import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { profile, projects } from './data/projects'
import { buildSlots, getLayout, getRingHolePx, isLowPowerDevice, isWebGLAvailable, prefersReducedMotion } from './gallery/config'
import { nav, nearestPositionFor, wrapIndex } from './gallery/navStore'
import { composeLabel, composeMedia, ensureFonts } from './gallery/textures'
import { useGalleryControls } from './gallery/useGalleryControls'
import { ProjectPanel } from './gallery/ProjectPanel'
import { ProjectIndex } from './gallery/ProjectIndex'
import { CornerNav, Loader, ProfileOverlay } from './gallery/Interface'

const MIN_LOADER_MS = 1100

// three.js is only downloaded when the 3D gallery is actually used.
const GalleryCanvas = lazy(() => import('./gallery/GalleryCanvas').then((m) => ({ default: m.GalleryCanvas })))

function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function useViewportSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

export default function App() {
  const canUse3D = useMemo(() => isWebGLAvailable() && !isLowPowerDevice(), [])
  const reducedMotion = useReducedMotion()
  const viewport = useViewportSize()
  const slots = useMemo(() => buildSlots(projects), [])

  const [view, setView] = useState(canUse3D ? 'featured' : 'full')
  const [cardCanvases, setCardCanvases] = useState(null)
  const [ready, setReady] = useState(false)
  const [introKey, setIntroKey] = useState(0)

  // 'gallery' → 'opening' → 'project' → 'closing' → 'gallery'
  const [phase, setPhase] = useState('gallery')
  const [activeSlot, setActiveSlot] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [standalone, setStandalone] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [ringMounted, setRingMounted] = useState(false)

  const stageRef = useRef()
  const lastFocus = useRef(null)

  // Preload fonts + compose card textures before revealing the gallery.
  useEffect(() => {
    let cancelled = false
    const started = performance.now()
    ;(async () => {
      await ensureFonts()
      let canvases = null
      if (canUse3D) {
        const list = await Promise.all(projects.map(async (p) => ({ media: await composeMedia(p), label: composeLabel(p) })))
        canvases = new Map(projects.map((p, i) => [p.id, list[i]]))
      }
      const wait = Math.max(0, MIN_LOADER_MS - (performance.now() - started))
      setTimeout(() => {
        if (cancelled) return
        setCardCanvases(canvases)
        setReady(true)
      }, wait)
    })()
    return () => {
      cancelled = true
    }
  }, [canUse3D])

  const onLoaderGone = useCallback(() => setIntroKey((k) => k + 1), [])

  const layout = getLayout(slots.length, viewport.w, viewport.h)
  // On-screen width of one card step near the focus, used to map drag pixels → slots.
  const slotWidthPx = useCallback(() => {
    const l = getLayout(slots.length, window.innerWidth, window.innerHeight)
    const tanX = Math.tan((l.fov * Math.PI) / 360) * (window.innerWidth / window.innerHeight)
    return (l.pitch / (2 * l.waveDepth * tanX)) * window.innerWidth
  }, [slots.length])

  const openSlot = useCallback(
    (slot) => {
      if (phase !== 'gallery') return
      lastFocus.current = document.activeElement
      setProfileOpen(false)
      setStandalone(false)
      setActiveSlot(slot)
      setActiveIndex(slots[slot].projectIndex)
      setPhase('opening')
    },
    [phase, slots],
  )

  const onTap = useCallback(
    (x, y) => {
      const slot = nav.pick ? nav.pick(x, y) : -1
      if (slot >= 0) openSlot(slot)
    },
    [openSlot],
  )

  const openCentered = useCallback(() => openSlot(wrapIndex(Math.round(nav.current), slots.length)), [openSlot, slots.length])

  const openFromIndex = useCallback(
    (index) => {
      if (phase !== 'gallery') return
      lastFocus.current = document.activeElement
      setStandalone(true)
      setActiveIndex(index)
      setPhase('project')
    },
    [phase],
  )

  const onOpened = useCallback(() => setPhase('project'), [])

  const restoreFocus = () => {
    const el = lastFocus.current
    if (el && document.contains(el)) el.focus({ preventScroll: true })
  }

  const onClosed = useCallback(() => {
    setPhase('gallery')
    setActiveSlot(null)
    setActiveIndex(null)
    restoreFocus()
  }, [])

  const onPanelClose = useCallback(() => {
    if (standalone) {
      setPhase('gallery')
      setActiveIndex(null)
      setStandalone(false)
      restoreFocus()
    } else {
      setPhase('closing')
    }
  }, [standalone])

  const toggleProfile = useCallback(() => {
    if (phase !== 'gallery') return
    if (!profileOpen && canUse3D) setRingMounted(true)
    setProfileOpen(!profileOpen)
  }, [phase, profileOpen, canUse3D])

  const goHome = useCallback(() => {
    setProfileOpen(false)
    if (canUse3D) setView('featured')
    nav.target = Math.round(nav.target / slots.length) * slots.length
  }, [canUse3D, slots.length])

  const onRingHidden = useCallback(() => setRingMounted(false), [])

  // Escape closes the profile.
  useEffect(() => {
    if (!profileOpen) return
    const onKey = (e) => e.key === 'Escape' && setProfileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [profileOpen])

  // Default cursor; Drum switches it to 'pointer' while hovering a card.
  useEffect(() => {
    document.documentElement.dataset.cursor = 'grab'
  }, [])

  const featured = view === 'featured' && canUse3D
  useGalleryControls(stageRef, {
    enabled: featured && ready && phase === 'gallery',
    slotWidthPx,
    onActivate: openCentered,
    onTap,
  })

  // Accessible, focusable list of projects that drives the drum.
  const focusProject = (index) => {
    let best = null
    slots.forEach((s, i) => {
      if (s.projectIndex !== index) return
      const pos = nearestPositionFor(i, nav.target, slots.length)
      if (best == null || Math.abs(pos - nav.target) < Math.abs(best.pos - nav.target)) best = { pos, slot: i }
    })
    if (best) nav.target = best.pos
    return best
  }

  const activeProject = activeIndex != null ? projects[activeIndex] : null
  const showPanel = activeProject && phase === 'project'
  const ringHole = getRingHolePx(layout, viewport.w, viewport.h)

  return (
    <div className={`app view-${view}${phase !== 'gallery' ? ' is-locked' : ''}${profileOpen ? ' is-profile' : ''}${canUse3D ? '' : ' no-3d'}${ringMounted ? ' is-ring' : ''}`}>
      <h1 className="sr-only">
        {profile.name} — {profile.role}
      </h1>

      {canUse3D && (
        <div
          ref={stageRef}
          className={`stage${featured ? '' : ' is-inactive'}${!featured && ringMounted ? ' is-ring' : ''}`}
          tabIndex={featured ? 0 : -1}
          role="region"
          aria-roledescription="3D gallery"
          aria-label="Project gallery. Use the arrow keys to browse and Enter to open the centred project."
        >
          {cardCanvases && (
            <Suspense fallback={null}>
            <GalleryCanvas
              slots={slots}
              active={featured}
              cardCanvases={cardCanvases}
              phase={phase}
              activeSlot={activeSlot}
              reducedMotion={reducedMotion}
              onOpened={onOpened}
              onClosed={onClosed}
              introKey={introKey}
              profileOpen={profileOpen}
              ringMounted={ringMounted}
              onRingHidden={onRingHidden}
            />
            </Suspense>
          )}
        </div>
      )}

      {featured && (
        <ul className="a11y-list" aria-label="Projects">
          {projects.map((p, i) => (
            <li key={p.id}>
              <button
                onFocus={() => focusProject(i)}
                onClick={() => {
                  const best = focusProject(i)
                  if (best) openSlot(best.slot)
                }}
              >
                {String(i + 1).padStart(2, '0')} — {p.title}
              </button>
            </li>
          ))}
        </ul>
      )}

      {view === 'full' && ready && <ProjectIndex projects={projects} onOpen={openFromIndex} reducedMotion={reducedMotion} />}

      <ProfileOverlay open={profileOpen} ringSize={canUse3D ? ringHole : Math.min(viewport.w * 0.86, 560)} />

      <CornerNav
        view={view}
        canUse3D={canUse3D}
        profileOpen={profileOpen}
        hidden={!ready || phase !== 'gallery'}
        onHome={goHome}
        onToggleProfile={toggleProfile}
        onSetView={(v) => {
          if (v === view) return
          setProfileOpen(false)
          setRingMounted(false)
          setView(v)
        }}
      />

      {showPanel && (
        <ProjectPanel
          key={activeProject.id}
          project={activeProject}
          index={activeIndex}
          total={projects.length}
          standalone={standalone || !featured}
          reducedMotion={reducedMotion}
          onClose={onPanelClose}
        />
      )}

      <Loader done={ready} onGone={onLoaderGone} />
    </div>
  )
}
