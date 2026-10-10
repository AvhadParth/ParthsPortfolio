/**
 * Portfolio content — edit this file to update the gallery.
 *
 * Project fields
 *  - id           unique slug
 *  - title        card + case-study title
 *  - category     short discipline label shown as a tag
 *  - year         optional; leave '' to hide
 *  - summary      one-line description (case-study intro)
 *  - description  optional longer paragraph
 *  - technologies list of tools; leave [] to hide the section
 *  - links        [{ label, href }]; leave [] to hide
 *  - video        optional scrolling screen recording (MP4, 1280×752). Plays on the 3D
 *                 card and leads the case study.
 *  - poster       still frame shown while the video loads (and for reduced motion).
 *  - cover        image for the card when there is no video (landscape ~1.7:1).
 *                 Leave null to render a generated typographic placeholder.
 *  - gallery      images for the case-study column (after the video).
 *  - palette      [background, accent, ink] for generated placeholders.
 *
 * Put media in /public/videos/projects/ and /public/images/projects/.
 */

export const profile = {
  name: 'Parth Avhad',
  role: 'Creative Developer',
  location: 'Mumbai, India',
  // One line shown on the landing view, so visitors know who this is straight away.
  tagline: 'Creative developer in Mumbai, building immersive websites and e-commerce.',
  bio: 'Parth Avhad is a creative developer and Information Technology engineer based in Mumbai, building immersive, motion-driven websites and data-informed products — from 3D e-commerce experiences to applied AI research.',
  highlights: 'B.E. Information Technology · Mumbai',
  email: 'avhadparth04@gmail.com',
  resume: '/PARTHRESUME.pdf',
  links: [
    { label: 'GitHub', href: 'https://github.com/AvhadParth' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/parthavhad/' },
    { label: 'Email', href: 'mailto:avhadparth04@gmail.com' },
  ],
  // Most recent first.
  experience: [
    {
      role: 'Data Analyst Intern',
      company: 'MuSo (Museum of Solutions), a JSW initiative',
      location: 'Worli, Mumbai',
      period: 'Apr 2026 – Present',
      details: [
        'Analysing operational and visitor data to support strategic decisions.',
        'Building executive dashboards in Python to track key performance metrics.',
        'Developing ETL pipelines that keep the data accurate and reliable.',
      ],
    },
    {
      role: 'WordPress Developer Intern',
      company: 'DigiFalx',
      location: 'Sanpada, Navi Mumbai',
      period: 'Feb 2025 – Jan 2026',
      details: [
        'Customised client themes and plugins with cross-browser compatibility.',
        'Optimised performance and SEO, cutting average page load by 30%.',
        'Delivered responsive, accessible web experiences.',
      ],
    },
    {
      role: 'Business Analyst Intern',
      company: 'Hatmedia',
      location: 'Andheri, Mumbai',
      period: 'Mar 2024 – Dec 2024',
      details: ['Helped project managers plan and run technical projects.', 'Monitored project budgets and prepared financial reports.'],
    },
  ],
  education: [
    {
      degree: 'B.E. Information Technology',
      institution: 'Shah and Anchor Kutchhi Engineering College, Chembur',
      period: 'Aug 2023 – Present',
      note: 'Final year · CGPA 9.12 / 10',
    },
    {
      degree: 'Higher Secondary (Science)',
      institution: 'B.N.B College of Science, Thane',
      period: 'Aug 2021 – May 2023',
      note: '80%',
    },
  ],
  skills: [
    { group: 'Languages', items: ['JavaScript', 'Python', 'Java', 'C / C++', 'SQL (PostgreSQL)', 'HTML / CSS'] },
    { group: 'Frameworks', items: ['React', 'Three.js', 'GSAP', 'Node.js / Express', 'FastAPI', 'Flask', 'WordPress'] },
    { group: 'Tools', items: ['Git & GitHub', 'Docker', 'Google Cloud Platform', 'Figma'] },
    { group: 'Data', items: ['Tableau', 'Power BI', 'Excel', 'R'] },
  ],
}

const media = (id) => ({
  video: `/videos/projects/${id}.mp4`,
  poster: `/images/projects/${id}-poster.webp`,
  cover: null,
  gallery: [`/images/projects/${id}-2.webp`, `/images/projects/${id}-3.webp`],
})

export const projects = [
  {
    id: 'libre',
    title: 'Libre',
    category: '3D E-commerce',
    year: '',
    summary: 'Premium non-alcoholic wine brand with an immersive 3D e-commerce website.',
    description: 'Alcohol-free sparkling wine from Extremadura, Spain — a playful, scroll-driven storefront built around the bottles.',
    technologies: [],
    links: [{ label: 'Live site', href: 'https://www.drinklibre.in' }],
    ...media('libre'),
    palette: ['#3a0f17', '#e7b9a4', '#f6e9df'],
  },
  {
    id: 'shiorra',
    title: 'Shiorra',
    category: 'Wellness E-commerce',
    year: '',
    summary: 'Premium wellness e-commerce — product design and frontend development.',
    description: 'Storefront for Shiōrra, a range of pregnancy and daily-energy supplements.',
    technologies: [],
    links: [{ label: 'Live site', href: 'https://shiorra.com' }],
    ...media('shiorra'),
    palette: ['#e7ddd0', '#6b7a5b', '#2b2a24'],
  },
  {
    id: 'yobo',
    title: 'Yobo',
    category: 'Lingerie E-commerce',
    year: '',
    summary: 'E-commerce website for YOBO, a lingerie brand making bras and briefs for real bodies.',
    description: '',
    technologies: [],
    links: [{ label: 'Live site', href: 'https://yobo-beta.vercel.app' }],
    ...media('yobo'),
    palette: ['#f4efe9', '#5a1f3d', '#1c1c1c'],
  },
  {
    id: 'quint-home',
    title: 'Quint Home',
    category: 'Home Fragrance E-commerce',
    year: '',
    summary: 'E-commerce for a Mumbai home-fragrance brand — waterless diffusers and fragrance oils.',
    description: '',
    technologies: [],
    links: [{ label: 'Live site', href: 'https://www.quinthome.in' }],
    ...media('quint-home'),
    palette: ['#141414', '#c9b48a', '#f2efe8'],
  },
  {
    id: 'tatvyra',
    title: 'Tatvyra',
    category: 'Wellness Food Brand',
    year: '',
    summary: 'Website for Tatvyra, clean-label wellness essentials — nut butters, moringa, spirulina and raw honey.',
    description: '',
    technologies: [],
    links: [{ label: 'Live site', href: 'https://tatvyra.vercel.app' }],
    ...media('tatvyra'),
    palette: ['#f3ecdf', '#5b3a8c', '#241a33'],
  },
  {
    id: 'infinity-services',
    title: 'Infinity Services',
    category: 'Corporate Website',
    year: '',
    summary: 'Website for a Navi Mumbai water treatment and laboratory solutions company.',
    description: '',
    technologies: [],
    links: [{ label: 'Live site', href: 'https://infinityservices-ten.vercel.app' }],
    ...media('infinity-services'),
    palette: ['#eef2f3', '#1f5c73', '#10262f'],
  },
]
