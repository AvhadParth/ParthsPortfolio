import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CubeCamera, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { RING_RADIUS, RING_TUBE, centerDepth, getRingScale } from './config'
import { nav, profileFx, wrapIndex } from './navStore'

const SPHERES = [
  [0.52, 0.34, -0.1, 0.05],
  [-0.46, -0.4, 0.05, 0.035],
  [0.18, -0.58, -0.15, 0.028],
  [-0.2, 0.55, 0.1, 0.03],
  [0.6, -0.18, 0.12, 0.022],
]

const GLASS_BACKGROUND = new THREE.Color('#000000')

/** Same organic wobble as the hole in the card shader, so ring and hole move together. */
const wobbleAt = (angle, time) => 0.16 * Math.sin(3 * angle + time * 1.7) + 0.09 * Math.sin(5 * angle - time * 2.3)

/**
 * Wobble a torus on the CPU (works with any material, including glass). Only touches
 * the vertices while the wobble is active; restores the perfect circle once it settles.
 */
function useWobblyTorus(radius, tube) {
  const geometry = useMemo(() => new THREE.TorusGeometry(radius, tube, 48, 200), [radius, tube])
  const base = useMemo(() => Float32Array.from(geometry.attributes.position.array), [geometry])
  const settled = useRef(true)
  useEffect(() => () => geometry.dispose(), [geometry])

  const apply = (amount, time) => {
    const pos = geometry.attributes.position
    if (amount < 5e-4) {
      if (!settled.current) {
        pos.array.set(base)
        pos.needsUpdate = true
        geometry.computeVertexNormals()
        settled.current = true
      }
      return
    }
    settled.current = false
    const arr = pos.array
    for (let i = 0; i < arr.length; i += 3) {
      const x = base[i]
      const y = base[i + 1]
      const f = 1 + amount * wobbleAt(Math.atan2(y, x), time)
      arr[i] = x * f
      arr[i + 1] = y * f
    }
    pos.needsUpdate = true
    geometry.computeVertexNormals()
  }
  return { geometry, apply }
}

/**
 * Draws the FULL view's list of names (read from the DOM, so positions match exactly)
 * into a full-viewport canvas. The glass ring refracts this into swirling streaks.
 */
function captureIndexText(width, height) {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.textBaseline = 'middle'
  document.querySelectorAll('.index-name, .index-dot').forEach((el) => {
    const r = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    ctx.fillStyle = el.classList.contains('index-dot') ? 'rgba(244,244,241,0.6)' : '#f4f4f1'
    ctx.fillText(el.textContent.trim(), r.left, r.top + r.height / 2)
  })
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Profile view.
 * - `chrome` (gallery): a hole opens in the card wall and a thick chrome ring grows out
 *   of it, first wearing the card's imagery, then settling into a perfect torus.
 * - `glass` (FULL view): a clear glass ring grows in, refracting the list of names into
 *   swirling, rainbow-fringed streaks — the "black hole".
 * A cube camera captures a private studio (plus the scene) for reflections/highlights.
 */
export function ProfileRing({ open, mode = 'chrome', slots, textures, layout, reducedMotion, onHidden }) {
  const { size } = useThree()
  const group = useRef()
  const spin = useRef()
  const depth = centerDepth(layout)
  const scale = getRingScale(layout, size.width, size.height)
  const glass = mode === 'glass'
  const ring = useWobblyTorus(RING_RADIUS, glass ? RING_TUBE * 0.8 : RING_TUBE)
  const wrapRing = useWobblyTorus(RING_RADIUS, RING_TUBE * 1.004)

  // Chrome ring starts out wrapped in the imagery of the card it grows out of.
  const wrapMaterial = useMemo(() => {
    const slot = slots[wrapIndex(Math.round(nav.current), slots.length)]
    const entry = textures.get(slot.project.id)
    const map = entry.video && entry.video.readyState >= 2 ? entry.videoTexture : entry.media
    return new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0, depthWrite: false })
  }, [slots, textures])
  useEffect(() => () => wrapMaterial.dispose(), [wrapMaterial])

  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.04, envMapIntensity: 1.4 }), [])
  useEffect(() => () => chrome.dispose(), [chrome])

  // FULL view: the names, as a plane filling the view just behind the ring.
  const textDepth = depth + 0.8
  const textPlane = useMemo(() => {
    if (!glass) return null
    const visH = 2 * textDepth * Math.tan((layout.fov * Math.PI) / 360)
    return { texture: captureIndexText(size.width, size.height), w: visH * (size.width / size.height), h: visH }
  }, [glass, textDepth, layout.fov, size.width, size.height])
  useEffect(() => () => textPlane?.texture.dispose(), [textPlane])
  const sweep = useRef()

  // A private "studio" behind the camera: invisible in the main view but captured by
  // the cube camera, giving the chrome/glass crisp highlights (and card colours for chrome).
  const studio = useMemo(() => {
    const white = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide })
    const images = [...textures.values()].map((t) => new THREE.MeshBasicMaterial({ map: t.media, side: THREE.DoubleSide }))
    return { white, images }
  }, [textures])
  useEffect(
    () => () => {
      studio.white.dispose()
      studio.images.forEach((m) => m.dispose())
    },
    [studio],
  )
  const panels = useMemo(() => {
    const count = 10
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2
      return { position: [Math.cos(a) * 2.6, Math.sin(a) * 2.6, 2.2], rotation: [0, 0, a + Math.PI / 2], material: i % studio.images.length }
    })
  }, [studio])

  useEffect(() => {
    profileFx.holeRadius = glass ? 0 : RING_RADIUS * scale
  }, [scale, glass])

  useEffect(() => {
    const fx = profileFx
    let tl
    if (reducedMotion) {
      tl = gsap.to(fx, { reveal: open ? 1 : 0, wobble: 0, wrap: 0, duration: 0.3, onComplete: () => !open && onHidden?.() })
    } else if (open) {
      fx.wobble = 1
      fx.wrap = glass ? 0 : 1
      tl = gsap
        .timeline()
        .to(fx, { reveal: 1, duration: 1.7, ease: 'power3.inOut' }, 0)
        .to(fx, { wobble: 0, duration: 2.2, ease: 'power2.inOut' }, 0.4)
        .to(fx, { wrap: 0, duration: 1.6, ease: 'power1.inOut' }, 0.8)
    } else {
      tl = gsap
        .timeline({ onComplete: () => onHidden?.() })
        .to(fx, { wrap: glass ? 0 : 0.7, duration: 0.45, ease: 'power1.out' }, 0)
        .to(fx, { wobble: 1, duration: 0.6, ease: 'power2.in' }, 0)
        .to(fx, { reveal: 0, duration: 0.9, ease: 'power3.in' }, 0.1)
    }
    return () => tl.kill()
  }, [open, reducedMotion, onHidden, glass])

  // Leave the wall intact once the ring is gone.
  useEffect(
    () => () => {
      profileFx.reveal = 0
      profileFx.wobble = 0
      profileFx.wrap = 0
    },
    [],
  )

  useFrame(({ clock }) => {
    const r = profileFx.reveal
    const t = clock.elapsedTime
    ring.apply(profileFx.wobble, t)
    if (!glass) wrapRing.apply(profileFx.wobble, t)
    wrapMaterial.opacity = profileFx.wrap
    group.current.scale.setScalar(Math.max(1e-4, scale * r))
    group.current.visible = r > 0.001
    // Glass: light strips circle behind the camera so a bright crescent sweeps the rim.
    if (sweep.current && !reducedMotion) sweep.current.rotation.z = t * 0.6
    if (!reducedMotion) {
      spin.current.rotation.x = Math.sin(t * 0.3) * 0.05
      spin.current.rotation.y = Math.sin(t * 0.4) * 0.06
    }
  })

  return (
    <>
      <group>
        {!glass &&
          panels.map((p, i) => (
            <mesh key={i} position={p.position} rotation={p.rotation} material={studio.images[p.material]}>
              <planeGeometry args={[2.4, 1.6]} />
            </mesh>
          ))}
        <mesh material={studio.white} position={[0, 2.2, 4]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 0.8]} />
        </mesh>
        <mesh material={studio.white} position={[-3, -0.4, 3]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3, 0.4]} />
        </mesh>
        {glass && (
          <group ref={sweep} position={[0, 0, 2.4]}>
            <mesh material={studio.white} position={[0, 2.4, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
              <planeGeometry args={[5, 1.1]} />
            </mesh>
            <mesh material={studio.white} position={[0, -2.4, 0]} rotation={[-Math.PI / 2.4, 0, 0]}>
              <planeGeometry args={[3, 0.5]} />
            </mesh>
          </group>
        )}
      </group>

      {textPlane && (
        <mesh position={[0, 0, -textDepth]}>
          <planeGeometry args={[textPlane.w, textPlane.h]} />
          {/* Identical to the DOM list it replaces, so the handover is invisible. */}
          <meshBasicMaterial map={textPlane.texture} transparent toneMapped={false} />
        </mesh>
      )}

      <group ref={group} position={[0, layout.cardsY, -depth]}>
        <CubeCamera resolution={256} frames={Infinity} near={0.05} far={60}>
          {(texture) => {
            if (chrome.envMap !== texture) {
              chrome.envMap = texture
              chrome.needsUpdate = true
            }
            return (
              <group ref={spin}>
                {/* Black disc: the profile text sits on pure black inside the ring. */}
                <mesh position={[0, 0, -RING_TUBE * 0.9]}>
                  <circleGeometry args={[RING_RADIUS, 96]} />
                  <meshBasicMaterial color="#000000" />
                </mesh>
                {glass ? (
                  <mesh geometry={ring.geometry}>
                    <MeshTransmissionMaterial
                      envMap={texture}
                      envMapIntensity={3}
                      transmission={1}
                      thickness={0.9}
                      roughness={0}
                      ior={1.5}
                      chromaticAberration={0.9}
                      anisotropicBlur={0.15}
                      distortion={0.35}
                      distortionScale={0.4}
                      temporalDistortion={0.08}
                      clearcoat={1}
                      backside
                      backsideThickness={0.4}
                      samples={6}
                      resolution={768}
                      background={GLASS_BACKGROUND}
                    />
                  </mesh>
                ) : (
                  <>
                    <mesh geometry={ring.geometry} material={chrome} />
                    <mesh geometry={wrapRing.geometry} material={wrapMaterial} />
                  </>
                )}
                {SPHERES.map(([x, y, z, r], i) => (
                  <mesh key={i} position={[x, y, z]}>
                    <sphereGeometry args={[r, 32, 32]} />
                    <meshStandardMaterial envMap={texture} metalness={1} roughness={0.05} />
                  </mesh>
                ))}
              </group>
            )
          }}
        </CubeCamera>
      </group>
    </>
  )
}
