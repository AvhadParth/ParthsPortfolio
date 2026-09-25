import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { CARD_ASPECT, getPanelRect } from './config'
import { createCurve } from './curve'
import { nav, nearestPositionFor, profileFx } from './navStore'
import { cardFragmentShader, cardVertexShader, createCardGeometry, createCardUniforms } from './cardShader'

const damp = THREE.MathUtils.damp

/** Slightly underdamped spring step: the wave swells, carries through and settles. */
function springStep(state, target, dt, stiffness = 32, damping = 7.5) {
  const accel = (target - state.x) * stiffness - state.v * damping
  state.v += accel * dt
  state.x += state.v * dt
}

/** Wrap a slot offset into (-n/2, n/2]. */
function wrapRel(value, n) {
  let rel = value % n
  if (rel > n / 2) rel -= n
  if (rel <= -n / 2) rel += n
  return rel
}

/**
 * How many extra slots to push the neighbours aside while a project is open, so their
 * inner edges peek out just inside the panel margins (the grey slivers either side of
 * the case study). Solved per side because the wave is asymmetric.
 */
function solveNeighbourPush(curve, layout, width, height, side) {
  const tanX = Math.tan((layout.fov * Math.PI) / 360) * (width / height)
  const rect = getPanelRect(width, height)
  const target = 1 - (rect.left * 0.5) / (width / 2)
  const ndc = (k) => {
    const p = curve.at(side * ((1 + k) * layout.pitch - layout.cardW / 2))
    return (side * p.x) / (-p.z * tanX)
  }
  if (ndc(0) >= target) return 0
  if (ndc(4) < target) return 4
  let lo = 0
  let hi = 4
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (ndc(mid) < target) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/**
 * The wall of project cards sliding along the wave curve. Owns the per-frame motion,
 * hover/click picking and the open/close timelines of the selected card.
 */
export function Drum({ slots, textures, layout, phase, activeSlot, reducedMotion, onOpened, onClosed, introKey }) {
  const { size, camera } = useThree()
  const prevCurrent = useRef(nav.current)
  const returnTo = useRef(0)
  const hovered = useRef(-1)
  const spread = useRef({ value: 0 })
  const parallax = useRef({ x: 0, y: 0 })
  const slotS = useRef(new Float32Array(slots.length))
  const playing = useRef(new Set())
  // Live wave: `energy` deepens it with speed, `lean` slides the crest with direction.
  const wave = useRef({ energy: { x: 0, v: 0 }, lean: { x: 0, v: 0 } })

  const { waveDepth, waveAmp, waveLength, wavePhase, span } = layout
  const curve = useMemo(
    () => createCurve({ waveDepth, waveAmp, waveLength, wavePhase, span }),
    [waveDepth, waveAmp, waveLength, wavePhase, span],
  )
  useEffect(() => () => curve.texture.dispose(), [curve])

  const geometry = useMemo(() => createCardGeometry(layout.cardW, layout.cardH), [layout.cardW, layout.cardH])
  useEffect(() => () => geometry.dispose(), [geometry])

  const materials = useMemo(
    () =>
      slots.map(
        ({ project }) =>
          new THREE.ShaderMaterial({
            uniforms: createCardUniforms(textures.get(project.id).media, textures.get(project.id).label, CARD_ASPECT, curve),
            vertexShader: cardVertexShader,
            fragmentShader: cardFragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide, // the ribbon twists far enough to show the cards' backs
          }),
      ),
    [slots, textures, curve],
  )
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials])

  // Picking: intersect the pointer ray with the curved wall, then find the card there.
  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    nav.pick = (clientX, clientY) => {
      ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const hit = curve.intersect(raycaster.ray)
      if (!hit || Math.abs(hit.y - layout.cardsY) > layout.cardH / 2) return -1
      const s = slotS.current
      for (let i = 0; i < s.length; i++) if (Math.abs(hit.s - s[i]) <= layout.cardW / 2) return i
      return -1
    }
    return () => {
      nav.pick = null
    }
  }, [camera, curve, layout.cardH, layout.cardW, layout.cardsY])

  // Intro: cards fade in while the wall glides into place.
  useEffect(() => {
    if (!introKey) return
    const fade = materials.map((m) => m.uniforms.uOpacity)
    if (reducedMotion) {
      fade.forEach((u) => (u.value = 1))
      return
    }
    nav.current = nav.target - 1.6
    fade.forEach((u) => (u.value = 0))
    const tween = gsap.to(fade, { value: 1, duration: 1.4, ease: 'power2.out', stagger: 0.04 })
    return () => tween.kill()
  }, [introKey, materials, reducedMotion])

  // Open / close timelines.
  useEffect(() => {
    if (activeSlot == null) return
    const selected = materials[activeSlot]?.uniforms
    if (!selected) return
    const others = materials.filter((_, i) => i !== activeSlot).map((m) => m.uniforms.uDim)
    const quick = reducedMotion ? 0.35 : 1

    if (phase === 'opening') {
      nav.locked = true
      returnTo.current = nav.target
      const center = nearestPositionFor(activeSlot, nav.current, slots.length)
      const travel = Math.abs(center - nav.current)
      const tl = gsap.timeline({ onComplete: onOpened })
      tl.to(nav, { current: center, target: center, duration: travel < 0.01 ? 0 : Math.min(0.9, 0.4 + travel * 0.18) * quick, ease: 'power3.inOut' })
        .addLabel('morph', '-=0.1')
        .to(others, { value: 1, duration: 0.9 * quick, ease: 'power2.out' }, 'morph')
        .to(spread.current, { value: 1, duration: 1.1 * quick, ease: 'expo.inOut' }, 'morph')
        .to(selected.uOpen, { value: 1, duration: 1.05 * quick, ease: 'expo.inOut' }, 'morph')
        .to(selected.uRipple, { value: reducedMotion ? 0 : 1, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'morph')
        .to(selected.uWhite, { value: 1, duration: 0.5 * quick, ease: 'power2.in' }, 'morph+=0.4')
      return () => tl.kill()
    }

    if (phase === 'closing') {
      const back = returnTo.current
      const tl = gsap.timeline({
        onComplete: () => {
          nav.locked = false
          onClosed()
        },
      })
      tl.to(selected.uWhite, { value: 0, duration: 0.6 * quick, ease: 'power2.inOut' })
        .to(selected.uOpen, { value: 0, duration: 1 * quick, ease: 'expo.inOut' }, '<')
        .to(selected.uRipple, { value: reducedMotion ? 0 : 0.8, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '<')
        .to(spread.current, { value: 0, duration: 1 * quick, ease: 'expo.inOut' }, '<')
        .to(others, { value: 0, duration: 0.8 * quick, ease: 'power2.out' }, '<0.35')
        .to(nav, { current: back, target: back, duration: Math.abs(back - nav.current) < 0.01 ? 0 : 0.8 * quick, ease: 'power3.inOut' }, '<0.1')
      return () => tl.kill()
    }
  }, [phase, activeSlot, materials, slots.length, reducedMotion, onOpened, onClosed])

  // Keep the morph target glued to the panel rectangle (also on resize).
  const updateFlatTarget = (uniforms) => {
    const rect = getPanelRect(size.width, size.height)
    const depth = layout.distance * 0.45
    const worldPerPx = (2 * depth * Math.tan((layout.fov * Math.PI) / 360)) / size.height
    uniforms.uFlatScale.value.set((rect.width * worldPerPx) / layout.cardW, (rect.height * worldPerPx) / layout.cardH)
    uniforms.uFlatCenter.value.set(
      (rect.left + rect.width / 2 - size.width / 2) * worldPerPx,
      -(rect.top + rect.height / 2 - size.height / 2) * worldPerPx,
      -depth,
    )
    uniforms.uPanelAspect.value = rect.width / rect.height
    uniforms.uPanelCorner.value = rect.radius / rect.height
  }

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20)
    if (!nav.locked) nav.current = damp(nav.current, nav.target, reducedMotion ? 14 : 5, dt)
    const rawVelocity = (nav.current - prevCurrent.current) / Math.max(dt, 1e-4)
    prevCurrent.current = nav.current
    nav.velocity = damp(nav.velocity, reducedMotion ? 0 : rawVelocity, 6, dt)

    const settle = nav.locked ? 0 : 1

    // Slow scrolling keeps the resting wave. Fast moves bring it alive: the crest swells
    // towards the viewer, the rest of the strip sweeps far back into a long, thin
    // ribbon that twists along its length, and the crest travels against the motion.
    // Everything springs back to rest.
    const v = reducedMotion ? 0 : nav.velocity * settle
    const w = wave.current
    // Normal scrolling (~2–3 cards/s in the reference) leaves the wave calm; it only
    // swells on real flings (~5+ cards/s).
    springStep(w.energy, THREE.MathUtils.clamp((Math.abs(v) - 2.5) / 3, 0, 1), dt, 18, 6.5)
    springStep(w.lean, THREE.MathUtils.clamp(v / 4, -1, 1), dt, 18, 6.5)
    // Measured from the reference at full speed: the crest only comes ~20% closer
    // (card ~53% → ~68% of the screen height) while the trailing strip sinks back to
    // ~4× the resting depth. The wave keeps its length. Energy never overshoots past 1.
    const e = THREE.MathUtils.clamp(w.energy.x, 0, 1)
    const H = layout.cardH
    curve.update({
      depth: layout.waveDepth + 1.0 * H * e,
      amp: layout.waveAmp + 1.2 * H * e,
      length: layout.waveLength,
      phase: layout.wavePhase + w.lean.x * H * 0.8,
    })
    const twist = e * THREE.MathUtils.clamp(w.lean.x * 1.6, -1, 1) * 1.1

    const spreadValue = spread.current.value
    const pushR = spreadValue > 0 ? spreadValue * solveNeighbourPush(curve, layout, size.width, size.height, 1) : 0
    const pushL = spreadValue > 0 ? spreadValue * solveNeighbourPush(curve, layout, size.width, size.height, -1) : 0

    materials.forEach((material, i) => {
      const u = material.uniforms
      const rel = wrapRel(i - nav.current, slots.length)
      const offset = i === activeSlot ? 0 : rel > 0 ? pushR : -pushL
      const s = (rel + offset) * layout.pitch
      slotS.current[i] = s
      u.uSlotS.value = s
      u.uCardsY.value = layout.cardsY
      u.uVelocity.value = nav.velocity * settle
      u.uTwist.value = twist
      u.uHover.value = damp(u.uHover.value, hovered.current === i && !nav.locked ? 1 : 0, 8, dt)
      u.uHole.value = profileFx.reveal * profileFx.holeRadius
      u.uHoleWobble.value = profileFx.wobble
      u.uTime.value = state.clock.elapsedTime
    })
    if (activeSlot != null && materials[activeSlot]) updateFlatTarget(materials[activeSlot].uniforms)

    // Videos: only projects on or near screen play; everything else pauses. Cards show
    // the poster until their video has a frame ready.
    playing.current.clear()
    slots.forEach((slot, i) => {
      const near = Math.abs(slotS.current[i]) < layout.pitch * 2.6 && materials[i].uniforms.uDim.value < 0.99
      if (near) playing.current.add(slot.project.id)
    })
    textures.forEach((entry, id) => {
      const video = entry.video
      if (!video) return
      const shouldPlay = !reducedMotion && playing.current.has(id)
      if (shouldPlay && video.paused) video.play().catch(() => {})
      else if (!shouldPlay && !video.paused) video.pause()
    })
    slots.forEach((slot, i) => {
      const entry = textures.get(slot.project.id)
      const ready = entry.video && entry.video.readyState >= 2 && (!reducedMotion || entry.video.currentTime > 0)
      materials[i].uniforms.uMap.value = ready ? entry.videoTexture : entry.media
    })

    // Hover picking + cursor.
    const next = !nav.locked && nav.pointerInside && nav.pick ? nav.pick(nav.pointerClient.x, nav.pointerClient.y) : -1
    if (next !== hovered.current) {
      hovered.current = next
      document.documentElement.dataset.cursor = next >= 0 ? 'pointer' : 'grab'
    }

    // Subtle camera parallax from the pointer; neutral while a project is open
    // so the morph lines up exactly with the DOM panel.
    const cam = state.camera
    const px = reducedMotion ? 0 : nav.pointer.x * settle
    const py = reducedMotion ? 0 : nav.pointer.y * settle
    parallax.current.x = damp(parallax.current.x, -px * 0.02, 3, dt)
    parallax.current.y = damp(parallax.current.y, py * 0.015, 3, dt)
    cam.rotation.y = parallax.current.x
    cam.rotation.x = parallax.current.y
  })

  return (
    <group>
      {slots.map((slot, i) => (
        <mesh
          key={slot.key}
          geometry={geometry}
          material={materials[i]}
          renderOrder={i === activeSlot ? 10 : 0}
          frustumCulled={false}
          raycast={() => null}
        />
      ))}
    </group>
  )
}
