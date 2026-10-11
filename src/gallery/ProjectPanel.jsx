import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { panelFx } from './navStore'
import { PanelShell } from './PanelShell'
import { posterDataURL } from './textures'

const MIN_GALLERY_ITEMS = 3

function PanelVideo({ project, reducedMotion, continueFromCard }) {
  return (
    <figure className="panel-figure">
      <video
        // Pick up where the 3D card's copy of the video was, so the handover is seamless.
        onLoadedMetadata={(e) => {
          if (continueFromCard && panelFx.videoTime > 0) e.currentTarget.currentTime = panelFx.videoTime % e.currentTarget.duration
        }}
        src={project.video}
        poster={project.poster || undefined}
        muted
        loop
        playsInline
        autoPlay={!reducedMotion}
        controls={reducedMotion}
        preload="auto"
        loading="lazy"
        aria-label={`${project.title} — scrolling through the live website`}
      />
    </figure>
  )
}

function PanelImage({ src, fallback, alt }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className="panel-figure">
      <img
        src={failed ? fallback : src}
        alt={alt}
        width="1600"
        height="940"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </figure>
  )
}

/** Editorial case-study panel: project info on the left, media column on the right. */
export function ProjectPanel({ project, index, total, standalone, pending, reducedMotion, onClose }) {
  const heroRef = useRef()

  // Tell the 3D card where the lead image sits inside the panel (in panel uv, y up),
  // so the card's image can travel into exactly that slot — and back out on close.
  const measureHero = useCallback(() => {
    const hero = heroRef.current
    const panel = hero?.closest('.panel')
    if (!hero || !panel || standalone) {
      panelFx.hero = null
      return
    }
    const h = hero.getBoundingClientRect()
    const p = panel.getBoundingClientRect()
    panelFx.hero = [(h.left - p.left) / p.width, 1 - (h.bottom - p.top) / p.height, (h.right - p.left) / p.width, 1 - (h.top - p.top) / p.height]
  }, [standalone])

  useLayoutEffect(() => {
    measureHero()
    window.addEventListener('resize', measureHero)
    return () => {
      window.removeEventListener('resize', measureHero)
      panelFx.hero = null
    }
  }, [measureHero])

  const images = useMemo(() => {
    const real = project.gallery.map((src, i) => ({ src, fallback: posterDataURL(project, i % 3) }))
    for (let v = real.length + (project.video ? 1 : 0); v < MIN_GALLERY_ITEMS; v++) {
      const src = posterDataURL(project, v % 3)
      real.push({ src, fallback: src })
    }
    return real
  }, [project])

  const primaryLink = project.links[0]
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <PanelShell
      labelledBy="panel-title"
      closeLabel="Close project"
      standalone={standalone}
      pending={pending}
      reducedMotion={reducedMotion}
      onBeforeClose={measureHero}
      onClose={onClose}
    >
      <header className="panel-info">
        <h2 id="panel-title" className="panel-title panel-reveal">
          {project.title}
        </h2>
        <p className="panel-summary panel-reveal">{project.summary}</p>

        <div className="panel-tags panel-reveal">
          {primaryLink && (
            <a
              className="panel-arrow"
              href={primaryLink.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${primaryLink.label} (opens in new tab)`}
            >
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

      {/* The first item is the lead image: the 3D card's image lands exactly on it, so
          it is already in place (no reveal) when the panel opens from the gallery. */}
      <div className="panel-gallery">
        {project.video && (
          <div ref={heroRef} className={standalone ? 'panel-reveal' : undefined}>
            <PanelVideo project={project} reducedMotion={reducedMotion} continueFromCard={!standalone} />
          </div>
        )}
        {images.map((img, i) => {
          const isHero = !project.video && i === 0
          return (
            <div ref={isHero ? heroRef : undefined} className={isHero && !standalone ? undefined : 'panel-reveal'} key={i}>
              <PanelImage src={img.src} fallback={img.fallback} alt={`${project.title} — image ${i + 1}`} />
            </div>
          )
        })}
      </div>
    </PanelShell>
  )
}
