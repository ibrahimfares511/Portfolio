"""Render the home page's social images (public/og/home-ar.jpg, home-en.jpg).

Needs a running build on localhost:3100 (npm run build && PORT=3100 npm start)
and Python Playwright. The text is the hero's approved copy from messages/.
"""
import asyncio, json, pathlib, re
from playwright.async_api import async_playwright

SITE = pathlib.Path(__file__).resolve().parents[2]
BASE = "http://localhost:3100"

async def main():
    tpl = (SITE / "scripts/og/og.html").read_text()
    css = sorted((SITE / ".next/static/chunks").glob("*.css"))
    links = "".join(f'<link rel="stylesheet" href="{BASE}/_next/static/chunks/{c.name}">' for c in css)
    out = SITE / "public/og"
    out.mkdir(exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1200, "height": 630})
        for lang in ("ar", "en"):
            hero = json.loads((SITE / f"messages/{lang}.json").read_text())["hero"]
            html = (tpl.replace('<link rel="stylesheet" href="__CSS__">', links)
                    .replace("__LANG__", lang).replace("__DIR__", "rtl" if lang == "ar" else "ltr")
                    .replace("__EYEBROW__", hero["eyebrow"]).replace("__HEAD__", hero["headline"])
                    .replace("__AVATAR__", f"{BASE}/avatar/06-arms-crossed-848.webp"))
            await pg.goto(BASE + "/favicon.ico")  # same origin for fonts
            await pg.set_content(html, wait_until="networkidle")
            await pg.evaluate("document.fonts.ready")
            await pg.wait_for_timeout(300)
            jpg = out / f"home-{lang}.jpg"
            await pg.screenshot(path=str(jpg), type="jpeg", quality=86)
            print("wrote", jpg)
        await b.close()

asyncio.run(main())
