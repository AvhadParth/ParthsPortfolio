import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { CARD_ASPECT, centerDepth, getPanelRect } from './config'
import { createCurve } from './curve'
import { nav, nearestPositionFor, panelFx, profileFx } from './navStore'
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
  const tanY = Math.tan((layout.fov * Math.PI) / 360)
  const rect = getPanelRect(width, height)
  // Screen extent and panel margin along the strip's axis.
  const tanAlong = layout.vertical ? tanY : tanY * (width / height)
  const target = layout.vertical ? 1 - (rect.top * 0.5) / (height / 2) : 1 - (rect.left * 0.5) / (width / 2)
  const ndc = layout.wheelR
    ? (k) => {
        // Giant wheel: the neighbour's nearer edge (its top when below, its bottom
        // when above) on screen, in NDC along the vertical axis.
        const a = ((1 + k) * layout.pitch) / layout.wheelR
        const z = layout.waveDepth + layout.wheelR * (1 - Math.cos(a)) * layout.wheelTilt
        return (layout.wheelR * Math.sin(a) - layout.cardH / 2) / (z * tanAlong)
      }
    : (k) => {
        const p = curve.at(side * ((1 + k) * layout.pitch - layout.along / 2))
        return (side * p.x) / (-p.z * tanAlong)
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
  // Pointer flow: where the mouse meets the strip, and three dents that trail it at
  // different speeds so the surface seems to drag behind the cursor.
  const flow = useRef({ s: 0, a: 0, has: false, strength: 0, dents: [0, 1, 2].map(() => ({ s: 0, a: 0 })) })
  const slotS = useRef(new Float32Array(slots.length))
  const playing = useRef(new Set())
  // Live wave: `energy` deepens it with speed, `lean` slides the crest with direction.
  const wave = useRef({ energy: { x: 0, v: 0 }, lean: { x: 0, v: 0 } })
  // Giant wheel (phones): gondola swing, a lightly damped pendulum.
  const sway = useRef({ x: 0, v: 0 })
  const spokes = useRef()

  // Faint rim and spokes so the wheel reads as a wheel. The rim is static per layout;
  // the spokes follow the cards each frame.
  const wheelLines = useMemo(() => {
    if (!layout.wheelR) return null
    const R = layout.wheelR
    const top = layout.cardsY + layout.cardH / 2
    const rimPos = []
    const N = 160
    for (let i = 0; i < N; i++) {
      for (const k of [i, i + 1]) {
        const a = (k / N) * Math.PI * 2
        rimPos.push(R * (Math.cos(a) - 1), top - R * Math.sin(a), -layout.waveDepth - R * (1 - Math.cos(a)) * layout.wheelTilt)
      }
    }
    const rim = new THREE.BufferGeometry()
    rim.setAttribute('position', new THREE.Float32BufferAttribute(rimPos, 3))
    const spokeGeo = new THREE.BufferGeometry()
    spokeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(slots.length * 6), 3))
    const material = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.13, depthWrite: false })
    const hub = [-R, top, -layout.waveDepth - R * layout.wheelTilt]
    return { rim, spokeGeo, material, hub }
  }, [layout.wheelR, layout.wheelTilt, layout.cardH, layout.cardsY, layout.waveDepth, slots.length])
  useEffect(
    () => () => {
      if (!wheelLines) return
      wheelLines.rim.dispose()
      wheelLines.spokeGeo.dispose()
      wheelLines.material.dispose()
    },
    [wheelLines],
  )

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
    const probe = new THREE.Ray()
    // Where a screen point meets the strip: { s: along it, y: across it }, or null.
    nav.hit = (clientX, clientY) => {
      ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const ray = raycaster.ray
      if (layout.vertical) {
        // The curve lives in the x/z plane; a vertical strip is that plane turned on
        // its side (curve x → world -y), so turn the ray the same way.
        probe.origin.set(-(ray.origin.y - layout.cardsY), ray.origin.x, ray.origin.z)
        probe.direction.set(-ray.direction.y, ray.direction.x, ray.direction.z)
      } else {
        probe.origin.set(ray.origin.x, ray.origin.y - layout.cardsY, ray.origin.z)
        probe.direction.copy(ray.direction)
      }
      return curve.intersect(probe)
    }
    const wheelPick = (clientX, clientY) => {
      ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const { origin: o, direction: d } = raycaster.ray
      const s = slotS.current
      const R = layout.wheelR
      let best = -1
      let bestZ = -Infinity
      for (let i = 0; i < s.length; i++) {
        const a = s[i] / R
        if (Math.abs(a) > Math.PI / 2) continue
        const z = -layout.waveDepth - R * (1 - Math.cos(a)) * layout.wheelTilt
        const t = (z - o.z) / d.z
        const x = o.x + d.x * t
        const y = o.y + d.y * t
        const cx = R * (Math.cos(a) - 1)
        const cy = layout.cardsY - R * Math.sin(a)
        if (Math.abs(x - cx) <= layout.cardW / 2 && Math.abs(y - cy) <= layout.cardH / 2 && z > bestZ) {
          best = i
          bestZ = z
        }
      }
      return best
    }
    nav.pick = (clientX, clientY) => {
      if (layout.wheelR) return wheelPick(clientX, clientY)
      const hit = nav.hit(clientX, clientY)
      const across = layout.vertical ? layout.cardW : layout.cardH
      if (!hit || Math.abs(hit.y) > across / 2) return -1
      const s = slotS.current
      for (let i = 0; i < s.length; i++) if (Math.abs(hit.s - s[i]) <= layout.along / 2) return i
      return -1
    }
    return () => {
      nav.pick = null
      nav.hit = null
    }
  }, [camera, curve, layout.cardH, layout.cardW, layout.cardsY, layout.along, layout.vertical, layout.wheelR, layout.wheelTilt, layout.waveDepth])

  // Intro: as the loader fades, every card grows out of its spot into place.
  useEffect(() => {
    if (!introKey) return
    const fade = materials.map((m) => m.uniforms.uOpacity)
    const grow = materials.map((m) => m.uniforms.uIntro)
    if (reducedMotion) {
      fade.forEach((u) => (u.value = 1))
      grow.forEach((u) => (u.value = 1))
      return
    }
    fade.forEach((u) => (u.value = 0))
    grow.forEach((u) => (u.value = 0))
    const tl = gsap
      .timeline()
      .to(fade, { value: 1, duration: 0.35, ease: 'power1.out' }, 0)
      .to(grow, { value: 1, duration: 1.25, ease: 'expo.out' }, 0)
    return () => tl.kill()
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
      // Under a second in total: the card lifts, flattens into the panel and its image
      // slides into the case study's lead-image slot.
      const tl = gsap.timeline({ onComplete: onOpened })
      tl.to(nav, { current: center, target: center, duration: travel < 0.01 ? 0 : Math.min(0.5, 0.25 + travel * 0.12) * quick, ease: 'power3.inOut' })
        .addLabel('morph', '-=0.12')
        .to(others, { value: 1, duration: 0.5 * quick, ease: 'power2.out' }, 'morph')
        .to(spread.current, { value: 1, duration: 0.75 * quick, ease: 'power3.inOut' }, 'morph')
        .to(selected.uOpen, { value: 1, duration: 0.75 * quick, ease: 'power3.inOut' }, 'morph')
        .to(selected.uRipple, { value: reducedMotion ? 0 : 0.6, duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'morph')
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
      tl.to(selected.uOpen, { value: 0, duration: 0.55 * quick, ease: 'power3.inOut' })
        .to(selected.uRipple, { value: reducedMotion ? 0 : 0.5, duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '<')
        .to(spread.current, { value: 0, duration: 0.55 * quick, ease: 'power3.inOut' }, '<')
        .to(others, { value: 0, duration: 0.45 * quick, ease: 'power2.out' }, '<0.1')
        .to(nav, { current: back, target: back, duration: Math.abs(back - nav.current) < 0.01 ? 0 : 0.5 * quick, ease: 'power3.inOut' }, '<')
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
    // Momentum from a released drag keeps feeding the target, fading over ~2 seconds.
    if (nav.fling && !nav.locked && !nav.dragging) {
      nav.target += nav.fling * dt
      nav.fling *= Math.exp(-2.2 * dt)
      if (Math.abs(nav.fling) < 0.02) nav.fling = 0
    }
    // One smooth ease-out towards the target (measured on the reference: ~0.6 s to
    // cover 90% of the distance).
    if (!nav.locked) nav.current = damp(nav.current, nav.target, reducedMotion ? 14 : 6.3, dt)
    const rawVelocity = (nav.current - prevCurrent.current) / Math.max(dt, 1e-4)
    prevCurrent.current = nav.current
    nav.velocity = damp(nav.velocity, reducedMotion ? 0 : rawVelocity, 14, dt)

    const settle = nav.locked ? 0 : 1

    // Speed brings the ribbon alive, whatever moves it (wheel, drag or momentum). Calm
    // below ~2 cards/s; by ~8.5 cards/s the focused card swells towards the viewer while
    // the strip beside it sinks back into a thin, twisting ribbon. Springs keep the
    // change fluid, and it settles back as the strip slows.
    const v = reducedMotion || layout.vertical ? 0 : nav.velocity * settle
    const w = wave.current
    // Stiff, well-damped springs: the shape answers speed within a few frames and lets
    // go as soon as the strip slows, instead of lingering after it has stopped.
    springStep(w.energy, THREE.MathUtils.clamp((Math.abs(v) - 2.2) / 5.5, 0, 1), dt, 170, 21)
    springStep(w.lean, THREE.MathUtils.clamp(v / 8, -1, 1), dt, 170, 21)
    // At full energy the focused card grows from ~53% to ~65% of the screen height
    // (as measured) while the strip beside it sinks to several times its resting depth.
    const e = THREE.MathUtils.clamp(w.energy.x, 0, 1)
    const H = layout.cardH
    curve.update({
      depth: layout.waveDepth + 1.0 * H * e,
      amp: layout.waveAmp + 1.2 * H * e,
      // The wave lengthens and its peak slides towards the cards that are leaving, so
      // they stay large while the arriving side sinks back into the ribbon.
      length: layout.waveLength * (1 + 0.35 * e),
      phase: layout.wavePhase - w.lean.x * e * H * 0.9,
    })
    const twist = e * THREE.MathUtils.clamp(w.lean.x * 1.6, -1, 1) * 1.15

    // Pointer flow. Strength follows how fast the pointer travels across the strip and
    // fades over about a second once it stops; nothing while dragging or with a
    // project open.
    const f = flow.current
    const active = !reducedMotion && !nav.locked && !nav.dragging && nav.pointerInside && nav.hit
    const hit = active ? nav.hit(nav.pointerClient.x, nav.pointerClient.y) : null
    let drive = 0
    if (hit) {
      if (f.has) drive = THREE.MathUtils.clamp(Math.hypot(hit.s - f.s, hit.y - f.a) / Math.max(dt, 1e-3) / 7, 0, 1)
      else f.dents.forEach((d) => ((d.s = hit.s), (d.a = hit.y)))
      f.s = hit.s
      f.a = hit.y
    }
    f.has = !!hit
    f.strength = damp(f.strength, drive, drive > f.strength ? 9 : 2.4, dt)
    const follow = [16, 7, 3.5]
    f.dents.forEach((d, k) => {
      d.s = damp(d.s, f.s, follow[k], dt)
      d.a = damp(d.a, f.a, follow[k], dt)
    })

    // Giant wheel: gondolas trail the wheel's motion and rock gently after it stops.
    if (layout.wheelR) {
      const target = reducedMotion || nav.locked ? 0 : THREE.MathUtils.clamp(-nav.velocity * 0.045, -0.3, 0.3)
      springStep(sway.current, target, dt, 28, 2.4)
    }

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
      u.uVertical.value = layout.vertical ? 1 : 0
      u.uWheel.value = layout.wheelR ? 1 : 0
      if (layout.wheelR) {
        u.uWheelR.value = layout.wheelR
        u.uWheelDepth.value = layout.waveDepth
        u.uWheelTilt.value = layout.wheelTilt
        u.uCardH.value = layout.cardH
        u.uSway.value = sway.current.x
      }
      u.uIntroOrigin.value.set(0, layout.cardsY, -centerDepth(layout))
      u.uVelocity.value = nav.velocity * settle
      u.uTwist.value = twist
      const weights = [1, 0.7, 0.45]
      f.dents.forEach((d, k) => u.uDents.value[k].set(d.s, d.a, f.strength * weights[k]))
      u.uDentRadius.value = layout.cardH * 0.34
      u.uHole.value = profileFx.reveal * profileFx.holeRadius
      u.uHoleWobble.value = profileFx.wobble
      u.uTime.value = state.clock.elapsedTime
    })
    if (wheelLines && spokes.current) {
      const pos = wheelLines.spokeGeo.attributes.position
      const R = layout.wheelR
      const top = layout.cardsY + layout.cardH / 2
      for (let i = 0; i < slots.length; i++) {
        const ang = slotS.current[i] / R
        pos.setXYZ(i * 2, wheelLines.hub[0], wheelLines.hub[1], wheelLines.hub[2])
        pos.setXYZ(i * 2 + 1, R * (Math.cos(ang) - 1), top - R * Math.sin(ang), -layout.waveDepth - R * (1 - Math.cos(ang)) * layout.wheelTilt)
      }
      pos.needsUpdate = true
      spokes.current.visible = !nav.locked && profileFx.reveal < 0.01
    }
    if (activeSlot != null && materials[activeSlot]) {
      const u = materials[activeSlot].uniforms
      updateFlatTarget(u)
      const hero = panelFx.hero
      if (hero) u.uHero.value.set(hero[0], hero[1], hero[2], hero[3])
      else u.uHero.value.set(0, 0, 1, 1)
      const video = textures.get(slots[activeSlot].project.id).video
      if (video) panelFx.videoTime = video.currentTime
    }

    // Videos: only projects on or near screen play; everything else pauses. Cards show
    // the poster until their video has a frame ready.
    playing.current.clear()
    slots.forEach((slot, i) => {
      // The focused card and one either side: what's actually on screen. Outer cards
      // keep their posters until scrolled to, so the page doesn't load every video.
      const near = Math.abs(slotS.current[i]) < layout.pitch * 1.5 && materials[i].uniforms.uDim.value < 0.99
      if (near) playing.current.add(slot.project.id)
    })
    textures.forEach((entry, id) => {
      const video = entry.video
      if (!video) return
      const near = playing.current.has(id)
      // Attach the source the first time the card comes near once the strip has arrived
      // where it's heading, so cards that only fly past (intro glide, fast scrolls)
      // don't download.
      if (near && Math.abs(nav.target - nav.current) < 0.15 && !video.src && video.dataset.src) {
        video.src = video.dataset.src
        video.preload = reducedMotion ? 'metadata' : 'auto'
      }
      const shouldPlay = !reducedMotion && near
      if (shouldPlay && video.paused) video.play().catch(() => {})
      else if (!shouldPlay && !video.paused) video.pause()
    })
    slots.forEach((slot, i) => {
      const entry = textures.get(slot.project.id)
      const ready = entry.video && entry.video.readyState >= 2 && (!reducedMotion || entry.video.currentTime > 0)
      materials[i].uniforms.uMap.value = ready ? entry.videoTexture : entry.media
      materials[i].uniforms.uVideo.value = ready ? 1 : 0
    })

    // Hover picking + cursor.
    const next = !nav.locked && nav.pointerInside && nav.pick ? nav.pick(nav.pointerClient.x, nav.pointerClient.y) : -1
    if (next !== hovered.current) {
      hovered.current = next
      document.documentElement.dataset.cursor = next >= 0 ? 'pointer' : 'grab'
    }

  })

  return (
    <group>
      {wheelLines && (
        <group renderOrder={-1}>
          <lineSegments ref={spokes} geometry={wheelLines.spokeGeo} material={wheelLines.material} frustumCulled={false} />
          <lineSegments geometry={wheelLines.rim} material={wheelLines.material} frustumCulled={false} visible={activeSlot == null} />
        </group>
      )}
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
