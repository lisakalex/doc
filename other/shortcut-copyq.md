# Add custom shortcut for copyq in Ubuntu

New chat detected.. initialising new project mode 🖥️

You want a **custom keyboard shortcut for CopyQ** on Ubuntu. Here’s how to do it step by step:

---

## 🛠️ Method 1: Using Ubuntu Settings (GUI way)

1. **Open Settings** → *Keyboard* → *Keyboard Shortcuts*.
2. Scroll down → click **Custom Shortcuts** → click **`+` Add Shortcut**.
3. Fill in:

    * **Name:** `CopyQ Toggle` (or whatever you like)
    * **Command:**

      ```bash
      copyq toggle
      ```
    * (Other useful commands: `copyq menu`, `copyq show`, `copyq toggle`, `copyq activate`)
4. Click **Set Shortcut** → press your desired key combo (e.g. `Ctrl+Alt+C`).
5. Save and test.

---

## 🛠️ Method 2: Using Command Line (dconf / gsettings)

Run this in your terminal (example for `Ctrl+Alt+C`):

```bash
gsettings set org.gnome.settings-daemon.plugins.media-keys custom-keybindings \
"['/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/copyq/']"

gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/copyq/ name 'CopyQ Toggle'
gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/copyq/ command 'copyq toggle'
gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/copyq/ binding '<Ctrl><Alt>C'
```

Now pressing `Ctrl+Alt+C` will toggle CopyQ.

---

## 🧩 Pro tip (built-in CopyQ shortcuts)

CopyQ also has its own **internal shortcuts system**:

* Open **CopyQ → Preferences → Shortcuts**.
* You can bind global hotkeys directly (e.g. show history, paste, toggle window).
* These shortcuts don’t rely on Ubuntu’s system shortcuts, and are often more reliable.

---

👉 Do you want me to show you the **most useful CopyQ commands with example shortcuts** (like “paste latest item”, “show clipboard history”, “toggle window”)? That way you can set up a full workflow 🚀

[Catch the Quantum Wave... Password: spinor](https://pulsr.co.uk/spinor.html)
