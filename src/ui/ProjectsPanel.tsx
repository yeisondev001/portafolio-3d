import { useState } from 'react'
import { projects, type Project } from '../data/projects'
import { Panel } from './Panel'
import styles from './ProjectsPanel.module.css'

/** Mientras no haya captura, un bloque de color con la inicial del proyecto */
function Thumb({ project, className }: { project: Project; className: string }) {
  if (project.image) {
    return <img className={className} src={project.image} alt={project.name} loading="lazy" />
  }
  return (
    <div
      className={className}
      style={{
        background: project.placeholder,
        display: 'grid',
        placeItems: 'center',
        fontSize: 42,
        opacity: 0.9,
      }}
      aria-hidden="true"
    >
      {project.name.charAt(0)}
    </div>
  )
}

function Detail({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <>
      <button type="button" className={styles.back} onClick={onBack}>
        ← Todos los proyectos
      </button>

      <div className={styles.detail}>
        <Thumb project={project} className={styles.shot} />

        <div className={styles.detailText}>
          <span className={styles.year}>{project.year}</span>
          <p>{project.description}</p>

          <ul className={styles.tags}>
            {project.stack.map((tech) => (
              <li key={tech} className={styles.tag}>
                {tech}
              </li>
            ))}
          </ul>

          <div className={styles.links}>
            {project.demo && (
              <a
                className={`${styles.link} ${styles.primary}`}
                href={project.demo}
                target="_blank"
                rel="noreferrer"
              >
                Ver el sitio
              </a>
            )}
            {project.repo && (
              <a className={styles.link} href={project.repo} target="_blank" rel="noreferrer">
                Código
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function ProjectsPanel() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <Panel
      title={selected ? selected.name : 'Proyectos'}
      subtitle={selected ? selected.tagline : `${projects.length} proyectos`}
    >
      {selected ? (
        <Detail project={selected} onBack={() => setSelected(null)} />
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className={styles.card}
              onClick={() => setSelected(project)}
            >
              <Thumb project={project} className={styles.thumb} />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{project.name}</h3>
                <p className={styles.cardTagline}>{project.tagline}</p>
                <ul className={styles.tags}>
                  {project.stack.slice(0, 3).map((tech) => (
                    <li key={tech} className={styles.tag}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          ))}
        </div>
      )}
    </Panel>
  )
}
