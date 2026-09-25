# Parth Avhad — Portfolio

An immersive 3D project gallery built with React, Vite, React Three Fiber and GSAP.

```bash
npm install
npm run dev     # local dev server
npm run build   # production build → dist/
```

## Editing content

All content lives in [`src/data/projects.js`](src/data/projects.js): the profile text and links, and one entry per project (title, category, year, summary, description, technologies, links, cover and gallery images).

- Put images in `public/images/projects/` (WebP, ~1600px wide) and reference them as `/images/projects/<file>.webp`.
- `cover` is shown on the 3D card; `gallery` fills the case-study column. Anything left empty falls back to a generated typographic placeholder in the project's `palette`.
- Empty `year`, `description`, `technologies` or `links` are simply hidden.

## Structure

- `src/gallery/config.js`: drum layout, panel rectangle, device/motion checks
- `src/gallery/Drum.jsx`: card meshes, render loop, open/close timelines
- `src/gallery/cardShader.js`: card geometry + shader (curvature, bend, morph, corners)
- `src/gallery/ProfileRing.jsx`: chrome ring for the profile view
- `src/gallery/useGalleryControls.js`: wheel, drag/touch and keyboard input
- `src/gallery/ProjectPanel.jsx`, `ProjectIndex.jsx`, `Interface.jsx`: DOM layers

Devices without WebGL (or very low-powered ones) get the flat "Full" index instead of the 3D drum. `prefers-reduced-motion` shortens transitions and disables the bend/ripple effects.
