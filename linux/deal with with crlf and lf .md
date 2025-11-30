Dealing with CRLF (Windows-style line endings) and LF (Unix/Linux-style) in a team using Git across Windows and Linux can be tricky, but it's solvable with a consistent setup. Here's how to manage it effectively:

---

## ✅ Best Practice: Use Git's `core.autocrlf` Setting

### 1. **Set `.gitattributes` in Your Repository (RECOMMENDED)**
This is the **most consistent** way to enforce line endings across platforms.

Create a `.gitattributes` file at the root of your repo:

```
* text=auto
```

You can also force specific file types to use LF or CRLF:

```gitattributes
*.sh   text eol=lf
*.bat  text eol=crlf
*.ps1  text eol=crlf
*.py   text eol=lf
*.yml  text eol=lf
```

Git will normalize line endings to LF in the repo and convert to the OS-specific format on checkout.

🔗 Reference: [Git Book - Customizing Git: Attributes](https://git-scm.com/book/en/v2/Customizing-Git-Git-Attributes)

---

### 2. **Set Local Git Config Depending on OS**

#### On **Windows**:
```bash
git config --global core.autocrlf true
```
This tells Git:
- Convert LF to CRLF when **checking out**
- Convert CRLF back to LF when **committing**

#### On **Linux/macOS**:
```bash
git config --global core.autocrlf input
```
This means:
- Leave LF on checkout
- Convert CRLF to LF on commit

🔗 Reference: [Git Documentation - core.autocrlf](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreautocrlf)

---

### 3. **Fix Existing Files in a Repo**

If line endings are already inconsistent:

```bash
# Ensure .gitattributes is set
# Then run:
git add --renormalize .
git commit -m "Normalize line endings"
```

🔗 Reference: [GitHub Docs - Dealing with line endings](https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings)

---

### 4. **Avoid Editor Conflicts**

Configure your editors to match Git settings:

- **VS Code**: Set `"files.eol": "\n"` or `"\r\n"` in `settings.json`
- **Sublime Text / IntelliJ / Vim / etc.**: Configure default line endings to LF

---

Would you like a sample `.gitattributes` file tailored for a DevOps project (e.g., scripts, Dockerfiles, YAML)?