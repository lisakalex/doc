# Django RPC model payment

Alright — here’s a **Django model + webhook/payment listener setup** using Electrum RPC so your vevrecapital.net clone can:

* Generate a **unique BTC address per user/investment**
* Listen for incoming BTC payments via Electrum JSON-RPC
* Mark payments as **confirmed** after blockchain confirmations

---

## 1. **Django Model**

We’ll store invoices/payments.

```python
# payments/models.py
from django.db import models
from django.contrib.auth.models import User

class BitcoinPayment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('expired', 'Expired')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    btc_address = models.CharField(max_length=64, unique=True)
    amount_btc = models.DecimalField(max_digits=16, decimal_places=8)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    txid = models.CharField(max_length=128, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount_btc} BTC - {self.status}"
```

---

## 2. **Electrum RPC Utility**

Central helper to talk to Electrum.

```python
# payments/electrum_rpc.py
import requests
from requests.auth import HTTPBasicAuth
from django.conf import settings

RPC_URL = "http://127.0.0.1:7777"
RPC_USER = "btcadmin"
RPC_PASS = "supersecurepass"

def electrum_rpc(method, params=None):
    payload = {
        "id": 1,
        "method": method,
        "params": params or []
    }
    r = requests.post(RPC_URL, json=payload, auth=HTTPBasicAuth(RPC_USER, RPC_PASS))
    r.raise_for_status()
    return r.json()["result"]
```

---

## 3. **Generating a BTC Address for a New Payment**

When a user creates a deposit/investment:

```python
# payments/services.py
from .models import BitcoinPayment
from .electrum_rpc import electrum_rpc
from decimal import Decimal

def create_bitcoin_invoice(user, amount_btc):
    # Generate new BTC address from Electrum
    btc_address = electrum_rpc("createnewaddress")
    
    payment = BitcoinPayment.objects.create(
        user=user,
        btc_address=btc_address,
        amount_btc=Decimal(amount_btc)
    )
    return payment
```

---

## 4. **Payment Checker (Celery Task or Cron)**

Polls Electrum for new transactions.

```python
# payments/tasks.py
from datetime import datetime
from .models import BitcoinPayment
from .electrum_rpc import electrum_rpc

def check_pending_payments():
    pending_payments = BitcoinPayment.objects.filter(status='pending')
    for payment in pending_payments:
        history = electrum_rpc("getaddresshistory", [payment.btc_address])
        if not history:
            continue

        # Take the latest tx
        tx = history[-1]
        txid = tx['tx_hash']
        conf = tx['height']  # height > 0 means confirmed in a block
        
        if conf > 0:
            # Confirmed
            payment.status = 'confirmed'
            payment.txid = txid
            payment.confirmed_at = datetime.utcnow()
            payment.save()
```

You can run `check_pending_payments()` every few minutes with **Celery** or `django-crontab`.

---

## 5. **Webhook Alternative (Optional)**

Electrum has `notify` commands for addresses, so instead of polling, you can make Electrum call your Django endpoint when a payment comes in.
Example:

```bash
electrum notify 1YourBtcAddressHere "curl -X POST https://yoursite.com/api/payment-webhook/ -d 'address=%s&txid=%s'"
```

But for production, polling every 2–5 min is simpler and avoids firewall headaches.

---

## 6. **Flow in vevrecapital.net clone**

1. User requests investment → Django calls `create_bitcoin_invoice()`
2. User sends BTC to the given address
3. Background task polls Electrum JSON-RPC
4. When confirmed, status changes to `confirmed` and ROI logic kicks in

---

If you want, I can now give you the **ROI logic + auto-payout script** so that once a payment is confirmed, Django automatically schedules ROI accrual and sends BTC payouts via Electrum.

Do you want me to prepare that next?
