import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { getPanelRect } from './config'
import { posterDataURL } from './textures'

const MIN_GALLERY_ITEMS = 3

function useViewport() {
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

function PanelVideo({ project, reducedMotion }) {
  return (
    <figure className="panel-figure">
      <video
        src={project.video}
        poster={project.poster || undefined}
        muted
        loop
        playsInline
        autoPlay={!reducedMotion}
        controls={reducedMotion}
        preload="auto"
        aria-label={`${project.title} — scrolling through the live website`}
      />
    </figure>
  )
}

function PanelImage({ src, fallback, alt }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className="panel-figure">
      <img src={failed ? fallback : src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
    </figure>
  )
}

/**
 * Editorial case-study panel. In 3D mode it appears on top of the white card that
 * has already morphed into exactly this rectangle; `standalone` adds its own fade
 * for the 2D index / fallback.
 */
export function ProjectPanel({ project, index, total, standalone, reducedMotion, onClose }) {
  const vp = useViewport()
  const rect = getPanelRect(vp.w, vp.h)
  const panelRef = useRef()
  const closeRef = useRef()
  const closing = useRef(false)

  const images = useMemo(() => {
    const real = project.gallery.map((src, i) => ({ src, fallback: posterDataURL(project, i % 3) }))
    for (let v = real.length + (project.video ? 1 : 0); v < MIN_GALLERY_ITEMS; v++) {
      const src = posterDataURL(project, v % 3)
      real.push({ src, fallback: src })
    }
    return real
  }, [project])

  useLayoutEffect(() => {
    const panel = panelRef.current
    const ctx = gsap.context(() => {
      const d = reducedMotion ? 0.2 : 1
      if (standalone) gsap.from(panel, { opacity: 0, scale: 0.985, duration: 0.5 * d, ease: 'power3.out' })
      gsap.from('.panel-reveal', { opacity: 0, y: reducedMotion ? 0 : 24, duration: 0.8 * d, ease: 'power3.out', stagger: 0.06 })
    }, panel)
    closeRef.current?.focus({ preventScroll: true })
    return () => ctx.revert()
  }, [standalone, reducedMotion])

  const requestClose = () => {
    if (closing.current) return
    closing.current = true
    const d = reducedMotion ? 0.15 : 0.35
    gsap.to(panelRef.current.querySelectorAll('.panel-reveal'), { opacity: 0, duration: d, ease: 'power2.in' })
    gsap.to(panelRef.current, {
      opacity: standalone ? 0 : 1,
      duration: d,
      delay: standalone ? 0.05 : d * 0.6,
      onComplete: onClose,
    })
  }

  // Escape to close + keep Tab focus inside the dialog.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        requestClose()
      } else if (e.key === 'Tab') {
        const focusable = panelRef.current.querySelectorAll('a[href], button:not([disabled])')
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const primaryLink = project.links[0]
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <div className={`panel-layer${standalone ? ' is-standalone' : ''}`}>
      <article
        ref={panelRef}
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: rect.radius }}
      >
        <button ref={closeRef} className="panel-close panel-reveal" onClick={requestClose} aria-label="Close project">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>

        <div className="panel-scroll">
          <header className="panel-info">
            <h2 id="panel-title" className="panel-title panel-reveal">
              {project.title}
            </h2>
            <p className="panel-summary panel-reveal">{project.summary}</p>

            <div className="panel-tags panel-reveal">
              {primaryLink && (
                <a className="panel-arrow" href={primaryLink.href} target="_blank" rel="noreferrer" aria-label={`${primaryLink.label} (opens in new tab)`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 16L16 8M9 8h7v7" />
                  </svg>
                </a>
              )}
              <span className="chip">{project.category}</span>
              {project.year && <span className="chip">{project.year}</span>}
            </div>

            {project.description && <p className="panel-description panel-reveal">{project.description}</p>}

            {project.technologies.length > 0 && (
              <div className="panel-meta panel-reveal">
                <h3>Technologies</h3>
                <ul>
                  {project.technologies.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.links.length > 0 && (
              <div className="panel-meta panel-reveal">
                <h3>Links</h3>
                <ul>
                  {project.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noreferrer">
                        {l.label} <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="panel-counter panel-reveal" aria-hidden="true">
              {counter}
            </p>
          </header>

          <div className="panel-gallery">
            {project.video && (
              <div className="panel-reveal">
                <PanelVideo project={project} reducedMotion={reducedMotion} />
              </div>
            )}
            {images.map((img, i) => (
              <div className="panel-reveal" key={i}>
                <PanelImage src={img.src} fallback={img.fallback} alt={`${project.title} — image ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
