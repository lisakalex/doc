# Django Crontab

### A Comprehensive Guide to Using Django Crontab for Scheduled Tasks

**By Daniel Wachira Maina – Published on Medium, Dec 7, 2023**
[Read on Medium](https://medium.com/@mainadanielwachira/a-comprehensive-guide-to-using-django-crontab-for-scheduled-tasks-bb62b99083e8)

---

#### Introduction

**Django Crontab** is a powerful tool that enables you to schedule periodic tasks within your Django application.
Whether you need to send emails, update database records, or perform other recurring operations, Django Crontab
automates these processes with ease.
This guide walks through how to set up and use Django Crontab for managing scheduled tasks effectively.

---

#### Prerequisites

Before starting, make sure you have:

* Python and Django installed
* An existing Django project set up

---

#### Installation

Install Django Crontab using pip:

```bash
pip install django-crontab
```

Add it to your Django project’s installed apps:

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'django_crontab',
    # ...
]
```

---

#### Configuration

Define your cron jobs in `settings.py`:

```python
# settings.py
CRONJOBS = [
    ('*/5 * * * *', 'your_app.tasks.my_cron_job'),
    # Add more jobs as needed
]
```

Here, `*/5 * * * *` is the cron expression (every 5 minutes), and
`your_app.tasks.my_cron_job` points to the task function or management command.

---

#### Applying Crontab

To register your cron jobs, run:

```bash
python manage.py crontab add
```

---

#### Managing Cron Jobs

View all installed cron jobs:

```bash
python manage.py crontab show
```

Remove all installed cron jobs:

```bash
python manage.py crontab remove
```

---

#### Example: Sending a Daily Email

Create a simple function to send daily emails:

```python
# your_app/tasks.py
from django.core.mail import send_mail


def send_daily_email():
    send_mail(
        'Daily Update',
        'This is your daily update email.',
        'from@example.com',
        ['to@example.com'],
        fail_silently=False,
    )
```

Schedule it in `settings.py` to run at midnight daily:

```python
# settings.py
CRONJOBS = [
    ('0 0 * * *', 'your_app.tasks.send_daily_email'),
]
```

---

#### Conclusion

Django Crontab greatly simplifies task scheduling within Django projects. By integrating it properly, you can automate
routine operations and enhance your project’s efficiency.

---

**Note:** Django Crontab is not supported on Windows systems (as mentioned by community feedback). For distributed
deployments (e.g., Docker Swarm or Kubernetes), alternative schedulers like Celery Beat may be more suitable.

**Reference:**
Maina, D. W. (2023, December 7). *A Comprehensive Guide to Using Django Crontab for Scheduled Tasks.* Medium.
[https://medium.com/@mainadanielwachira/a-comprehensive-guide-to-using-django-crontab-for-scheduled-tasks-bb62b99083e8](https://medium.com/@mainadanielwachira/a-comprehensive-guide-to-using-django-crontab-for-scheduled-tasks-bb62b99083e8)
