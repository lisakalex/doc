# Re-create the Virtual Environment Properly

## I had this error
```bash
(venv) al@ku:/var/www/djangotutorial$ pip install django-debug-toolbar
error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try apt install
    python3-xyz, where xyz is the package you are trying to
    install.
    
    If you wish to install a non-Debian-packaged Python package,
    create a virtual environment using python3 -m venv path/to/venv.
    Then use path/to/venv/bin/python and path/to/venv/bin/pip. Make
    sure you have python3-full installed.
    
    If you wish to install a non-Debian packaged Python application,
    it may be easiest to use pipx install xyz, which will manage a
    virtual environment for you. Make sure you have pipx installed.
    
    See /usr/share/doc/python3.12/README.venv for more information.

note: If you believe this is a mistake, please contact your Python installation or OS distribution provider. You can override this, at the risk of breaking your Python installation or OS, by passing --break-system-packages.
hint: See PEP 668 for the detailed specification.
```

---

You're correct that your shell prompt shows you're inside a virtual environment:

```
(venv) al@ku:/var/www/djangotutorial$ pip install django-debug-toolbar
```

However, the error `externally-managed-environment` still suggests that Python is treating this environment as if it's part of the system-managed Python, which is restricted for safety.

This often happens on newer versions of Ubuntu or Debian, where PEP 668 is enforced. It can occur if:

1. The virtual environment wasn't properly isolated when created.
2. The `pip` inside the venv is still using system paths or configurations.

---

## How to fix it

### Step 1: Remove the current virtual environment

```bash
rm -rf venv
```

This ensures there's no leftover configuration from the broken environment.

### Step 2: Create a new virtual environment

```bash
python3 -m venv venv
```

Then activate it:

```bash
source venv/bin/activate
```

### Step 3: Reinstall pip inside the venv using a clean bootstrap

```bash
curl -sS https://bootstrap.pypa.io/get-pip.py | python
```

This installs `pip` in the virtual environment without using any system-managed package restrictions.

### Step 4: Install the Django Debug Toolbar

```bash
pip install django-debug-toolbar
```

---

## Confirm the environment is correct

After activating your new virtual environment, run:

```bash
which python
```

This should output a path like:

```
/var/www/djangotutorial/venv/bin/python
```

Also check:

```bash
which pip
```

This should return:

```
/var/www/djangotutorial/venv/bin/pip
```

If either one points to `/usr/bin/python` or `/usr/bin/pip`, you're still using the system Python by mistake.

---

## Why this happens

Newer Linux distributions (Ubuntu 23+, Debian 12+) enforce [PEP 668](https://peps.python.org/pep-0668/), which prevents package installs in system-managed Python environments. Sometimes, even virtual environments inherit this restriction if pip was not bootstrapped properly.

Using the above steps ensures your pip is cleanly installed in the virtual environment and not blocked by system protections.

---

If you'd like help with automating this setup or have questions about your Linux or Python version, let me know.
