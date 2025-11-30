Here’s a **simple Django example** of how to accept Bitcoin payments using **Electrum** in the background.

---

## What it will do

* Create a new Bitcoin address for each order using Electrum.
* Show the customer how much Bitcoin to send and where.
* Periodically check if the payment has been received and confirmed.

---

## Requirements

1. **Electrum installed** and set up on your server/machine.
2. Electrum daemon running:

   ```bash
   electrum daemon start
   ```
3. Electrum CLI available in the system path.
4. Django project already created.

---

## Example Django app structure

```
myshop/
│
├── shop/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── templates/shop/payment.html
│
├── myshop/
│   └── settings.py, urls.py, etc.
│
├── manage.py
```

---

## 1. `models.py`

```python
from django.db import models

class Order(models.Model):
    customer_name = models.CharField(max_length=100)
    btc_address = models.CharField(max_length=100, blank=True)
    btc_amount = models.DecimalField(max_digits=16, decimal_places=8)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## 2. `views.py`

```python
import subprocess
import requests
from django.shortcuts import render, redirect
from .models import Order

def get_btc_price_gbp():
    # Using CoinGecko API for BTC/GBP
    url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=gbp"
    response = requests.get(url)
    return response.json()['bitcoin']['gbp']

def get_new_btc_address():
    result = subprocess.run(["electrum", "getunusedaddress"], capture_output=True, text=True)
    return result.stdout.strip()

def create_order(request):
    if request.method == "POST":
        name = request.POST.get("name")
        amount_gbp = float(request.POST.get("amount"))

        price = get_btc_price_gbp()
        btc_amount = round(amount_gbp / price, 8)
        btc_address = get_new_btc_address()

        order = Order.objects.create(
            customer_name=name,
            btc_amount=btc_amount,
            btc_address=btc_address
        )
        return redirect("payment", order_id=order.id)
    
    return render(request, "shop/create_order.html")

def payment_view(request, order_id):
    order = Order.objects.get(id=order_id)
    return render(request, "shop/payment.html", {"order": order})
```

---

## 3. `urls.py`

```python
from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_order, name="create_order"),
    path("payment/<int:order_id>/", views.payment_view, name="payment"),
]
```

---

## 4. Template: `payment.html`

```html
<h2>Pay with Bitcoin</h2>
<p>Send exactly <strong>{{ order.btc_amount }} BTC</strong> to:</p>
<code>{{ order.btc_address }}</code>
<br>
<img src="https://api.qrserver.com/v1/create-qr-code/?data=bitcoin:{{ order.btc_address }}?amount={{ order.btc_amount }}" alt="QR Code">
<p>Once payment is received, your order will be marked as paid.</p>
```

---

## 5. Optional: Payment Checker Script

Run this periodically with a cronjob or background task.

```python
# scripts/check_payments.py
import subprocess
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myshop.settings")
django.setup()

from shop.models import Order

def check_payments():
    orders = Order.objects.filter(is_paid=False)
    for order in orders:
        cmd = ["electrum", "getaddressbalance", order.btc_address]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if '"confirmed": 0' not in result.stdout:
            order.is_paid = True
            order.save()
            print(f"Order {order.id} marked as paid.")

if __name__ == "__main__":
    check_payments()
```

Set a cronjob or use something like Django Q, Celery, or a `while True` loop to check payments every few minutes.

---

## Summary

* This uses **Electrum** to generate Bitcoin addresses and check balances.
* The entire system is non-custodial — you control your wallet.
* Best for low-volume sites, donations, or trusted users.

---

Would you like:

* A full GitHub project template?
* To add Lightning support later?
* Or integration with Netlify/Fly.io?

Let me know how advanced you want this to go.
