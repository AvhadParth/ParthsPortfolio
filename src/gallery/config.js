// Layout + motion constants for the 3D gallery drum.
// Cards sit on the outside of a slowly rotating drum in front of the camera.

export const CARD_ASPECT = 1.7 // width / height of every card (texture is composed to match)
export const MIN_SLOTS = 10 // projects repeat around the drum until at least this many slots exist

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')))
  } catch {
    return false
  }
}

// Very low-end devices get the 2D index instead of the WebGL drum.
export function isLowPowerDevice() {
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  return cores <= 2 || memory <= 1
}

/** Build the ring of slots (projects repeated so the drum is always full). */
export function buildSlots(projects) {
  if (!projects.length) return []
  const repeats = Math.max(1, Math.ceil(MIN_SLOTS / projects.length))
  const slots = []
  for (let r = 0; r < repeats; r++) {
    projects.forEach((project, i) => slots.push({ key: `${project.id}-${r}`, project, projectIndex: i }))
  }
  return slots
}

/**
 * Gallery geometry for the current viewport. A wide-angle camera sits close to a gently
 * waving wall of cards: nearest just left of centre, receding to the right, easing back
 * again. Proportions are expressed in card heights (H) as measured from the reference.
 */
export function getLayout(slotCount, width, height) {
  const aspect = width / height
  const portrait = aspect < 0.9
  const cardW = 3.2
  const cardH = cardW / CARD_ASPECT
  const gap = 0.07
  const fov = portrait ? 60 : 70
  const tanV = Math.tan((fov * Math.PI) / 360)
  const H = cardH

  // Mean wall depth. On narrow screens the camera backs off so the focused card still fits.
  const maxCoverage = portrait ? 0.82 : aspect < 1.3 ? 0.58 : 1
  const fitDepth = cardW / (maxCoverage * 2 * tanV * aspect)
  const waveDepth = Math.max(1.66 * H, fitDepth)

  return {
    cardW,
    cardH,
    gap,
    pitch: cardW + gap, // arc length between neighbouring card centres
    slotCount,
    fov,
    distance: waveDepth,
    waveDepth,
    waveAmp: (portrait ? 0.2 : 0.34) * H,
    waveLength: 4.8 * H,
    wavePhase: -0.93 * H, // x of the nearest point of the wave
    span: (slotCount / 2 + 1.5) * (cardW + gap),
    cardsY: 0,
    floorY: -cardH * 0.5 - 0.04,
  }
}

/**
 * The case-study panel rectangle in CSS pixels. Used both for the DOM panel and as the
 * target the selected 3D card morphs into, so the handoff between them is seamless.
 */
export function getPanelRect(width, height) {
  const mobile = width < 760
  const x = mobile ? 10 : Math.max(20, Math.round(width * 0.028))
  const y = mobile ? 10 : Math.max(18, Math.round(height * 0.035))
  return { left: x, top: y, width: width - x * 2, height: height - y * 2, radius: mobile ? 14 : 20 }
}

// Profile ring (chrome torus) dimensions, in ring-local units.
export const RING_RADIUS = 0.9
export const RING_TUBE = 0.22

/** Depth of the card wall straight ahead of the camera (where the profile ring sits). */
export function centerDepth(layout) {
  const k = (Math.PI * 2) / layout.waveLength
  return layout.waveDepth - layout.waveAmp * Math.cos(k * -layout.wavePhase)
}

/** Scale that makes the ring fill most of the shorter viewport side at the wall's depth. */
export function getRingScale(layout, width, height) {
  const visH = 2 * centerDepth(layout) * Math.tan((layout.fov * Math.PI) / 360)
  const visW = visH * (width / height)
  return (Math.min(visH * 0.9, visW * 0.9) / 2) / (RING_RADIUS + RING_TUBE)
}

/** Diameter of the ring's hole in CSS pixels — the profile text is fitted inside it. */
export function getRingHolePx(layout, width, height) {
  const visH = 2 * centerDepth(layout) * Math.tan((layout.fov * Math.PI) / 360)
  return ((2 * (RING_RADIUS - RING_TUBE) * getRingScale(layout, width, height)) / visH) * height
}
