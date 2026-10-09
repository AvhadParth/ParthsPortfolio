import { profile } from '../data/projects'
import { PanelShell } from './PanelShell'

/** About view: who Parth is, experience timeline, education and skills. */
export function AboutPanel({ reducedMotion, onClose }) {
  return (
    <PanelShell labelledBy="about-title" closeLabel="Close about" standalone reducedMotion={reducedMotion} onClose={onClose}>
      <header className="panel-info">
        <h2 id="about-title" className="panel-title panel-reveal">
          {profile.name}
        </h2>
        <p className="about-role panel-reveal">
          {profile.role}, {profile.location}
        </p>
        <p className="panel-summary panel-reveal">{profile.bio}</p>
        <ul className="about-links panel-reveal">
          {profile.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a className="about-resume" href={profile.resume} download>
              Download résumé (PDF)
            </a>
          </li>
        </ul>
      </header>

      <div className="about-body">
        <section className="about-section panel-reveal" aria-labelledby="about-experience">
          <h3 id="about-experience">Experience</h3>
          <ol className="about-timeline">
            {profile.experience.map((job) => (
              <li key={job.role + job.company}>
                <p className="about-period">{job.period}</p>
                <div>
                  <p className="about-heading">{job.role}</p>
                  <p className="about-sub">
                    {job.company}, {job.location}
                  </p>
                  <ul className="about-details">
                    {job.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-section panel-reveal" aria-labelledby="about-education">
          <h3 id="about-education">Education</h3>
          <ol className="about-timeline">
            {profile.education.map((e) => (
              <li key={e.degree}>
                <p className="about-period">{e.period}</p>
                <div>
                  <p className="about-heading">{e.degree}</p>
                  <p className="about-sub">{e.institution}</p>
                  <p className="about-note">{e.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-section panel-reveal" aria-labelledby="about-skills">
          <h3 id="about-skills">Skills</h3>
          <dl className="about-skills">
            {profile.skills.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </PanelShell>
  )
}
