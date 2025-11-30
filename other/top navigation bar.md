You're right — the **top navigation bar in Material for MkDocs** only appears **by default on wide screens**, and only when you **have the correct `features` enabled** and **enough space** (depending on layout). Let’s make sure everything is set up correctly.

---

## ✅ Ensure Top Navigation Bar Is Enabled

To force **top-level navigation** (horizontal menu), you must:

### 1. Use `navigation.tabs` feature (not `navigation.top`)

```yaml
theme:
  name: material
  features:
    - navigation.tabs  # THIS enables top nav bar (as tabs)
```

### 2. Make sure your `nav:` structure is shallow (1–2 levels deep)

Example:

```yaml
site_name: My Docs
theme:
  name: material
  features:
    - navigation.tabs

nav:
  - Home: index.md
  - Docs: docs.md
  - About: about.md
  - Blog: blog.md
```

If you use deep dropdowns, they’ll be converted to a side nav instead.

---

## ⚠️ Common Reasons Top Bar Fails

| Problem                               | Fix                               |
| ------------------------------------- | --------------------------------- |
| Used `navigation.top`                 | Use `navigation.tabs` instead     |
| Too many nested levels                | Use 1-2 levels only               |
| Screen too small                      | Try desktop view                  |
| Material theme not properly installed | Run `pip install mkdocs-material` |

---

## 🔧 Full Example of `mkdocs.yml`

```yaml
site_name: My Project
theme:
  name: material
  features:
    - navigation.tabs

nav:
  - Home: index.md
  - Getting Started: getting-started.md
  - API: api.md
  - About: about.md
```

---

## 📦 Build & Serve

After updating, run:

```bash
mkdocs serve
```

Then open [http://127.0.0.1:8000](http://127.0.0.1:8000) in a **desktop browser**.

---

Let me know if you'd like to include dropdowns or force mobile/desktop views.
