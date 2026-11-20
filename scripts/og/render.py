"""Render the home page's social images (public/og/home-ar.jpg, home-en.jpg), 2400×1260.

Needs a running build on localhost:3100 (npm run build && PORT=3100 npm start)
and Python Playwright. Text comes from messages/ (hero eyebrow, headline with its
clay accent, the first three proof numbers); the screen is the WMS dashboard.
Usage: python3 scripts/og/render.py [base-url] [site-dir]
"""
import asyncio, json, pathlib, sys, urllib.request, re
from playwright.async_api import async_playwright

SITE = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else pathlib.Path(__file__).resolve().parents[2]
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3100"
SHOT = "/projects/wms/shots/desktop-dashboard-ar-1600.webp"
AVATAR = "/avatar/06-arms-crossed-848.webp"
# the hero's four proof numbers, with labels short enough for a small preview
SHORT = {
    "ar": ["مخازن على نظام واحد", "موظف على منصة Elite", "طالب على منصتين تعليميتين", "مطاعم استخدمت ويب بوينت"],
    "en": ["warehouses on one system", "employees on Elite", "students on two learning platforms", "restaurants used Web Point"],
}

async def main():
    tpl = (SITE / "scripts/og/og.html").read_text()
    page = urllib.request.urlopen(BASE + "/en").read().decode()
    css = re.findall(r'href="(/_next/static/[^"]+\.css)"', page)
    links = "".join(f'<link rel="stylesheet" href="{BASE}{c}">' for c in dict.fromkeys(css))
    out = SITE / "public/og"
    out.mkdir(exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        # drawn at 2x (2400×1260): LinkedIn and others shrink and recompress previews hard, so a
        # sharper source keeps the small labels readable
        pg = await b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=2)
        for lang in ("ar", "en"):
            hero = json.loads((SITE / f"messages/{lang}.json").read_text())["hero"]
            accent = hero["headlineAccent"]
            # the promise on one line, the clay accent on the next
            head = hero["headline"].replace(accent, "").strip() + f"<br><b>{accent}</b>"
            stats = "".join(
                f'<div class="stat"><div class="num">{v}</div><div class="lab">{l}</div></div>'
                for v, l in zip((s["value"] for s in hero["proof"]), SHORT[lang])
            )
            url = "← ibrahimfares.dev" if lang == "ar" else "ibrahimfares.dev →"
            html = (tpl.replace('<link rel="stylesheet" href="__CSS__">', links)
                    .replace("__LANG__", lang).replace("__DIR__", "rtl" if lang == "ar" else "ltr")
                    .replace("__EYEBROW__", hero["eyebrow"]).replace("__HEAD__", head)
                    .replace("__STATS__", stats).replace("__URL__", url)
                    .replace("__SHOT__", BASE + SHOT).replace("__AVATAR__", BASE + AVATAR))
            await pg.goto(BASE + "/robots.txt")  # same origin for fonts and images
            await pg.set_content(html, wait_until="networkidle")
            await pg.evaluate("document.fonts.ready")
            await pg.wait_for_timeout(400)
            jpg = out / f"home-{lang}.jpg"
            await pg.screenshot(path=str(jpg), type="jpeg", quality=90)
            print("wrote", jpg)
        await b.close()

asyncio.run(main())
