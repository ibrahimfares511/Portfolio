export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  tagline: string;
  year: string;
  role: string;
  status: string;
  liveUrl: string;
  githubUrl: string;
  challengeText: string;
  contributionBullets: Array<{ icon: string; title: string; desc: string }>;
  keyChallenges: Array<{ title: string; desc: string; solution: string; imageIndex?: number }>;
  techStack: string[];
  archDecisions: string[];
  keyFeatures: string[];
  screens: Array<{ label: string }>;
  metrics: Array<{ value: string; label: string; desc: string }>;
}

export const caseStudiesData: Record<string, Record<string, CaseStudy>> = {
  en: {

    // ─── WMS ────────────────────────────────────────────────────
    "wms": {
      id: "wms",
      title: "Warehouse Management System (WMS)",
      category: "ENTERPRISE APP",
      tagline: "Built a full-stack warehouse management system solo — from database to UI.",
      year: "2024",
      role: "Full Stack Developer (Solo)",
      status: "Live",
      liveUrl: "#",
      githubUrl: "#",
      challengeText: "Warehouse staff and logistics companies faced persistent stock count errors, delay in inventory synchronization, and a complete lack of visual storage location mappings.",
      contributionBullets: [
        {
          icon: "database",
          title: "Full Stack Solo Build",
          desc: "Architected and built the entire system solo — Express REST API, MySQL database, Socket.io real-time sync, and all 15 frontend screens.",
        },
        {
          icon: "check",
          title: "Blind Count Audit System",
          desc: "Engineered a blind counting audit system with SKU-level locking to prevent race conditions across simultaneous floor workers.",
        },
        {
          icon: "code",
          title: "Dynamic Layout Engine",
          desc: "Built a dynamic layout injection engine in vanilla JS that generates role-based navigation across all pages from a single source of truth.",
        },
      ],
      keyChallenges: [
        {
          title: "Blind Count Race Prevention",
          desc: "Multiple floor workers counting the same SKU simultaneously caused database overlaps, and showing expected counts tempted workers to copy instead of counting physically.",
          solution: "Implemented a POST lock endpoint that locks SKU tasks per user, shows locked badges to others, and uses blind numeric inputs that hide expected counts until physical entry is submitted.",
          imageIndex: 5,
        },
        {
          title: "Split Returns Quantity Validation",
          desc: "Returned orders with mixed item conditions (Good vs Damaged) needed strict validation ensuring the sum of split quantities exactly matches the original order details.",
          solution: "Built a DOM-based validator looping through each return row, summing Good and Damaged inputs, and blocking submission via SweetAlert2 if totals don't match original quantities.",
          imageIndex: 4,
        },
        {
          title: "Dynamic Layout Injection Engine",
          desc: "Managing unified navigation and responsive sidebars across 15 HTML pages in vanilla JS without a framework led to duplicate markup and visual lag.",
          solution: "Built layout.js as an interceptor that reads the user session role, generates headers, bottom drawers, and sidebar elements dynamically, then wraps page content in structural layout containers.",
          imageIndex: 2,
        },
      ],
      techStack: [
        "Express.js", "Node.js", "Socket.io", "Sequelize ORM", "MySQL",
        "Vanilla JavaScript (ES6+)", "Tailwind CSS", "Chart.js",
        "html2pdf.js", "SheetJS (xlsx)", "SweetAlert2", "Lucide Icons",
        "JWT", "bcryptjs", "Multer",
      ],
      archDecisions: [
        "Express REST API chosen for lightweight server routing without framework overhead.",
        "MySQL with indexed columns on status and order_number for sub-second queries on 100K+ records.",
        "Vanilla JS layout injection engine built to avoid framework dependency across 15 static HTML pages.",
      ],
      keyFeatures: [
        "Interactive Storage Map Allocation Grid",
        "Real-Time Low-Stock and Relocation Alerts",
        "Optimized Barcode / QR Code Scanner Parser",
        "Offline Audit Logging and Persistence",
        "Dashboard analytics for inventory turnover scores",
      ],
      screens: [
        { label: "System Dashboard" },
        { label: "Analytics & Statistics" },
        { label: "Orders Dashboard" },
        { label: "Order Preparation" },
        { label: "Returns Center" },
        { label: "Cycle Count Management" },
        { label: "Driver & Delivery" },
        { label: "Reports Center" },
        { label: "Responsive Design" },
      ],
      metrics: [
        { value: "Full Stack", label: "Solo Built",        desc: "Backend, database and frontend alone" },
        { value: "100K+",      label: "Orders Supported",  desc: "Sub-second queries on indexed database" },
        { value: "6",          label: "User Roles",        desc: "Admin, Driver, Auditor, Preparer and more" },
      ],
    },

    // ─── ERTIQAA ACADEMY ────────────────────────────────────────
    "ertiqaa-academy": {
      id: "ertiqaa-academy",
      title: "Ertiqaa Academy",
      category: "LMS PLATFORM",
      tagline: "Delivered a complete LMS with 6+ exam formats and real-time progress tracking for thousands of users.",
      year: "2023",
      role: "Sole Frontend Developer",
      status: "Live",
      liveUrl: "https://ertiqaaedu.com/",
      githubUrl: "#",
      challengeText: "The academy required an advanced student portal capable of rendering multiple distinct interactive evaluation templates and multimedia lessons with real-time state tracking.",
      contributionBullets: [
        {
          icon: "refresh",
          title: "Token Refresh Middleware",
          desc: "Built a global token refresh middleware using async-mutex inside RTK Query, eliminating race conditions across parallel API requests.",
        },
        {
          icon: "database",
          title: "Polymorphic Quiz Engine",
          desc: "Engineered a polymorphic quiz engine supporting 6 question formats (MCQ, True/False, Pairs, Fill Blanks, Essay, Reordering) under a single unified reducer architecture.",
        },
        {
          icon: "monitor",
          title: "Dual-Page PDF Viewer",
          desc: "Developed a custom dual-page PDF book viewer with dynamic viewport scaling and a 20-second engagement tracker to ensure accurate lesson completion data.",
        },
      ],
      keyChallenges: [
        {
          title: "Token Refresh Race Condition",
          desc: "Multiple parallel API calls with expired tokens triggered redundant refresh requests causing race conditions.",
          solution: "Built a global RTK Query middleware using async-mutex that locks concurrent requests, refreshes the token once, then retries all waiting requests.",
          imageIndex: 2,
        },
        {
          title: "Dynamic Drag-and-Drop Fill Blanks",
          desc: "Question text with blank markers (___) needed to be converted into live interactive drop targets inline within the text.",
          solution: "Used regex to split question text, replaced blanks with React DnD drop components, and exposed verify and reset controls via useImperativeHandle.",
          imageIndex: 1,
        },
        {
          title: "Responsive Dual-Page PDF Viewer",
          desc: "Building a side-by-side book-style PDF reader without infinite re-render loops from inline config objects and with dynamic viewport scaling.",
          solution: "Wrapped PDF config in useMemo to prevent re-renders, attached resize listener to recalculate canvas width, and rendered two Document instances side-by-side with 2-page navigation steps.",
          imageIndex: 5,
        },
      ],
      techStack: [
        "React 18", "TypeScript", "Vite", "Redux Toolkit (RTK Query)",
        "React Router DOM v7", "Tailwind CSS", "Radix UI", "Material UI",
        "Framer Motion", "React DnD", "react-pdf", "Recharts",
        "Nivo Charts", "Firebase (FCM)", "i18next", "React Hook Form",
        "Zod", "async-mutex", "date-fns", "xlsx",
      ],
      archDecisions: [
        "Radix UI primitives chosen for robust, keyboard-accessible interaction components.",
        "Redux Toolkit selected to manage complex nested state objects in exam sheets.",
        "React-i18next used to drive full bidirectional localization (LTR/RTL) client-side.",
      ],
      keyFeatures: [
        "Polymorphic Timed Assessment Engine",
        "Multimedia Virtual Classroom Player",
        "Real-Time Student Progress Tracking Dashboard",
        "Automated Quiz Grading & Answers Key",
        "Multi-Role System (Student / Instructor / Admin)",
      ],
      screens: [
        { label: "Landing Page" },
        { label: "Lesson Player" },
        { label: "Student Progress" },
        { label: "Content Management" },
        { label: "Teacher Reports" },
        { label: "Certificate Builder" },
        { label: "Responsive Design" },
      ],
      metrics: [
        { value: "68",   label: "Screens Built",   desc: "Across 4 role-based dashboards" },
        { value: "6+",   label: "Question Formats", desc: "MCQ, Pairs, Blanks, Essay and more" },
        { value: "100%", label: "Solo Frontend",    desc: "Delivered entire LMS frontend alone" },
      ],
    },

    // ─── WEB POINT ERP ──────────────────────────────────────────
    "web-point-erp": {
      id: "web-point-erp",
      title: "Web Point Restaurant ERP",
      category: "ENTERPRISE APP",
      tagline: "Co-built and sold a Restaurant ERP system deployed across 4+ active businesses.",
      year: "2023",
      role: "Co-Founder & Lead Frontend Developer",
      status: "Live",
      liveUrl: "#",
      githubUrl: "#",
      challengeText: "Local dining businesses lacked a unified graphical floor manager, administrative order tracker, and customer digital menu interface.",
      contributionBullets: [
        {
          icon: "grid",
          title: "Touch & Mouse Swipe Framework",
          desc: "Hand-built a touch and mouse swipe framework from scratch to reveal POS cart action buttons on both mobile and desktop devices.",
        },
        {
          icon: "zap",
          title: "Real-Time Checkout Calculations",
          desc: "Engineered real-time checkout calculations for VAT, bank commissions, and visa surcharges updating instantly without server roundtrips.",
        },
        {
          icon: "code",
          title: "Fractional Quantity Keypad",
          desc: "Built the fractional quantity keypad parser mapping decimal buttons (1/8, 1/4, 1/2) to automatic price conversions.",
        },
      ],
      keyChallenges: [
        {
          title: "Touch & Mouse Swipe Gestures",
          desc: "The POS cart needed swipe-to-reveal action buttons (Comment, Extra, Discount, Delete) that work on both touchscreens and desktop mouse drags.",
          solution: "Hand-built a coordinate tracker binding mousedown/touchstart events, calculating horizontal drag offset, and sliding items when exceeding a 60px threshold to reveal actions.",
          imageIndex: 2,
        },
        {
          title: "Real-Time Checkout Calculations",
          desc: "Checkout totals needed to instantly recalculate VAT, service charges, bank commission rates, and credit card surcharges when cashier toggles any payment option.",
          solution: "Built jQuery event listeners on all payment toggles computing VAT, bank ratios, and visa surcharges in real-time without any database roundtrips.",
          imageIndex: 3,
        },
        {
          title: "State-Aware Table Merge Logic",
          desc: "The dining hall merge tool needed to prevent double-merges, block busy tables from being selected, and handle recursive parent-child table selections.",
          solution: "Built a modal initializer reading custom table properties (follow, state, booked, master) to conditionally disable checkboxes and recursively select all child tables in a section.",
          imageIndex: 1,
        },
      ],
      techStack: [
        "Vue.js (v2.5)", "Laravel (v6.20)", "jQuery (v3.2)", "Bootstrap (v4)",
        "Spatie Laravel Permission", "mPDF", "Laravel Report Generator",
        "SweetAlert2", "Axios", "Lodash", "jQuery UI Touch Punch",
      ],
      archDecisions: [
        "Vue.js v2 chosen for reactive component updates in the POS cart without full-page refreshes.",
        "jQuery UI Touch Punch added to extend HTML5 drag compatibility to mobile touch events.",
        "Spatie Laravel Permission used for 51 granular role-based access rules.",
      ],
      keyFeatures: [
        "Drag & Drop Dining Floor Layout Builder",
        "Customer Digital Menu & Cart System",
        "Kitchen Operations Status Monitor",
        "Payment Gateway Integration Flow",
        "Admin Analytics & Sales Reports",
      ],
      screens: [
        { label: "Table Floor Map" },
        { label: "POS Menu & Order Cart" },
        { label: "Payment & Checkout" },
        { label: "Sales Reports" },
        { label: "Delivery Management" },
      ],
      metrics: [
        { value: "4+",      label: "Active Businesses", desc: "Running daily restaurant operations" },
        { value: "51",      label: "User Permissions",  desc: "Granular role-based access control" },
        { value: "Co-Built", label: "Sold Product",     desc: "Co-founded, built and sold successfully" },
      ],
    },

    // ─── HAYA ACADEMY ───────────────────────────────────────────
    "haya-academy": {
      id: "haya-academy",
      title: "HAYA Academy",
      category: "LMS PLATFORM",
      tagline: "Built a full-featured academy platform as sole frontend developer — from zero to production.",
      year: "2022",
      role: "Sole Frontend Developer",
      status: "Live",
      liveUrl: "https://hayaedu.com/",
      githubUrl: "#",
      challengeText: "The client needed a fast, media-rich learning portal and automated grading features without the complexity of heavy single-page application frameworks.",
      contributionBullets: [
        {
          icon: "monitor",
          title: "Anti-Piracy Video System",
          desc: "Built a dual-layer anti-piracy system combining a CSS-animated student identity watermark with server-side range-based video streaming.",
        },
        {
          icon: "play",
          title: "In-Browser Voice Recording",
          desc: "Implemented in-browser voice recording using MediaRecorder API for oral exam submissions without requiring any external application.",
        },
        {
          icon: "cpu",
          title: "Idle-Aware Watch Tracker",
          desc: "Developed an idle-aware watch tracker that pauses progress updates after 10 minutes of user inactivity, ensuring accurate course analytics.",
        },
      ],
      keyChallenges: [
        {
          title: "Anti-Piracy Video Protection",
          desc: "Paid course videos were vulnerable to screen recording and direct URL downloads by students.",
          solution: "Built a CSS-animated floating watermark overlay showing student identity, combined with server-side range-based streaming (3MB chunks) blocking direct URL access to video files.",
          imageIndex: 5,
        },
        {
          title: "Interactive Matching with SVG Lines",
          desc: "Building a click-to-connect matching question type that draws visual lines between paired items without using heavy diagram libraries.",
          solution: "Used LeaderLine JS to render dynamic colored SVG connector lines between matched columns, with shuffled indices on load and hidden input serialization for form submission.",
          imageIndex: 1,
        },
        {
          title: "Browser-Based Audio Recording",
          desc: "Students needed to submit oral exam answers directly from the browser without installing any native application.",
          solution: "Implemented browser MediaRecorder API to capture microphone audio chunks, convert them to MP3 Blob format, and map them onto form inputs using DataTransfer for seamless backend submission.",
          imageIndex: 6,
        },
      ],
      techStack: [
        "Laravel 11.0", "Alpine.js", "jQuery", "Tailwind CSS", "Bootstrap 5",
        "Plyr", "Swiper JS", "LeaderLine JS", "SweetAlert2", "OpenAI API",
        "FFMpeg", "Intervention Image", "Laravel DomPDF",
        "Maatwebsite Excel", "Firebase PHP JWT", "Laravel Sanctum",
      ],
      archDecisions: [
        "jQuery selected to directly hook into Laravel Blade templates with zero compile overhead.",
        "Bootstrap grid used for uniform responsiveness on student mobile screens.",
        "AJAX database sync established to save progression marks seamlessly.",
      ],
      keyFeatures: [
        "Automated Quiz Evaluation & Progression Logs",
        "Multimedia Lesson Player with Progress Tracking",
        "Student Enrollment & Registration Workflows",
        "Instructor Lesson Creation Panel",
        "Admin Dashboard & Gradebook Manager",
      ],
      screens: [
        { label: "Landing Page" },
        { label: "Interactive Activity Builder" },
        { label: "Student Analytics" },
        { label: "Activity Categories" },
        { label: "Manage Activities" },
        { label: "Student Lessons" },
      ],
      metrics: [
        { value: "5+",   label: "Payment Gateways", desc: "Stripe, Fawry, Paytm and more" },
        { value: "6",    label: "Question Types",   desc: "Including voice recording and SVG matching" },
        { value: "100%", label: "Solo Frontend",    desc: "Built entire frontend as sole developer" },
      ],
    },

    // ─── MRS. AYAT ASAAD ────────────────────────────────────────
    "mrs-ayat-asaad": {
      id: "mrs-ayat-asaad",
      title: "Mrs. Ayat Asaad Platform",
      category: "LMS PLATFORM",
      tagline: "Built a full e-learning platform with anti-piracy protection, digital wallet, and AI-powered course tools.",
      year: "2022",
      role: "Frontend Developer",
      status: "Live",
      liveUrl: "https://ms-ayat-asaad.com/",
      githubUrl: "#",
      challengeText: "The platform needed to protect paid video and PDF content from piracy, support a digital wallet with multi-type coupons, and restrict account access to a single device.",
      contributionBullets: [
        {
          icon: "monitor",
          title: "Dual Anti-Piracy Layer",
          desc: "Built a dual anti-piracy layer combining CSS animated watermarks with FFMpeg server-side video burning and pdf.js canvas rendering to protect all paid content.",
        },
        {
          icon: "zap",
          title: "Multi-Type Coupon Engine",
          desc: "Developed a multi-type coupon engine supporting Discount, Payment and Recharge vouchers with wallet integration and remainder balance handling.",
        },
        {
          icon: "check",
          title: "Single-Device Account Locking",
          desc: "Implemented single-device account locking via deviceId binding in the mobile API to prevent credential sharing across multiple devices.",
        },
      ],
      keyChallenges: [
        {
          title: "Dual-Layer Anti-Piracy System",
          desc: "Paid course videos and PDF books were vulnerable to screen recording, direct URL downloads, and right-click saving by students.",
          solution: "Built a CSS-animated floating watermark showing student identity combined with FFMpeg server-side watermark burning, plus a pdf.js canvas renderer that blocks downloads and right-clicks.",
          imageIndex: 3,
        },
        {
          title: "Multi-Type Coupon Payment Engine",
          desc: "Standard discount coupons were not enough — the platform needed payment vouchers that act like credit cards with remainder balance handling.",
          solution: "Built a transactional coupon service handling 3 types (Discount, Payment, Recharge) where payment coupons can forfeit, reuse, or transfer remaining balance to student wallet under database transactions.",
          imageIndex: 2,
        },
        {
          title: "Single Device Account Locking",
          desc: "Students were sharing login credentials to access paid courses on multiple devices, causing revenue loss.",
          solution: "Implemented device ID binding in the mobile login API endpoint. The system validates the deviceId header against the stored device and returns 403 Forbidden if a new device attempts login.",
          imageIndex: 1,
        },
      ],
      techStack: [
        "Laravel 11.0", "Alpine.js", "jQuery", "Tailwind CSS", "Bootstrap",
        "Plyr", "Swiper", "flatpickr", "Axios", "FFMpeg",
        "pdf.js", "Intervention Image", "Laravel Sanctum", "Firebase JWT",
      ],
      archDecisions: [
        "Alpine.js chosen for lightweight reactive components within Laravel Blade without build steps.",
        "Plyr media player selected for custom video controls and watermark overlay integration.",
        "pdf.js canvas rendering used instead of iframes to prevent direct file downloads.",
      ],
      keyFeatures: [
        "Complete Interface & UI Redesign Layout",
        "Optimized Course Content Loading Stream",
        "Mobile-Responsive Lesson Evaluation Interface",
        "Optimized Student Dashboard Metrics",
        "Automated Performance Reporting Tools",
      ],
      screens: [
        { label: "Landing Page" },
        { label: "Question Bank Dashboard" },
        { label: "Admin Categories Panel" },
        { label: "Bootcamps Catalog" },
        { label: "Responsive Design" },
        { label: "Dark Mode View" },
      ],
      metrics: [
        { value: "+80%", label: "Speed Improvement", desc: "Page rendering after full optimization" },
        { value: "3",    label: "Coupon Types",       desc: "Discount, Payment and Recharge" },
        { value: "1000", label: "Bulk Coupons",       desc: "Generated in a single batch operation" },
      ],
    },

  },

  // ═══════════════════════════════════════════════════════════════
  // ARABIC
  // ═══════════════════════════════════════════════════════════════
  ar: {

    // ─── WMS AR ─────────────────────────────────────────────────
    "wms": {
      id: "wms",
      title: "Warehouse Management System (WMS)",
      category: "ENTERPRISE APP",
      tagline: "بناء نظام إدارة مخازن متكامل منفرداً من قاعدة البيانات حتى الواجهة.",
      year: "2024",
      role: "مطور متكامل منفرد",
      status: "Live",
      liveUrl: "#",
      githubUrl: "#",
      challengeText: "واجه موظفو المستودعات والشركات اللوجستية أخطاءً مستمرة في جرد وتحديث المخزون وتأخراً في مزامنة البيانات، مع غياب كامل لأي تخطيط بصري لأماكن التخزين.",
      contributionBullets: [
        {
          icon: "database",
          title: "بناء النظام الكامل منفرداً",
          desc: "بناء النظام بالكامل منفرداً — Express REST API وقاعدة بيانات MySQL ومزامنة Socket.io وجميع الـ 15 شاشة.",
        },
        {
          icon: "check",
          title: "نظام جرد عمياء مع قفل المنتجات",
          desc: "هندسة نظام جرد عمياء مع قفل على مستوى المنتج لمنع التعارض بين عمال الجرد المتزامنين.",
        },
        {
          icon: "code",
          title: "محرك حقن التخطيط الديناميكي",
          desc: "بناء محرك حقن تخطيط ديناميكي بـ vanilla JS يولد تنقلاً حسب الدور عبر جميع الصفحات من مصدر واحد.",
        },
      ],
      keyChallenges: [
        {
          title: "منع التعارض في الجرد العمياء",
          desc: "عمال الجرد المتعددون الذين يعدون نفس المنتج في آن واحد تسببوا في تعارض البيانات، وإظهار الأرقام المتوقعة أغرى العمال بنسخها.",
          solution: "تطبيق نقطة نهاية قفل تقفل مهام المنتج لكل مستخدم وتُظهر شارات مقفلة للآخرين مع إخفاء الأرقام المتوقعة حتى الإدخال الفعلي.",
          imageIndex: 5,
        },
        {
          title: "التحقق من كميات المرتجعات المقسمة",
          desc: "طلبات المرتجعات ذات الحالات المختلطة احتاجت للتحقق من أن مجموع الكميات المقسمة يطابق تفاصيل الطلب الأصلي تماماً.",
          solution: "بناء مدقق يتحقق من كل صف مرتجع ويجمع الكميات الجيدة والتالفة ويمنع الإرسال إذا لم تطابق كميات الطلب الأصلي.",
          imageIndex: 4,
        },
        {
          title: "محرك حقن التخطيط الديناميكي",
          desc: "إدارة تنقل موحد عبر 15 صفحة HTML في vanilla JS بدون إطار عمل أدى لتكرار الكود وتأخر في العرض.",
          solution: "بناء layout.js كـ interceptor يقرأ دور المستخدم ويولد الترويسات والأشرطة الجانبية ديناميكياً ثم يلف محتوى الصفحة في حاويات هيكلية.",
          imageIndex: 2,
        },
      ],
      techStack: [
        "Express.js", "Node.js", "Socket.io", "Sequelize ORM", "MySQL",
        "Vanilla JavaScript (ES6+)", "Tailwind CSS", "Chart.js",
        "html2pdf.js", "SheetJS (xlsx)", "SweetAlert2", "Lucide Icons",
        "JWT", "bcryptjs", "Multer",
      ],
      archDecisions: [
        "تم اختيار Express REST API لبناء خادم خفيف دون تكلفة الأطر الكبيرة.",
        "تم فهرسة MySQL على أعمدة الحالة ورقم الطلب لاستعلامات أقل من ثانية.",
        "تم بناء محرك حقن التخطيط بـ Vanilla JS للاستغناء عن أي إطار عمل.",
      ],
      keyFeatures: [
        "مخطط بصري تفاعلي لتوزيع وترتيب حاويات التخزين",
        "نظام تنبيهات فوري لنقص المخزون أو النقل الخاطئ",
        "معالج دمج فوري لأجهزة قراءة الباركود والـ QR Code",
        "تسجيل وحفظ عمليات الجرد دون اتصال بالإنترنت",
        "لوحة تحكم إحصائية لمعدلات دوران البضائع والمبيعات",
      ],
      screens: [
        { label: "لوحة التحكم الرئيسية" },
        { label: "الإحصائيات والتحليلات" },
        { label: "لوحة الطلبات" },
        { label: "تجهيز الطلبات" },
        { label: "مركز المرتجعات" },
        { label: "إدارة الجرد الدوري" },
        { label: "السائق والتوصيل" },
        { label: "مركز التقارير" },
        { label: "تصميم متجاوب" },
      ],
      metrics: [
        { value: "Full Stack", label: "مبني منفرداً",    desc: "الخادم وقاعدة البيانات والواجهة منفرداً" },
        { value: "100K+",      label: "طلب مدعوم",       desc: "استعلامات أقل من ثانية على قاعدة مفهرسة" },
        { value: "6",          label: "دور مستخدم",      desc: "مدير وسائق ومدقق ومعد وغيرهم" },
      ],
    },

    // ─── ERTIQAA AR ─────────────────────────────────────────────
    "ertiqaa-academy": {
      id: "ertiqaa-academy",
      title: "Ertiqaa Academy",
      category: "LMS PLATFORM",
      tagline: "تقديم نظام إدارة تعلم (LMS) متكامل مع أكثر من 6 نماذج اختبار ومتابعة لحظية لآلاف الطلاب.",
      year: "2023",
      role: "مطور واجهات أمامية منفرد",
      status: "Live",
      liveUrl: "https://ertiqaaedu.com/",
      githubUrl: "#",
      challengeText: "تطلبت الأكاديمية بوابة طلابية متقدمة قوية قادرة على عرض نماذج تقييم تفاعلية متنوعة ودروس فيديو وصوت مع تتبع التقدم لحظياً.",
      contributionBullets: [
        {
          icon: "refresh",
          title: "Middleware تجديد التوكن",
          desc: "بناء middleware عالمي لتجديد التوكن باستخدام async-mutex داخل RTK Query للقضاء على تعارض الطلبات المتوازية.",
        },
        {
          icon: "database",
          title: "محرك اختبارات متعدد الأشكال",
          desc: "بناء محرك اختبارات متعدد الأشكال يدعم 6 أنواع أسئلة تحت معمارية Reducer موحدة.",
        },
        {
          icon: "monitor",
          title: "عارض PDF ثنائي الصفحات",
          desc: "تطوير عارض PDF مخصص ثنائي الصفحات مع نظام تتبع تفاعل 20 ثانية لضمان دقة بيانات إتمام الدروس.",
        },
      ],
      keyChallenges: [
        {
          title: "تعارض طلبات تجديد التوثيق",
          desc: "طلبات API المتوازية بتوكن منتهٍ كانت تُطلق طلبات تجديد متكررة مما يسبب تعارضاً في البيانات.",
          solution: "بناء middleware عالمي في RTK Query باستخدام async-mutex يقفل الطلبات المتزامنة ويجدد التوكن مرة واحدة ثم يُعيد تنفيذ الطلبات المعلقة.",
          imageIndex: 2,
        },
        {
          title: "نظام ملء الفراغات بالسحب والإفلات",
          desc: "كان النص الذي يحتوي على فراغات (___) يحتاج لتحويله لأهداف سحب وإفلات تفاعلية داخل النص مباشرة.",
          solution: "استخدام Regex لتقسيم النص واستبدال الفراغات بمكونات React DnD، مع كشف دوال التحقق والإعادة عبر useImperativeHandle.",
          imageIndex: 1,
        },
        {
          title: "عارض PDF ثنائي الصفحات المتجاوب",
          desc: "بناء عارض PDF بتخطيط كتاب ثنائي الصفحات دون حلقات إعادة رسم لا نهائية مع دعم التغيير الديناميكي لحجم الشاشة.",
          solution: "تغليف إعدادات PDF في useMemo لمنع إعادة الرسم، وإضافة مستمع resize لإعادة حساب عرض الـ canvas، وعرض نسختين من Document جنباً لجنب.",
          imageIndex: 5,
        },
      ],
      techStack: [
        "React 18", "TypeScript", "Vite", "Redux Toolkit (RTK Query)",
        "React Router DOM v7", "Tailwind CSS", "Radix UI", "Material UI",
        "Framer Motion", "React DnD", "react-pdf", "Recharts",
        "Nivo Charts", "Firebase (FCM)", "i18next", "React Hook Form",
        "Zod", "async-mutex", "date-fns", "xlsx",
      ],
      archDecisions: [
        "تم اختيار Radix UI لبناء مكونات تفاعلية يمكن الوصول إليها بالكامل عبر لوحة المفاتيح.",
        "تم استخدام Redux Toolkit لإدارة مصفوفات البيانات المتشعبة والامتحانات الطويلة.",
        "تم استخدام React-i18next لدعم التوطين الكامل للغات واتجاهات الصفحة (RTL/LTR).",
      ],
      keyFeatures: [
        "محرك تقييمات واختبارات تفاعلي محدد بزمن",
        "مشغل دروس فيديو وصوتيات الفصول الافتراضية",
        "لوحة تتبع تقدم الطالب ومؤشرات التحصيل العلمي",
        "تصحيح تلقائي للاختبارات وعرض نموذج الإجابات",
        "بوابة متعددة الأدوار (طالب / معلم / مسؤول)",
      ],
      screens: [
        { label: "الصفحة الرئيسية" },
        { label: "مشغل الدروس" },
        { label: "تقدم الطالب" },
        { label: "إدارة المحتوى" },
        { label: "تقارير المعلم" },
        { label: "إنشاء الشهادات" },
        { label: "تصميم متجاوب" },
      ],
      metrics: [
        { value: "68",   label: "شاشة مبنية",               desc: "موزعة على 4 لوحات تحكم" },
        { value: "6+",   label: "نماذج أسئلة",              desc: "اختيار متعدد، توصيل، فراغات وغيرها" },
        { value: "100%", label: "تطوير واجهات منفردًا",     desc: "بناء واجهات نظام التعلم بالكامل منفردًا" },
      ],
    },

    // ─── WEB POINT ERP AR ───────────────────────────────────────
    "web-point-erp": {
      id: "web-point-erp",
      title: "Web Point Restaurant ERP",
      category: "ENTERPRISE APP",
      tagline: "المشاركة في بناء وبيع نظام ERP لإدارة المطاعم تم نشره في أكثر من 4 شركات نشطة.",
      year: "2023",
      role: "مؤسس مشارك ومطور واجهات رئيسي",
      status: "Live",
      liveUrl: "#",
      githubUrl: "#",
      challengeText: "كانت تفتقر المطاعم المحلية إلى لوحة تحكم رسومية موحدة لتتبع الطلبات، وتغيير توزيع الطاولات ديناميكياً، وعرض قائمة طعام رقمية للزبائن.",
      contributionBullets: [
        {
          icon: "grid",
          title: "إطار السحب باللمس والماوس",
          desc: "بناء إطار سحب مخصص من الصفر يكشف أزرار إجراءات سلة الطلبات على الأجهزة المحمولة وسطح المكتب.",
        },
        {
          icon: "zap",
          title: "حسابات الدفع الفوري",
          desc: "هندسة حسابات دفع فورية للضرائب والعمولات تُحدَّث لحظياً دون طلبات للخادم.",
        },
        {
          icon: "code",
          title: "لوحة مفاتيح الكميات الكسرية",
          desc: "بناء محلل لوحة المفاتيح الكسرية يحول أزرار الكسور (1/8، 1/4، 1/2) إلى تحويلات أسعار تلقائية.",
        },
      ],
      keyChallenges: [
        {
          title: "إيماءات السحب باللمس والماوس",
          desc: "كانت سلة الطلبات تحتاج لإيماءات سحب تكشف أزرار الإجراءات على شاشات اللمس وسطح المكتب على حد سواء.",
          solution: "بناء متتبع إحداثيات مخصص يربط أحداث mousedown/touchstart ويحسب إزاحة السحب الأفقي، ويكشف الأزرار عند تجاوز عتبة 60px.",
          imageIndex: 2,
        },
        {
          title: "حسابات الدفع الفوري في الوقت الحقيقي",
          desc: "كانت مجاميع الدفع تحتاج لإعادة حساب ضريبة القيمة المضافة وعمولات البنك فورياً عند تغيير أي خيار دفع.",
          solution: "بناء مستمعات jQuery على جميع خيارات الدفع تحسب الضرائب والعمولات فورياً دون أي طلبات لقاعدة البيانات.",
          imageIndex: 3,
        },
        {
          title: "منطق دمج الطاولات بوعي بالحالة",
          desc: "أداة دمج قاعة الطعام احتاجت لمنع الدمج المزدوج وحظر الطاولات المشغولة مع دعم التحديد التسلسلي للطاولات الأب والابن.",
          solution: "بناء مُهيئ modal يقرأ خصائص الطاولة المخصصة لتعطيل checkboxes بشكل شرطي وتحديد جميع الطاولات الفرعية بشكل تكراري.",
          imageIndex: 1,
        },
      ],
      techStack: [
        "Vue.js (v2.5)", "Laravel (v6.20)", "jQuery (v3.2)", "Bootstrap (v4)",
        "Spatie Laravel Permission", "mPDF", "Laravel Report Generator",
        "SweetAlert2", "Axios", "Lodash", "jQuery UI Touch Punch",
      ],
      archDecisions: [
        "تم اختيار Vue.js v2 لتحديثات المكونات التفاعلية في سلة الطلبات دون إعادة تحميل الصفحة.",
        "تم إضافة jQuery UI Touch Punch لتوسيع دعم السحب على أجهزة اللمس.",
        "تم استخدام Spatie Permission لإدارة 51 صلاحية وصول دقيقة.",
      ],
      keyFeatures: [
        "مخطط طاولات تفاعلي بالسحب والإفلات للمطعم",
        "قائمة طعام رقمية للعملاء ونظام عربة تسوق متكامل",
        "شاشة مراقبة وتحديث حالات الطلبات للمطبخ",
        "بوابة دفع إلكترونية متكاملة وتأكيد العمليات",
        "لوحة تحكم إحصائية للتقارير والمبيعات اليومية",
      ],
      screens: [
        { label: "خريطة طاولات المطعم" },
        { label: "قائمة الطلبات وسلة الشراء" },
        { label: "الدفع والمحاسبة" },
        { label: "تقارير المبيعات" },
        { label: "إدارة التوصيل" },
      ],
      metrics: [
        { value: "4+",       label: "شركات نشطة وتعمل بالنظام", desc: "تدير العمليات اليومية للمطاعم" },
        { value: "51",       label: "صلاحية مستخدم",             desc: "تحكم دقيق في صلاحيات الأدوار" },
        { value: "Co-Built", label: "منتج تجاري مُباع",          desc: "أسسنا وبنينا وبعنا بنجاح" },
      ],
    },

    // ─── HAYA AR ────────────────────────────────────────────────
    "haya-academy": {
      id: "haya-academy",
      title: "HAYA Academy",
      category: "LMS PLATFORM",
      tagline: "بناء منصة أكاديمية متكاملة الميزات كمطور واجهات وحيد — من الصفر إلى مرحلة الإنتاج المباشر.",
      year: "2022",
      role: "مطور واجهات أمامية منفرد",
      status: "Live",
      liveUrl: "https://hayaedu.com/",
      githubUrl: "#",
      challengeText: "احتاج العميل إلى بوابة تعليمية سريعة غنية بالوسائط وذات ميزات تصحيح تلقائي، دون استخدام أطر عمل الواجهات الأحادية المعقدة والثقيلة.",
      contributionBullets: [
        {
          icon: "monitor",
          title: "نظام حماية الفيديو المزدوج",
          desc: "بناء نظام حماية مزدوج يجمع علامة مائية CSS متحركة بهوية الطالب مع بث الفيديو المجزأ من الخادم.",
        },
        {
          icon: "play",
          title: "التسجيل الصوتي داخل المتصفح",
          desc: "تطبيق تسجيل صوتي داخل المتصفح باستخدام MediaRecorder API لأسئلة الامتحانات الشفهية.",
        },
        {
          icon: "cpu",
          title: "نظام تتبع المشاهدة الذكي",
          desc: "تطوير نظام تتبع مشاهدة يتوقف بعد 10 دقائق من عدم التفاعل لضمان دقة إحصائيات استهلاك المحتوى.",
        },
      ],
      keyChallenges: [
        {
          title: "حماية الفيديو من القرصنة",
          desc: "كانت دروس الفيديو المدفوعة عرضة للتسجيل والتنزيل المباشر من خلال الروابط.",
          solution: "بناء طبقة علامة مائية متحركة بـ CSS تُظهر هوية الطالب، مع بث الفيديو من الخادم بأجزاء 3MB لمنع الوصول المباشر للملفات.",
          imageIndex: 5,
        },
        {
          title: "أسئلة التوصيل بخطوط SVG تفاعلية",
          desc: "بناء نوع سؤال توصيل تفاعلي يرسم خطوطاً بصرية بين العناصر المتطابقة دون استخدام مكتبات رسم ثقيلة.",
          solution: "استخدام LeaderLine JS لرسم خطوط SVG ملونة ديناميكية بين الأعمدة المتطابقة مع ترتيب عشوائي عند التحميل وتسلسل المدخلات المخفية للإرسال.",
          imageIndex: 1,
        },
        {
          title: "تسجيل صوتي داخل المتصفح",
          desc: "احتاج الطلاب لتقديم إجابات شفهية مباشرة من المتصفح دون تثبيت أي تطبيق خارجي.",
          solution: "تطبيق MediaRecorder API للمتصفح لالتقاط قطع الصوت وتحويلها لصيغة MP3، ثم ربطها بمدخلات النموذج عبر DataTransfer للإرسال للخادم.",
          imageIndex: 6,
        },
      ],
      techStack: [
        "Laravel 11.0", "Alpine.js", "jQuery", "Tailwind CSS", "Bootstrap 5",
        "Plyr", "Swiper JS", "LeaderLine JS", "SweetAlert2", "OpenAI API",
        "FFMpeg", "Intervention Image", "Laravel DomPDF",
        "Maatwebsite Excel", "Firebase PHP JWT", "Laravel Sanctum",
      ],
      archDecisions: [
        "تم اختيار jQuery لربطه المباشر والسريع مع قوالب Laravel Blade دون تكلفة تجميع الكود.",
        "تم استخدام Bootstrap لضمان استجابة وتجاوب الواجهات على شاشات هواتف الطلاب.",
        "تم إعداد مزامنة AJAX لحفظ علامات التقدم التعليمي تلقائياً وبأمان.",
      ],
      keyFeatures: [
        "تقييم تلقائي للاختبارات وسجلات التحصيل الدراسي",
        "مشغل دروس الوسائط المتعددة مع تتبع دقيق للمشاهدة",
        "نظام تسجيل والتحاق الطلاب بالدورات التعليمية",
        "لوحة تحكم المعلم لإدارة ورفع المحتوى الدراسي",
        "لوحة الإدارة الشاملة وسجلات درجات الطلاب",
      ],
      screens: [
        { label: "الصفحة الرئيسية" },
        { label: "منشئ الأنشطة التفاعلية" },
        { label: "إحصائيات الطلاب" },
        { label: "فئات الأنشطة" },
        { label: "إدارة الأنشطة" },
        { label: "دروس الطلاب" },
      ],
      metrics: [
        { value: "5+",   label: "بوابات دفع مدمجة",      desc: "Stripe وFawry وPaytm وغيرها" },
        { value: "6",    label: "أنواع أسئلة",            desc: "تشمل التسجيل الصوتي والتوصيل بالخطوط" },
        { value: "100%", label: "تطوير واجهات منفردًا",   desc: "بناء كامل الواجهات الأمامية منفردًا" },
      ],
    },

    // ─── MRS. AYAT AR ────────────────────────────────────────────
    "mrs-ayat-asaad": {
      id: "mrs-ayat-asaad",
      title: "منصة مس آيات أسعد",
      category: "LMS PLATFORM",
      tagline: "بناء منصة تعليم إلكتروني متكاملة مع حماية من القرصنة ومحفظة رقمية وأدوات محتوى بالذكاء الاصطناعي.",
      year: "2022",
      role: "مطور واجهات أمامية",
      status: "Live",
      liveUrl: "https://ms-ayat-asaad.com/",
      githubUrl: "#",
      challengeText: "احتاجت المنصة لحماية محتوى الفيديو والكتب المدفوعة من القرصنة، ودعم محفظة رقمية مع كوبونات متعددة الأنواع، وتقييد الوصول على جهاز واحد.",
      contributionBullets: [
        {
          icon: "monitor",
          title: "طبقة الحماية المزدوجة من القرصنة",
          desc: "بناء طبقة حماية مزدوجة تجمع علامات مائية CSS متحركة مع حرق فيديو FFMpeg وعرض canvas بـ pdf.js لحماية المحتوى المدفوع.",
        },
        {
          icon: "zap",
          title: "محرك كوبونات متعدد الأنواع",
          desc: "تطوير محرك كوبونات متعدد الأنواع يدعم الخصم والدفع والشحن مع تكامل المحفظة وإدارة الرصيد المتبقي.",
        },
        {
          icon: "check",
          title: "قفل الحساب على جهاز واحد",
          desc: "تطبيق قفل الحساب على جهاز واحد عبر ربط معرف الجهاز في API الموبايل لمنع مشاركة بيانات الدخول.",
        },
      ],
      keyChallenges: [
        {
          title: "نظام حماية مزدوج من القرصنة",
          desc: "كانت دروس الفيديو والكتب المدفوعة عرضة للتسجيل والتنزيل المباشر وحفظ الملفات.",
          solution: "بناء علامة مائية CSS متحركة تُظهر هوية الطالب مع حرق علامة مائية بـ FFMpeg من الخادم وعارض canvas بـ pdf.js يمنع التنزيل.",
          imageIndex: 3,
        },
        {
          title: "محرك كوبونات متعدد الأنواع",
          desc: "كوبونات الخصم العادية لم تكف — احتاجت المنصة لقسائم دفع تعمل كبطاقات ائتمان مع إدارة الرصيد المتبقي.",
          solution: "بناء خدمة كوبونات تعاملية تدير 3 أنواع حيث يمكن لكوبونات الدفع إلغاء أو إعادة استخدام أو تحويل الرصيد المتبقي للمحفظة.",
          imageIndex: 2,
        },
        {
          title: "قفل الحساب على جهاز واحد",
          desc: "كان الطلاب يشاركون بيانات تسجيل الدخول للوصول للدورات المدفوعة على أجهزة متعددة مما تسبب في خسارة.",
          solution: "تطبيق ربط معرف الجهاز في نقطة نهاية تسجيل الدخول للموبايل. يتحقق النظام من معرف الجهاز ويُعيد خطأ 403 عند محاولة تسجيل دخول من جهاز جديد.",
          imageIndex: 1,
        },
      ],
      techStack: [
        "Laravel 11.0", "Alpine.js", "jQuery", "Tailwind CSS", "Bootstrap",
        "Plyr", "Swiper", "flatpickr", "Axios", "FFMpeg",
        "pdf.js", "Intervention Image", "Laravel Sanctum", "Firebase JWT",
      ],
      archDecisions: [
        "تم اختيار Alpine.js لمكونات تفاعلية خفيفة داخل Blade دون خطوات بناء.",
        "تم اختيار Plyr لدعم تخصيص مشغل الفيديو ودمج طبقة العلامة المائية.",
        "تم استخدام عرض pdf.js على canvas بدل iframe لمنع تنزيل الملفات.",
      ],
      keyFeatures: [
        "إعادة تصميم وتحديث كامل لواجهة المستخدم والألوان",
        "نظام محسّن لتحميل وعرض محتويات المواد والدروس",
        "لوحة تفاعل وتقييم متجاوبة بالكامل للهواتف",
        "لوحة إحصائيات محسّنة لتقدم الطلاب الأكاديمي",
        "أدوات استخراج تلقائي لتقارير أداء وتحصيل الفصل",
      ],
      screens: [
        { label: "الصفحة الرئيسية" },
        { label: "لوحة بنك الأسئلة" },
        { label: "لوحة الفئات الإدارية" },
        { label: "كتالوج البوتكامبات" },
        { label: "تصميم متجاوب" },
        { label: "الوضع الليلي" },
      ],
      metrics: [
        { value: "+80%", label: "تحسن في السرعة",       desc: "عرض الصفحات بعد التحسين الشامل" },
        { value: "3",    label: "أنواع كوبونات",         desc: "خصم ودفع وشحن رصيد" },
        { value: "1000", label: "كوبون دفعة واحدة",     desc: "يُولَّد في عملية دفعية واحدة" },
      ],
    },

  },
};
