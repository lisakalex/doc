If you have reinstalled Ubuntu, your old SSH keypair (typically stored in `~/.ssh/id_rsa` and `~/.ssh/id_rsa.pub`) is gone unless you backed it up. Here’s what you can do:

### **Option 1: Restore Old SSH Key (If Backed Up)**
If you saved your old SSH key before reinstalling, restore it by:
1. Copying the private key (`id_rsa`) and public key (`id_rsa.pub`) back to `~/.ssh/`.
2. Setting correct permissions:
   ```bash
   chmod 600 ~/.ssh/id_rsa
   chmod 644 ~/.ssh/id_rsa.pub
   ```
3. Restarting SSH agent and adding the key:
   ```bash
   eval $(ssh-agent -s)
   ssh-add ~/.ssh/id_rsa
   ```
4. Testing the connection:
   ```bash
   ssh -T git@github.com  # Example for GitHub
   ```

### **Option 2: Generate a New SSH Key (If Not Backed Up)**
If you don’t have a backup, generate a new SSH key:
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
- Save it in `~/.ssh/id_rsa` (default location).
- Add the new public key (`~/.ssh/id_rsa.pub`) to services like GitHub, GitLab, or remote servers.

Check if your old key was backed up before generating a new one, as using the old key avoids updating all your authorized keys.