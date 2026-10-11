import { useEffect, useRef, useState } from 'react'
import { posterDataURL } from './textures'

/**
 * Preview card centred on the hovered (or keyboard-focused) name, which stays readable
 * on top of it. Glides between names; plays the project's scrolling recording, or shows
 * its poster/placeholder.
 */
function Preview({ project, anchor, reducedMotion }) {
  const ref = useRef()
  const videoRef = useRef()
  const state = useRef({ x: anchor.x, y: anchor.y, tx: anchor.x, ty: anchor.y, tilt: 0 })

  useEffect(() => {
    state.current.tx = anchor.x
    state.current.ty = anchor.y
  }, [anchor.x, anchor.y])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const s = state.current
      const ease = reducedMotion ? 1 : 0.16
      const dx = s.tx - s.x
      s.x += dx * ease
      s.y += (s.ty - s.y) * ease
      s.tilt += (Math.max(-12, Math.min(12, dx * 0.12)) - s.tilt) * 0.15
      if (ref.current) {
        ref.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) rotate(${reducedMotion ? 0 : s.tilt * 0.5}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  useEffect(() => {
    const video = videoRef.current
    if (video && !reducedMotion) video.play().catch(() => {})
  }, [project, reducedMotion])

  const still = project.poster || project.cover || posterDataURL(project, 0)
  return (
    <div ref={ref} className="index-preview" aria-hidden="true">
      <div className="index-preview-card">
      {project.video ? (
        <video ref={videoRef} key={project.id} src={project.video} poster={still} muted loop playsInline preload="auto" />
      ) : (
        <img key={project.id} src={still} alt="" />
      )}
      </div>
    </div>
  )
}

/**
 * "Full" view: every project as a line of large type, separated by dots, with a floating
 * preview on hover/focus. Also serves as the gallery on devices without WebGL.
 */
export function ProjectIndex({ projects, onOpen, reducedMotion }) {
  const [active, setActive] = useState(null)
  const [anchor, setAnchor] = useState({ x: 0, y: 0 })
  const finePointer = useRef(typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)

  // Anchor the preview to the middle of the name itself.
  const showFor = (index, el) => {
    const r = el.getBoundingClientRect()
    setActive(index)
    setAnchor({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  return (
    <section
      className="index"
      aria-label="All projects"
      onPointerLeave={() => setActive(null)}
    >
      <ul className={`index-list${active != null ? ' has-active' : ''}`}>
        {projects.map((project, i) => (
          <li key={project.id}>
            <button
              style={{ '--i': i }}
              className={`index-name${active === i ? ' is-active' : ''}`}
              onClick={() => onOpen(i)}
              onPointerEnter={(e) => finePointer.current && showFor(i, e.currentTarget)}
              onFocus={(e) => showFor(i, e.currentTarget)}
              onBlur={() => setActive(null)}
            >
              {project.title}
            </button>
            {i < projects.length - 1 && (
              <span className="index-dot" aria-hidden="true">
                ·
              </span>
            )}
          </li>
        ))}
      </ul>
      {active != null && <Preview project={projects[active]} anchor={anchor} reducedMotion={reducedMotion} />}
    </section>
  )
}
