import { useEffect } from 'react'
import { nav } from './navStore'

// The strip travels this many pixels for each pixel of wheel or drag input.
const GAIN = 1.4
// Largest wheel step taken from a single event, in pixels.
const WHEEL_CAP = 68

/**
 * Wheel / trackpad, pointer drag (mouse + touch) and keyboard navigation for the strip.
 * Everything writes to `nav.target`; the render loop eases towards it. The strip rests
 * wherever it lands (no snapping); a released drag carries on with momentum.
 */
export function useGalleryControls(stageRef, { enabled, slotWidthPx, isVertical, onActivate, onTap }) {
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !enabled) return

    const onWheel = (e) => {
      if (nav.locked) return
      const unit = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? window.innerHeight : 1
      const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * unit
      nav.fling = 0
      nav.target += (Math.max(-WHEEL_CAP, Math.min(WHEEL_CAP, delta)) * GAIN) / slotWidthPx()
    }

    // Drag, with momentum on release.
    let startX = 0
    let lastX = 0
    let lastT = 0
    let speed = 0 // px per ms
    let pointerId = null
    // The strip runs top-to-bottom on portrait screens, so drags follow that axis.
    const along = (e) => (isVertical() ? e.clientY : e.clientX)

    const onPointerDown = (e) => {
      if (nav.locked || e.button > 0) return
      pointerId = e.pointerId
      nav.pointerClient.x = e.clientX
      nav.pointerClient.y = e.clientY
      startX = lastX = along(e)
      lastT = performance.now()
      speed = 0
      nav.dragging = true
      nav.fling = 0
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
      const dx = along(e) - lastX
      speed = speed * 0.6 + (dx / Math.max(1, now - lastT)) * 0.4
      lastX = along(e)
      lastT = now
      nav.target -= (dx * GAIN) / slotWidthPx()
    }
    const onPointerUp = (e) => {
      if (!nav.dragging || e.pointerId !== pointerId) return
      nav.dragging = false
      pointerId = null
      delete document.documentElement.dataset.dragging
      const moved = Math.abs(lastX - startX) > 6
      // Hand the release speed to the render loop as momentum (slots per second).
      if (moved && performance.now() - lastT < 80) nav.fling = (-speed * 1000 * GAIN) / slotWidthPx()
      // Giant wheel (portrait): like a Ferris wheel stopping at the boarding point,
      // land exactly on a card — including where the momentum would have carried it.
      if (moved && isVertical()) {
        nav.target = Math.round(nav.target + nav.fling / 2.2)
        nav.fling = 0
      }
      if (!moved) onTap(e.clientX, e.clientY)
    }

    const onKeyDown = (e) => {
      if (nav.locked || e.defaultPrevented) return
      if (e.target.closest?.('input, textarea, [contenteditable]')) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        nav.fling = 0
        nav.target = Math.round(nav.target) + 1
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        nav.fling = 0
        nav.target = Math.round(nav.target) - 1
      } else if (e.key === 'Enter' && (e.target === document.body || e.target === stage)) {
        e.preventDefault()
        onActivate()
      }
    }

    // Passive: the page itself never scrolls (overflow hidden, overscroll-behavior none),
    // so there is nothing to prevent and the browser needn't wait on this handler.
    stage.addEventListener('wheel', onWheel, { passive: true })
    stage.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      nav.dragging = false
      nav.fling = 0
      stage.removeEventListener('wheel', onWheel)
      stage.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('keydown', onKeyDown)
      nav.pointerInside = false
    }
  }, [stageRef, enabled, slotWidthPx, isVertical, onActivate, onTap])
}
