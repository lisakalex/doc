# Django Debug Toolbar

To install **Django Debug Toolbar**, follow these steps — this is useful for development to inspect SQL queries, cache, templates, signals, and more.

---

## ✅ Step-by-Step: Install Django Debug Toolbar

### 1. **Install via pip**

Run in your virtual environment:

```bash
pip install django-debug-toolbar
```

If used uv to create venv

```bash
uv pip install django-debug-toolbar
```

---

### 2. **Add to `INSTALLED_APPS` in `settings.py`**

```python
INSTALLED_APPS = [
    # ... your other apps
    'debug_toolbar',
]
```

---

### 3. **Add to `MIDDLEWARE` (near the top)**

```python
MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    # ... other middleware
]
```

---

### 4. **Add URL config (in `urls.py`)**

Only enable it in development:

```python
from django.conf import settings
from django.urls import include, path

urlpatterns = [
    # your URLs...
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]
```

---

### 5. **Set Internal IPs (to allow access from localhost)**

In `settings.py`, add:

```python
INTERNAL_IPS = [
    '127.0.0.1',
]
```

If you're using Docker, you might need:

```python
INTERNAL_IPS = [
    '127.0.0.1',
    '172.17.0.1',  # Docker bridge IP
]
```

---

## ✅ Optional: Configure Toolbar Panels

You can customize which panels appear:

```python
DEBUG_TOOLBAR_PANELS = [
    'debug_toolbar.panels.timer.TimerPanel',
    'debug_toolbar.panels.sql.SQLPanel',
    'debug_toolbar.panels.cache.CachePanel',
    'debug_toolbar.panels.settings.SettingsPanel',
    'debug_toolbar.panels.headers.HeadersPanel',
    # ... others
]
```

---

## ✅ Test

Run your server:

```bash
python manage.py runserver
```

Then visit `http://127.0.0.1:8000` and you should see the debug toolbar on the right.

---

## 📖 Reference

Official docs:
[https://django-debug-toolbar.readthedocs.io/en/latest/installation.html](https://django-debug-toolbar.readthedocs.io/en/latest/installation.html)

Let me know if you're using Docker or a special setup (like with Nginx, Gunicorn, or inside VSCode), and I can tailor the config.
