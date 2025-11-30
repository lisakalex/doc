# Virtual environment
## Corrected & Improved Cheat Sheet

### 1. Install `uv`

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Then **restart your terminal** so `uv` is in your PATH.

---

### 2. (Option A) Create a virtual environment with `uv`

If you want to use `uv` for everything:

```bash
uv venv --python 3.13 /home/al4/IdeaProjects/btc_payments/.venv
source /home/al4/IdeaProjects/btc_payments/.venv/bin/activate
uv pip install -r requirements.txt
```

You can also install or update packages:

```bash
uv pip install package
uv pip install --upgrade package
uv pip uninstall package
uv pip freeze > requirements.txt
```
 
*Best for speed and modern workflows.*

---

### 3. (Option B) Use standard `venv` and `pip`

If you want to stick to built-in Python tools:

```bash
python3 -m venv ~/.venv
source ~/.venv/bin/activate
python -m pip install package
python -m pip install --upgrade package
python -m pip install package==2.6.0
python -m pip uninstall package
pip freeze > requirements.txt
python -m pip install -r /var/www/requirements.txt
deactivate
```
 
*Best for compatibility (e.g., when following tutorials or using systemd services).*

---

### 4. Summary Table

| Task            | `uv` way (faster)                    | `pip` way (standard)                        |
| --------------- | ------------------------------------ | ------------------------------------------- |
| Create venv     | `uv venv .venv`                      | `python3 -m venv .venv`                     |
| Activate venv   | `source .venv/bin/activate`          | same                                        |
| Install deps    | `uv pip install -r requirements.txt` | `python -m pip install -r requirements.txt` |
| Install package | `uv pip install flask`               | `python -m pip install flask`               |
| Upgrade package | `uv pip install --upgrade flask`     | `python -m pip install --upgrade flask`     |
| Freeze deps     | `uv pip freeze > requirements.txt`   | `pip freeze > requirements.txt`             |
| Deactivate      | `deactivate`                         | same                                        |

---

### Optional Tip

To make `uv` always use the same interpreter as your virtualenv:

```bash
uv venv --python $(which python3)
```

---

### References

* Official docs: [https://docs.astral.sh/uv](https://docs.astral.sh/uv)
* Python docs (venv & pip): [https://docs.python.org/3/library/venv.html](https://docs.python.org/3/library/venv.html)
