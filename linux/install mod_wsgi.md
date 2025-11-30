To install **mod_wsgi** on your system, follow these steps. This process is for Ubuntu or Debian-based systems but can be adapted for other distributions.

---

### **Step 1: Update the Package List**
Run the following command to update your package list:
```bash
sudo apt update
```

---

### **Step 2: Install Apache2**
If Apache2 is not already installed, you can install it with:
```bash
sudo apt install apache2 -y
```

---

### **Step 3: Install `mod_wsgi`**
1. Install the `mod_wsgi` package for Python 3:
   ```bash
   sudo apt install libapache2-mod-wsgi-py3 -y
   ```

2. Verify that `mod_wsgi` is enabled in Apache:
   ```bash
   apache2ctl -M | grep wsgi
   ```
   You should see `wsgi_module` in the output. If it’s not enabled, you can enable it manually:
   ```bash
   sudo a2enmod wsgi
   ```

3. Restart Apache2 to apply changes:
   ```bash
   sudo systemctl restart apache2
   ```

---

### **Step 4: Verify Installation**
Create a simple WSGI test application to confirm `mod_wsgi` is working.

1. Create a directory for your app:
   ```bash
   sudo mkdir -p /var/www/wsgi_test
   ```

2. Create a WSGI script:
   ```bash
   sudo nano /var/www/wsgi_test/app.wsgi
   ```

   Add the following content:
   ```python
   def application(environ, start_response):
       status = '200 OK'
       output = b'WSGI is working!'

       response_headers = [('Content-type', 'text/plain'), ('Content-Length', str(len(output)))]
       start_response(status, response_headers)

       return [output]
   ```

3. Configure Apache to serve this application:
   ```bash
   sudo nano /etc/apache2/sites-available/wsgi_test.conf
   ```

   Add the following content:
   ```apache
   <VirtualHost *:80>
       ServerName wsgitest.local
       DocumentRoot /var/www/wsgi_test

       WSGIScriptAlias / /var/www/wsgi_test/app.wsgi

       <Directory /var/www/wsgi_test>
           Require all granted
       </Directory>
   </VirtualHost>
   ```

4. Enable the site and reload Apache:
   ```bash
   sudo a2ensite wsgi_test
   sudo systemctl restart apache2
   ```

5. Add an entry to your `/etc/hosts` file to test locally:
   ```bash
   sudo nano /etc/hosts
   ```
   Add the following line:
   ```
   127.0.0.1 wsgitest.local
   ```

6. Open a web browser and visit:
   ```
   http://wsgitest.local
   ```

You should see the message **"WSGI is working!"**

---

### **Troubleshooting**
- If the module isn’t working as expected, check the Apache error logs:
  ```bash
  sudo tail -f /var/log/apache2/error.log
  ```

- Ensure that the Python version matches your application’s requirements.