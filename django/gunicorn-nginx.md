# Gunicorn + Nginx

Here’s a **complete guide** to setting up a Django app using **Gunicorn + Nginx** on a Linux server (like Ubuntu). This is the **modern, recommended production deployment** setup — fast, efficient, and scalable.

---

## ✅ Why Gunicorn + Nginx?

* **Gunicorn**: A Python WSGI HTTP server – runs your Django code
* **Nginx**: A fast reverse proxy – serves static files and forwards traffic to Gunicorn

---

## 🧰 Prerequisites

You should already have:

* Django project (e.g. `/home/username/myproject/`)
* Python virtual environment
* Ubuntu or Debian-based server (adjust paths for other distros)

---

## 🚀 Step-by-Step Setup

### 1. **Install Gunicorn inside your virtualenv**

```bash
source /home/username/myproject/venv/bin/activate
pip install gunicorn
```

### 2. **Test Gunicorn (local test)**

```bash
cd /home/username/myproject/
gunicorn myproject.wsgi:application
```

* This will run your Django app on `127.0.0.1:8000`
* If it works, press `Ctrl+C` to stop

---

### 3. **Create a systemd Service for Gunicorn**

Create a unit file:

```bash
sudo nano /etc/systemd/system/gunicorn.service
```

Paste this:

```ini
[Unit]
Description=gunicorn daemon for myproject
After=network.target

[Service]
User=username
Group=www-data
WorkingDirectory=/home/username/myproject
ExecStart=/home/username/myproject/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/home/username/myproject/gunicorn.sock \
          myproject.wsgi:application

[Install]
WantedBy=multi-user.target
```

Then run:

```bash
sudo systemctl daemon-reexec
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

Test:

```bash
sudo systemctl status gunicorn
```

---

### 4. **Install and Configure Nginx**

```bash
sudo apt install nginx
```

Create a config file:

```bash
sudo nano /etc/nginx/sites-available/myproject
```

Paste this:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/username/myproject;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/username/myproject/gunicorn.sock;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

---

### 5. **Update Django Settings**

Make sure your `settings.py` has:

```python
ALLOWED_HOSTS = ['yourdomain.com', '127.0.0.1']
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
```

Then collect static files:

```bash
python manage.py collectstatic
```

---

### 6. **(Optional) Secure with HTTPS (Let’s Encrypt)**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🧪 Test Your Setup

* Visit `http://yourdomain.com`
* Django app should load
* Static files should load via Nginx

---

## 🧼 Folder Structure Overview

```
/home/username/myproject/
├── manage.py
├── myproject/
│   ├── wsgi.py
├── gunicorn.sock
├── static/
├── venv/
```

---

### 📚 References

* [Django official deployment docs](https://docs.djangoproject.com/en/stable/howto/deployment/wsgi/gunicorn/)
* [DigitalOcean Django Gunicorn guide](https://www.digitalocean.com/community/tutorials/how-to-deploy-django-app-with-gunicorn-nginx-on-ubuntu-20-04)

---

Would you like a version of this setup that includes HTTPS, PostgreSQL, or Docker?
