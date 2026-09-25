import { useEffect, useRef, useState } from 'react'
import { posterDataURL } from './textures'

/**
 * Floating preview that trails the pointer (or sits by the focused name when using the
 * keyboard). Plays the project's scrolling recording, or shows its poster/placeholder.
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
        ref.current.style.transform = `translate3d(${s.x + 24}px, ${s.y - 90}px, 0) rotate(${reducedMotion ? 0 : s.tilt}deg)`
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
      {project.video ? (
        <video ref={videoRef} key={project.id} src={project.video} poster={still} muted loop playsInline preload="auto" />
      ) : (
        <img key={project.id} src={still} alt="" />
      )}
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

  const showFor = (index, x, y) => {
    setActive(index)
    setAnchor({ x, y })
  }

  return (
    <section
      className="index"
      aria-label="All projects"
      onPointerMove={(e) => active != null && setAnchor({ x: e.clientX, y: e.clientY })}
      onPointerLeave={() => setActive(null)}
    >
      <ul className={`index-list${active != null ? ' has-active' : ''}`}>
        {projects.map((project, i) => (
          <li key={project.id}>
            <button
              className={`index-name${active === i ? ' is-active' : ''}`}
              onClick={() => onOpen(i)}
              onPointerEnter={(e) => finePointer.current && showFor(i, e.clientX, e.clientY)}
              onFocus={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                showFor(i, r.right, r.top + r.height / 2)
              }}
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
