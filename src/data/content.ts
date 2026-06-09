export const stats = [
  { value: 2, suffix: '+', label: 'Years Experience' },
  { value: 10, suffix: '+', label: 'Production Projects' },
  { value: 100, suffix: '+', label: 'Components Built' },
  { value: 1000, suffix: '+', label: 'Development Hours' },
] as const

export const technologies = [
  { name: 'React', color: '#61DAFB', orbit: 0 },
  { name: 'TypeScript', color: '#3178C6', orbit: 1 },
  { name: 'Redux', color: '#764ABC', orbit: 2 },
  { name: 'RTK Query', color: '#764ABC', orbit: 3 },
  { name: 'Tailwind', color: '#06B6D4', orbit: 4 },
  { name: 'MUI', color: '#007FFF', orbit: 5 },
  { name: 'Firebase', color: '#FFCA28', orbit: 6 },
  { name: 'Laravel APIs', color: '#FF2D20', orbit: 7 },
  { name: 'Agora', color: '#099DFD', orbit: 8 },
] as const

export const careerJourney = [
  {
    title: 'Frontend Trainee',
    period: '2022',
    description: 'Foundation in HTML, CSS, JavaScript, and responsive design principles.',
  },
  {
    title: 'React Developer',
    period: '2023',
    description: 'Built component-driven UIs, mastered hooks, and state management patterns.',
  },
  {
    title: 'ERP Systems Developer',
    period: '2023–2024',
    description: 'Developed enterprise dashboards with complex data flows and role-based access.',
  },
  {
    title: 'Educational Platforms Engineer',
    period: '2024',
    description: 'Crafted interactive learning systems with real-time features and rich media.',
  },
  {
    title: 'Advanced Front-End Engineer',
    period: '2025',
    description: 'Architecting scalable products with performance-first engineering mindset.',
  },
] as const

export const projects = [
  {
    id: 'erp-dashboard',
    title: 'Advanced ERP Dashboard',
    tagline: 'Real-time business intelligence at scale',
    tags: ['ERP System', 'Dashboard'],
    description: 'A comprehensive ERP solution with advanced analytics, role-based access, and real-time data synchronization.',
    problem: 'A growing enterprise needed a unified dashboard to manage inventory, sales, and HR operations across multiple departments with real-time data synchronization.',
    challenges: [
      'Complex role-based access control across 12 user types',
      'Handling 50K+ records with smooth pagination',
      'Real-time updates without page refreshes',
    ],
    solution: 'Architected a modular React application with RTK Query for server state, virtualized data tables, and WebSocket integration for live updates.',
    architecture: ['Feature-based folder structure', 'RTK Query + Redux slices', 'Laravel REST API', 'Role-based route guards'],
    technologies: ['React', 'TypeScript', 'Redux', 'RTK Query', 'MUI', 'Laravel'],
    results: ['40% faster data load times', 'Reduced support tickets by 35%', 'Deployed to 200+ daily users'],
    gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
    accent: '#818cf8',
  },
  {
    id: 'learning-platform',
    title: 'Interactive Learning Platform',
    tagline: 'Education reimagined with real-time collaboration',
    tags: ['Education', 'E-learning'],
    description: 'A modern e-learning platform with interactive content, quizzes, progress tracking, and real-time collaboration.',
    problem: 'An ed-tech startup required a platform supporting live classes, interactive whiteboards, assignments, and progress tracking for thousands of students.',
    challenges: [
      'PDF whiteboard integration with annotation tools',
      'Real-time video conferencing with Agora SDK',
      'Complex assignment submission workflows',
    ],
    solution: 'Built a comprehensive learning ecosystem with custom PDF viewer, drag-and-drop assignment builder, and integrated video conferencing.',
    architecture: ['Micro-frontend modules', 'Firebase real-time DB', 'Agora RTC integration', 'Custom PDF engine'],
    technologies: ['React', 'TypeScript', 'Firebase', 'Agora', 'Tailwind', 'Redux'],
    results: ['10K+ active students', '99.2% uptime', '4.8/5 user satisfaction'],
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    accent: '#22d3ee',
  },
  {
    id: 'meeting-app',
    title: 'Real-time Meeting App',
    tagline: 'A real-time communication platform with video calls',
    tags: ['Real-time', 'Collaboration'],
    description: 'A real-time communication platform with video calls, whiteboard, chat, and file sharing capabilities.',
    problem: 'Teams lacked a lightweight, fast web application for video conferencing, collaborative whiteboarding, and persistent chat streams in a single tab.',
    challenges: [
      'Low latency audio/video syncing',
      'Real-time canvas drawing syncing on double boards',
      'Handling flaky internet connection states',
    ],
    solution: 'Engineered a WebRTC meeting workspace with Agora SDK, drawing canvas synced via WebSockets, and automatic reconnection states.',
    architecture: ['WebRTC / Agora RTC client', 'Canvas syncing engines', 'Redux slices for meeting states', 'Heartbeat sockets'],
    technologies: ['React', 'TypeScript', 'Tailwind', 'Redux', 'Agora', 'Node.js'],
    results: ['Sub-100ms drawing delay', 'Used by 12 client departments', 'Reduced platform load by 40%'],
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accent: '#34d399',
  },
] as const

export const architectureSteps = [
  { title: 'Requirements', icon: 'clipboard', description: 'Deep dive into user needs, constraints, and success metrics.' },
  { title: 'Planning', icon: 'map', description: 'Technical specs, sprint breakdown, and risk assessment.' },
  { title: 'UI Architecture', icon: 'layout', description: 'Component hierarchy, design tokens, and layout systems.' },
  { title: 'State Management', icon: 'database', description: 'Server vs client state, caching strategies, and data flow.' },
  { title: 'API Integration', icon: 'plug', description: 'RESTful contracts, error handling, and optimistic updates.' },
  { title: 'Optimization', icon: 'zap', description: 'Bundle splitting, lazy loading, and performance profiling.' },
  { title: 'Deployment', icon: 'rocket', description: 'CI/CD pipelines, monitoring, and rollback strategies.' },
] as const

export const challenges = [
  {
    id: 'pdf-whiteboard',
    title: 'PDF Whiteboard Integration',
    summary: 'Integrating PDF rendering with interactive whiteboard for seamless annotation.',
    challenge: 'Integrating a full-featured PDF viewer with drawing, annotation, and real-time sync across multiple users in a live classroom environment.',
    solution: 'Built a custom canvas overlay system on top of PDF.js with WebSocket synchronization, conflict resolution, and undo/redo stacks.',
    outcome: 'Enabled seamless collaborative annotation with <50ms latency, supporting 30+ concurrent users per session.',
    accent: '#3b82f6',
  },
  {
    id: 'real-time',
    title: 'Real-time Collaboration',
    summary: 'Built real-time features with WebSockets and conflict resolution.',
    challenge: 'Building reliable real-time notifications, live data updates, and presence indicators without overwhelming the client or server.',
    solution: 'Designed an event-driven architecture with WebSocket connections, heartbeat monitoring, exponential backoff reconnection, and message queuing.',
    outcome: 'Achieved 99.9% message delivery rate with graceful degradation to polling when WebSockets unavailable.',
    accent: '#10b981',
  },
  {
    id: 'performance',
    title: 'Performance Optimization',
    summary: 'Optimized large datasets with virtualization and caching strategies.',
    challenge: 'A data-heavy dashboard was causing 3+ second load times and janky scrolling with 10K+ table rows.',
    solution: 'Implemented virtual scrolling, React.memo with custom comparators, web workers for data transformation, and aggressive code splitting.',
    outcome: 'Reduced initial load to 1.2s, achieved 60fps scrolling, and improved Lighthouse score from 62 to 94.',
    accent: '#f59e0b',
  },
  {
    id: 'state-management',
    title: 'State Management Complexity',
    summary: 'Managed complex state across large applications with RTK Query.',
    challenge: 'Managing intertwined state across authentication, permissions, cached API data, and real-time notifications in a large ERP application.',
    solution: 'Implemented a layered state architecture with RTK Query for server cache, Redux slices for UI state, and middleware for cross-cutting concerns.',
    outcome: 'Reduced state-related bugs by 70% and improved developer onboarding time by 50%.',
    accent: '#ef4444',
  },
  {
    id: 'file-upload',
    title: 'File Upload & Processing',
    summary: 'Implemented chunked uploads with progress tracking and validation.',
    challenge: 'Users needed to upload massive assets (5GB+) without session timeouts, with progress bars and pause/resume capabilities.',
    solution: 'Engineered a chunked file slicer in Javascript that uploads binary parts in parallel, validates SHA-256 hashes on the fly, and merges segments on target servers.',
    outcome: 'Achieved 100% upload success rate on files up to 10GB, and enabled instant pause/resume toggling on network reconnect.',
    accent: '#f97316',
  },
] as const

export const testimonials = [
  {
    quote: 'Ibrahim transformed our legacy dashboard into a modern, performant application. His attention to detail and architectural thinking elevated our entire frontend codebase.',
    author: 'Sarah Mitchell',
    role: 'Engineering Manager',
    company: 'TechFlow Solutions',
  },
  {
    quote: 'The learning platform he built exceeded our expectations. Real-time features work flawlessly, and students love the interactive experience.',
    author: 'Ahmed Hassan',
    role: 'Product Lead',
    company: 'EduNext',
  },
  {
    quote: 'Rare combination of design sensibility and engineering rigor. Ibrahim doesn\'t just write code — he crafts products.',
    author: 'James Chen',
    role: 'Startup Founder',
    company: 'DataPulse',
  },
] as const

export const socialLinks = [
  { label: 'Email', href: 'mailto:ibrahim@example.com', icon: 'mail' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com', icon: 'github' },
  { label: 'WhatsApp', href: 'https://wa.me/', icon: 'message-circle' },
] as const

export const githubActivity = {
  contributions: 847,
  repositories: 24,
  openSource: 8,
  streak: 42,
} as const
