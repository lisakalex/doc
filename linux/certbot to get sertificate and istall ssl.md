Certbot is a free and open-source tool to obtain SSL/TLS certificates from Let’s Encrypt and automatically install them on your web server. Here's how to use it to secure your website with SSL:

---

### **Step 1: Install Certbot**
1. Update your package list:
   ```bash
   sudo apt update
   ```
2. Install Certbot and its dependencies for your web server (e.g., Nginx or Apache):
   - For Apache:
     ```bash
     sudo apt install certbot python3-certbot-apache
     ```
   - For Nginx:
     ```bash
     sudo apt install certbot python3-certbot-nginx
     ```

---

### **Step 2: Obtain an SSL Certificate**
1. **For Apache**:
   Run Certbot with the Apache plugin:
   ```bash
   sudo certbot --apache
   ```
   - Certbot will automatically detect your Apache configuration and ask which domain(s) you want to secure.
   - It will automatically configure HTTPS for your site.

2. **For Nginx**:
   Run Certbot with the Nginx plugin:
   ```bash
   sudo certbot --nginx
   ```
   - Certbot will detect your Nginx configuration and secure your domain(s).
   - It modifies your Nginx configuration to enable HTTPS.

3. If you’re not using a supported web server, use the standalone mode:
   ```bash
   sudo certbot certonly --standalone
   ```
   - This requires your web server to be stopped during certificate issuance.

---

### **Step 3: Verify Installation**
- Certbot configures your web server to redirect HTTP traffic to HTTPS.
- Test your configuration by visiting your site at `https://yourdomain.com`.

---

### **Step 4: Automatic Renewal**
Let’s Encrypt certificates expire every 90 days, but Certbot can automate renewals:
1. Test renewal with:
   ```bash
   sudo certbot renew --dry-run
   ```
2. Certbot installs a cron job or systemd timer for automatic renewal. Verify its status:
   ```bash
   sudo systemctl status certbot.timer
   ```

---

### **Step 5: Troubleshooting**
- Ensure port 80 (HTTP) and 443 (HTTPS) are open in your firewall:
  ```bash
  sudo ufw allow 'Apache Full'
  sudo ufw allow 'Nginx Full'
  ```
- Check Certbot logs if issues occur:
  ```bash
  cat /var/log/letsencrypt/letsencrypt.log
  ```

Let me know if you need help with specific configurations!
