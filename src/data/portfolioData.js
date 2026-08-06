export const magazineIssueData = {
  issueNumber: "ISSUE 001",
  volume: "VOL. 01",
  date: "AUGUST 2026",
  price: "$28.00 USD",
  title: "PARTH AVHAD",
  subtitle: "The Creative Engineering & Data Craft of Parth Avhad",
  editor: "PARTH AVHAD",
  location: "MUMBAI, INDIA",
  contact: {
    phone: "+91 8433591056",
    email: "avhadparth04@gmail.com",
    linkedin: "https://linkedin.com/in/parthavhad/",
    github: "https://github.com/AvhadParth",
    location: "Mumbai, India"
  },
  toc: [
    { number: "01", label: "EDITOR'S NOTE", title: "On Code & Crafts", page: "04" },
    { number: "02", label: "CHRONICLES", title: "Industry Roles & Field Work", page: "08" },
    { number: "03", label: "FEATURE STORIES", title: "Selected Works & Architecture", page: "14" },
    { number: "04", label: "CURATED CATALOG", title: "Engineering Specimen Sheet", page: "22" },
    { number: "05", label: "CORRESPONDENCE", title: "Editorial Board & Inquiry Line", page: "28" }
  ],
  editorsLetter: {
    headline: "THE CREATIVE ENGINEER",
    subhead: "Where Machine Intelligence, Defensive Security, and High Craft Intersect.",
    bodyParagraphs: [
      "Welcome to 'PARTH AVHAD' Issue 001—an annual publication documenting my engineering craft.",
      "From training NLP models to detect misinformation in under 2 seconds, to building 94%-accurate ML classifiers for Smart India Hackathon finalists, my work bridges raw data pipelines with intuitive human interfaces."
    ],
    signature: "Parth Avhad",
    role: "Editor-in-Chief & Creative Engineer"
  },
  projects: [
    {
      id: "factmatrix",
      featureNumber: "01",
      year: "2026",
      title: "FactMatrix",
      subtitle: "Real-Time Misinformation & Credibility Detection Engine",
      category: "NLP / MERN STACK",
      metricValue: "< 2.0s",
      metricLabel: "Detection Latency",
      coverImage: "/images/fact_matrix_editorial.png",
      abstract: "Analyzes live news streams using custom NLP pipelines and multi-source cross-referencing to calculate credibility scores in under two seconds.",
      challenge: "High-volume feed processing with sub-2s response latency.",
      architecture: [
        "React.js high-density editorial UI",
        "Node.js & Express RESTful API gateway",
        "NLP Sentiment & Credibility Engine",
        "MongoDB vector storage"
      ],
      outcome: "Sub-2s response time across 10+ concurrent news APIs.",
      techStack: ["React.js", "Node.js", "Express", "MongoDB", "Python NLP"],
      githubUrl: "https://github.com/AvhadParth",
      liveDemoUrl: "https://github.com/AvhadParth",
      quote: "Truth is not a static statement; it is a dynamic graph of verified signals."
    },
    {
      id: "phishguard",
      featureNumber: "02",
      year: "2025",
      title: "PhishGuard",
      subtitle: "ML Defensive System for Phishing & Threat Detection",
      category: "MACHINE LEARNING / CYBERSECURITY",
      metricValue: "94.0%",
      metricLabel: "Classification Accuracy",
      coverImage: "/images/fact_matrix_editorial.png",
      abstract: "Selected for Smart India Hackathon (SIH). Engineered to detect malicious links, deceptive email headers, and social engineering payloads in real-time.",
      challenge: "Classifying zero-day URL obfuscation across 50k+ dataset.",
      architecture: [
        "Python & Flask microservice backend",
        "Scikit-Learn Random Forest Classifier (50k+ samples)",
        "React security inspection dashboard",
        "Feature extraction engine for URL entropy"
      ],
      outcome: "94% accuracy across 50,000+ benchmark phishing vectors. SIH Finalist.",
      techStack: ["Python", "Flask", "React", "Scikit-Learn", "pandas"],
      githubUrl: "https://github.com/AvhadParth",
      liveDemoUrl: "https://github.com/AvhadParth",
      quote: "In security, defense must adapt faster than deception."
    },
    {
      id: "securenext",
      featureNumber: "03",
      year: "2025",
      title: "SecureNext",
      subtitle: "Security-First Application Architecture & RBAC Layer",
      category: "FULL-STACK SECURITY",
      metricValue: "JWT + RBAC",
      metricLabel: "Security Standard",
      coverImage: "/images/fact_matrix_editorial.png",
      abstract: "Enterprise MERN stack application template built to mitigate OWASP Top 10 vulnerabilities through defense-in-depth security principles.",
      challenge: "Enforcing granular RBAC and stateless session security.",
      architecture: [
        "Cryptographic password hashing via Bcrypt",
        "Stateless session management via HttpOnly JWT",
        "Role-Based Access Control (RBAC) middleware",
        "MongoDB encrypted storage layers"
      ],
      outcome: "Zero unauthenticated data leaks in penetration benchmarks.",
      techStack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Bcrypt"],
      githubUrl: "https://github.com/AvhadParth",
      liveDemoUrl: "https://github.com/AvhadParth",
      quote: "Security is the foundation upon which everything rests."
    }
  ],
  skillsCatalog: {
    languages: ["Java", "Python", "C / C++", "SQL (PostgreSQL)", "JavaScript", "HTML5 / CSS3"],
    frameworks: ["React.js", "Node.js / Express", "FastAPI", "Flask", "WordPress", "Material-UI"],
    devTools: ["Git & GitHub", "Docker", "TravisCI", "Google Cloud Platform", "VS Code", "PyCharm", "IntelliJ IDEA"],
    designTools: ["Figma", "UI/UX Design", "Wireframing", "Prototyping", "User Flows"],
    dataLibraries: ["pandas", "NumPy", "Matplotlib", "Scikit-Learn", "Data Pipelines"]
  },
  experienceChronicles: [
    {
      period: "APRIL 2026 – PRESENT",
      role: "Data Analyst Intern",
      company: "MuSo (Museum of Solutions) — JSW Initiative",
      location: "Worli, Mumbai",
      details: [
        "Analyzing operational & visitor data supporting strategic decisions at JSW initiative.",
        "Building executive dashboards in Python tracking key performance metrics.",
        "Developing ETL data pipelines ensuring high quality and reliability."
      ]
    },
    {
      period: "FEB 2025 – JAN 2026",
      role: "WordPress Developer Intern",
      company: "DigiFalx - Digital Beginnings",
      location: "Sanpada, Navi Mumbai",
      details: [
        "Customized client themes/plugins ensuring cross-browser compatibility.",
        "Optimized site performance & SEO, reducing average page load by 30%.",
        "Delivered responsive, accessible web experiences."
      ]
    },
    {
      period: "MAR 2024 – DEC 2024",
      role: "Business Analyst Intern",
      company: "Hatmedia",
      location: "Andheri, Mumbai",
      details: [
        "Assisted project managers in planning/executing technical projects.",
        "Monitored project budgets and prepared financial reports."
      ]
    }
  ],
  education: [
    {
      institution: "Shah and Anchor Kutchhi Engineering College",
      degree: "B.E. Information Technology",
      location: "Chembur, Mumbai",
      period: "Aug 2023 – Present",
      status: "IN PROGRESS (FINAL YEAR)",
      isCompleted: false,
      score: "CGPA: 9.12 / 10"
    },
    {
      institution: "B.N.B College of Science",
      degree: "12th Science",
      location: "Thane, Mumbai",
      period: "Aug 2021 – May 2023",
      status: "COMPLETED",
      isCompleted: true,
      score: "PERCENTAGE: 80.0%"
    }
  ]
};
