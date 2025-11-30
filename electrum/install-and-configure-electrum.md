# Install and Configure Electrum with systemd and JSON-RPC

## 1. Install Electrum

Official download:
[https://electrum.org/#download](https://electrum.org/#download)

### Install dependencies:

```bash
sudo apt-get install python3-pyqt6 libsecp256k1-dev python3-cryptography
```

---

## 2. Verifying Electrum Downloads

### Download release and signature:

```bash
wget https://download.electrum.org/4.6.2/Electrum-4.6.2.tar.gz
wget https://download.electrum.org/4.6.2/Electrum-4.6.2.tar.gz.asc
```

### Import developer GPG keys:

```bash
gpg --keyserver hkps://keys.openpgp.org --recv-keys 6694D8DE7BE8EE5631BED9502BD5824B7F9470E6
```

Alternative key servers:

```bash
gpg --keyserver keys.gnupg.net --recv-keys 6694D8DE7BE8EE5631BED9502BD5824B7F9470E6
gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys 6694D8DE7BE8EE5631BED9502BD5824B7F9470E6
gpg --keyserver hkps://pgp.mit.edu --recv-keys 6694D8DE7BE8EE5631BED9502BD5824B7F9470E6
```

### Verify the signature:

```bash
gpg --verify Electrum-4.6.2.tar.gz.asc Electrum-4.6.2.tar.gz
```

Expected output if valid:

```
gpg: Good signature from "Thomas Voegtlin (https://electrum.org) <thomasv@electrum.org>"
```

If you see:

```
gpg: Can't check signature: No public key
```

Import more keys:

```bash
gpg --keyserver hkps://keys.openpgp.org --recv-keys \
    6694D8DE7BE8EE5631BED9502BD5824B7F9470E6 \
    637DB1E23370F84AFF88CCE03152347D07DA627C \
    AA0BC6824B397BBA99776E157ED8D82B37192688 \
    0EEDCFD5CAFB459067349B23CA9EEEC43DF911DC
```

---

## 3. Install Electrum in a Python Virtual Environment

### System dependencies (outside venv):

```bash
sudo apt update
sudo apt install -y build-essential autoconf automake libtool pkg-config python3-dev libssl-dev
```

### Extract Electrum:

```bash
mkdir -p /var/www/simple-django-login-and-register/electrum
tar -xvf Electrum-4.6.2.tar.gz -C /var/www/simple-django-login-and-register/electrum
```

### Create and activate venv:

```bash
cd /var/www/simple-django-login-and-register
python3 -m venv ~/.venv
source ~/.venv/bin/activate
```

### Install Electrum:

```bash
cd /var/www/simple-django-login-and-register/electrum/Electrum-4.6.2
pip install -r electrum/Electrum-4.6.2/contrib/requirements/requirements.txt
pip install .
```

### Verify installation:

```bash
which electrum
```

Expected output:

```
/var/www/simple-django-login-and-register/.venv/bin/electrum
```

Check version:

```bash
electrum --version
```

---

## 4. Systemd Service for Electrum Daemon (JSON-RPC)

Create systemd service:

```bash
sudo nano /etc/systemd/system/electrum.service
```

Paste:

```
[Unit]
Description=Electrum Bitcoin Wallet Daemon
After=network.target

[Service]
User=al1
Group=al1
WorkingDirectory=/home/al1/.electrum

ExecStartPre=/bin/rm -f ~/.electrum/daemon.lock
ExecStartPre=/bin/rm -f ~/.electrum/wallets/*.lock

ExecStart=/var/www/simple-django-login-and-register/.venv/bin/electrum daemon -d

Restart=always
RestartSec=5

Environment=ELECTRUM_PATH=~/.electrum

[Install]
WantedBy=multi-user.target
```

---

## 5. Configure Electrum JSON-RPC

Edit config:

```bash
nano ~/.electrum/config
```

Example config:

```json
{
  "auto_connect": true,
  "blockchain_preferred_block": {
    "hash": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    "height": 0
  },
  "config_version": 3,
  "oneserver": true,
  "rpchost": "127.0.0.1",
  "rpcpassword": "supersecurepass",
  "rpcport": 7777,
  "rpcuser": "al1",
  "use_ssl": false
}
```

---

## 6. Manage Service

Reload systemd and start service:

```bash
sudo systemctl daemon-reload
sudo systemctl restart electrum
sudo systemctl enable --now electrum
```

Check status:

```bash
sudo systemctl status electrum
```

Expected:

```
● electrum.service - Electrum Bitcoin Wallet Daemon
     Loaded: loaded (/etc/systemd/system/electrum.service; enabled; preset: enabled)
     Active: active (running) since Tue 2025-09-09 21:54:18 BST; 13ms ago
    Process: 96235 ExecStartPre=/bin/rm -f /home/al1/.electrum/daemon.lock (code=exited, status=0/SUCCESS)
    Process: 96237 ExecStartPre=/bin/rm -f /home/al1/.electrum/wallets/*.lock (code=exited, status=0/SUCCESS)
   Main PID: 96239 (electrum)
      Tasks: 1 (limit: 18645)
     Memory: 3.1M (peak: 3.1M)
        CPU: 20ms
     CGroup: /system.slice/electrum.service
             └─96239 /var/www/simple/.venv/bin/python3 /var/www/simple/.venv/bin/electrum daemon -d

Sep 09 21:54:18 ku systemd[1]: Starting electrum.service - Electrum Bitcoin Wallet Daemon...
Sep 09 21:54:18 ku systemd[1]: Started electrum.service - Electrum Bitcoin Wallet Daemon.
```

---

## 7. Test JSON-RPC

Run:

```bash
/var/www/simple/.venv/bin/electrum getinfo
```

Example output:

```json
{
    "auto_connect": false,
    "blockchain_height": 897119,
    "connected": false,
    "fee_estimates": {},
    "network": "mainnet",
    "path": "/home/al1/.electrum",
    "server": "localhost",
    "server_height": 0,
    "spv_nodes": 0,
    "version": "4.6.2"
}
```

---

Do you want me to also **add curl JSON-RPC examples** (like checking balance, creating invoices, sending transactions) so you can interact with Electrum programmatically?
