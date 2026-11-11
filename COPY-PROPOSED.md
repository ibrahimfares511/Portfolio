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

## Phase 4: other work, what I can build

| Key | Arabic | English | Note |
| --- | --- | --- | --- |
| `otherWork.delivered` | تم التسليم (2022) | Delivered (2022) | Arabic from the sitemap; English approved by Ibrahim (Nov 10, 2026). |

Everything else is the sitemap's text. The three "What I can build" cards print each line exactly as written, bold part first ("**Internal systems for companies**: warehouses, …"); the proof chips use the project names from the cards. The "Have another idea?" card shows the thinking avatar (design system: "If you have an idea").

English section titles that contain the pronoun "I" are set in Nunito (bold) instead of IF Pen, which is lowercase only (Ibrahim, Nov 10, 2026).

## Phase 5: how we work, tools

No new copy. Steps and the closing line are the sitemap's text; each step prints as written ("**نفهم**: …"). The tools rows use the sitemap's lists in order; the row names (اللغات والأطر …) are read by screen readers as each row's label. Logos: the old site's SVGs where it had them, simple-icons for the new tools (Next.js, Vue, Vite, TanStack Query, Prisma, PostgreSQL, MySQL, Redis, Socket.io, Docker).

## Phase 6: about, contact (approved)

| Key | Arabic | English | Where |
| --- | --- | --- | --- |
| `about.info[].label` | المكان · اللغات · متاح لـ | Location · Languages · Open to | Labels of the three facts (the sitemap gives English names only) |
| `contactSection.direct` | أو تواصل مباشرة | Or reach me directly | Above WhatsApp and email beside the form |
| `contactSection.sending` | جارٍ الإرسال… | Sending… | Send button while sending |
| `contactSection.required` | هذا الحقل مطلوب | This field is required | Empty field |
| `contactSection.invalidReach` | اكتب بريدًا إلكترونيًا أو رقم واتساب صحيحًا | Enter a valid email or WhatsApp number | Field 2 |
| `contactSection.successTitle` | وصلتني رسالتك. | Got your message. | After sending, with the thumbs-up pose |
| `contactSection.successText` | سأرد عليك خلال 24 ساعة. | I'll reply within 24 hours. | Under it (echoes the approved subline) |
| `contactSection.sendAnother` | أرسل رسالة أخرى | Send another message | Link back to the form |
| `contactSection.error` | لم تُرسل الرسالة. جرّب مرة أخرى، أو راسلني على واتساب. | The message didn't go through. Try again, or message me on WhatsApp. | If sending fails |

The four fields use the sitemap's text: the part before the colon is the label, the part after it the hint ("وسيلة التواصل" / "البريد الإلكتروني أو واتساب").

## Phase 7: project pages, 404 (approved)

The case-study text itself is copied as written from each package's `case-study.ar.md` / `case-study.en.md` (title, lead, every section). Role, year, status, captions and stack come from `project.json`. The closing box reuses approved copy (Contact title and subline, the hero's "Start your project" button). Only these interface labels are new:

| Key | Arabic | English | Where |
| --- | --- | --- | --- |
| `caseStudy.back` | كل الأعمال | All work | Back link to the projects section |
| `caseStudy.plain` / `technical` | مبسّط · تقني | Plain · Technical | The two lenses (sitemap names) |
| `caseStudy.lensLabel` | طريقة العرض | View | Screen-reader label of the switch |
| `caseStudy.role` / `year` / `status` | الدور · السنة · الحالة | Role · Year · Status | Facts box |
| `caseStudy.visit` | زيارة الموقع | Visit site | Ertiqaa and HAYA only (they have a live link) |
| `caseStudy.videos` | فيديوهات قصيرة | Short videos | Plain lens |
| `caseStudy.screens` | الشاشات | Screens | Plain lens |
| `caseStudy.desktop` / `mobile` | على الكمبيوتر · على الجوال | Desktop · Mobile | Gallery groups |
| `caseStudy.stack` | الأدوات المستخدمة | Stack | Technical lens |
| `caseStudy.architecture` | بنية النظام | Architecture | Technical lens, the diagram |
| `caseStudy.next` | المشروع التالي | Next project | End of the page |
| `caseStudy.close` / `prev` / `nextShot` | إغلاق · السابق · التالي | Close · Previous · Next | Screen viewer buttons |
| `notFound.title` | هذه الصفحة غير موجودة. | This page doesn't exist. | 404, with the shrug pose |
| `notFound.home` | العودة إلى الرئيسية | Back to home | 404 button |

Which section goes where: "دوري / My role" and "من الداخل / Under the hood" are the technical lens; every other section of the case study is the plain lens, in the file's order.
