export const portfolioData = {
  profile: {
    name: "Ibrahim Fares",
    title: "Frontend Developer",
    location: "Sharkia, Egypt",
    email: "ibrahimfares511@gmail.com",
    phone: "(+20) 1007218535",
    github: "https://github.com/ibrahimfares511",
    linkedin: "https://linkedin.com/in/ibrahimfares511",
    whatsapp: "https://wa.me/201007218535",
    summary:
      "Frontend Developer with 4+ years of professional experience building scalable web applications using React.js, Redux Toolkit, and modern JavaScript. Proven track record delivering full-featured platforms — from real-time chat and interactive dashboards to complex LMS systems — across both full-time and freelance engagements. Currently expanding into full-stack development with Node.js/Express and workflow automation with n8n. Open to remote opportunities.",
  },
  stats: [
    { value: 4, suffix: "+", label: "Years Experience" },
    { value: 5, suffix: "+", label: "Production Projects" },
    { value: 3, suffix: "+", label: "Companies Partnered" },
    { value: 15, suffix: "+", label: "Core Technologies" },
  ],
  education: [
    {
      degree: "Bachelor's Degree in Civil Engineering",
      institution: "Zagazig University, Egypt",
      period: "2017 – 2022",
      description:
        "Acquired analytical problem-solving and rigorous engineering methods.",
    },
    {
      degree: "Information Technology School",
      institution: "Ismailia, Egypt",
      period: "2012 – 2017",
      description:
        "Developed interest in programming; self-taught web development; built the school website as a graduation project.",
    },
  ],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Basic" },
  ],
  skills: {
    languagesAndCore: [
      "JavaScript (ES6+)",
      "TypeScript",
      "HTML5",
      "CSS3",
      "JSON",
      "AJAX",
    ],
    frameworksAndLibraries: [
      "React.js",
      "Redux Toolkit",
      "Zustand",
      "React Hook Form",
      "Zod",
      "jQuery",
    ],
    uiAndStyling: [
      "Tailwind CSS",
      "MUI",
      "ShadCN UI",
      "Bootstrap",
      "Radix UI",
      "Framer Motion",
      "Swiper",
      "ApexCharts",
      "SweetAlert2",
    ],
    backendAndApis: [
      "Node.js",
      "Express.js (Currently Learning)",
      "RESTful APIs",
      "Firebase",
      "AJAX/Laravel integration",
    ],
    automation: ["n8n (Workflow Automation)"],
    toolsAndPlatforms: [
      "Git",
      "GitHub",
      "NPM",
      "Postman",
      "Swagger",
      "Figma",
      "Trello",
    ],
  },
  careerJourney: [
    {
      role: "Frontend Developer",
      company: "Amyal Smart Company",
      period: "Apr 2024 – Present",
      location: "Remote, Full-time",
      description:
        "Engineered high-engagement web experiences and collaborated with backend teams.",
      highlights: [
        "Built Warehouse Management System (WMS) from scratch — React, Redux Toolkit: visual mapping & scanner integration.",
        "Implemented visual storage layouts and offline stock count transactions to prevent data drops.",
        "Integrated barcode scanner inputs; connected to Laravel backend APIs via AJAX queries.",
      ],
    },
    {
      role: "Freelance Frontend Developer",
      company: "Independent Client Contracts",
      period: "Feb 2022 – Present",
      location: "Remote / Freelance",
      description:
        "Led the visual redesign and development of multiple digital classrooms and LMS web applications.",
      highlights: [
        "Built Ertiqaa Academy's full student portal with React, Redux, Firebase, MUI & Framer Motion.",
        "Developed 6+ interactive exam formats (MCQ, matching, ordering) with strict state validation.",
        "Sole developer for HAYA Academy — complete classroom frontend with jQuery & Laravel.",
      ],
    },
    {
      role: "Frontend Developer",
      company: "Alwasetah Company",
      period: "Jul 2022 – Dec 2022",
      location: "Remote, Full-time",
      description:
        "Refactored and modernized a legacy frontend codebase, improving performance and visual consistency.",
      highlights: [
        "Refactored legacy UI components to modern CSS tokens and design standards.",
        "Resolved critical display issues and improved rendering speeds of legacy codebases.",
        "Improved responsive layouts across landing pages and admin dashboards.",
      ],
    },
    {
      role: "Co-Founder & Frontend Lead",
      company: "Web Point — Restaurant ERP",
      period: "Jan 2021 – Jan 2024",
      location: "Hybrid, Project-based",
      description:
        "Built and sold a Restaurant ERP system deployed across 4+ active businesses.",
      highlights: [
        "Built a drag-and-drop table layout builder with real-time order queue binding.",
        "Designed the full admin dashboard: menu controls, order streams & floor plan management.",
        "Engineered lightweight customer interfaces for digital menu browsing and checkout.",
      ],
    },
  ],
  projects: [
    {
      id: "wms",
      title: "Warehouse Management System (WMS)",
      tagline: "Real-time logistics and inventory tracking system",
      tags: ["React.js", "Redux Toolkit", "Tailwind CSS", "Laravel APIs"],
      description:
        "An enterprise-grade warehouse management system supporting real-time stock levels, automated stock checks, and barcode/QR scanner integration.",
      problem:
        "Distributors and warehouse staff struggled with delayed stock syncs, order errors, and lack of visual bin location map guides.",
      challenges: [
        "Designing low-latency visual mapping of storage layouts.",
        "Preserving offline stock count transactions during network disruptions.",
        "Structuring barcode scanners event mapping in standard browser context.",
      ],
      solution:
        "Engineered a custom grid floor map canvas with Drag and Drop bin configurations, local database syncing for offline counts, and direct scanner listeners.",
      architecture: [
        "React floor layout coordinator",
        "Redux stock state preservation",
        "Barcode reader key input parser",
        "Laravel backend REST APIs",
      ],
      technologies: [
        "React",
        "Redux Toolkit",
        "Tailwind CSS",
        "Laravel APIs",
        "AJAX",
        "SweetAlert2",
      ],
      results: [
        "Visual bin allocation layout mapping",
        "Offline state preservation during stock counting",
        "Low-latency scanning responses",
      ],
      gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
      accent: "#a855f7",
    },
    {
      id: "ertiqaa-academy",
      title: "Ertiqaa Academy",
      tagline: "Advanced multimedia learning management system",
      tags: ["React.js", "Redux Toolkit", "MUI", "i18n", "Firebase"],
      description:
        "A premium educational platform featuring multimedia classrooms, timed evaluations, progress reports, and 6+ interactive question styles.",
      problem:
        "The academy required an advanced student portal capable of rendering multiple distinct interactive exam types and video/audio lessons while ensuring progress metrics are tracked in real time.",
      challenges: [
        "Developing robust and reusable renderers for 6+ question types.",
        "Handling quiz state preservation during network interruptions.",
        "Supporting multi-language localization seamlessly across student assets.",
      ],
      solution:
        "Created a modular question parser with strict TypeScript validation, Radix UI and Tailwind CSS for accessible inputs, and state management using Redux Toolkit and Firebase.",
      architecture: [
        "Polymorphic assessment engine layout",
        "Redux-based student quiz state store",
        "React-i18next translation layer",
        "Firebase student tracking data stream",
      ],
      technologies: [
        "React",
        "Redux Toolkit",
        "MUI",
        "Radix UI",
        "Firebase",
        "Tailwind CSS",
        "Framer Motion",
        "React i18n",
      ],
      results: [
        "Delivered 6+ interactive question templates",
        "Persistent timed assessment logs",
        "Full responsiveness for all student devices",
      ],
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      accent: "#06b6d4",
    },
    {
      id: "web-point-erp",
      title: "Web Point Restaurant ERP",
      tagline: "Custom ERP with drag-and-drop table management",
      tags: ["React.js", "TypeScript", "HTML5 Canvas", "JSON"],
      description:
        "An administrative and consumer restaurant suite that handles digital menu ordering, payment gateways, and visual floor plans.",
      problem:
        "Local dining establishments lacked an unified dashboard to manage orders, modify table arrangements dynamically, and present a seamless customer checkout flow.",
      challenges: [
        "Designing an interactive drag-and-drop table manager.",
        "Maintaining synchronized state between the kitchen and administrative views.",
      ],
      solution:
        "Developed a custom drag-and-drop grid canvas using HTML5 Drag and Drop APIs, combined with a highly optimized order tracking queue that manages statuses in real-time.",
      architecture: [
        "Dual portal configuration (Admin vs Customer)",
        "HTML5 layout coordinate engine",
        "Local state persistent caching layer",
        "JSON data contract endpoints",
      ],
      technologies: [
        "React",
        "TypeScript",
        "JavaScript",
        "HTML5",
        "CSS3",
        "JSON",
      ],
      results: [
        "Deployed and sold to 4+ dining businesses",
        "Zero order dropping in peak operational hours",
        "Intuitive graphical floor plan management",
      ],
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      accent: "#10b981",
    },
    {
      id: "haya-academy",
      title: "HAYA Academy",
      tagline: "Custom student platform with jQuery and Laravel",
      tags: ["jQuery", "Laravel", "AJAX", "HTML5", "CSS3"],
      description:
        "A traditional server-rendered educational platform with media-rich lesson plans, quizzes, and automated evaluations.",
      problem:
        "The school needed an affordable, fast e-learning system with media support and automated grading features without the complexity of a heavy single-page application framework.",
      challenges: [
        "Structuring clean, modular frontend logic in jQuery without component encapsulation.",
        "Integrating Laravel APIs seamlessly with dynamic AJAX requests.",
      ],
      solution:
        "Implemented a structured MVC layout on the Laravel backend, writing modular jQuery scripts with custom namespaces to handle quiz scoring, media playbacks, and timed actions.",
      architecture: [
        "Laravel Blade template architecture",
        "Namespaced jQuery event streams",
        "AJAX database transactions",
      ],
      technologies: [
        "jQuery",
        "Laravel",
        "AJAX",
        "JavaScript",
        "HTML5",
        "CSS3",
      ],
      results: [
        "Developed successfully as sole frontend coder",
        "Integrated comprehensive grading system",
        "Lightweight rendering under 1.5 seconds",
      ],
      gradient: "from-blue-500/20 via-sky-500/10 to-transparent",
      accent: "#3b82f6",
    },
    {
      id: "mrs-ayat-asaad",
      title: "Mrs. Ayat Asaad Platform",
      tagline: "Redesigned and optimized educational web app",
      tags: ["jQuery", "Laravel", "AJAX", "UI/UX Redesign"],
      description:
        "A detailed redesign and code modernization phase for an active online portal, improving overall user experience and page speed scores.",
      problem:
        "The existing platform suffered from outdated UI design, poor mobile responsiveness, and high load times that negatively impacted student engagement.",
      challenges: [
        "Refactoring and optimizing legacy Laravel/jQuery integrations without breaking existing user data.",
        "Upgrading UI elements to modern standards while retaining core logic.",
      ],
      solution:
        "Conducted a complete UI/UX audit, refactored redundant CSS/JS scripts, optimized images, and modernized the layout to align with responsive design rules.",
      architecture: [
        "Optimized CSS layout stylesheets",
        "Refactored legacy scripting sheets",
        "Laravel/jQuery rendering pipeline",
      ],
      technologies: [
        "jQuery",
        "Laravel",
        "AJAX",
        "JavaScript",
        "CSS3",
        "HTML5",
      ],
      results: [
        "Rebuilt key portals for enhanced visual clarity",
        "Achieved 40%+ page load speed improvements",
        "100% responsiveness on mobile tablets and phones",
      ],
      gradient: "from-rose-500/20 via-red-500/10 to-transparent",
      accent: "#f43f5e",
    },
  ],
  challenges: [
    {
      id: "real-time-chat",
      title: "Real-Time Leaderboard & Chat Sync",
      summary: "Built real-time features with Firebase and custom timer hooks.",
      challenge:
        "Syncing countdown timers for active marathon challenges and event chat rooms across concurrent users without lagging the main browser thread.",
      solution:
        "Implemented a unified React Context with requestAnimationFrame loop for counting, and paired it with Firebase Realtime Database observers.",
      outcome:
        "Maintained perfectly synced timers (<10ms offset) and messaging streams across users, preserving smooth 60fps rendering.",
      accent: "#a855f7",
    },
    {
      id: "exam-engine",
      title: "Polymorphic Assessment Engine",
      summary: "Created a flexible question renderer for 6+ exam formats.",
      challenge:
        "Designing a robust client-side quiz parser that handles MCQ, matching, ordering, fill-in-the-blank, essay questions with state preservation and timer hooks.",
      solution:
        "Developed a polymorphic React component set typed strictly in TypeScript, managing a central reducer for question transitions and client state.",
      outcome:
        "Deployed to thousands of students, enabling seamless timed exams with automatic progress saving during network drops.",
      accent: "#06b6d4",
    },
    {
      id: "drag-drop-erp",
      title: "Interactive Drag & Drop Table Grid",
      summary:
        "Custom drag-and-drop table layouts for administrative dashboard.",
      challenge:
        "Enabling restaurant administrators to visually place, resize, and connect dining tables inside a grid layout that instantly binds to order queues.",
      solution:
        "Built an interactive canvas using HTML5 Drag and Drop APIs combined with responsive coordinate calculations and client-side bounding checks.",
      outcome:
        "Successfully rolled out to 4+ active businesses, reducing layout modification time from hours to minutes.",
      accent: "#10b981",
    },
    {
      id: "legacy-refactoring",
      title: "Legacy Integration Modernization",
      summary:
        "Refactored jQuery/Laravel apps to achieve responsiveness and speed.",
      challenge:
        "Inheriting outdated web apps with bloated stylesheets, unorganized script sheets, and slow page-load speeds.",
      solution:
        "Performed a complete audit, eliminated redundant styling classes, modularized scripts, and optimized media delivery systems.",
      outcome:
        "Reduced load times significantly and delivered clean visual responsiveness across mobile screens.",
      accent: "#3b82f6",
    },
    {
      id: "geo-discovery",
      title: "Geo-Located Offers Discovery",
      summary: "Integrated Google Maps API for location-based offers search.",
      challenge:
        "Dynamically fetching and clustering local offers on a map layout as the user pans or zooms, preventing screen stuttering or slow queries.",
      solution:
        "Implemented debounced map boundary updates, marker clustering, and custom location hooks to query offers efficiently via AJAX.",
      outcome:
        "Created an immersive, stutter-free map experience allowing students and users to find offers in real-time.",
      accent: "#f43f5e",
    },
  ],
} as const;
