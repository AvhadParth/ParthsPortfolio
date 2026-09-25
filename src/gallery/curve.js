import * as THREE from 'three'

const SAMPLES = 2048
const STEP = 0.004 // x step when integrating arc length

/**
 * The path the cards slide along: a gentle horizontal wave in front of the camera,
 * nearest a little left of centre, receding to the right and easing back again.
 * Cards travel along it by arc length, so every card keeps its true width wherever it
 * is on the curve.
 *
 * The wave is live: `update({ depth, amp, phase, length })` reshapes it (e.g. deeper and shifted while
 * the gallery is moving fast). The result is uploaded as a float texture mapping arc
 * length s → (x, z, tangent x, tangent z) for the vertex shader.
 */
export function createCurve({ waveDepth, waveAmp, waveLength, wavePhase, span }) {
  let k = (Math.PI * 2) / waveLength
  let depth = waveDepth
  let amp = waveAmp
  let phase = wavePhase
  const zAt = (x) => -(depth - amp * Math.cos(k * (x - phase)))

  // Arc-length tables for walking right (+x) and left (-x) from x = 0. Arc length grows
  // at least as fast as x, so span / STEP steps always suffice.
  const maxSteps = Math.ceil(span / STEP) + 2
  const right = { xs: new Float32Array(maxSteps), ss: new Float32Array(maxSteps), n: 0 }
  const left = { xs: new Float32Array(maxSteps), ss: new Float32Array(maxSteps), n: 0 }
  const walk = (table, dir) => {
    let x = 0
    let s = 0
    let z = zAt(0)
    let n = 0
    table.xs[0] = 0
    table.ss[0] = 0
    while (s < span && n < maxSteps - 1) {
      const nx = x + dir * STEP
      const nz = zAt(nx)
      s += Math.hypot(nx - x, nz - z)
      x = nx
      z = nz
      n++
      table.xs[n] = x
      table.ss[n] = s
    }
    table.n = n + 1
  }

  const xForS = (s) => {
    const table = s >= 0 ? right : left
    const target = Math.abs(s)
    let lo = 0
    let hi = table.n - 1
    if (target >= table.ss[hi]) return table.xs[hi]
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (table.ss[mid] < target) lo = mid
      else hi = mid
    }
    const t = (target - table.ss[lo]) / Math.max(1e-9, table.ss[hi] - table.ss[lo])
    return table.xs[lo] + (table.xs[hi] - table.xs[lo]) * t
  }

  const data = new Float32Array(SAMPLES * 4)
  const table = new Float32Array(SAMPLES * 2)
  const texture = new THREE.DataTexture(data, SAMPLES, 1, THREE.RGBAFormat, THREE.FloatType)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter

  const rebuild = () => {
    walk(right, 1)
    walk(left, -1)
    for (let i = 0; i < SAMPLES; i++) {
      const s = -span + (2 * span * i) / (SAMPLES - 1)
      const x = xForS(s)
      const z = zAt(x)
      const slope = -amp * k * Math.sin(k * (x - phase)) // dz/dx
      const len = Math.hypot(1, slope)
      const o = i * 4
      data[o] = x
      data[o + 1] = z
      data[o + 2] = 1 / len
      data[o + 3] = slope / len
      table[i * 2] = x
      table[i * 2 + 1] = z
    }
    texture.needsUpdate = true
  }
  rebuild()

  /** Reshape the wave; cheap enough to call every frame while it's moving. */
  const update = (next) => {
    const nextK = (Math.PI * 2) / next.length
    if (
      Math.abs(next.amp - amp) < 1e-4 &&
      Math.abs(next.phase - phase) < 1e-4 &&
      Math.abs(next.depth - depth) < 1e-4 &&
      Math.abs(nextK - k) < 1e-5
    )
      return
    k = nextK
    depth = next.depth
    amp = next.amp
    phase = next.phase
    rebuild()
  }

  /** Point on the curve at arc length s. */
  const at = (s) => {
    const x = xForS(THREE.MathUtils.clamp(s, -span, span))
    return { x, z: zAt(x) }
  }

  /**
   * Intersect a camera ray with the curved wall. Returns the arc length s and height y
   * of the hit, or null.
   */
  const intersect = (ray) => {
    const { origin: o, direction: d } = ray
    let prevCross = 0
    let prevX = 0
    let prevZ = 0
    for (let i = 0; i < SAMPLES; i++) {
      const x = table[i * 2] - o.x
      const z = table[i * 2 + 1] - o.z
      const cross = x * d.z - z * d.x
      if (i > 0 && Math.sign(cross) !== Math.sign(prevCross)) {
        const t = prevCross / (prevCross - cross)
        const s = -span + (2 * span * (i - 1 + t)) / (SAMPLES - 1)
        const hx = prevX + (x - prevX) * t
        const hz = prevZ + (z - prevZ) * t
        const along = (hx * d.x + hz * d.z) / (d.x * d.x + d.z * d.z)
        if (along > 0) return { s, y: o.y + d.y * along }
      }
      prevCross = cross
      prevX = x
      prevZ = z
    }
    return null
  }

  return { texture, span, samples: SAMPLES, at, intersect, update }
}
