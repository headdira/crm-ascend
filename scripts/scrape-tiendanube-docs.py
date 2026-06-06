#!/usr/bin/env python3
"""Scrape Nuvemshop/Tiendanube API docs (2025-03) to markdown files."""

import html
import re
import urllib.request
from pathlib import Path

BASE = "https://tiendanube.github.io/api-documentation"
OUT_DIR = Path(__file__).resolve().parent.parent / "docs" / "tiendanube-api"


def strip_tags(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    return html.unescape(text)


def html_to_md(content: str) -> str:
    content = re.sub(
        r'<a href="#[^"]*" class="hash-link"[^>]*>.*?</a>', "", content
    )

    for level in range(6, 0, -1):
        content = re.sub(
            rf"<h{level}[^>]*>(.*?)</h{level}>",
            lambda m, lvl=level: "\n"
            + "#" * lvl
            + " "
            + strip_tags(m.group(1)).strip()
            + "\n",
            content,
            flags=re.DOTALL,
        )

    def replace_codeblock(match: re.Match[str]) -> str:
        classes = match.group(1) or ""
        lang_match = re.search(r"language-(\w+)", classes)
        lang = lang_match.group(1) if lang_match else ""
        code = re.sub(r"<[^>]+>", "", match.group(2))
        code = html.unescape(code).strip()
        return f"\n\n```{lang}\n{code}\n```\n\n"

    content = re.sub(
        r'<motion\.div class="language-(\w+)?[^"]* codeBlockContainer[^"]*"[^>]*>.*?<pre[^>]*><code[^>]*>(.*?)</code></pre>',
        replace_codeblock,
        content,
        flags=re.DOTALL,
    )
    content = re.sub(
        r'<div class="language-(\w+)?[^"]* codeBlockContainer[^"]*"[^>]*>.*?<pre[^>]*><code[^>]*>(.*?)</code></pre>',
        replace_codeblock,
        content,
        flags=re.DOTALL,
    )
    content = re.sub(
        r'<motion\.motion\.div class="codeBlockContainer[^"]*"[^>]*>.*?<pre[^>]*><code[^>]*>(.*?)</code></pre>',
        lambda m: f"\n\n```\n{html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip()}\n```\n\n",
        content,
        flags=re.DOTALL,
    )
    content = re.sub(
        r'<div class="codeBlockContainer[^"]*"[^>]*>.*?<pre[^>]*><code[^>]*>(.*?)</code></pre>',
        lambda m: f"\n\n```\n{html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip()}\n```\n\n",
        content,
        flags=re.DOTALL,
    )

    content = re.sub(r"<code>([^<]*)</code>", r"`\1`", content)
    content = re.sub(
        r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>',
        lambda m: f"[{strip_tags(m.group(2))}]({m.group(1)})",
        content,
        flags=re.DOTALL,
    )
    content = re.sub(r"<strong>(.*?)</strong>", r"**\1**", content, flags=re.DOTALL)
    content = re.sub(r"<em>(.*?)</em>", r"*\1*", content, flags=re.DOTALL)
    content = re.sub(
        r"<li>(.*?)</li>",
        lambda m: f"\n- {strip_tags(m.group(1)).strip()}",
        content,
        flags=re.DOTALL,
    )
    content = re.sub(r"<ul>|</ul>|<ol>|</ol>", "\n", content)
    content = re.sub(
        r"<p>(.*?)</p>",
        lambda m: f"\n\n{strip_tags(m.group(1)).strip()}\n",
        content,
        flags=re.DOTALL,
    )
    content = re.sub(
        r"<blockquote>(.*?)</blockquote>",
        lambda m: "\n> " + strip_tags(m.group(1)).strip() + "\n",
        content,
        flags=re.DOTALL,
    )
    content = re.sub(r"<thead>|</thead>|<tbody>|</tbody>", "", content)
    content = re.sub(r"<tr>", "\n", content)
    content = re.sub(r"</tr>", "", content)
    content = re.sub(
        r"<t[hd][^>]*>(.*?)</t[hd]>",
        lambda m: "| " + strip_tags(m.group(1)).strip() + " ",
        content,
        flags=re.DOTALL,
    )

    content = re.sub(r"<[^>]+>", "", content)
    content = html.unescape(content)
    content = re.sub(r"\n{3,}", "\n\n", content)
    content = re.sub(r" +", " ", content)
    return content.strip()


def extract_index_cards(html_content: str) -> str | None:
    cards = re.findall(
        r'class="card padding--lg cardContainer[^"]*" href="(/api-documentation/[^"]+)">'
        r'<h2 class="[^"]*" title="([^"]*)">.*?</h2>'
        r'<p class="[^"]*" title="([^"]*)">(.*?)</p>',
        html_content,
        flags=re.DOTALL,
    )
    if not cards:
        return None

    lines = ["## Recursos\n"]
    for href, title, _desc_title, desc in cards:
        desc = strip_tags(desc).strip()
        link = f"[{strip_tags(title).strip()}]({href})"
        lines.append(f"- {link}" + (f" — {desc}" if desc else ""))
    return "\n".join(lines) + "\n"


def extract_markdown(html_content: str) -> str | None:
    patterns = [
        r'class="theme-doc-markdown markdown">(.*?)<footer class="theme-doc-footer',
        r'class="theme-doc-markdown markdown">(.*?)</article>',
    ]
    for pattern in patterns:
        match = re.search(pattern, html_content, re.DOTALL)
        if match:
            return html_to_md(match.group(1))
    return extract_index_cards(html_content)


def get_title(html_content: str) -> str:
    match = re.search(r"<title[^>]*>([^<]+)</title>", html_content)
    if match:
        return match.group(1).split("|")[0].strip()
    return "Untitled"


def is_doc_url(url: str) -> bool:
    path = url.replace(f"{BASE}/", "")
    if path.startswith("v1/") or path.startswith("next/"):
        return False
    if path == "blog" or path.startswith("blog/"):
        return False
    return True


def get_urls() -> list[str]:
    sitemap = urllib.request.urlopen(f"{BASE}/sitemap.xml").read().decode()
    urls = re.findall(
        r"<loc>(https://tiendanube\.github\.io/api-documentation/[^<]+)</loc>",
        sitemap,
    )
    return sorted({url for url in urls if is_doc_url(url)})


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    urls = get_urls()
    errors: list[tuple[str, str]] = []
    success = 0

    for url in urls:
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "CRM-Ascend Doc Scraper (docs@ascend.local)"},
            )
            page = urllib.request.urlopen(req, timeout=30).read().decode(
                "utf-8", errors="replace"
            )
            title = get_title(page)
            md = extract_markdown(page)
            if not md:
                errors.append((url, "no markdown content"))
                continue

            rel_path = url.replace(f"{BASE}/", "").replace(BASE, "index")
            if not rel_path or rel_path == "/":
                rel_path = "index"

            out_file = OUT_DIR / f"{rel_path}.md"
            out_file.parent.mkdir(parents=True, exist_ok=True)
            header = (
                f"---\ntitle: {title}\nsource: {url}\nversion: 2025-03\n---\n\n"
            )
            out_file.write_text(header + md, encoding="utf-8")
            success += 1
            print(f"OK: {rel_path} ({len(md)} chars)")
        except Exception as exc:
            errors.append((url, str(exc)))
            print(f"ERR: {url} - {exc}")

    index_lines = [
        "# Nuvemshop / Tiendanube API Documentation (2025-03)",
        "",
        "> Documentação espelhada de https://tiendanube.github.io/api-documentation/",
        "> Baixada em: 2026-05-25",
        "",
        "## Índice",
        "",
    ]

    for url in urls:
        rel = url.replace(f"{BASE}/", "").replace(BASE, "index")
        if not rel:
            rel = "index"
        title_path = OUT_DIR / f"{rel}.md"
        if title_path.exists():
            title = "Unknown"
            for line in title_path.read_text(encoding="utf-8").split("\n"):
                if line.startswith("title:"):
                    title = line.replace("title:", "").strip()
                    break
            index_lines.append(f"- [{title}](./{rel}.md)")

    (OUT_DIR / "README.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")

    print(f"\nDone: {success}/{len(urls)} pages")
    if errors:
        print(f"Errors: {len(errors)}")
        for url, message in errors:
            print(f"  {url}: {message}")


if __name__ == "__main__":
    main()
