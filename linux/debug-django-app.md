# Debugging a Django app

Debugging a Django app involves using a combination of tools and techniques to trace issues in views, models, templates, and middleware. Below is a **step-by-step guide** with best practices and tool suggestions:

---

## 🔧 1. Enable Debug Mode

In `settings.py`:

```python
DEBUG = True
```

This shows **detailed error tracebacks** in the browser.

> ⚠️ Make sure `DEBUG = False` in **production**.

---

## 🛠 2. Use Django’s Built-in Development Server

Start the dev server:

```bash
python manage.py runserver
```

When errors occur, Django shows a helpful **debug page** with variable states and stack traces.

---

## 🔍 3. Add Logging

In `settings.py`:

```python
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

Then in your code:

```python
import logging
logger = logging.getLogger(__name__)

logger.debug("Debugging message")
logger.info("Some info")
```

> 🧠 Tip: Logs show in the terminal when you run the server.

---

## 🐞 4. Use Python Debugger (`pdb`)

Add a breakpoint in your view:

```python
import pdb; pdb.set_trace()
```

This will pause execution in the terminal and give you a Python shell.

Navigate with:

* `n` – next line
* `s` – step into function
* `c` – continue execution
* `q` – quit

> Use `pdb` when you want **precise control** while debugging.

---

## 🧪 5. Write Unit Tests

Django supports tests out of the box:

```bash
python manage.py test
```

Example test in `tests.py`:

```python
from django.test import TestCase
from django.urls import reverse

class HomePageTests(TestCase):
    def test_home_page_status_code(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
```

---

## 🔗 6. Check SQL Queries

To log all DB queries, add this in your view or shell:

```python
from django.db import connection
print(connection.queries)
```

Or use the **Django Debug Toolbar** (next tip) to inspect queries in the browser.

---

## 🧰 7. Use Django Debug Toolbar (highly recommended)

### Install:

```bash
pip install django-debug-toolbar
```

### settings.py:

```python
INSTALLED_APPS += ['debug_toolbar']

MIDDLEWARE = ['debug_toolbar.middleware.DebugToolbarMiddleware'] + MIDDLEWARE

INTERNAL_IPS = ['127.0.0.1']  # Enable for localhost
```

### urls.py:

```python
import debug_toolbar
from django.urls import include, path

urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
```

➡ Now you can see detailed **SQL queries, cache, request headers, signals, and templates** in your browser.

Docs: [https://django-debug-toolbar.readthedocs.io/](https://django-debug-toolbar.readthedocs.io/)

---

## 📄 8. Template Debugging

Enable the template debug mode (usually on when `DEBUG = True`):

```python
TEMPLATES = [
    {
        'OPTIONS': {
            'debug': True,
        },
    },
]
```

Use `{% debug %}` in templates to see available context variables.

---

## 🧠 9. Use IDE Debugger

If you're using **VS Code**, **PyCharm**, or similar:

* Set breakpoints in your views or models.
* Start Django with the IDE debugger (e.g. VS Code’s "Python: Django" config).
* Step through code like you would in any normal Python app.

---

## 🧹 10. Check for Migrations, Cache, and Static Files

Sometimes bugs are due to:

* **Migrations** not applied: `python manage.py makemigrations && migrate`
* **Stale cache**: use `cache.clear()` if you're using Django's caching framework
* **Static files** not found: run `python manage.py collectstatic`

---

## Reference

* Django Debugging Docs: [https://docs.djangoproject.com/en/stable/topics/debugging/](https://docs.djangoproject.com/en/stable/topics/debugging/)
* Django Logging: [https://docs.djangoproject.com/en/stable/topics/logging/](https://docs.djangoproject.com/en/stable/topics/logging/)
* Django Debug Toolbar: [https://django-debug-toolbar.readthedocs.io/](https://django-debug-toolbar.readthedocs.io/)

---

Let me know the specific issue you’re facing (e.g. 500 error, template bug, database issue), and I’ll help debug it directly.
