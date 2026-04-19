import calculatorProjectImage from "../assets/cal.png";
import todoProjectImage from "../assets/todo.png";
import mstArenaProjectImage from "../assets/mst-arena.svg";

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
  { id: "resume", label: "Resume" },
];

export const initialSkills = {
  blender: 78,
  frontend: 88,
  backend: 76,
  figma: 72,
  aiml: 69,
};

export const skillLabels = {
  blender: "Blender",
  frontend: "Frontend",
  backend: "Backend",
  figma: "Figma",
  aiml: "AI/ML",
};

export const homeRoleTitles = ["AI/ML Developer", "Web Developer", "3D Designer"];

export const resumeViewUrl =
  "https://drive.google.com/file/d/13r3uT4NFg6SApoWRpcuo1IGNv7GhzwLz/view?usp=drivesdk";

export const resumeDownloadUrl =
  "https://drive.google.com/uc?export=download&id=13r3uT4NFg6SApoWRpcuo1IGNv7GhzwLz";

export const profileLinks = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/1Nitin1",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/in/nitin-baranwal0510",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    url: "https://leetcode.com/u/CodeZGod",
  },
  {
    id: "codeforces",
    label: "Codeforces",
    url: "https://codeforces.com/profile/CodeXGod",
  },
  {
    id: "codechef",
    label: "CodeChef",
    url: "https://www.codechef.com/users/codexgod",
  },
  {
    id: "x",
    label: "X",
    url: "https://x.com/100Nitin100",
  },
];

export const projectCards = [
  {
    id: "calculator",
    title: "Calculator App",
    description:
      "A clean and responsive calculator web app for fast arithmetic operations with a simple, user-friendly interface.",
    image: calculatorProjectImage,
    imageAlt: "Calculator project preview",
    liveUrl: "https://calculator-ten-pi-89.vercel.app/",
  },
  {
    id: "todo",
    title: "Todo App",
    description:
      "A lightweight task manager that helps track daily work with add, update, and completion-focused todo workflows.",
    image: todoProjectImage,
    imageAlt: "Todo app project preview",
    liveUrl: "https://todo-app-iota-flax.vercel.app/",
  },
  {
    id: "mst-arena",
    title: "MST Arena",
    description:
      "A graph-based game to learn Minimum Spanning Tree strategies with two playable modes: Prim and Kruskal.",
    image: mstArenaProjectImage,
    imageAlt: "MST Arena project preview",
    liveUrl: "https://minimum-spanning-tree-game.vercel.app/",
  },
];

export const skillDomains = [
  {
    id: "design",
    title: "Design",
    summary:
      "I design product-ready interfaces and 3D visuals focused on clarity, consistency, and developer handoff.",
    cards: [
      {
        name: "Design Toolkit",
        level: "Product UI + 3D",
        description:
          "Using Figma and Blender, I build reusable UI patterns, interactive prototypes, and optimized GLB assets for modern web apps and portfolio experiences.",
      },
    ],
  },
  {
    id: "aiml",
    title: "AI/ML",
    summary:
      "I build practical ML workflows that move from clean data to measurable model performance.",
    cards: [
      {
        name: "AI/ML Toolkit",
        level: "Data + Model Workflow",
        description:
          "I use Python and TensorFlow for preprocessing, training, and evaluation, with experiments tracked through metrics, validation splits, and iterative tuning.",
      },
    ],
  },
  {
    id: "web-dev",
    title: "Web Development",
    summary:
      "I build full-stack web products with responsive UI, scalable APIs, and deployment-ready architecture.",
    cards: [
      {
        name: "Web Dev Toolkit",
        level: "Modern Full-Stack Core",
        description:
          "With React, Node.js, and Express, I ship feature-driven apps with clean component architecture, REST APIs, authentication-ready patterns, and cloud-friendly deployment flow.",
      },
    ],
  },
];

export const growthTimeline = [
  {
    date: "2022",
    title: "Class 10 Achievement",
    detail:
      "Scored 97% in Class 10 with 100 marks in both Mathematics and Science.",
  },
  {
    date: "2024",
    title: "Class 12 Achievement",
    detail: "Scored 98% in Class 12 with 100 in Mathematics and 99 in Science.",
  },
  {
    date: "April 2024",
    title: "JEE Main",
    detail: "Secured 96 percentile in JEE Main.",
  },
  {
    date: "May 2024",
    title: "JEE Advanced",
    detail: "Secured AIR 11784 in JEE Advanced.",
  },
  {
    date: "July 2024",
    title: "Started Java",
    detail: "Began learning Java and core problem-solving fundamentals.",
  },
  {
    date: "August 2024",
    title: "CS Degree",
    detail:
      "Started B.Tech in Computer Science at Maharaja Surajmal Institute of Technology.",
  },
  {
    date: "September 2024",
    title: "DSA & CP Journey",
    detail:
      "Started learning and practicing Data Structures, Algorithms, and Competitive Programming.",
  },
  {
    date: "September 2024",
    title: "Geek Room Society",
    detail: "Joined Geek Room Society in the DSA department.",
  },
  {
    date: "October 2024",
    title: "HackWithMAIT 5.0",
    detail: "Participated and reached Top 20 rank.",
  },
  {
    date: "February 2025",
    title: "Frontend Development",
    detail:
      "Started learning frontend development and building interactive web interfaces.",
  },
  {
    date: "March 2025",
    title: "Power BI",
    detail: "Learned Power BI for analytics and dashboard storytelling.",
  },
  {
    date: "April 2025",
    title: "C Programming",
    detail: "Learned C language and low-level programming basics.",
  },
  {
    date: "August 2025",
    title: "C++ Programming",
    detail: "Learned C++ for advanced DSA and competitive programming.",
  },
  {
    date: "September 2025",
    title: "Codeforces Pupil",
    detail: "Reached Codeforces Pupil rank.",
  },
  {
    date: "September 2025",
    title: "CodeChef 3★",
    detail: "Achieved 3-star rating on CodeChef.",
  },
  {
    date: "October 2025",
    title: "HackWithMAIT 6.0",
    detail: "Participated and reached Top 20 rank.",
  },
  {
    date: "October 2025",
    title: "MSC Society",
    detail: "Joined MSC Society in the DSA department.",
  },
  {
    date: "October 2025",
    title: "TechSoc",
    detail: "Joined TechSoc in the Technical department.",
  },
  {
    date: "2025",
    title: "SIH Semi-Finals",
    detail: "Selected in Smart India Hackathon semi-finals.",
  },
  {
    date: "November 2025",
    title: "Python for Data Science",
    detail: "Learned Python and key libraries for data science workflows.",
  },
  {
    date: "January 2026",
    title: "LeetCode Knight",
    detail: "Reached LeetCode Knight level.",
  },
  {
    date: "January 2026",
    title: "Blender & Figma",
    detail: "Learned Blender and Figma for design and 3D workflows.",
  },
  {
    date: "January 2026",
    title: "3D Web Development",
    detail: "Learned 3D web development and interactive scene building.",
  },
  {
    date: "February 2026",
    title: "AI/ML Learning",
    detail: "Started learning AI/ML with practical experimentation.",
  },
  {
    date: "February 2026",
    title: "Backend & Databases",
    detail: "Learned backend development and database fundamentals.",
  },
  {
    date: "2026",
    title: "AlgoQuest Winner",
    detail:
      "Secured 3rd place in the DSA hackathon AlgoQuest out of 180+ participants.",
  },
];
