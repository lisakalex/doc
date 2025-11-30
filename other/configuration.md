# Configuration and Navigation

Sure! Here's a rewritten version of your Hugo configuration documentation. It’s restructured for clarity, clean formatting, and better readability:

---

# 📘 Hugo Configuration Guide

Hugo uses a single configuration file, typically named `hugo.yaml`, located in the root of your site. This file lets you define how your site behaves—from menus and logos to sidebars and footers.

> 💡 **Tip:** For a full-featured example, check out the [`exampleSite/hugo.yaml`](https://github.com/imfing/hextra/blob/main/exampleSite/hugo.yaml) on GitHub.

---

## 🧭 Navigation Menu

The **top-right navigation menu** is defined in the `menu.main` section of your `hugo.yaml`.

### Example:

```yaml
menu:
  main:
    - name: Documentation
      pageRef: /docs
      weight: 1
    - name: Blog
      pageRef: /blog
      weight: 2
    - name: About
      pageRef: /about
      weight: 3
    - name: Search
      weight: 4
      params:
        type: search
    - name: GitHub
      weight: 5
      url: "https://github.com/imfing/hextra"
      params:
        icon: github
```

### Supported Menu Item Types:

* **Internal Link** (using `pageRef`)

  ```yaml
  - name: Docs
    pageRef: /docs
  ```

* **External Link** (using `url`)

  ```yaml
  - name: GitHub
    url: "https://github.com"
  ```

* **Search Bar**

  ```yaml
  - name: Search
    params:
      type: search
  ```

* **Icon Support**

  ```yaml
  - name: GitHub
    params:
      icon: github
  ```

> Use `weight` to control menu order.

---

## 🖼️ Logo & Site Title

Customize the logo and site title in your `hugo.yaml` under `params.navbar`.

```yaml
params:
  navbar:
    displayTitle: true
    displayLogo: true
    logo:
      path: images/logo.svg
      dark: images/logo-dark.svg
      link: /
      width: 40
      height: 20
```

* Place your logo under the `static/images/` folder.
* You can also define dark mode and link behavior.

---

## 📚 Sidebar Configuration

### 🔹 Main Sidebar

The main sidebar is **auto-generated** from your `content/` directory.

#### To exclude a page from the sidebar:

In the page’s front matter:

```yaml
---
title: Configuration
sidebar:
  exclude: true
---
```

---

### 🔹 Sidebar Extra Links

Define additional links under `menu.sidebar`:

```yaml
menu:
  sidebar:
    - name: More
      params:
        type: separator
      weight: 1
    - name: About
      pageRef: /about
      weight: 2
    - name: Hugo Docs ↗
      url: "https://gohugo.io/documentation/"
      weight: 3
```

---

## 📑 Right Sidebar (Table of Contents)

A **Table of Contents** is generated automatically based on page headings.

#### To disable it:

```yaml
---
title: Configuration
toc: false
---
```

---

## 📝 Page Edit Links

Enable edit links to your GitHub (or other) repository:

```yaml
params:
  editURL:
    enable: true
    base: "https://github.com/your-username/your-repo/edit/main"
```

#### Or per-page:

```yaml
---
title: Configuration
editURL: "https://example.com/edit/this/page"
---
```

---

## ⚓ Footer Customization

### 🄯 Copyright

Create a translation file: `i18n/en.yaml`
Example:

```yaml
copyright: "© 2024 YOUR TEXT HERE"
```

Supports **Markdown formatting** too!

---

## 🔖 Favicon

To use custom favicon(s), place your files in the `static/` folder. This will override the theme’s default icons.

---

Would you like this reformatted as a Markdown or Hugo content page directly?
[Click here to try a new GPT!](https://f614.short.gy/Code)
