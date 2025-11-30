# Django Electrum BTC Payments

This document contains a ready-to-use Django app named `wallet` and supporting project bits that integrate with an **Electrum daemon via JSON-RPC** to:

* Create a new BTC address per investment
* Show a QR code for the address
* Poll Electrum for address/tx history and update payment status when confirmed
* Use Celery + Redis for background tasks (scheduled polling)

> **Notes (production-ready principles)**
>
> * Secrets and credentials are read from environment variables.
> * Use Celery for scheduled/retryable background jobs.
> * Use a dedicated Electrum daemon (running on localhost or another secure host) with RPC enabled.
> * Minimal third-party dependencies: `requests`, `qrcode`, `Pillow` (for QR generation).

---

## Project structure (relevant files)

```
simple_django_login_and_register/
├─ simple_django_login_and_register/
│  ├─ __init__.py
│  ├─ settings.py  # add CELERY and ELECTRUM settings
│  ├─ celery.py
│  └─ urls.py
├─ wallet/
│  ├─ migrations/
│  ├─ templates/wallet/investment_detail.html
│  ├─ __init__.py
│  ├─ models.py
│  ├─ electrum_rpc.py
│  ├─ services.py
│  ├─ tasks.py
│  ├─ views.py
│  └─ urls.py
├─ manage.py
└─ requirements.txt
```

---

## requirements.txt

```
Django>=4.2
requests
celery[redis]
redis
qrcode[pil]
Pillow
python-dotenv  # optional, for local env file loading
```

---

## Environment variables (set these in your production env)

```
ELECTRUM_RPC_URL=http://127.0.0.1:7777
ELECTRUM_RPC_USER=user
ELECTRUM_RPC_PASS=WA7Um-kxneAxFIP5C8TYbQ==
DJANGO_SECRET_KEY=...
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1
```

---

## `wallet/models.py`

```python
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Investment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount_btc = models.DecimalField(max_digits=16, decimal_places=8)
    created_at = models.DateTimeField(auto_now_add=True)
    # link to payment
    payment = models.OneToOneField('BitcoinPayment', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Investment {self.id} by {self.user} — {self.amount_btc} BTC"


class BitcoinPayment(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_CONFIRMED = 'confirmed'
    STATUS_EXPIRED = 'expired'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_EXPIRED, 'Expired'),
    ]

    investment = models.ForeignKey(Investment, null=True, blank=True, on_delete=models.CASCADE)
    btc_address = models.CharField(max_length=128, unique=True)
    amount_btc = models.DecimalField(max_digits=16, decimal_places=8)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_PENDING)
    txid = models.CharField(max_length=128, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.btc_address} ({self.amount_btc}) — {self.status}"
```

---

## `wallet/electrum_rpc.py`

```python
import os
import requests
from requests.auth import HTTPBasicAuth
from django.conf import settings

# Read from env / settings
RPC_URL = os.environ.get('ELECTRUM_RPC_URL', 'http://127.0.0.1:7777')
RPC_USER = os.environ.get('ELECTRUM_RPC_USER', '')
RPC_PASS = os.environ.get('ELECTRUM_RPC_PASS', '')


class ElectrumRPCError(Exception):
    pass


def _rpc_call(method, params=None, request_id=1, timeout=10):
    payload = {
        'id': request_id,
        'method': method,
        'params': params or []
    }
    auth = None
    if RPC_USER or RPC_PASS:
        auth = HTTPBasicAuth(RPC_USER, RPC_PASS)
    try:
        r = requests.post(RPC_URL, json=payload, auth=auth, timeout=timeout)
        r.raise_for_status()
    except requests.RequestException as e:
        raise ElectrumRPCError(f"RPC request error: {e}")

    data = r.json()
    if data.get('error'):
        raise ElectrumRPCError(data['error'])
    return data.get('result')


# Convenience functions
def createnewaddress():
    return _rpc_call('createnewaddress')


def getaddressbalance(address):
    return _rpc_call('getaddressbalance', [address])


def getaddresshistory(address):
    return _rpc_call('getaddresshistory', [address])


def getbalance():
    return _rpc_call('getbalance')


def load_wallet(wallet_path):
    return _rpc_call('load_wallet', [wallet_path])
```

---

## `wallet/services.py` — core business logic

```python
from decimal import Decimal
from .models import BitcoinPayment, Investment
from .electrum_rpc import createnewaddress, getaddresshistory, getaddressbalance
from django.utils import timezone


def create_payment_for_investment(investment: Investment):
    """Generate a new BTC address and create a BitcoinPayment row."""
    address = createnewaddress()
    payment = BitcoinPayment.objects.create(
        investment=investment,
        btc_address=address,
        amount_btc=investment.amount_btc,
        status=BitcoinPayment.STATUS_PENDING
    )
    # attach to investment
    investment.payment = payment
    investment.save(update_fields=['payment'])
    return payment


def check_and_update_payment(payment: BitcoinPayment, required_confirmations=1):
    """Check history for the payment address; update status if confirmed."""
    history = getaddresshistory(payment.btc_address)
    if not history:
        return payment

    # history is a list of tx entries; find incoming txs with amount >= required
    # Example entry: {'tx_hash': '...', 'height': 123456, 'value': 100000}
    # value in satoshis (electrum may return sats or BTC depending on version).
    for tx in history:
        # value might be satoshis; we attempt to compare robustly
        value = tx.get('value')
        if value is None:
            continue
        # if value looks like satoshis (int > 1e6) convert to BTC
        if isinstance(value, int) and value > 10**6:
            btc_amount = Decimal(value) / Decimal(1e8)
        else:
            btc_amount = Decimal(str(value))

        if btc_amount >= payment.amount_btc:
            # check confirmation
            height = tx.get('height', 0)
            if height > 0:
                payment.status = BitcoinPayment.STATUS_CONFIRMED
                payment.txid = tx.get('tx_hash') or tx.get('txid')
                payment.confirmed_at = timezone.now()
                payment.save()
                break
    return payment
```

---

## `wallet/tasks.py` — Celery scheduled tasks

```python
from celery import shared_task
from .models import BitcoinPayment
from .services import check_and_update_payment


@shared_task(bind=True, max_retries=3)
def poll_pending_payments(self):
    pending = BitcoinPayment.objects.filter(status=BitcoinPayment.STATUS_PENDING)
    for p in pending:
        try:
            check_and_update_payment(p)
        except Exception as exc:
            # let Celery retry for transient errors
            raise self.retry(exc=exc, countdown=60)
    return True
```

In `celery.py` (project root) add a beat schedule entry to run `poll_pending_payments` every 1–5 minutes.

---

## `wallet/views.py` — create investment, show payment + QR

```python
from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.http import require_POST
from decimal import Decimal
from django.urls import reverse
from .models import Investment
from .services import create_payment_for_investment
import qrcode
from io import BytesIO
from django.http import HttpResponse


@require_POST
def create_investment(request):
    # Example: expects POST with 'amount_btc'
    amount = request.POST.get('amount_btc')
    if not amount:
        return HttpResponse('Missing amount', status=400)

    invest = Investment.objects.create(user=request.user, amount_btc=Decimal(amount))
    create_payment_for_investment(invest)
    return redirect(reverse('wallet:investment_detail', args=[invest.id]))


def investment_detail(request, pk):
    invest = get_object_or_404(Investment, pk=pk)
    payment = invest.payment
    qr_svg = None
    if payment:
        # generate QR image for bitcoin URI
        uri = f"bitcoin:{payment.btc_address}?amount={payment.amount_btc}"
        img = qrcode.make(uri)
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        qr_data = buffer.getvalue()
        # we'll inline as PNG data in template as base64
        import base64
        qr_svg = base64.b64encode(qr_data).decode()

    return render(request, 'wallet/investment_detail.html', {
        'investment': invest,
        'payment': payment,
        'qr_base64': qr_svg,
    })
```

---

## `wallet/templates/wallet/investment_detail.html`

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Investment {{ investment.id }}</title>
</head>
<body>
  <h1>Investment #{{ investment.id }}</h1>
  <p>Amount: {{ investment.amount_btc }} BTC</p>
  {% if payment %}
    <p>Address: {{ payment.btc_address }}</p>
    <p>Status: {{ payment.status }}</p>
    {% if qr_base64 %}
      <img src="data:image/png;base64,{{ qr_base64 }}" alt="QR code" />
    {% endif %}
    <p>TXID: {{ payment.txid }}</p>
  {% else %}
    <p>No payment created yet.</p>
  {% endif %}
</body>
</html>
```

---

## `simple_django_login_and_register/celery.py` (project Celery entry)

```python
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simple_django_login_and_register.settings')
app = Celery('simple_django_login_and_register')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Schedule: run poll every 5 minutes
app.conf.beat_schedule = {
    'poll-pending-payments-every-5-min': {
        'task': 'wallet.tasks.poll_pending_payments',
        'schedule': crontab(minute='*/5'),
    },
}
```

---

## settings.py additions (snippets)

```python
# Celery
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/1')

# Electrum settings kept in env
ELECTRUM_RPC_URL = os.environ.get('ELECTRUM_RPC_URL')
ELECTRUM_RPC_USER = os.environ.get('ELECTRUM_RPC_USER')
ELECTRUM_RPC_PASS = os.environ.get('ELECTRUM_RPC_PASS')
```

---

## Run / Deployment checklist

1. Create virtualenv and install requirements.
2. Set environment variables (ELECTRUM RPC credentials, DJANGO secret, Celery broker).
3. Run `python manage.py migrate`.
4. Start Electrum daemon on the same host and ensure RPC is enabled and wallet is loaded.
5. Start Redis.
6. Start Celery worker: `celery -A simple_django_login_and_register worker --loglevel=info`.
7. Start Celery beat: `celery -A simple_django_login_and_register beat --loglevel=info`.
8. Serve Django with Gunicorn/ASGI behind Nginx.

---

## Security notes

* Keep Electrum RPC bound to localhost or internal network; use firewall rules.
* Use strong RPC credentials and store them in secrets manager (not checked into git).
* Consider using SSL/TLS or SSH tunnel if RPC access crosses machines.

---

## What I didn't include (you can add)

* Email notifications / admin UI
* Webhooks from Electrum (example uses polling)
* Rate-limiting / concurrency safeguards when multiple payments come in
* Unit tests and error metrics

---

If you want, I can now generate the exact files for you to copy — or create a downloadable zip. What would you like next?
