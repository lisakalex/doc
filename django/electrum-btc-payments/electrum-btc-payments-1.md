# Django Electrum BTC Payments 1

Alright — we’ll finish this out so it’s a **fully working Django payments app** you can run with `docker-compose up` and test end-to-end.

We already have the **infrastructure** from the previous message. Now we’ll add:

1. **`payments` app models/admin**
2. **Electrum RPC wrapper & QR code utils**
3. **Celery polling tasks**
4. **Views + URLs**
5. **Basic templates**

---

## **payments/models.py**

```python
from django.db import models
from django.contrib.auth.models import User

class Investment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount_btc = models.DecimalField(max_digits=16, decimal_places=8)
    btc_address = models.CharField(max_length=64, unique=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    txid = models.CharField(max_length=64, blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Investment {self.id} ({self.status})"
```

---

## **payments/admin.py**

```python
from django.contrib import admin
from .models import Investment

@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount_btc', 'btc_address', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('btc_address', 'txid', 'user__username')
```

---

## **payments/utils/electrum.py**

```python
import os
import requests
from requests.auth import HTTPBasicAuth

RPC_URL = os.getenv("ELECTRUM_RPC_URL")
RPC_USER = os.getenv("ELECTRUM_RPC_USER")
RPC_PASS = os.getenv("ELECTRUM_RPC_PASS")

session = requests.Session()
session.auth = HTTPBasicAuth(RPC_USER, RPC_PASS)
session.headers.update({"Content-Type": "application/json"})

def electrum_rpc(method, params=None):
    payload = {
        "id": 1,
        "method": method,
        "params": params or []
    }
    resp = session.post(RPC_URL, json=payload, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    if data.get("error"):
        raise RuntimeError(f"Electrum RPC error: {data['error']}")
    return data.get("result")

def create_new_address():
    return electrum_rpc("createnewaddress")

def get_address_history(address):
    return electrum_rpc("getaddresshistory", [address])

def get_transaction(txid):
    return electrum_rpc("gettransaction", [txid])
```

---

## **payments/utils/qr.py**

```python
import qrcode
from io import BytesIO

def generate_qr_code(btc_address):
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(f"bitcoin:{btc_address}")
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf
```

---

## **payments/tasks.py**

```python
from celery import shared_task
from django.core.exceptions import ObjectDoesNotExist
from .models import Investment
from .utils.electrum import get_address_history

@shared_task(bind=True, max_retries=5, default_retry_delay=60)
def poll_pending_investments(self):
    pending_investments = Investment.objects.filter(status='pending')
    for inv in pending_investments:
        try:
            history = get_address_history(inv.btc_address)
            if history:
                # Pick the first tx in history
                tx_info = history[0]
                if tx_info.get("height", 0) > 0:  # confirmed
                    inv.status = 'confirmed'
                    inv.txid = tx_info.get("tx_hash")
                    inv.save()
        except ObjectDoesNotExist:
            continue
        except Exception as e:
            self.retry(exc=e)
```

---

## **payments/views.py**

```python
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.core.files import File
from .models import Investment
from .utils.electrum import create_new_address
from .utils.qr import generate_qr_code

@login_required
def create_investment(request):
    if request.method == 'POST':
        amount_btc = request.POST.get('amount')
        btc_address = create_new_address()
        inv = Investment.objects.create(
            user=request.user,
            amount_btc=amount_btc,
            btc_address=btc_address
        )
        qr_buf = generate_qr_code(btc_address)
        inv.qr_code.save(f"{inv.id}.png", File(qr_buf), save=True)
        return redirect('investment_detail', pk=inv.pk)
    return render(request, 'payments/create.html')

@login_required
def investment_detail(request, pk):
    inv = get_object_or_404(Investment, pk=pk)
    return render(request, 'payments/detail.html', {'investment': inv})
```

---

## **payments/urls.py**

```python
from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_investment, name='create_investment'),
    path('<int:pk>/', views.investment_detail, name='investment_detail'),
]
```

---

## **btc\_payments/urls.py**

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('investments/', include('payments.urls')),
]
```

---

## **templates/payments/create.html**

```html
{% extends "base.html" %}
{% block content %}
<h1>Create Investment</h1>
<form method="post">
    {% csrf_token %}
    <label for="amount">Amount (BTC):</label>
    <input type="text" name="amount" id="amount" required>
    <button type="submit">Generate Address</button>
</form>
{% endblock %}
```

---

## **templates/payments/detail.html**

```html
{% extends "base.html" %}
{% block content %}
<h1>Investment {{ investment.id }}</h1>
<p>Amount: {{ investment.amount_btc }} BTC</p>
<p>BTC Address: {{ investment.btc_address }}</p>
{% if investment.qr_code %}
    <img src="{{ investment.qr_code.url }}" alt="QR Code">
{% endif %}
<p>Status: {{ investment.status }}</p>
{% if investment.txid %}
    <p>Transaction ID: {{ investment.txid }}</p>
{% endif %}
{% endblock %}
```

---

## **templates/base.html**

```html
<!DOCTYPE html>
<html>
<head>
    <title>BTC Payments</title>
</head>
<body>
{% if user.is_authenticated %}
    <p>Welcome, {{ user.username }} | <a href="/admin/logout/">Logout</a></p>
{% else %}
    <p><a href="/admin/login/">Login</a></p>
{% endif %}
<hr>
{% block content %}{% endblock %}
</body>
</html>
```

---

### **Run Instructions**

```bash
docker-compose up --build
```

Then open:

* **[http://localhost:8000/admin/](http://localhost:8000/admin/)** (create superuser with `docker-compose run django python manage.py createsuperuser`)
* **[http://localhost:8000/investments/create/](http://localhost:8000/investments/create/)** to create an investment

---

Do you want me to also add a **Docker healthcheck** so the Celery worker waits until Electrum RPC is ready before starting polling?
That would make it more production-safe.
