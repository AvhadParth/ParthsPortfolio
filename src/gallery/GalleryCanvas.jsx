import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Grid, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { getLayout } from './config'
import { nav } from './navStore'
import { Drum } from './Drum'
import { ProfileRing } from './ProfileRing'

function Floor({ layout }) {
  const ref = useRef()
  const cell = layout.cardH * 0.3
  // Scroll the floor with the drum so the space feels continuous.
  useFrame(() => {
    const travel = nav.current * layout.pitch * 0.6
    ref.current.position.x = -(((travel % cell) + cell) % cell)
  })
  return (
    <Grid
      ref={ref}
      position={[0, layout.floorY, -layout.distance]}
      args={[60, 60]}
      cellSize={cell}
      cellThickness={1.1}
      cellColor="#474747"
      sectionSize={cell * 100}
      sectionThickness={0}
      fadeDistance={layout.distance * 3.2}
      fadeStrength={1.5}
      infiniteGrid
    />
  )
}

function Scene({ cardCanvases, ...props }) {
  const { size, camera, gl } = useThree()

  // Per project: a media still (poster/cover/placeholder), a label overlay and, when the
  // project has one, a looping muted video that replaces the still once it can play.
  // Shared by the repeated slots and the ring reflections.
  const textures = useMemo(() => {
    const map = new Map()
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    const canvasTexture = (canvas) => {
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = anisotropy
      return texture
    }
    props.slots.forEach(({ project }) => {
      if (map.has(project.id)) return
      const canvases = cardCanvases.get(project.id)
      const entry = { media: canvasTexture(canvases.media), label: canvasTexture(canvases.label), video: null, videoTexture: null }
      if (project.video) {
        const video = document.createElement('video')
        video.src = project.video
        video.muted = true
        video.loop = true
        video.playsInline = true
        video.preload = 'auto'
        video.setAttribute('aria-hidden', 'true')
        entry.video = video
        entry.videoTexture = new THREE.VideoTexture(video)
        entry.videoTexture.colorSpace = THREE.SRGBColorSpace
      }
      map.set(project.id, entry)
    })
    return map
  }, [cardCanvases, gl, props.slots])
  useEffect(
    () => () =>
      textures.forEach((t) => {
        t.media.dispose()
        t.label.dispose()
        t.videoTexture?.dispose()
        if (t.video) {
          t.video.pause()
          t.video.removeAttribute('src')
          t.video.load()
        }
      }),
    [textures],
  )

  const layout = getLayout(props.slots.length, size.width, size.height)
  useLayoutEffect(() => {
    camera.fov = layout.fov
    camera.updateProjectionMatrix()
  }, [camera, layout.fov])
  return (
    <>
      <color attach="background" args={['#000000']} />
      {props.active && <Floor layout={layout} />}
      <group visible={props.active}>
        <Drum {...props} textures={textures} layout={layout} />
      </group>
      {props.ringMounted && (
        <ProfileRing
          key={props.active ? 'chrome' : 'glass'}
          mode={props.active ? 'chrome' : 'glass'}
          open={props.profileOpen}
          slots={props.slots}
          textures={textures}
          layout={layout} reducedMotion={props.reducedMotion} onHidden={props.onRingHidden} />
      )}
    </>
  )
}

export function GalleryCanvas(props) {
  const [dpr, setDpr] = useState(Math.min(window.devicePixelRatio || 1, 1.75))
  return (
    <Canvas
      className="stage-canvas"
      dpr={dpr}
      frameloop={props.ringMounted ? 'always' : !props.active || props.phase === 'project' ? 'demand' : 'always'}
      camera={{ position: [0, 0, 0], fov: 32, near: 0.05, far: 80 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(window.devicePixelRatio || 1, 1.75))} />
      <Scene {...props} />
    </Canvas>
  )
}
