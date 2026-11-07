/**
 * Single source of truth for every piece of content on the site.
 *
 * Sources: details supplied by Thanishka, her public GitHub repositories and
 * READMEs, her résumé (Thanishka_Yogesh_Resume) and her LinkedIn profile PDF
 * (Profile). Nothing here is invented; dates and titles are taken from those
 * documents.
 */

export const profile = {
  name: "Thanishka Yogesh",
  firstName: "Thanishka",
  lastName: "Yogesh",
  role: "Full-Stack & Web Developer",
  disciplines: ["Website Developer", "Full-Stack Developer", "Creative Technologist"],
  headline: "I build thoughtful digital experiences.",
  intro:
    "I build thoughtful digital experiences, from intuitive interfaces to the systems that power them.",
  tagline: "Developer. Student. Experimenter.",
  degree: "Bachelor of Engineering (B.E.)",
  department: "Computer Science and Engineering",
  college: "Sri Sairam Engineering College",
  education: "Aug 2025 to Aug 2029 (expected)",
  cgpa: "8.60",
  internships: 5,
  year: "Second year",
  location: "Chennai, Tamil Nadu, India",
  email: "thanishka.ykb@gmail.com",
  phone: "+91 9025658705",
  phoneDisplay: "+91 9025658705",
  phoneHref: "+919025658705",
  linkedin: "https://www.linkedin.com/in/thanishka-yogesh",
  github: "https://github.com/thanishkaykb",
  previousPortfolio: "https://portfolio-thanishka-yogesh.vercel.app/",
  resumePath: "/resume/Thanishka-Yogesh-Resume.pdf",
  availability: "Open to internships & collaborations",
  languages: ["Tamil", "Telugu", "English", "Hindi"],
} as const;

export type DoorCategory = {
  id: string;
  index: string;
  title: string;
  short: string;
  kicker: string;
  details: string;
  skills: { name: string; note: string }[];
  projectSlugs: string[];
  /** Intentionally blank until its content is written. */
  empty?: boolean;
};

export const doors: DoorCategory[] = [
  {
    id: "website-development",
    index: "01",
    title: "Website Development",
    short: "Websites",
    kicker: "Interfaces, built to be used",
    details:
      "My primary craft. I build websites in React and TypeScript with Vite or Next.js, style them with Tailwind CSS, and care about the details people feel rather than see: rhythm, contrast, keyboard access, loading behaviour and layouts that survive a 360px screen.",
    skills: [
      { name: "React.js", note: "Component architecture and state" },
      { name: "Next.js", note: "Routing and production builds" },
      { name: "TypeScript", note: "Typed interfaces and data models" },
      { name: "Tailwind CSS", note: "Design tokens, responsive layout" },
      { name: "HTML & CSS", note: "Semantic structure and typography" },
      { name: "Vercel", note: "Deployment and previews" },
    ],
    projectSlugs: ["paimana-ai", "intellect-hack-2026", "one-nation-one-portal"],
  },
  {
    id: "creative-development",
    index: "02",
    title: "Creative Development",
    short: "Creative",
    kicker: "Experiments with a browser",
    details:
      "Where I test ideas: Three.js scenes, scroll-driven storytelling, hand tracking in the browser, colour-memory games, type experiments. Creative work is how I keep the craft moving, and how most of my product instincts get built.",
    skills: [
      { name: "Three.js / R3F", note: "Real-time 3D in the browser" },
      { name: "GSAP + ScrollTrigger", note: "Scroll-driven sequences" },
      { name: "MediaPipe / TensorFlow.js", note: "Hand tracking and live vision" },
      { name: "Browser media APIs", note: "Camera, MediaRecorder, Web Speech" },
      { name: "Generative UI", note: "Canvas, SVG and procedural visuals" },
      { name: "Motion design", note: "Easing, choreography, reveals" },
    ],
    projectSlugs: ["air-draw", "motion-mesh", "colouris"],
  },
  {
    id: "leadership-events",
    index: "03",
    title: "Leadership and Events",
    short: "Leadership",
    kicker: "Rooms I help run",
    details: "",
    skills: [],
    projectSlugs: [],
    empty: true,
  },
];

export type Anthology = {
  title: string;
  publisher: string;
  isbn: string;
  href: string;
  cover: string;
  note: string;
};

/** Two published anthologies; covers come from the shared cover-page folder. */
export const anthologies: Anthology[] = [
  {
    title: "Some Feelings Don't Expire",
    publisher: "Writer's Pocket",
    isbn: "978-93-6868-908-9",
    href: "https://amzn.in/d/06Y3hf8r",
    cover: "/writing/cover-a.jpg",
    note: "On the feelings that stay: love, hurt, longing and hope, carried quietly.",
  },
  {
    title: "Almost Human",
    publisher: "Writer's Pocket",
    isbn: "978-93-7248-459-5",
    href: "https://amzn.in/d/01nM6Hjr",
    cover: "/writing/cover-b.jpg",
    note: "On feeling everything too much, breaking quietly, and still being here.",
  },
];

export type Poem = {
  title: string;
  form: string;
  date: string;
  href: string;
  text: string;
};

export const poetryProfile =
  "https://www.poetrysoup.com/poems_poets/poems_by_poet.aspx?ID=181303";

export const artAccount = {
  handle: "@art_by_thanishka",
  href: "https://www.instagram.com/art_by_thanishka/",
};

/** Every poem on the public PoetrySoup profile, in full. */
export const poems: Poem[] = [
  {
    title: "Shattered Heart",
    form: "Free verse",
    date: "26 July 2025",
    href: "https://www.poetrysoup.com/poem/shattered_heart_1748153",
    text: `Do you know how it feels to be
No one's first priority?

The feeling of being alone
While your friends are falling in love.
The time when you needed support
But no one was there to.
The anxiety of being accused
When you did nothing wrong.
The fear of getting rejected
By the one you love.
The pain of getting backstabbed
By your very close ones'.
The times when you cried
But no one really cared about it.
The way you felt lonely
On every class break.
The fear of losing your best friend
Because of another person.
The feeling of getting famous
For things that were not true.
The sadness that comes when
No one feels like themselves.
The thought of accepting your fate
Because nothing is going to change.
The way you feel depressed
Because of another person.
The time when you did things
For others, but it's all wasted.
The pain that you felt in your chest
When all these things happened.

And you know what?
Those are signs telling you
To live for yourself
And not for others.`,
  },
  {
    title: "Colours!",
    form: "Free verse",
    date: "19 February 2025",
    href: "https://www.poetrysoup.com/poem/colours_1707933",
    text: `Those are the colours.
Which binds together, and then
A beautiful background is formed.
Which mesmerizes people.

Which blends together
And forms an
Amazing shade
Which is then visible to us.

Whatever the shade is
It has never made itself unattractive.
And we still have a fondness for it.
Because it's a piece of art.

Humans are also kind of shades.
Who are unique in their own way.
Beautiful, kind, and lovely
And fascinating for other people.

We humans are pieces of art too.
Everyone has different talents.
Everyone are unique and contrast
And we are the future of all.`,
  },
  {
    title: "Palette of Potential",
    form: "Rhyme",
    date: "7 December 2024",
    href: "https://www.poetrysoup.com/poem/palette_of_potential_1691293",
    text: `There is always that person
Who is the most important after parents.
The one who thought us everything
And made us who we are now.
The art of being a teacher
Is like eternity.
The endless joy of progressions,
Is the ecstasy of both.
They are the God's
Who transforms us into the best one's.
Makes us prove ourselves.
And be proud of oneself's.
For me, it's my master.
The one who made me realize who I am
And what my potential is.
The one who thought me my interest
And made me the best in it.
The happiness I get out of it
Is another level of exuberance.
I like my hobby, more like passion,
It gives life to me.
Thank all the teachers
Who helps you through your works.
They are wonderful for who they are.
Because learning is as important as oxygen.`,
  },
  {
    title: "Footprints",
    form: "Rhyme",
    date: "12 November 2024",
    href: "https://www.poetrysoup.com/poem/footprints_1686497",
    text: `I look back at my footprints,
Which showed my progression.
A better one indeed,
Learning how a life proceeds.

Know that yesterday isn't tomorrow.
The past chapter is closed,
A new one might start soon.
Put on a smile and go.

True colours comes out
When a problem arises.
A sudden courage appeared to solve
Those one by one, it brought peace.

Heart untangled from the ties
Which were knotted very tightly.
Unraveled one after another,
Till the heart was set free.

Now, a happier era has just begun.
Where people I trust are around me,
Jovial and sprightly,
Which makes me persist freely.`,
  },
];

export const abilityGroups: { label: string; items: string[] }[] = [
  {
    label: "Programming",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C", "SQL"],
  },
  {
    label: "Frontend",
    items: ["React.js", "Next.js", "Vite", "Tailwind CSS", "Framer Motion", "HTML5 / CSS3"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express.js", "FastAPI", "Convex", "Supabase", "REST APIs"],
  },
  {
    label: "Database",
    items: ["PostgreSQL", "MySQL", "SQLite", "Convex DB"],
  },
  {
    label: "Design",
    items: ["Figma", "Design systems", "shadcn/ui", "Recharts", "UI/UX", "Accessibility"],
  },
  {
    label: "Tools",
    items: ["Git & GitHub", "Vercel", "VS Code", "Bun & npm", "SHAP", "ESLint"],
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  tagline: string;
  problem: string;
  description: string;
  features: string[];
  tech: string[];
  contribution: string;
  repo?: string;
  live?: string;
  featured: boolean;
  motif: "signs" | "civic" | "event" | "qr" | "nutrition" | "capsule" | "ai" | "risk";
  accent: string;
};

const catalog: Project[] = [
  {
    slug: "paimana-ai",
    name: "PAIMANA AI",
    kind: "AI · Infrastructure",
    year: "2026",
    tagline: "Risk intelligence for infrastructure projects.",
    problem:
      "Infrastructure projects fail quietly: cost overruns, schedule slips and execution risks build up long before anyone raises an alarm, and by then intervention is expensive.",
    description:
      "A predictive intelligence platform that identifies cost, schedule and execution risk across infrastructure projects. It scores risk, explains the factors behind each prediction, and turns a portfolio of projects into something you can actually act on.",
    features: [
      "Predictive risk scoring across cost, schedule and execution",
      "Portfolio analytics with risk trends",
      "Alerts for emerging risk across projects",
      "AI-driven insights with SHAP-based explainability",
      "What-If simulation for planned interventions",
      "RAG-assisted project insights on an interactive dashboard",
    ],
    tech: ["React", "Vite", "FastAPI", "Python", "Scikit-learn", "SHAP", "Pandas", "Vercel"],
    contribution:
      "Built the platform end to end: risk-scoring pipeline, explainability layer and the interactive dashboard.",
    repo: "https://github.com/thanishkaykb/PAIMANA-AI",
    live: "https://paimana-ai-cyan.vercel.app/",
    featured: true,
    motif: "risk",
    accent: "#FFC928",
  },
  {
    slug: "silent-voices-seen",
    name: "Silent Voices, Seen",
    kind: "Accessibility · AI · Team lead",
    year: "2026",
    tagline: "Bridging speech and sign language, in the browser.",
    problem:
      "Two-way conversation between deaf and hearing people usually needs specialised hardware or an interpreter. Most tools only convert speech into text and stop there.",
    description:
      "A fully browser-based platform for two-way communication between spoken or written language and sign language, translation, live camera recognition, a fingerspelling trainer and a searchable signs library in one place. Built and led as a team product.",
    features: [
      "Text → sign language with instant animation",
      "Voice → sign language using live speech recognition",
      "Sign → text vision analysis from an image or video",
      "Real-time sign detection through the device camera",
      "Fingerspelling trainer with step-by-step A–Z breakdown",
      "Searchable signs library plus translation history",
    ],
    tech: ["React", "Next.js", "Node.js", "Computer Vision", "Speech Recognition", "Vercel"],
    contribution:
      "Team lead on the résumé-documented build: led development and team integration, and built the text-to-sign, voice-to-sign and sign-to-text workflows with responsive, real-time interfaces.",
    repo: "https://github.com/thanishkaykb/Silent-Voices-Seen",
    live: "https://silent-voice-seen.vercel.app",
    featured: true,
    motif: "signs",
    accent: "#FFC928",
  },
  {
    slug: "one-nation-one-portal",
    name: "One Nation One Portal",
    kind: "Citizen portal · Front-end",
    year: "2026",
    tagline: "Every government scheme and official portal, in one place.",
    problem:
      "Government services in India are spread across dozens of separate portals and departments, so finding the right scheme, the right form and the right office often takes longer than the task itself.",
    description:
      "A single-window portal for citizens: service categories for identity documents, health cover, education and scholarships, and agriculture support, each naming the schemes behind it, plus a live ticker for announcements. Built as a plain React and Vite front-end with no backend to keep it fast on a campus or mobile connection.",
    features: [
      "Four service categories: identity, health, education and agriculture",
      "Scheme cards naming the schemes behind each service, from Aadhaar to PM Kisan",
      "Live announcement ticker for policy and enrolment updates",
      "Portal-wide summary of schemes, portals and support hours",
      "Navy and gold civic visual identity with responsive layouts",
    ],
    tech: ["React", "Vite", "JavaScript", "CSS3", "Vercel"],
    contribution:
      "Solo build: concept, visual identity, page structure, category and scheme content, responsive layout and deployment.",
    repo: "https://github.com/thanishkaykb/One-Nation-One-Portal",
    live: "https://one-nation-one-portal-digital-india.vercel.app/",
    featured: true,
    motif: "civic",
    accent: "#FFC928",
  },
  {
    slug: "civic-lens",
    name: "CivicLens",
    kind: "Civic tech · Full-stack",
    year: "2026",
    tagline: "A clearer path through the Right to Information process.",
    problem:
      "The RTI Act lets citizens request information from public authorities, but knowing what to ask, how to structure an application and keeping track of submissions is confusing enough that most people give up.",
    description:
      "A civic-tech platform that turns a document-heavy process into a guided digital workflow: structured RTI applications, a dashboard, saved requests, profile management and document export.",
    features: [
      "Guided RTI application creation",
      "My RTIs workspace for every saved request",
      "Dashboard overview of a user's civic activity",
      "Email OTP authentication with protected routes",
      "PDF and DOCX export of completed applications",
      "Responsive interface with motion-led transitions",
    ],
    tech: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS v4",
      "Convex",
      "Convex Auth",
      "shadcn/ui",
      "Framer Motion",
      "jsPDF",
    ],
    contribution:
      "Solo build: product design, interface system, Convex schema and backend functions, authentication and document export.",
    repo: "https://github.com/thanishkaykb/CivicLens",
    featured: true,
    motif: "civic",
    accent: "#FFC928",
  },
  {
    slug: "intellect-hack-2026",
    name: "Intellect Hack 2026",
    kind: "Event website · IEEE",
    year: "2026",
    tagline: "The official site for a 6-hour AI hackathon.",
    problem:
      "An inter-college hackathon needed one authoritative place for its timeline, problem statements, registration details, jury information and FAQs, without a designer or a CMS.",
    description:
      "The official event website for Intellect Hack 2026, organised by the IEEE Reliability Society and SEC SBC at Sri Sairam Engineering College, Chennai, built as a fully responsive, animated single experience while also coordinating the event.",
    features: [
      "Event overview, eligibility, fees, venue and format",
      "Interactive two-phase competition timeline",
      "Five official problem-statement areas",
      "Coordinator profiles and jury information",
      "Accessible FAQ accordion and registration CTAs",
      "Mobile navigation and scroll-based animation",
    ],
    tech: ["React", "TypeScript", "TanStack Start", "TanStack Router", "Tailwind CSS", "Radix UI", "Vite"],
    contribution:
      "Designed and developed the official event website, and worked as a student coordinator and event organiser for Intellect Hack 2026.",
    repo: "https://github.com/thanishkaykb/Intellect-Hack-2026",
    live: "https://intellect-hack-2026.vercel.app/",
    featured: true,
    motif: "event",
    accent: "#FFC928",
  },
  {
    slug: "congestiq-ai",
    name: "CongestiQ AI",
    kind: "Hackathon · 2nd prize",
    year: "2026",
    tagline: "Urban traffic intelligence, built in eight hours.",
    problem:
      "Traffic congestion is usually managed after it happens. Combining traffic, weather, incident and safety signals could show congestion risk before it becomes a jam.",
    description:
      "A predictive traffic intelligence platform with an explainable Low / Medium / High risk engine, live dashboards, signal-timing recommendations and route suggestions. Team lead build for Code Carnival 2K26 at SIMATS Engineering, where it placed second.",
    features: [
      "Congestion-risk engine with visible reasoning",
      "Live traffic dashboard with route visualisation",
      "Signal-timing recommendations",
      "Weather, incident and safety data combined into scoring",
      "Live MVP demoed to the jury",
      "Explainable Low / Medium / High risk output",
    ],
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Custom rule engine", "Vercel"],
    contribution:
      "Team lead: ideation, development, integration and the final presentation. 2nd Prize, Code Carnival 2K26, SIMATS Engineering.",
    repo: "https://github.com/thanishkaykb/CongestiQ-AI",
    live: "https://congestiq-ai.vercel.app",
    featured: true,
    motif: "ai",
    accent: "#FFC928",
  },
  {
    slug: "scanforge",
    name: "ScanForge",
    kind: "Full-stack · Product",
    year: "2026",
    tagline: "A QR studio, not a QR generator.",
    problem:
      "Most QR tools produce a plain black square. Anyone sharing a menu, portfolio, Wi-Fi network or file wants something designed, and wants to find it again later.",
    description:
      "A full-stack QR code studio for URLs, Wi-Fi networks, email, SMS and uploaded files, with visual customisation, cloud storage and a personal library of every code you generate.",
    features: [
      "URL, Wi-Fi, email, SMS and file QR types",
      "Five pattern styles with custom colours and sizes",
      "File upload with persistent cloud storage",
      "Saved QR history and re-downloads across devices",
      "Supabase authentication and protected data",
      "Responsive studio interface",
    ],
    tech: ["React 19", "TypeScript", "TanStack Start", "TanStack Query", "Tailwind CSS v4", "Supabase", "Vercel"],
    contribution: "Solo build: interface, QR generation and styling logic, Supabase auth, database and storage.",
    repo: "https://github.com/thanishkaykb/ScanForge",
    featured: true,
    motif: "qr",
    accent: "#FFC928",
  },
  {
    slug: "nourish-ai",
    name: "Nourish AI",
    kind: "AI · Health",
    year: "2026",
    tagline: "Snap a meal. Understand the numbers.",
    problem:
      "Manual calorie tracking fails because it asks people to search databases and guess portion sizes for every meal. Most people quit within a week.",
    description:
      "An AI nutrition tracker that identifies a meal from a photo and estimates calories, protein, carbohydrates and fat, then tracks intake, weight and body measurements over time.",
    features: [
      "Photo-based meal recognition with Gemini vision",
      "Serving-size, calorie and macro estimation",
      "Daily calorie budget and nutrition history",
      "Macro distribution charts",
      "Weight and body measurement trends",
      "Daily streak tracking and secure accounts",
    ],
    tech: ["React 19", "TypeScript", "TanStack Start", "Tailwind CSS 4", "Supabase", "Gemini 2.5 Flash", "Recharts"],
    contribution: "Solo build: product design, AI food-analysis flow, dashboard and Supabase data layer.",
    repo: "https://github.com/thanishkaykb/Nourish-AI",
    featured: true,
    motif: "nutrition",
    accent: "#FFC928",
  },
  {
    slug: "time-capsule",
    name: "TimeCapsule",
    kind: "Full-stack · Media",
    year: "2026",
    tagline: "Capture today. Relive tomorrow.",
    problem:
      "Event photos get scattered across chats and posted immediately. There is no shared, private place where a group can collect memories and open them together later.",
    description:
      "A collaborative time-capsule platform: create a private event, invite people with an event code, collect photos and videos, and keep everything locked behind a live countdown until the reveal date.",
    features: [
      "Private events with custom reveal dates",
      "Invite codes and member management",
      "In-browser photo capture and video recording",
      "Time-locked memories that unlock together",
      "Live countdown to the reveal",
      "Bulk ZIP download of the unlocked gallery",
    ],
    tech: ["React 19", "TanStack Start", "TypeScript", "Tailwind CSS 4", "Supabase", "MediaRecorder API", "JSZip"],
    contribution: "Solo build: product concept, event and invitation flows, camera capture, reveal logic and storage.",
    repo: "https://github.com/thanishkaykb/TimeCapsule",
    featured: true,
    motif: "capsule",
    accent: "#FFC928",
  },
];

/**
 * Showcase order, set by Thanishka: PAIMANA AI leads, then Intellect Hack 2026,
 * Silent Voices Seen and CongestiQ AI, then the rest. Every section maps over
 * `projects`, so this single list keeps the work in the same order everywhere.
 */
const projectOrder = [
  "paimana-ai",
  "intellect-hack-2026",
  "silent-voices-seen",
  "congestiq-ai",
  "one-nation-one-portal",
  "civic-lens",
  "scanforge",
  "nourish-ai",
  "time-capsule",
];

export const projects: Project[] = [...catalog].sort(
  (a, b) => projectOrder.indexOf(a.slug) - projectOrder.indexOf(b.slug),
);

export const moreProjects = [
  {
    name: "Study Buddy",
    line: "Turns PDFs, notes and lectures into summaries, flashcards, quizzes and cited AI answers.",
    tech: "React · Supabase · AI",
    repo: "https://github.com/thanishkaykb/Study-Buddy",
  },
  {
    name: "FinePrint AI",
    line: "Reads the fine print: AI document analysis with a Supabase-backed workspace.",
    tech: "React · Vite · Supabase",
    repo: "https://github.com/thanishkaykb/FinePrint-Ai",
    live: "https://fine-print-ai-weld.vercel.app",
  },
  {
    name: "Green Pin Nexus",
    line: "Privileged-access intelligence prototype that detects suspicious chains of authorised activity.",
    tech: "FastAPI · scikit-learn · NetworkX · React",
    repo: "https://github.com/thanishkaykb/Green-Pin-Nexus",
  },
  {
    name: "VoteWise AI",
    line: "A civic decision engine that aligns voter priorities with candidate positions.",
    tech: "Flask · Python · LLMs",
    repo: "https://github.com/thanishkaykb/Vote-Wise-AI",
  },
  {
    name: "NextQuest",
    line: "A minimalist productivity app that turns tasks into timed quests.",
    tech: "HTML · CSS · JavaScript",
    repo: "https://github.com/thanishkaykb/NextQuest",
  },
  {
    name: "Lumen",
    line: "A calm study corner with a Pomodoro timer, ambience, to-dos and stats.",
    tech: "React · TypeScript",
    repo: "https://github.com/thanishkaykb/Lumen-The-Study-Corner",
  },
  {
    name: "Converta",
    line: "All-in-one PDF editing, file conversion and image optimisation in the browser.",
    tech: "React · TypeScript",
    repo: "https://github.com/thanishkaykb/Converta",
  },
  {
    name: "AirDraw",
    line: "Real-time hand-tracked drawing, a Minority Report style spatial interface.",
    tech: "MediaPipe · Canvas · JavaScript",
    repo: "https://github.com/thanishkaykb/AirDraw",
  },
  {
    name: "MotionMesh",
    line: "Browser hand tracking turned into glowing neon visuals with TensorFlow.js.",
    tech: "TensorFlow.js · MediaPipe",
    repo: "https://github.com/thanishkaykb/MotionMesh",
  },
  {
    name: "Colouris",
    line: "An interactive colour-memory game about perception, recall and accuracy.",
    tech: "React · TypeScript",
    repo: "https://github.com/thanishkaykb/Colouris",
  },
  {
    name: "KernType",
    line: "A typography playground for exploring and visualising text styles.",
    tech: "React · TypeScript",
    repo: "https://github.com/thanishkaykb/KernType",
  },
];

export type TimelineEntry = {
  period: string;
  title: string;
  org: string;
  body: string;
  tags: string[];
  link?: string;
  linkLabel?: string;
};

/**
 * The single chronological record of study, internships, leadership and the
 * work each one produced. The story section reads this list and nothing else,
 * so the same ground is never covered twice.
 */
export const timeline: TimelineEntry[] = [
  {
    period: "Aug 2025",
    title: "B.E. Computer Science and Engineering",
    org: "Sri Sairam Engineering College, Chennai",
    body: "Started my engineering degree: programming, data structures, systems, and the habit of asking how things actually work underneath. Graduation expected in Aug 2029.",
    tags: ["Education"],
  },
  {
    period: "Oct 2025 onwards",
    title: "IEEE Reliability Society & IEEE TEMS",
    org: "IEEE Reliability Society · SEC SBC · IEEE TEMS Sairam Chapter",
    body: "A volunteer with the IEEE Reliability Society SEC SBC since October 2025, supporting events and outreach. Since October 2026 I have served as Outreach and Multimedia Lead for the IEEE TEMS Sairam Chapter, after joining its volunteer team in March 2026.",
    tags: ["IEEE", "Volunteering", "Outreach"],
  },
  {
    period: "Dec 2025 to Jan 2026",
    title: "Web Development and Designing Intern",
    org: "Oasis Infobyte",
    body: "Developed and styled web interfaces with modern front-end frameworks, focusing on layout, responsive behaviour and visual consistency across screen sizes.",
    tags: ["Internship", "Front-end", "CSS"],
    link: "https://www.linkedin.com/in/thanishka-yogesh",
    linkLabel: "LinkedIn",
  },
  {
    period: "Dec 2025 to Jan 2026",
    title: "Artificial Intelligence and App Development Intern",
    org: "CodeAlpha",
    body: "Enhanced AI algorithms using machine-learning techniques and contributed to open-source AI projects alongside app development work.",
    tags: ["Internship", "Python", "ML"],
    link: "https://www.linkedin.com/in/thanishka-yogesh",
    linkLabel: "LinkedIn",
  },
  {
    period: "Jan 2026 to Feb 2026",
    title: "Full-Stack Web Development Intern",
    org: "Prodigy InfoTech",
    body: "Built full-stack web applications using HTML/CSS, JavaScript and Node.js, working across the interface and the server side of each task.",
    tags: ["Internship", "Node.js", "JavaScript"],
    link: "https://www.linkedin.com/in/thanishka-yogesh",
    linkLabel: "LinkedIn",
  },
  {
    period: "2026",
    title: "From pages to products",
    org: "Convex · Supabase · FastAPI",
    body: "Built CivicLens, ScanForge, TimeCapsule and Silent Voices Seen, authenticated products with schemas, storage, document export and real-time interaction. The interface had to agree with the data layer.",
    tags: ["Full-Stack", "Product", "React"],
  },
  {
    period: "Apr 2026",
    title: "Microsoft & Google Student Ambassador",
    org: "Microsoft Learn Student Ambassadors · Google Student Ambassador '26",
    body: "Selected as an MLSA Associate and a Google Student Ambassador in the same month, joining global student programmes for campus leaders building technical communities. Also a GeeksforGeeks Campus Mantri from June 2026.",
    tags: ["Leadership", "Community", "MLSA"],
  },
  {
    period: "2026",
    title: "Hackathons and prizes",
    org: "CongestiQ AI · Code Carnival 2K26 · Green Pin Nexus",
    body: "Led CongestiQ AI at the 8-hour Code Carnival at SIMATS Engineering and took 2nd Prize. Also part of the Green Pin Nexus privileged-access risk prototype.",
    tags: ["Hackathon", "2nd Prize", "Team lead"],
  },
  {
    period: "Sep 2026",
    title: "Student coordinator & official website, Intellect Hack 2026",
    org: "IEEE Reliability Society · SEC SBC, Sri Sairam Engineering College",
    body: "Coordinated INTELLECT HACK 2026 alongside the Design Sprint, Innovate to Impact, Portfolio Workshop and GEN-A-THON, handling registrations, communication, promotions and execution, and designed and built the official event website.",
    tags: ["IEEE", "Event website", "Coordinator"],
    link: "https://github.com/thanishkaykb/Intellect-Hack-2026",
    linkLabel: "Event website",
  },
  {
    period: "2026 onwards",
    title: "MAGIC member at Unnat Bharat Abhiyan",
    org: "Unnat Bharat Abhiyan, Sri Sairam Engineering College",
    body: "As a MAGIC Member of Unnat Bharat Abhiyan at Sri Sairam Engineering College and the Advocate for Sirukalathur, one of the villages associated with our institution, I aspire to be a voice for the community and a catalyst for meaningful change. I believe in understanding grassroots challenges, connecting people with opportunities, and turning ideas into initiatives that create real impact. Through active community engagement, collaboration, and innovative thinking, I hope to contribute to the village's sustainable development, empower its people, and help build a stronger, more inclusive future. For me, this role is more than a responsibility; it is an opportunity to give back to society and be part of a change that truly matters.",
    tags: ["Community", "MAGIC", "UBA"],
  },
  {
    period: "2026 onwards",
    title: "MAGIC member at UiAutomisticx Club",
    org: "UiAutomisticx Club",
    body: "MAGIC member at UiAutomisticx Club, where I am the Mastermind. I will make a big contribution here and drive real change in this club.",
    tags: ["Community", "MAGIC", "UiAutomisticx"],
  },
];

export const yogaCertificate = "/assets/images/yoga-certificate.jpg";

export const honors: { title: string; detail: string; link?: string; linkLabel?: string }[] = [
  {
    title: "2nd Prize, Code Carnival 2K26",
    detail: "SIMATS Engineering · 8-hour hackathon · team lead on CongestiQ AI",
  },
  {
    title: "Guinness World Record attempt",
    detail:
      "Largest Online Yoga World Record · Commemorate the International Day of Yoga, premium edition · 21 June 2026",
    link: yogaCertificate,
    linkLabel: "Certificate",
  },
  {
    title: "Women's Day'26, 2nd Place",
    detail: "Ramp walk, Sri Sairam Engineering College",
  },
  {
    title: "Sparkle'26, 2nd Place",
    detail: "Ramp walk, Sri Sairam Engineering College",
  },
];

export const certifications = [
  { name: "1M1B: Think Beyond", issuer: "IBM" },
  { name: "Introduction to Modern AI", issuer: "Cisco" },
  { name: "Python Concurrent Programming", issuer: "Skillsoft" },
  { name: "Tata GenAI Powered Data Analytics Job Simulation", issuer: "Forage" },
  { name: "TATA Crucible Campus Quiz 2025", issuer: "Tata" },
  { name: "Introduction to Graphic Design · Basics of UI/UX", issuer: "Certifications" },
];

export type PressClipping = { src: string; title: string; meta: string; href: string };

/** Times of India school pages that printed the poems. */
export const pressClippings: PressClipping[] = [
  { src: "/writing/press/press-1.jpg",
    href: "/writing/press/press-1.jpg", title: "Moon", meta: "Dare to Dream · 17 March 2025" },
  { src: "/writing/press/press-2.jpg",
    href: "/writing/press/press-2.jpg", title: "Footprints", meta: "Express Y · The Times of India" },
  {
    src: "/writing/press/press-3.jpg",
    href: "/writing/press/press-3.jpg",
    title: "The Final Bell Rings",
    meta: "Canvas & Verses · 20 February 2025",
  },
  { src: "/writing/press/press-4.jpg",
    href: "/writing/press/press-4.jpg", title: "Colours!", meta: "Express Y · The Times of India" },
  {
    src: "/writing/press/press-5.jpg",
    href: "/writing/press/press-5.jpg",
    title: "Palette of Potential",
    meta: "Express Y · The Times of India",
  },
  { src: "/writing/press/press-6.jpg",
    href: "/writing/press/press-6.jpg", title: "Colours!", meta: "Express Y · 22 January 2025" },
];

export type DrivePoem = { n: number; title: string; href: string };

/** The full numbered collection, one PDF per poem in the shared Drive folder. */
export const drivePoems: DrivePoem[] = [
  { n: 1, title: "Autumn", href: "https://drive.google.com/file/d/1XoV8dv72Kr3YrgICs0Bb3zB_AIIUatmv/view" },
  { n: 2, title: "Scared", href: "https://drive.google.com/file/d/1okHBoX0X-rBWbRz5H021QB10BKpNrnsA/view" },
  { n: 3, title: "Ocean", href: "https://drive.google.com/file/d/12S7ifrOmcRWbdcwcJx-sAtOFvs8O9tkp/view" },
  { n: 4, title: "Dreams", href: "https://drive.google.com/file/d/1D2gGYFbDW6odO4EViVx_OkfFGzFBBOuu/view" },
  { n: 5, title: "You", href: "https://drive.google.com/file/d/1Vxy1rBdrVgaEbdmi9thQiFT13ppWIOVC/view" },
  { n: 6, title: "Moon", href: "https://drive.google.com/file/d/1aPrC6QwwThGUMKCZYyhKPeODxeB8GOCB/view" },
  { n: 7, title: "Tree", href: "https://drive.google.com/file/d/1Zd7MUEdsFtnkC6kspZ0Rs4LBU9u-oMl6/view" },
  { n: 8, title: "Betrayal", href: "https://drive.google.com/file/d/1efYOw16maqjjf59014KqhpwtxXLkN71E/view" },
  { n: 9, title: "What if", href: "https://drive.google.com/file/d/1yaWCl3gODLsMzmkMAQqyjlRpxEmPgzel/view" },
  { n: 10, title: "First", href: "https://drive.google.com/file/d/1PKeAehTJwMULsneMnPhXaabTI7djHOru/view" },
  { n: 11, title: "Stars", href: "https://drive.google.com/file/d/13hoVUhT-dTBr81DUMv-IQEeycOG0EiXk/view" },
  { n: 12, title: "Colours!", href: "https://drive.google.com/file/d/11SntqJEMMbTIxkoJRCXCxjlXu5BCmlJO/view" },
  { n: 13, title: "Trauma", href: "https://drive.google.com/file/d/1ifNsw0dYvn-YzpoGG0_oBz2ksh-qJRid/view" },
  { n: 14, title: "My world", href: "https://drive.google.com/file/d/1hQPBjpENNE1vSlwgIw_SkMbdzV4EhI9H/view" },
  { n: 15, title: "11.11", href: "https://drive.google.com/file/d/1rA2iZ4PP-n2LeM02oeFTtCX88DuRZ9Sn/view" },
  { n: 16, title: "Melody", href: "https://drive.google.com/file/d/1x0HSAuAyFtfQ6YospV_A0Y9_9Zy8ozB4/view" },
  { n: 17, title: "Tree Pt-2", href: "https://drive.google.com/file/d/1C5v19BWvvR_cm5ZllXuqlBGShXAKW_1u/view" },
  { n: 18, title: "Move on", href: "https://drive.google.com/file/d/1qyGA27SiMfn5pnBkNva0XBE-1kdLf1K5/view" },
  { n: 19, title: "Past", href: "https://drive.google.com/file/d/1VnHv29a-7goA3YN7m1sr0aZmaarbabHg/view" },
  { n: 20, title: "Them", href: "https://drive.google.com/file/d/1ufo0d23Q_wT_doqyba0UmqkoGq9VNlKe/view" },
  { n: 21, title: "Stephanie", href: "https://drive.google.com/file/d/15281DbbltNaj1fqlcTfrbY-Z4Sz-9_2D/view" },
  { n: 22, title: "When", href: "https://drive.google.com/file/d/1UmklSFdbzcTInbMjcVEUQBqfUz_7SLQW/view" },
  { n: 23, title: "அவன்", href: "https://drive.google.com/file/d/1FXUzQu33-fjPHb0oGLqkMxvSxMINETNC/view" },
  { n: 24, title: "Footprints", href: "https://drive.google.com/file/d/18CHs5w3SzEJLPK8pOOmrKsFEZr6Z9XM3/view" },
  { n: 25, title: "Lords'", href: "https://drive.google.com/file/d/1DgfuXxyBWarGYMxxOUixvgP55nEMsphW/view" },
  { n: 26, title: "User not found", href: "https://drive.google.com/file/d/1JMGXoS6uTJKyKbf0h-7dijl5SUpezMYR/view" },
  { n: 27, title: "Echoes of heartache", href: "https://drive.google.com/file/d/12mWO34Ly5iT8hrf4F0qMMflg6y_NRwTs/view" },
  { n: 28, title: "The Lost Spring", href: "https://drive.google.com/file/d/1zUfYIPkq6e-BQa0CeHRRntX9ru60ynEB/view" },
  { n: 29, title: "The Downfall", href: "https://drive.google.com/file/d/1WejmBVpkkD6PDFVvsCw-0YThf7zAk5Re/view" },
  { n: 30, title: "Craving the Invisible", href: "https://drive.google.com/file/d/1K40ywfX5DyPudxa9ehStnOQY5pu24nZG/view" },
  { n: 31, title: "Gone, but not forgotten", href: "https://drive.google.com/file/d/12rFETHOLHDR3aRE6i0-5ONnSxOWM-w6j/view" },
  { n: 32, title: "Whispers of the Heart", href: "https://drive.google.com/file/d/1_ns9nr-ydF-54w4hvxMt2sqVYvzPbItN/view" },
  { n: 33, title: "Shattered Heart", href: "https://drive.google.com/file/d/1u4PufQ7QIM9NULKloRFK1JrdxIw8NFce/view" },
  { n: 34, title: "Palette of Potential", href: "https://drive.google.com/file/d/15UtzOJegX8ScQvQrsQmbpgcOYwCT-I2D/view" },
  { n: 35, title: "Future him", href: "https://drive.google.com/file/d/16_FBUlVMz08ZxpQkgjv_bRBgXBu8Yi9t/view" },
  { n: 36, title: "When The Final Bell Rings", href: "https://drive.google.com/file/d/1_GyzkUPJyrsS2K2-C0eK4CLVBzRDpGGS/view" },
  { n: 37, title: "A Love Letter Never Sent", href: "https://drive.google.com/file/d/1zXD5dhowXMm-lrY_xvfZ_GRt2zjlCGuV/view" },
  { n: 38, title: "Still One, Maybe Not", href: "https://drive.google.com/file/d/1zvFTlGHOyUJE63kX8jGiPt8gJwy3kY9y/view" },
  { n: 39, title: "Minutes Before the Earth Speaks", href: "https://drive.google.com/file/d/18501d3E1oPjT-kwJU-q69AbTZ8tjBb6A/view" },
  { n: 40, title: "The Stranger I Once Knew", href: "https://drive.google.com/file/d/1au1vLWVeKeSs8L0TJONLgMGRIf5_AzbL/view" },
  { n: 41, title: "The Colour You Left Behind", href: "https://drive.google.com/file/d/1GvzCzbL3ZPiAwnM9_hCeMsTHu-CwtvZ_/view" },
  { n: 42, title: "Uncounted", href: "https://drive.google.com/file/d/1aUPMhhyuuZl39OXYy3ezIpe2pAmVyfIY/view" },
];
