import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/projects'

/** Minimal corner navigation, as in the reference. */
export function CornerNav({ view, canUse3D, profileOpen, hidden, onHome, onToggleProfile, onSetView }) {
  return (
    <nav className={`corners${hidden ? ' is-hidden' : ''}`} aria-label="Site">
      <button className="corner corner-tl" onClick={onHome}>
        {profile.name}
      </button>
      <button className="corner corner-tr" onClick={onToggleProfile} aria-expanded={profileOpen}>
        {profileOpen ? 'Close' : 'Profile'}
      </button>
      <div className="corner corner-bl">
        {canUse3D && (
          <>
            <button className={view === 'featured' ? 'is-active' : ''} aria-pressed={view === 'featured'} onClick={() => onSetView('featured')}>
              Featured
            </button>
            <span aria-hidden="true">/</span>
          </>
        )}
        <button className={view === 'full' ? 'is-active' : ''} aria-pressed={view === 'full'} onClick={() => onSetView('full')}>
          Full
        </button>
      </div>
      <a className="corner corner-br" href={`mailto:${profile.email}`}>
        Contact
      </a>
    </nav>
  )
}

/** Three dashes drawing in, as in the reference intro. */
export function Loader({ done, onGone }) {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => {
      setGone(true)
      onGone?.()
    }, 700)
    return () => clearTimeout(t)
  }, [done, onGone])
  if (gone) return null
  return (
    <div className={`loader${done ? ' is-done' : ''}`} role="status" aria-live="polite">
      <span className="loader-dash" />
      <span className="loader-dash" />
      <span className="loader-dash" />
      <span className="sr-only">Loading portfolio</span>
    </div>
  )
}

export function ProfileOverlay({ open, ringSize }) {
  const ref = useRef()
  useEffect(() => {
    if (open) ref.current?.focus({ preventScroll: true })
  }, [open])
  return (
    <section
      ref={ref}
      tabIndex={-1}
      className={`profile${open ? ' is-open' : ''}`}
      aria-hidden={!open}
      aria-label="Profile"
      style={{ '--ring-size': `${ringSize}px` }}
    >
      <div className="profile-inner">
        <p className="profile-bio">{profile.bio}</p>
        <p className="profile-highlight">{profile.highlights}</p>
        <ul className="profile-links">
          {profile.links.map((l, i) => (
            <li key={l.label}>
              {i > 0 && <span aria-hidden="true">×</span>}
              <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" tabIndex={open ? 0 : -1}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <span aria-hidden="true">×</span>
            <a href={profile.resume} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
              Résumé
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
