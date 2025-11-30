# Verify the Electrum

Yes, Alex — you **should verify the Electrum download**, especially if you’re using it in production or handling customer funds.

Here’s why:

* Electrum binaries are not distributed through PyPI, so you normally download them from [electrum.org](https://electrum.org).
* There have been real-world phishing attacks where fake Electrum installers tricked users into giving up their Bitcoin.
* Verifying ensures the file wasn’t tampered with.

---

## 🔑 Verification steps (Linux example)

1. **Download the files**

   ```bash
   wget https://download.electrum.org/4.6.1/Electrum-4.6.1.tar.gz
   wget https://download.electrum.org/4.6.1/Electrum-4.6.1.tar.gz.asc
   ```

2. **Import the developer’s GPG key**

   ```bash
   gpg --keyserver hkps://keys.openpgp.org --recv-keys 6694D8DE7BE8EE5631BED9502BD5824B7F9470E6
   ```

   (That’s Thomas Voegtlin’s signing key, Electrum’s lead dev.)

3. **Verify signature**

   ```bash
   gpg --verify Electrum-4.6.1.tar.gz.asc Electrum-4.6.1.tar.gz
   ```

   ✅ You should see:

   ```
   gpg: Good signature from "Thomas Voegtlin (https://electrum.org) <thomasv@electrum.org>"
   ```

---

### If you’re installing via source (git clone):

* You don’t strictly need to verify if you trust GitHub directly, but in **production**, it’s best practice to either:

    * Verify Git tag signatures, or
    * Pin to a known commit hash.

---

⚠️ If you skip verification in a **test/dev environment**, it’s usually fine.
But for **production handling BTC**, I’d strongly recommend verifying.

---

Do you want me to write you a **ready-to-run Bash script** that automates the Electrum download + GPG verification?
