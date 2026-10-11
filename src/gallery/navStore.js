// Mutable navigation state shared between the input handlers and the render loop.
// Kept outside React so pointer/wheel input never triggers re-renders.
// Positions are measured in "slots": 1 unit = one card along the drum.
export const nav = {
  target: 0, // where input wants the drum to be
  current: 0, // eased position that is actually rendered
  velocity: 0, // smoothed slots/second, drives the bend + roll
  locked: false, // true while a project is opening/open/closing
  dragging: false,
  fling: 0, // momentum after a drag is released, in slots/second; decays in the render loop
  pointer: { x: 0, y: 0 }, // normalised -1..1, for camera parallax
  pointerClient: { x: 0, y: 0 }, // CSS pixels, for hover picking
  pointerInside: false, // pointer is over the 3D stage
  pick: null, // (clientX, clientY) => slot index or -1; provided by the scene
}

// Profile transition state, animated by ProfileRing and read by the cards (hole) and ring.
export const profileFx = {
  reveal: 0, // 0 → 1: hole opens and the ring grows out of the card
  wobble: 0, // amplitude of the organic wobble on hole edge + ring
  wrap: 0, // 1 = ring still wears the card's imagery, 0 = pure chrome
  holeRadius: 0, // world units, hole radius on the wall at full reveal
}

// Handover between the 3D card and the DOM case-study panel.
export const panelFx = {
  hero: null, // [x0, y0, x1, y1] of the panel's lead image in panel uv, or null
  videoTime: 0, // playback position of the open card's video, so the panel's copy can match
}

export const wrapIndex = (i, n) => ((i % n) + n) % n

/** Nearest drum position that centres `slot`, measured from `from`. */
export function nearestPositionFor(slot, from, slotCount) {
  const base = Math.round(from)
  let diff = wrapIndex(slot - base, slotCount)
  if (diff > slotCount / 2) diff -= slotCount
  return base + diff
}
