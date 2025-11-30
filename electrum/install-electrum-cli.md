There are **two main ways** to install Electrum, depending on what you need (desktop GUI vs CLI/daemon on a server). Since you’re working with a Django backend, I’ll assume you want the **CLI/daemon** version for server use.

---

## 1. Install from Python package (server/CLI use)

Electrum is a Python app. Best way is to install from source (not PyPI, because `pip install electrum` doesn’t work).

```bash
# Ensure build deps
sudo apt update
sudo apt install -y python3-pip python3-venv python3-dev build-essential \
    automake autoconf libtool pkg-config libssl-dev libffi-dev libsecp256k1-dev git

# Create a virtual environment (recommended)
mkdir -p ~/electrum && cd ~/electrum
python3 -m venv .venv
source .venv/bin/activate

# Clone Electrum source
git clone https://github.com/spesmilo/electrum.git
cd electrum

# Install requirements
pip install .[fast]

# Verify install
electrum --version
```

Now you can run:

```bash
electrum daemon start
```

---

## 2. Install official binary (desktop wallet with GUI)

If you want the desktop GUI version:

```bash
# Get latest release
wget https://download.electrum.org/4.6.1/Electrum-4.6.1.tar.gz
tar -xvf Electrum-4.6.1.tar.gz
cd Electrum-4.6.1
python3 run_electrum
```

Official binaries (signed by Thomas Voegtlin, Electrum’s maintainer) are at:
👉 [https://electrum.org/#download](https://electrum.org/#download)

---

## 3. Run from AppImage (Linux desktop easiest)

```bash
wget https://download.electrum.org/4.6.1/electrum-4.6.1-x86_64.AppImage
chmod +x electrum-4.6.1-x86_64.AppImage
./electrum-4.6.1-x86_64.AppImage
```

---

✅ **Summary for you (server + Django)**:

* Use **method 1 (from GitHub source)** in a virtualenv.
* That way you can run `electrum daemon` and talk to it via JSON-RPC.

---

Do you want me to give you a **step-by-step for Ubuntu 22.04+** specifically (since some dependencies like `autogen.sh` caused you errors earlier)?
