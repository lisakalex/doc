To ensure that all line endings in a project use **LF** (Line Feed) in IntelliJ IDEA on Linux, you can follow these steps:

---

### 1. **Configure Line Endings in IntelliJ IDEA**

IntelliJ IDEA allows you to configure the default line endings for new files and enforce them for existing files.

#### Steps:
1. Open IntelliJ IDEA.
2. Navigate to **File > Settings** (or **IntelliJ IDEA > Preferences** on macOS).
3. Go to **Editor > Code Style**.
4. Under **Line Separator**, select **Unix and macOS (\n)** from the dropdown.

This setting ensures that all new files created in IntelliJ will use LF line endings.

---

### 2. **Convert Existing Files to LF**

If you have files with different line endings, IntelliJ can convert them.

#### Steps:
1. Open the project in IntelliJ IDEA.
2. Right-click the **root directory** of your project in the **Project Explorer**.
3. Select **File Properties > Line Separators > LF - Unix and macOS (\n)**.
4. IntelliJ will convert the line endings of all files in the project to LF.

---

### 3. **Set Git to Use LF Line Endings**

If you are using Git, configure it to normalize line endings to LF, which is especially important for cross-platform projects.

#### Steps:
1. Open a terminal and configure Git globally to use LF:
   ```bash
   git config --global core.autocrlf input
   ```
   - This tells Git to convert CRLF (Windows) to LF when committing.
   - It leaves files untouched when checking them out on Linux or macOS.

2. If you want to enforce LF in a specific repository, create a `.gitattributes` file in the repository root and add the following:
   ```bash
   * text=auto
   *.sh eol=lf
   *.py eol=lf
   ```
   - This ensures LF line endings for scripts and text files.

---

### 4. **Verify Line Endings**

To check that all files have LF endings:
1. Open a terminal in your project directory.
2. Use the following command to find files with CRLF:
   ```bash
   grep -rl $'\r' .
   ```
   If this returns any files, they still have CRLF endings.

3. Convert those files to LF using `dos2unix`:
   ```bash
   dos2unix <filename>
   ```

To batch-convert all files:
```bash
find . -type f -exec dos2unix {} +
```

---

### Summary:
1. Set IntelliJ's default line separator to LF.
2. Convert existing files in IntelliJ to LF via **File Properties**.
3. Configure Git to normalize line endings to LF (`core.autocrlf=input`).
4. Use tools like `dos2unix` to ensure LF endings in existing files.

This will ensure consistent LF line endings in your project.
