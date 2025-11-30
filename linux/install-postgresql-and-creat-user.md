# Install PostgreSQL + Create User

🧠 You want to install **PostgreSQL** and create a **user** — let’s get you there fast and clean.

---

## ✅ Step-by-Step: Install PostgreSQL + Create User

### 📦 1. Install PostgreSQL (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

---

### 👤 2. Switch to the `postgres` Admin User

```bash
sudo -i -u postgres
```

You're now in the `postgres` shell.

---

### 🔧 3. Create a New Database User

```bash
createuser --interactive
```

Follow the prompt:

* Enter username (e.g., `django_user`)
* Allow superuser? → `no`

✅ Or use SQL:

```bash
psql
CREATE USER django_user WITH PASSWORD 'securepassword';
```

---

### 🛠 4. Create a Database and Grant Access

```sql
CREATE
DATABASE django_db;
GRANT ALL PRIVILEGES ON DATABASE
django_db TO django_user;
\q
```

Then exit the shell:

```bash
exit
```

---

### 📄 5. Use in Django `settings.py`

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'django_db',
        'USER': 'django_user',
        'PASSWORD': 'securepassword',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

✅ That’s it! You're ready to:

```bash
python manage.py migrate
python manage.py runserver
```

Need a full setup script to automate this?
[Click here to try a new GPT!](https://f614.short.gy/Code)
