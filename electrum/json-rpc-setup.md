# JSON-RPC setup

Alright — here’s the **ready-to-use Electrum daemon JSON-RPC setup** for your Django BTC payment listener.
This will let your Django app call Electrum over HTTP and check balances, transaction status, etc., without running Bitcoin Core.

---

## 1. Create Electrum config file

Electrum stores its config in a directory like:

* Linux: `~/.electrum/config`
* If you use `-D` flag, you can set a custom directory.

We’ll make one in your server’s home:

```bash
mkdir -p ~/.electrum
nano ~/.electrum/config
```

Paste this:

```json
{
  "rpcuser": "btcadmin",
  "rpcpassword": "supersecurepass",
  "rpcport": 7777,
  "rpchost": "127.0.0.1",
  "use_ssl": false,
  "server": "electrum.blockstream.info:50002:s",
  "oneserver": true,
  "auto_connect": true
}
```

**Explanation:**

* `rpcuser` / `rpcpassword` → Django will use this to authenticate.
* `rpcport` → Default Electrum JSON-RPC port is 7777.
* `server` → Using Blockstream’s Electrum server for mainnet.
* `oneserver` + `auto_connect` → Makes connection stable for payments.

---

## 2. Start Electrum daemon with RPC

From your activated virtual environment:

```bash
electrum daemon -d -D ~/.electrum
```

Check:

```bash
electrum daemon status
```

You should see `"daemon_status": "running"`.

---

## 3. Test RPC access from the server

```bash
curl --data '{"id":1,"method":"getbalance"}' \
     -u btcadmin:supersecurepass \
     http://127.0.0.1:7777
```

Expected output (example):

```json
{"id":1, "result":{"confirmed": 0.0, "unconfirmed": 0.0}}
```

---

## 4. Use in Django

You can call Electrum directly from your views, Celery tasks, or a webhook listener:

```python
import requests
from requests.auth import HTTPBasicAuth

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

# Example: get balance
balance = electrum_rpc("getbalance")
print(balance)
```

---

## 5. Auto-start on server boot

Create a systemd service so Electrum is always running:

```bash
sudo nano /etc/systemd/system/electrum.service
```

Paste:

```ini
[Unit]
Description=Electrum Bitcoin Wallet Daemon
After=network.target

[Service]
User=al
ExecStart=/var/www/simple-django-login-and-register/.venv/bin/electrum daemon -d -D /home/al/.electrum
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now electrum
```

---

Now your Electrum RPC service will:

* Start automatically on reboot
* Be available to your Django backend
* Use a trusted Electrum server (or you can point it to your own)

---

If you want, I can now give you a **Django model + webhook listener** that:

* Generates a new BTC address for each user
* Listens for incoming payments via Electrum RPC
* Marks invoices as paid when confirmed

That would complete your vevrecapital.net BTC payment flow.
Do you want me to prepare that next?
