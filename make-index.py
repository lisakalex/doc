#!/usr/bin/env python3
"""Build index.html: a sitemap of every page and document on https://lisakalex.github.io/doc/.

    python3 make-index.py        # rerun after adding or moving files, then commit index.html

Lists .html, .pdf, .csv and .md files, grouped by folder, with each page's <title>.
Skips styling and script folders (assets, css, js, img), search/print helpers,
and site/_hidden (pages deliberately kept out of the menus).
"""
import html
from urllib.parse import quote
import re
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
KEEP = {".html", ".pdf", ".csv", ".md"}
SKIP_DIRS = {".git", ".idea", ".jbeval", "assets", "css", "js", "img", "images",
             "javascripts", "stylesheets", "search", "print_page", "print-site", "_hidden", "fonts"}
SKIP_FILES = {"index.html", "404.html"}  # root index is this page; 404 is not content

OTHER_SITES = [
    ("mkdocs-1", "https://lisakalex.github.io/mkdocs-1/"),
    ("chatik", "https://lisakalex.github.io/chatik/"),
    ("gandon", "https://lisakalex.github.io/gandon/"),
    ("cdn", "https://lisakalex.github.io/cdn/"),
]


def title_of(p: Path) -> str:
    if p.suffix != ".html":
        return ""
    m = re.search(r"<title[^>]*>(.*?)</title>", p.read_text(errors="ignore")[:20000], re.S | re.I)
    if not m:
        return ""
    t = html.unescape(re.sub(r"\s+", " ", m.group(1))).strip()
    return re.sub(r"\s+[-–|]\s+(Documentation|Docs|My Docs|MkDocs)$", "", t)


def collect():
    groups = defaultdict(list)
    for p in sorted(ROOT.rglob("*")):
        rel = p.relative_to(ROOT)
        if not p.is_file() or p.suffix.lower() not in KEEP:
            continue
        if any(part in SKIP_DIRS for part in rel.parts[:-1]):
            continue
        if len(rel.parts) == 1:
            continue  # files at the repo root (this page)
        if rel.name == "404.html":
            continue
        top = rel.parts[0]
        # mkdocs-style page: folder/index.html -> link to the folder
        if rel.name == "index.html":
            href = "/".join(rel.parts[:-1]) + "/"
            label = "/".join(rel.parts[1:-1]) + "/" if len(rel.parts) > 2 else "(start page)"
        else:
            href = rel.as_posix()
            label = "/".join(rel.parts[1:])
        groups[top].append((label, href, title_of(p), p.suffix.lower().lstrip(".")))
    return groups


def render(groups) -> str:
    total = sum(len(v) for v in groups.values())
    sections = []
    for top in sorted(groups):
        rows = []
        for label, href, title, kind in sorted(groups[top], key=lambda r: (r[0] != "(start page)", r[0].lower())):
            show = title if title and title.lower() not in {label.strip("/").lower()} else ""
            rows.append(
                f'<li data-k="{html.escape((label + " " + title).lower())}">'
                f'<a href="{html.escape(quote(href))}">{html.escape(label)}</a>'
                + (f'<span class="t">{html.escape(show)}</span>' if show else "")
                + (f'<span class="k">{kind}</span>' if kind != "html" else "")
                + "</li>")
        sections.append(
            f'<details open id="{html.escape(top)}"><summary><span class="d">{html.escape(top)}/</span>'
            f'<span class="c">{len(groups[top])}</span></summary><ul>{"".join(rows)}</ul></details>')
    other = "".join(f'<li><a href="{u}">{n}</a><span class="t">{u}</span></li>' for n, u in OTHER_SITES)
    return TEMPLATE.format(total=total, nfolders=len(groups), sections="\n".join(sections),
                           other=other, today=date.today().strftime("%-d %b %Y"))


TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<title>Site map</title>
<style>
/* One column of folders; each folder is a collapsible list of pages. */
:root {{
  --bg: #f6f7f9; --panel: #ffffff; --ink: #1c2330; --muted: #5d6878; --line: #dde2ea;
  --accent: #1f6f5c; --chip: #e7efec;
  --mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color-scheme: light;
}}
@media (prefers-color-scheme: dark) {{
  :root {{ --bg: #12161c; --panel: #1a2029; --ink: #e3e8ef; --muted: #98a3b3; --line: #2b3340;
          --accent: #5cc2a6; --chip: #22322e; color-scheme: dark; }}
}}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.5 var(--sans);
       padding: 32px max(16px, env(safe-area-inset-right)) 48px max(16px, env(safe-area-inset-left)); }}
main {{ max-width: 860px; margin: 0 auto; display: grid; gap: 14px; }}
h1 {{ margin: 0; font-size: 1.6rem; }}
.sub {{ color: var(--muted); margin: 0; }}
input {{ width: 100%; padding: 10px 12px; font: inherit; color: var(--ink); background: var(--panel);
        border: 1px solid var(--line); border-radius: 6px; }}
input:focus {{ outline: 2px solid var(--accent); outline-offset: 1px; }}
details {{ background: var(--panel); border: 1px solid var(--line); border-radius: 6px; }}
summary {{ cursor: pointer; padding: 10px 14px; display: flex; gap: 10px; align-items: baseline; }}
summary:focus-visible {{ outline: 2px solid var(--accent); }}
.d {{ font: 600 1rem var(--mono); }}
.c {{ color: var(--muted); font-size: .85rem; font-variant-numeric: tabular-nums; }}
ul {{ list-style: none; margin: 0; padding: 0 14px 10px; }}
li {{ padding: 5px 0; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: baseline; }}
a {{ color: var(--accent); font-family: var(--mono); font-size: .9rem; overflow-wrap: anywhere; }}
.t {{ color: var(--muted); font-size: .88rem; }}
.k {{ font: .72rem var(--mono); text-transform: uppercase; letter-spacing: .05em; background: var(--chip);
      color: var(--accent); padding: 1px 6px; border-radius: 4px; }}
h2 {{ font-size: 1rem; margin: 18px 0 0; }}
footer {{ color: var(--muted); font-size: .85rem; }}
</style>
</head>
<body>
<main>
<h1>Site map</h1>
<p class="sub">{total} pages and files in {nfolders} folders on lisakalex.github.io/doc. Type to filter.</p>
<input id="q" type="search" placeholder="Filter, e.g. docker, cv, lesson 2.1" aria-label="Filter pages" autocomplete="off">
{sections}
<h2>Other sites</h2>
<details open><summary><span class="d">lisakalex.github.io/…</span></summary><ul>{other}</ul></details>
<footer>Generated {today} by make-index.py.</footer>
</main>
<script>
const q = document.getElementById('q');
q.addEventListener('input', () => {{
  const s = q.value.trim().toLowerCase();
  document.querySelectorAll('main > details[id]').forEach(d => {{
    let n = 0;
    d.querySelectorAll('li').forEach(li => {{ const hit = !s || li.dataset.k.includes(s); li.hidden = !hit; if (hit) n++; }});
    d.hidden = n === 0; if (s) d.open = true;
  }});
}});
</script>
</body>
</html>
"""

if __name__ == "__main__":
    groups = collect()
    (ROOT / "index.html").write_text(render(groups))
    print(f"index.html: {sum(len(v) for v in groups.values())} entries in {len(groups)} folders")
