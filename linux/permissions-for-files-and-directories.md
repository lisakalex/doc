# Permissions for files and directories

Here’s a complete breakdown of **permissions for files and directories** in Linux/Unix, including normal and special bits.

---

## **1. Basic Permissions**

| Permission | Symbol | Meaning                                            |
| ---------- | ------ | -------------------------------------------------- |
| Read       | `r`    | Can read file / list directory contents            |
| Write      | `w`    | Can modify file / create/delete files in directory |
| Execute    | `x`    | Can execute file / enter/traverse directory        |

---

### **Files**

* **Owner / Group / Others** each get `r`, `w`, `x`
* Example: `-rw-r--r--`

    * Owner: read/write
    * Group: read
    * Others: read

---

### **Directories**

* `r` → list contents (`ls`)
* `w` → create/delete files
* `x` → traverse / enter the directory (`cd`)

Example: `drwxr-x---`

* Owner: read/write/enter
* Group: read/enter
* Others: no access

---

## **2. Special Permission Bits**

| Bit    | Symbol    | File Effect        | Directory Effect                                  |
| ------ | --------- | ------------------ | ------------------------------------------------- |
| Setuid | `s` / `S` | File runs as owner | Not used                                          |
| Setgid | `s` / `S` | File runs as group | New files inherit directory group                 |
| Sticky | `t`       | N/A                | Only owner can delete files in dir (e.g., `/tmp`) |

**Notes on lowercase vs uppercase:**

* Lowercase `s` → execute bit is set, special bit active
* Uppercase `S` → execute bit not set, special bit inactive

Example:

* File: `-rwsr-xr-x` → setuid active, runs as owner
* Directory: `drwxr-sr-x` → setgid active, new files inherit group

---

## **3. Examples of Common Permissions**

| Type             | Example      | Meaning                                                  |
| ---------------- | ------------ | -------------------------------------------------------- |
| File             | `-rw-r--r--` | Owner read/write, others read                            |
| Executable File  | `-rwxr-xr-x` | Owner can run, group/others can run                      |
| Directory        | `drwxr-xr-x` | Owner can read/write/enter, others can read/enter        |
| Web Dir (shared) | `drwxrwsr-x` | Setgid, group can write, new files inherit group         |
| Shared Temp      | `drwxrwxrwt` | Sticky bit, everyone can write but only owner can delete |

---

If you want, I can make a **visual chart showing all 3 user categories + special bits** in one table for **files vs directories**, so you can see exactly what permissions do at a glance. It’s handy for DevOps/web setups.

Do you want me to make that?

In a typical Linux system, the `www-data` user and group are used by web servers like **Apache** or **Nginx**. There isn’t a single “standard” permission for all files, but there are **common conventions** for files and directories that `www-data` owns or uses.

---

## **1. Typical Ownership**

* **User:** `www-data` (the web server process)
* **Group:** `www-data`
* Files or directories that the web server needs to write to should be **owned by `www-data` or writable by the group**.

---

## **2. Typical Permissions**

| File/Directory Type                         | Permissions Example | Notes                                                                       |
| ------------------------------------------- | ------------------- | --------------------------------------------------------------------------- |
| Web files (HTML, CSS, JS)                   | `-rw-r--r--`        | Readable by web server (`www-data` in group or owner), not writable         |
| Configuration files                         | `-rw-r-----`        | Only owner (root) and group (www-data) can read                             |
| Directories (web root)                      | `drwxr-xr-x`        | Owner can write, others can read/enter                                      |
| Upload or cache directories                 | `drwxrwsr-x`        | Setgid + group writable so new files inherit group and web server can write |
| Temporary directories (like `/var/www/tmp`) | `drwxrwxrwt`        | Sticky bit prevents users from deleting each other’s files                  |

---

### **3. Common Practices**

1. **Read-only web files:** `www-data` can read, but shouldn’t write.
2. **Writable directories:** Only specific directories (uploads, logs, cache) are group-writable with `www-data`.
3. **Setgid directories:** Helps new files inherit `www-data` group.
4. **No world-writable web root:** Avoid `chmod 777` — it’s unsafe.

---

✅ **Summary**

* `www-data` is usually **owner or group** depending on the file.
* Files are usually `644` (`-rw-r--r--`)
* Directories are usually `755` (`drwxr-xr-x`)
* Only special directories are `775` or `1777` for writable areas.

---

If you want, I can make a **ready-to-use permission template for a typical web project**, showing exactly which directories `www-data` should own and which files should be read-only. This makes deployment safer.

Do you want me to do that?

Got it, Alex. You can do this safely with `find` to **separately set files and directories** recursively.

---

### **1. Set all directories to `755`**

```bash
find site/ -type d -exec chmod 755 {} \;
```

* `-type d` → only directories
* `chmod 755` → `rwxr-xr-x`

---

### **2. Set all files to `644`**

```bash
find site/ -type f -exec chmod 644 {} \;
```

* `-type f` → only files
* `chmod 644` → `rw-r--r--`

---

### **3. Optional: verify**

```bash
ls -lR site/
```

* Shows recursive permissions
* Directories should be `drwxr-xr-x`
* Files should be `-rw-r--r--`

---

This is the **standard safe setup for web projects**, where `www-data` can read files, enter directories, and only specific writable dirs (uploads/cache) are adjusted separately.

If you want, I can also give a **one-liner that does both in a single command**. It’s handy for deployments. Do you want that?

Here’s a neat **one-liner** that sets all **directories to 755** and all **files to 644** in one go:

```bash
find site/ -type d -exec chmod 755 {} \; -o -type f -exec chmod 644 {} \;
```

### **How it works:**

* `find site/` → start at `site/`
* `-type d -exec chmod 755 {} \;` → directories get `755`
* `-o` → “or”
* `-type f -exec chmod 644 {} \;` → files get `644`

✅ After this, your **web project will have safe standard permissions**:

* Directories: `drwxr-xr-x`
* Files: `-rw-r--r--`

Optional: you can combine this with `chown -R al:www-data site/` to ensure `al` is owner and `www-data` is group for all files.

Do you want me to show that full combined command?

Here’s a **full combined command** to set ownership and safe permissions for a web project like your `site/` directory:

```bash
# Set ownership
chown -R al:www-data site/

# Set directories to 755 and files to 644
find site/ -type d -exec chmod 755 {} \; -o -type f -exec chmod 644 {} \;
```

### **Explanation**

1. `chown -R al:www-data site/`

    * Recursively sets **owner = al** and **group = www-data**

2. `find site/ -type d -exec chmod 755 {} \; -o -type f -exec chmod 644 {} \;`

    * Directories: `drwxr-xr-x` → owner can write, others can enter
    * Files: `-rw-r--r--` → owner can read/write, others can read

---

✅ This is a **safe standard setup** for most web projects:

* `www-data` can read files and enter directories
* Only specific writable dirs (uploads, cache) need separate adjustment

If you want, I can also show a **version that automatically sets setgid on group-writable directories** so new files inherit the `www-data` group. That’s very handy for shared web projects.

Do you want me to show that too?
