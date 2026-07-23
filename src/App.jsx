import { useEffect, useRef, useState, useCallback, Suspense, Component } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Lanyard from './components/Lanyard/Lanyard';

gsap.registerPlugin(ScrollTrigger);

/* ===== ERROR BOUNDARY for 3D ===== */
class LanyardErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { console.error('Lanyard error:', err, info); }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/* ===== SVG Arrow Icon ===== */
const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ===== DATA (from resume) ===== */
const MARQUEE_ITEMS_1 = ['FULL-STACK DEVELOPMENT', 'UI/UX DESIGN', 'REACT & NEXT.JS', 'NODE.JS & EXPRESS', 'AI / ML TOOLS', 'MONGODB & SQL', 'FIGMA & PROTOTYPING', 'DEVOPS & CI/CD'];
const MARQUEE_ITEMS_2 = ['WORDPRESS', 'PYTHON', 'DOCKER', 'TAILWIND CSS', 'TENSORFLOW', 'GIT & GITHUB', 'REST APIs', 'NLP & OPENCV'];

const PROJECTS = [
  {
    title: 'Fact', titleAccent: 'Matrix',
    desc: 'Real-time fake news detection web app using NLP and multiple news APIs to cross-reference article credibility. Sub-2s detection response time with NLP pipeline analyzing text patterns across 5+ sources.',
    tags: ['React.js', 'Node.js', 'Express', 'MongoDB', 'NLP'],
    year: '2026', type: 'AI / Full-Stack', accent: 'pink', label: '01'
  },
  {
    title: 'Phish', titleAccent: 'Guard',
    desc: 'AI-powered phishing detection system using ML models to analyze URLs, email headers, and web content in real-time. Trained on 50,000+ samples achieving 94% accuracy. Selected for Smart India Hackathon.',
    tags: ['Python', 'Flask', 'React', 'ML', 'SIH'],
    year: '2026', type: 'AI / Cybersecurity', accent: 'blue', label: '02'
  },
  {
    title: 'Secure', titleAccent: 'Nest',
    desc: 'Security-first MERN stack application with JWT authentication, bcrypt password hashing, encrypted data storage, and role-based access control (RBAC) for sensitive user data.',
    tags: ['React', 'Node.js', 'MongoDB', 'JWT', 'RBAC'],
    year: '2025', type: 'Full-Stack App', accent: 'yellow', label: '03'
  },
  {
    title: 'Pure', titleAccent: 'Vital',
    desc: 'Wellness platform designed and built in React with a full Figma design system — components, variants, and user flows. Consistent design language across 15+ screens with accessibility focus.',
    tags: ['React', 'Figma', 'UI/UX', 'Design System'],
    year: '2025', type: 'UI/UX Design', accent: 'green', label: '04'
  },
];

const SKILLS = [
  { title: 'Frontend', icon: '◈', color: 'pink', pills: ['React.js', 'JavaScript', 'HTML/CSS', 'GSAP', 'Tailwind CSS', 'Framer'], className: 'skill-group--large' },
  { title: 'Backend', icon: '⬡', color: 'blue', pills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'MERN Stack'] },
  { title: 'AI / ML', icon: '◇', color: 'yellow', pills: ['Python', 'TensorFlow', 'MediaPipe', 'OpenCV', 'NLP'] },
  { title: 'Design', icon: '△', color: 'pink', pills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'User Flows'], className: 'skill-group--wide' },
  { title: 'DevOps & Tools', icon: '⬢', color: 'green', pills: ['Docker', 'Jenkins', 'SonarQube', 'Nagios', 'Git', 'GitHub'] },
  { title: 'Languages', icon: '⟐', color: 'blue', pills: ['JavaScript', 'Python', 'Java', 'C/C++', 'SQL'] },
];

const EXPERIENCE = [
  {
    role: 'Data Analyst Intern',
    company: 'MuSo — Museum of Solutions',
    note: 'a JSW Initiative · Current',
    date: 'Apr 2026 — Present',
    color: 'pink',
    details: [
      'Analyzing operational and visitor data to derive actionable insights supporting strategic decision-making at a JSW-backed innovation initiative',
      'Building dashboards and visual reports using Python and data visualization tools to track key performance metrics',
      'Collaborating with cross-functional teams to identify data trends, patterns, and opportunities for process improvement',
      'Assisting in data cleaning, transformation, and pipeline development to ensure data quality and reliability',
    ]
  },
  {
    role: 'WordPress Developer Intern',
    company: 'DigiFalx — Digital Beginnings',
    note: '',
    date: 'Feb 2025 — Jan 2026',
    color: 'blue',
    details: [
      'Developed and maintained client websites, customizing themes/plugins and ensuring cross-browser compatibility',
      'Optimized site performance and implemented SEO best practices — reduced average page load by ~30%',
      'Collaborated with design and dev team to troubleshoot issues and deliver responsive, accessible web experiences',
    ]
  },
  {
    role: 'Business Analyst Intern',
    company: 'Hatmedia',
    note: '',
    date: 'Mar 2024 — Dec 2024',
    color: 'yellow',
    details: [
      'Assisted project managers in planning and executing projects, ensuring adherence to timelines and deliverables',
      'Monitored project budgets, tracked expenses, and prepared financial reports to ensure cost-effectiveness',
    ]
  },
  {
    role: 'PR Member — E-Cell',
    company: 'Shah & Anchor Kutchhi Engineering College',
    note: '',
    date: 'Jun 2023 — Nov 2023',
    color: 'green',
    details: [
      'Led PR and communications for entrepreneurship cell events, managing outreach to 500+ student community',
      'Developed marketing campaigns and prepared effectiveness reports using survey and focus group data',
    ]
  },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef(null);
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  // ===== PRELOADER =====
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    const chars = document.querySelectorAll('.preloader-char');
    const dot = document.querySelector('.preloader-dot');
    const counter = document.querySelector('.preloader-counter');
    const fill = document.getElementById('preloader-fill');
    const countSpan = document.getElementById('preloader-count');
    if (!preloader || !fill || !countSpan) { setLoaded(true); return; }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(preloader, {
          yPercent: -100, duration: 0.8, ease: 'power3.inOut', delay: 0.2,
          onComplete: () => { preloader.style.display = 'none'; setLoaded(true); }
        });
      }
    });
    tl.to(chars, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    tl.to(dot, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.3');
    tl.to(counter, { opacity: 1, duration: 0.3 }, '-=0.2');
    tl.to({}, { duration: 1.2, ease: 'power2.inOut', onUpdate() { const p = Math.round(this.progress() * 100); countSpan.textContent = p; fill.style.width = p + '%'; } });
    tl.to(chars[0], { x: -30, opacity: 0, duration: 0.4, ease: 'power2.in' });
    tl.to(chars[1], { x: 30, opacity: 0, duration: 0.4, ease: 'power2.in' }, '<');
    tl.to([dot, counter, document.querySelector('.preloader-bar')], { opacity: 0, duration: 0.3, ease: 'power2.in' }, '<');
  }, []);

  // ===== LENIS + GSAP =====
  useEffect(() => {
    if (!loaded) return;
    const lenis = new Lenis({ duration: 1.0, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.8 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, [loaded]);

  // ===== CURSOR =====
  useEffect(() => {
    if (!loaded || window.innerWidth <= 768) return;
    let mouseX = 0, mouseY = 0, cX = 0, cY = 0, fX = 0, fY = 0;
    const onMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    document.addEventListener('mousemove', onMove);
    const tickCb = () => {
      cX += (mouseX - cX) * 0.2; cY += (mouseY - cY) * 0.2;
      fX += (mouseX - fX) * 0.08; fY += (mouseY - fY) * 0.08;
      if (cursorRef.current) gsap.set(cursorRef.current, { x: cX, y: cY });
      if (followerRef.current) gsap.set(followerRef.current, { x: fX, y: fY });
    };
    gsap.ticker.add(tickCb);
    return () => { document.removeEventListener('mousemove', onMove); gsap.ticker.remove(tickCb); };
  }, [loaded]);

  // ===== ANIMATIONS =====
  useEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      // Hero
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl.to('#hero-name-1', { y: 0, duration: 1, ease: 'power3.out' });
      heroTl.to('#hero-name-2', { y: 0, duration: 1, ease: 'power3.out' }, '-=0.7');
      heroTl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5');
      heroTl.to('.hero-bottom', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
      heroTl.to('.scroll-indicator', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3');

      // Nav
      gsap.to('#nav', { y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.hero', start: '80% top', toggleActions: 'play none none reverse' } });

      // Hero parallax
      gsap.to('.hero-content', { opacity: 0, y: -50, scrollTrigger: { trigger: '.hero', start: '60% top', end: 'bottom top', scrub: 1 } });

      // About text reveals
      document.querySelectorAll('.about .text-reveal > *').forEach(el => {
        gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } });
      });

      // Stats
      document.querySelectorAll('.stat-number[data-count]').forEach(el => {
        gsap.to(el, { textContent: parseInt(el.getAttribute('data-count')), duration: 1.5, ease: 'power2.out', snap: { textContent: 1 }, scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' } });
      });
      gsap.from('.stat-card', { y: 40, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: '.about-stats-col', start: 'top 80%', toggleActions: 'play none none none' } });

      // Projects horizontal scroll
      const track = document.getElementById('projects-track');
      if (track) {
        const totalScroll = track.scrollWidth - window.innerWidth + 100;
        gsap.to(track, { x: () => -totalScroll, ease: 'none', scrollTrigger: { trigger: '.projects', start: 'top 10%', end: () => `+=${totalScroll}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
      }

      // Section headers
      document.querySelectorAll('.section-header').forEach(h => {
        gsap.from(h, { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: h, start: 'top 80%', toggleActions: 'play none none none' } });
      });
      document.querySelectorAll('.section-line').forEach(line => {
        gsap.from(line, { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'power2.out', scrollTrigger: { trigger: line, start: 'top 85%', toggleActions: 'play none none none' } });
      });

      // Skills
      gsap.from('.skill-group', { y: 50, opacity: 0, duration: 0.6, stagger: { amount: 0.4 }, ease: 'power2.out', scrollTrigger: { trigger: '.skills-bento', start: 'top 80%', toggleActions: 'play none none none' } });

      // Experience
      gsap.from('.exp-item', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.exp-list', start: 'top 80%', toggleActions: 'play none none none' } });
      gsap.from('.edu-card, .certs-card', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.edu-certs', start: 'top 85%', toggleActions: 'play none none none' } });

      // Contact
      document.querySelectorAll('.contact .text-reveal > *').forEach((el, i) => {
        gsap.to(el, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.contact-heading', start: 'top 80%', toggleActions: 'play none none none' } });
      });
      gsap.from('.contact-email-btn', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.contact-details', start: 'top 85%', toggleActions: 'play none none none' } });
      gsap.from('.contact-link', { y: 20, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.contact-links', start: 'top 90%', toggleActions: 'play none none none' } });

      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
  }, [loaded]);

  // ===== SCROLL NAV =====
  const scrollTo = useCallback((id) => {
    const el = document.querySelector(id);
    if (el && lenisRef.current) lenisRef.current.scrollTo(el, { offset: -80 });
  }, []);

  // ===== ACCORDION =====
  const [activeExp, setActiveExp] = useState(null);
  const toggleExp = (i) => setActiveExp(activeExp === i ? null : i);

  // ===== CURSOR HOVER =====
  const onHoverEnter = () => document.body.classList.add('cursor-hover');
  const onHoverLeave = () => document.body.classList.remove('cursor-hover');

  // ===== MARQUEE RENDERER =====
  const MarqueeContent = ({ items, sep = '◆' }) => (
    <div className="marquee-content">
      {items.map((item, i) => (
        <span key={i}><span className="marquee-item">{item}</span><span className="marquee-sep">{sep}</span></span>
      ))}
    </div>
  );

  return (
    <>
      {/* Noise */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Cursor */}
      <div className="cursor" ref={cursorRef} id="cursor" />
      <div className="cursor-follower" ref={followerRef} id="cursor-follower" />

      {/* Preloader */}
      <div className="preloader" id="preloader">
        <div className="preloader-inner">
          <div className="preloader-text">
            <span className="preloader-char">P</span>
            <span className="preloader-char">A</span>
            <span className="preloader-dot">.</span>
          </div>
          <div className="preloader-bar"><div className="preloader-bar-fill" id="preloader-fill" /></div>
          <div className="preloader-counter"><span className="preloader-percent" id="preloader-count">0</span>%</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav" id="nav">
        <a className="nav-logo" href="#" onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
          PA<span className="nav-logo-dot">.</span>
        </a>
        <div className="nav-links">
          {['about', 'work', 'skills', 'experience', 'contact'].map(s => (
            <a key={s} className="nav-link" href={`#${s}`} onClick={(e) => { e.preventDefault(); scrollTo(`#${s}`); }}
               onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
          <a className="nav-cta" href="mailto:avhadparth04@gmail.com" onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
            Let's Talk <ArrowIcon />
          </a>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        <div className="hero-shape hero-shape--circle" />
        <div className="hero-shape hero-shape--ring" />
        <div className="hero-shape hero-shape--blob" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AVAILABLE FOR WORK
          </div>

          <div className="hero-name-wrapper">
            <div className="hero-name-line">
              <h1 className="hero-name" id="hero-name-1">PARTH</h1>
            </div>
            <div className="hero-name-line hero-name-line-2">
              <h1 className="hero-name" id="hero-name-2">AVHAD</h1>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-tagline">
              <p className="hero-tagline-line">
                Crafting <em className="highlight-pink">digital experiences</em> that merge{' '}
                <em className="highlight-blue">design thinking</em> with{' '}
                <em className="highlight-yellow">technical excellence</em>.
              </p>
            </div>
            <div className="hero-roles">
              <span>Developer</span>
              <span className="hero-role-sep">◆</span>
              <span>Designer</span>
              <span className="hero-role-sep">◆</span>
              <span>Creator</span>
            </div>
          </div>
        </div>

        {/* 3D Lanyard Badge — wrapped in ErrorBoundary so crashes don't kill the page */}
        <LanyardErrorBoundary>
          <Suspense fallback={<div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, color: '#555', fontSize: 14, letterSpacing: '0.1em' }}>Loading 3D...</div>}>
            <Lanyard
              position={[0, 0, 20]}
              gravity={[0, -40, 0]}
              frontImage="/card-front.png"
              backImage="/card-back.png"
              imageFit="cover"
            />
          </Suspense>
        </LanyardErrorBoundary>

        <div className="scroll-indicator">
          <div className="scroll-indicator-line" />
          <span className="scroll-indicator-text">SCROLL</span>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section className="marquee-section" aria-hidden="true">
        <div className="marquee-track marquee-track--forward">
          <MarqueeContent items={MARQUEE_ITEMS_1} />
          <MarqueeContent items={MARQUEE_ITEMS_1} />
        </div>
        <div className="marquee-track marquee-track--reverse">
          <MarqueeContent items={MARQUEE_ITEMS_2} sep="◇" />
          <MarqueeContent items={MARQUEE_ITEMS_2} sep="◇" />
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="about" id="about">
        <div className="section-header">
          <span className="section-number">01</span>
          <span className="section-label">About</span>
          <div className="section-line" />
        </div>
        <div className="about-grid">
          <div className="about-text-col">
            <div className="about-intro text-reveal">
              <h2 className="about-large-text">
                I build things for the web that look <span className="highlight-pink">beautiful</span> and work <span className="highlight-blue">flawlessly</span>.
              </h2>
            </div>
            <div className="about-body text-reveal">
              <p>B.Tech Information Technology student at <span className="highlight-yellow">SAKEC, Mumbai University</span>, with hands-on experience in full-stack development, UI/UX design, and DevOps.</p>
              <p>Passionate about building products that are both <span className="highlight-pink">technically solid</span> and <span className="highlight-blue">visually sharp</span> — from MERN stack applications to AI/ML-powered tools. Currently interning as a Data Analyst while actively shipping personal projects.</p>
            </div>
          </div>
          <div className="about-stats-col">
            <div className="stat-card stat-card--pink" onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
              <span className="stat-number" data-count="15">0</span><span className="stat-suffix">+</span>
              <span className="stat-label">Projects built & shipped</span>
            </div>
            <div className="stat-card stat-card--blue" onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
              <span className="stat-number" data-count="4">0</span><span className="stat-suffix">+</span>
              <span className="stat-label">Internships & work experience</span>
            </div>
            <div className="stat-card stat-card--yellow" onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
              <span className="stat-number stat-number--symbol">∞</span>
              <span className="stat-label">Curiosity & drive to learn</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROJECTS ===== */}
      <section className="projects" id="work">
        <div className="section-header">
          <span className="section-number">02</span>
          <span className="section-label">Selected Work</span>
          <div className="section-line" />
        </div>
        <div className="projects-horizontal-wrapper">
          <div className="projects-track" id="projects-track">
            {PROJECTS.map((p, i) => (
              <div key={i} className="project-card" data-accent={p.accent} onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
                <div className="project-card-bg" />
                <div className="project-card-content">
                  <div className="project-card-top">
                    <span className="project-year">{p.year}</span>
                    <span className="project-type">{p.type}</span>
                  </div>
                  <div>
                    <h3 className="project-title">{p.title}<span className="project-title-accent">{p.titleAccent}</span></h3>
                    <p className="project-desc">{p.desc}</p>
                    <div className="project-tags">{p.tags.map(t => <span key={t} className="project-tag">{t}</span>)}</div>
                    <a className="project-cta" href="#">View Project <ArrowIcon /></a>
                  </div>
                </div>
                <div className="project-card-visual">
                  <div className="project-visual-shape project-visual-shape--1" />
                  <div className="project-visual-shape project-visual-shape--2" />
                  <div className="project-visual-shape project-visual-shape--3" />
                  <div className="project-visual-label">{p.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SKILLS ===== */}
      <section className="skills" id="skills">
        <div className="section-header">
          <span className="section-number">03</span>
          <span className="section-label">Toolkit</span>
          <div className="section-line" />
        </div>
        <div className="skills-bento">
          {SKILLS.map((g, i) => (
            <div key={i} className={`skill-group ${g.className || ''}`} data-color={g.color} onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
              <div className="skill-group-header">
                <span className="skill-group-icon">{g.icon}</span>
                <span className="skill-group-title">{g.title}</span>
              </div>
              <div className="skill-pills">{g.pills.map(p => <span key={p} className="skill-pill">{p}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section className="experience" id="experience">
        <div className="section-header">
          <span className="section-number">04</span>
          <span className="section-label">Experience</span>
          <div className="section-line" />
        </div>
        <div className="exp-list">
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className={`exp-item ${activeExp === i ? 'active' : ''}`} data-color={exp.color}>
              <div className="exp-item-header" onClick={() => toggleExp(i)} onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
                <div className="exp-item-left">
                  <h3 className="exp-role">{exp.role}</h3>
                  <span className="exp-company">{exp.company} {exp.note && <span className="exp-company-note">· {exp.note}</span>}</span>
                </div>
                <span className="exp-date">{exp.date}</span>
                <button className="exp-toggle" aria-label="Toggle details"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
              </div>
              <div className="exp-item-body">
                <ul className="exp-details">{exp.details.map((d, j) => <li key={j}>{d}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>

        <div className="edu-certs">
          <div className="edu-card" onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
            <span className="edu-icon">🎓</span>
            <div>
              <h4 className="edu-degree">B.Tech Information Technology</h4>
              <p className="edu-school">Shah & Anchor Kutchhi Engineering College (SAKEC)</p>
              <span className="edu-year">2023 — Present · Mumbai University</span>
            </div>
          </div>
          <div className="certs-card" onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
            <span className="certs-icon">📜</span>
            <div>
              <h4 className="certs-title">Certifications</h4>
              <div className="certs-list">
                {['UI/UX Essentials — Udemy', 'Business Analyst — Cisco'].map(c => <span key={c} className="cert-badge">{c}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="contact" id="contact">
        <div className="contact-bg-text" aria-hidden="true">HELLO</div>
        <div className="contact-content">
          <div className="contact-heading text-reveal">
            <span className="contact-line">Let's work</span>
            <span className="contact-line contact-line--accent">together.</span>
          </div>
          <div className="contact-details">
            <a className="contact-email-btn" href="mailto:avhadparth04@gmail.com" onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
              <span className="contact-email-text">avhadparth04@gmail.com</span>
              <span className="contact-email-arrow"><ArrowIcon /></span>
            </a>
            <div className="contact-links">
              {[
                { label: 'GitHub', href: 'https://github.com/AvhadParth' },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/parth-avhad' },
                { label: 'Portfolio', href: 'https://parths-portfolio.vercel.app/' },
                { label: '+91 8433591056', href: 'tel:+918433591056' },
              ].map(l => (
                <a key={l.label} className="contact-link" href={l.href} target="_blank" rel="noopener noreferrer" onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
                  {l.label} <ArrowIcon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-inner">
          <span>© 2026 Parth Avhad</span>
          <span>Built with <span className="footer-heart">♥</span> and way too much coffee</span>
          <span>Mumbai, India</span>
        </div>
      </footer>
    </>
  );
}
