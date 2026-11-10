# Proposed copy

Phase 1 copy below was approved by Ibrahim on Nov 10, 2026 (with WhatsApp and email turned into icons).

Text the site needs that isn't in `_brief/portfolio-sitemap.md`. Nothing here is final until Ibrahim approves it; approved lines move out of this file.

## Phase 1: header, footer, accessibility

| Key | Arabic | English | Where |
| --- | --- | --- | --- |
| `nav.work` | الأعمال | Work | Header and footer link → Projects |
| `nav.process` | طريقة العمل | Process | Header and footer link → How we work |
| `nav.about` | من أنا | About | Header and footer link → About |
| `nav.contact` | تواصل | Contact | Header and footer link → Contact |
| `sections.otherWork` | أعمال أخرى | Other work | Title of section 3 (the sitemap gives no title) |
| `footer.rights` | © 2026 إبراهيم فارس | © 2026 Ibrahim Fares | Footer, bottom line |
| `switch.language` | English | العربية | Language button (each language shows the other one's name) |

Footer icons (WhatsApp, email, GitHub, LinkedIn) carry these labels for screen readers and as a hover tooltip: "واتساب / WhatsApp: +20 100 721 8535", "البريد الإلكتروني / Email: ibrahimfares511@gmail.com", "GitHub", "LinkedIn".

Screen-reader only (not visible):

| Key | Arabic | English |
| --- | --- | --- |
| `nav.skip` | انتقل إلى المحتوى | Skip to content |
| `nav.primary` | القائمة الرئيسية | Main menu |
| `nav.openMenu` / `nav.closeMenu` | فتح القائمة / إغلاق القائمة | Open menu / Close menu |
| `nav.home` | الصفحة الرئيسية | Home |
| `switch.theme` | تبديل الوضع الفاتح والداكن | Toggle light and dark mode |
| `switch.light` / `switch.dark` | فاتح / داكن | Light / Dark |

Page title and description reuse approved copy: the hero eyebrow and the hero subline.

## Phase 2: preloader and hero

No new copy. The hero uses the sitemap text word for word. The avatar's alt text is the name ("إبراهيم فارس" / "Ibrahim Fares").

## Phase 3: projects

No new copy. Title, subline, "Read the story" and the status words (يعمل / Live, تم التسليم / Delivered) come from the sitemap; everything on the cards comes from each `project.json`:

- Card name: the part of `title` before the colon ("Elite: منصة مزايا للموظفين" → "Elite").
- Smart Control's tag: "لوحة تحكم Elite / Elite's dashboard" (site-notes), linking to Elite's card.
- Links between cards: the `related` relation, then the other card's name (e.g. "منصة أخرى لتعليم العربية لمدارس الإمارات، لشركة مختلفة · أكاديمية إرتقاء").
- Screen recordings' alt text: the project's `title`.
