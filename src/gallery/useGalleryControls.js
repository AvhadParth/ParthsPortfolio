import { useEffect } from 'react'
import { nav } from './navStore'

/**
 * Wheel / trackpad, pointer drag (mouse + touch) and keyboard navigation for the drum.
 * Everything writes to `nav.target`; the render loop eases towards it.
 */
export function useGalleryControls(stageRef, { enabled, slotWidthPx, onActivate, onTap }) {
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !enabled) return

    let snapTimer = 0
    const snapSoon = (delay = 160) => {
      clearTimeout(snapTimer)
      snapTimer = setTimeout(() => {
        if (!nav.locked && !nav.dragging) nav.target = Math.round(nav.target)
      }, delay)
    }

    const onWheel = (e) => {
      e.preventDefault()
      if (nav.locked) return
      const unit = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? window.innerHeight : 1
      const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * unit
      // Cap each event so fast wheels/trackpads glide instead of racing (matches the
      // reference: a fast burst moves ~1.3 cards, not 3).
      nav.target += Math.max(-48, Math.min(48, delta)) / (slotWidthPx() * 0.9)
      snapSoon()
    }

    // Drag with inertia.
    let startX = 0
    let lastX = 0
    let lastT = 0
    let speed = 0 // px per ms
    let pointerId = null

    const onPointerDown = (e) => {
      if (nav.locked || e.button > 0) return
      pointerId = e.pointerId
      nav.pointerClient.x = e.clientX
      nav.pointerClient.y = e.clientY
      startX = lastX = e.clientX
      lastT = performance.now()
      speed = 0
      nav.dragging = true
      clearTimeout(snapTimer)
      document.documentElement.dataset.dragging = 'true'
    }
    const onPointerMove = (e) => {
      nav.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      nav.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      nav.pointerClient.x = e.clientX
      nav.pointerClient.y = e.clientY
      nav.pointerInside = stage.contains(e.target)
      if (!nav.dragging || e.pointerId !== pointerId) return
      const now = performance.now()
      const dx = e.clientX - lastX
      speed = speed * 0.6 + (dx / Math.max(1, now - lastT)) * 0.4
      lastX = e.clientX
      lastT = now
      nav.target -= dx / slotWidthPx()
    }
    const onPointerUp = (e) => {
      if (!nav.dragging || e.pointerId !== pointerId) return
      nav.dragging = false
      pointerId = null
      delete document.documentElement.dataset.dragging
      const moved = Math.abs(lastX - startX) > 6
      if (moved && performance.now() - lastT < 80) nav.target -= (speed * 260) / slotWidthPx()
      nav.target = Math.round(nav.target)
      if (!moved) onTap(e.clientX, e.clientY)
    }

    const onKeyDown = (e) => {
      if (nav.locked || e.defaultPrevented) return
      if (e.target.closest?.('input, textarea, [contenteditable]')) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        nav.target = Math.round(nav.target) + 1
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        nav.target = Math.round(nav.target) - 1
      } else if (e.key === 'Enter' && (e.target === document.body || e.target === stage)) {
        e.preventDefault()
        onActivate()
      }
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    stage.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      clearTimeout(snapTimer)
      nav.dragging = false
      stage.removeEventListener('wheel', onWheel)
      stage.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('keydown', onKeyDown)
      nav.pointerInside = false
    }
  }, [stageRef, enabled, slotWidthPx, onActivate, onTap])
}
