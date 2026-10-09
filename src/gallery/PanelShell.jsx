import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { getPanelRect } from './config'

function useViewport() {
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

/**
 * The white editorial panel used for case studies and the About view: modal dialog
 * semantics, focus trap, Escape to close and the staggered `.panel-reveal` entrance.
 * In 3D mode it sits on top of a card that has morphed into exactly this rectangle;
 * `standalone` adds its own fade for the 2D index, fallback and About view.
 */
export function PanelShell({ labelledBy, closeLabel, standalone, reducedMotion, onClose, children }) {
  const vp = useViewport()
  const rect = getPanelRect(vp.w, vp.h)
  const panelRef = useRef()
  const closeRef = useRef()
  const closing = useRef(false)

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
        const focusable = panelRef.current.querySelectorAll('a[href], button:not([disabled]), video[controls]')
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

  return (
    <div className={`panel-layer${standalone ? ' is-standalone' : ''}`}>
      <article
        ref={panelRef}
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: rect.radius }}
      >
        <button ref={closeRef} className="panel-close panel-reveal" onClick={requestClose} aria-label={closeLabel}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>
        <div className="panel-scroll">{children}</div>
      </article>
    </div>
  )
}
