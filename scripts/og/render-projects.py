"""Render each case study's social image (public/og/projects/<slug>-<lang>.jpg).

Needs a running build on localhost:3100 (npm run build && PORT=3100 npm start)
and Python Playwright. Text: the project's name and card line (content/projects/index.json)
and the hero eyebrow (messages/); picture: the project's cover.
Usage: python3 scripts/og/render-projects.py [slug ...]
"""
import asyncio, html, json, pathlib, sys
from playwright.async_api import async_playwright

SITE = pathlib.Path(__file__).resolve().parents[2]
BASE = "http://localhost:3100"

async def main():
    tpl = (SITE / "scripts/og/og-project.html").read_text()
    css = sorted((SITE / ".next/static/chunks").glob("*.css"))
    links = "".join(f'<link rel="stylesheet" href="{BASE}/_next/static/chunks/{c.name}">' for c in css)
    projects = json.loads((SITE / "content/projects/index.json").read_text())
    only = set(sys.argv[1:])
    out = SITE / "public/og/projects"
    out.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1200, "height": 630})
        for pr in projects:
            if only and pr["slug"] not in only:
                continue
            sizes = pr["media"]["cover"]["sizes"]
            cover = sizes[max(sizes, key=int)]["webp"]
            for lang in ("ar", "en"):
                eyebrow = json.loads((SITE / f"messages/{lang}.json").read_text())["hero"]["eyebrow"]
                page = (tpl.replace('<link rel="stylesheet" href="__CSS__">', links)
                        .replace("__LANG__", lang).replace("__DIR__", "rtl" if lang == "ar" else "ltr")
                        .replace("__EYEBROW__", html.escape(eyebrow))
                        .replace("__NAME__", html.escape(pr["name"][lang]))
                        .replace("__LINE__", html.escape(pr["card"]["line"][lang]))
                        .replace("__PIC__", BASE + cover))
                await pg.goto(BASE + "/robots.txt")  # same origin for fonts
                await pg.set_content(page, wait_until="networkidle")
                await pg.evaluate("document.fonts.ready")
                await pg.wait_for_timeout(300)
                jpg = out / f"{pr['slug']}-{lang}.jpg"
                await pg.screenshot(path=str(jpg), type="jpeg", quality=86)
                print("wrote", jpg)
        await b.close()

asyncio.run(main())
