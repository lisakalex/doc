In IntelliJ (or WebStorm), **all code style and formatting settings** are stored in your **IDE configuration directory** or, if you export them, in a **project-specific configuration file**. Here’s a breakdown:

---

### **1. IDE-wide settings**

* Path depends on your OS:

| OS          | Path                                                     |
| ----------- | -------------------------------------------------------- |
| **Windows** | `%USERPROFILE%\.IntelliJIdea<version>\config\codestyles` |
| **macOS**   | `~/Library/Preferences/IntelliJIdea<version>/codestyles` |
| **Linux**   | `~/.config/JetBrains/IntelliJIdea<version>/codestyles`   |

* The `codestyles` folder contains **XML files** like `Project.xml` or `Default.xml` defining code formatting rules.

---

### **2. Project-specific settings**

* If your project has **code style stored in VCS**, look in the project directory:

```
<project-root>/.idea/codeStyles/
```

* Files are XML, e.g., `codeStyleConfig.xml` or `Project.xml`.

---

### **3. How to check from IntelliJ**

1. **Settings → Editor → Code Style → HTML**
2. Click **Manage → Save as Global / Copy to Project**
3. IntelliJ will either store it in the IDE config folder (global) or in `.idea/codeStyles` (project).

---

If you want, I can give a **step-by-step way to permanently stop IntelliJ from wrapping `<a><br>` lines** by editing these settings directly in the XML file.

Do you want me to do that?
Great! Here’s how to **permanently stop IntelliJ from wrapping your `<a><br>` lines** by editing the code style XML directly.

---

### **Step 1: Locate the code style file**

**Project-specific:**

```
<project-root>/.idea/codeStyles/Project.xml
```

**IDE-wide:**

* **Windows:** `%USERPROFILE%\.IntelliJIdea<version>\config\codestyles/`
* **macOS:** `~/Library/Preferences/IntelliJIdea<version>/codestyles/`
* **Linux:** `~/.config/JetBrains/IntelliJIdea<version>/codestyles/`

---

### **Step 2: Open the XML file**

You’ll see something like this inside:

```xml
<code_scheme name="Project" version="173">
  <HTMLCodeStyleSettings>
    <option name="HTML_WRAP_LONG_LINES" value="true" />
    <option name="HTML_DO_NOT_WRAP_TAGS" />
    ...
  </HTMLCodeStyleSettings>
</code_scheme>
```

---

### **Step 3: Change wrapping options**

1. **Disable wrapping for HTML tags**:

```xml
<option name="HTML_WRAP_LONG_LINES" value="false" />
```

2. **Optional:** Specify tags that should never wrap. Add `<a>` here:

```xml
<option name="HTML_DO_NOT_WRAP_TAGS" value="a,br" />
```

* This tells IntelliJ **never to break lines for `<a>` or `<br>` tags**.

---

### **Step 4: Save and reload**

1. Save the XML file.
2. Restart IntelliJ (or re-import project) to apply.
3. Your `<a href="/test/">Test drive</a><br>` will now **stay on a single line** even after auto-format.

---

If you want, I can create a **ready-to-paste XML snippet** that you can drop into your project so all `<a>` + `<br>` lines stay untouched automatically.

Do you want me to do that?
