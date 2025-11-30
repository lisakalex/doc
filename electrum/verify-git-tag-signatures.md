# Verify Git tag signatures

Great question — verifying Git tag signatures is a solid way to make sure you’re building Electrum (or any project) from an **authentic source**.

Here’s how to do it step by step:

---

## 1. Clone Electrum’s repo

```bash
git clone https://github.com/spesmilo/electrum.git
cd electrum
```

---

## 2. Fetch all tags (signed release tags)

```bash
git fetch --tags
```

---

## 3. Verify a release tag

For example, if you want to check `4.6.1`:

```bash
git tag -v 4.6.1
```

You should see output like:

```
object 123abc...
type commit
tag 4.6.1
tagger Thomas Voegtlin <thomasv@electrum.org> 2024-10-01 12:34:56 +0000

Electrum 4.6.1 release
gpg: Signature made ...
gpg: Good signature from "Thomas Voegtlin (https://electrum.org) <thomasv@electrum.org>"
```

✅ **Good signature** means the tag is valid.

---

## 4. Import Thomas Voegtlin’s GPG key if needed

If you haven’t already:

```bash
gpg --keyserver hkps://keys.openpgp.org --recv-keys 6694D8DE7BE8EE5631BED9502BD5824B7F9470E6
```

---

## 5. Checkout the release

Once verified:

```bash
git checkout 4.6.1
```

Now you’re on the verified source code for Electrum 4.6.1.

---

⚡ This is better than just `git clone` and `pip install .` because you **pin to a cryptographically signed release**.

---

Do you want me to make you a **one-liner shell script** that clones Electrum, verifies the latest signed tag, and checks it out automatically?
