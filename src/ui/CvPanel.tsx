import { career } from '../data/career'
import { certifications } from '../data/certifications'
import { profile } from '../data/profile'
import { CATEGORY_LABEL, CATEGORY_ORDER, stack } from '../data/stack'
import { Panel } from './Panel'
import styles from './CvPanel.module.css'

/**
 * El CV, el que se levanta de la carpeta del escritorio.
 *
 * Antes la carpeta disparaba la descarga a ciegas: te bajaba un archivo sin
 * que hubieras visto nunca qué decía. Ahora se lee acá mismo y la descarga
 * es un botón, no la única salida.
 *
 * Se dibuja como una hoja de papel y no como los demás paneles a propósito:
 * el visitante acaba de levantar algo del escritorio y tiene que reconocer
 * qué es antes de leer una palabra.
 *
 * No es una imagen del PDF: es HTML armado con los mismos datos de
 * `src/data/`. Así el texto se selecciona, lo leen los buscadores y los
 * lectores de pantalla (SPEC §9), se ve bien en celular, y sobre todo no
 * se desactualiza — si cambia la trayectoria, cambia el CV.
 */
export default function CvPanel() {
  return (
    <Panel title="CV" subtitle={`${profile.name} · ${profile.role}`} lift>
      <div className={styles.actions}>
        {/* Descarga en un clic: `download` evita que el navegador lo abra
            en una pestaña y se lleve al visitante fuera del cuarto */}
        <a className={styles.download} href={profile.cv} download>
          Descargar PDF
        </a>
        <span className={styles.hint}>o leelo acá mismo</span>
      </div>

      <article className={styles.sheet}>
        <header className={styles.sheetHead}>
          <h3 className={styles.name}>{profile.name}</h3>
          <p className={styles.role}>{profile.role}</p>
          <p className={styles.contact}>
            {profile.location} · {profile.mode} · {profile.email}
          </p>
        </header>

        <section className={styles.block}>
          <h4 className={styles.blockTitle}>Perfil</h4>
          <p className={styles.summary}>{profile.summary}</p>
        </section>

        <section className={styles.block}>
          <h4 className={styles.blockTitle}>Experiencia y formación</h4>
          {career.map((item) => (
            <div key={item.id} className={styles.entry}>
              <span className={styles.period}>{item.period}</span>
              <div>
                <h5 className={styles.entryRole}>{item.role}</h5>
                <p className={styles.entryPlace}>{item.place}</p>
                <p className={styles.entryText}>{item.description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.block}>
          <h4 className={styles.blockTitle}>Stack</h4>
          {CATEGORY_ORDER.map((category) => {
            const items = stack.filter((tech) => tech.category === category)
            if (items.length === 0) return null

            return (
              <p key={category} className={styles.line}>
                <span className={styles.lineLabel}>{CATEGORY_LABEL[category]}</span>
                {items.map((tech) => tech.name).join(' · ')}
              </p>
            )
          })}
        </section>

        <section className={styles.block}>
          <h4 className={styles.blockTitle}>Certificaciones</h4>
          {certifications.map((cert) => (
            <p key={cert.id} className={styles.line}>
              <span className={styles.lineLabel}>{cert.year}</span>
              {cert.name} — {cert.issuer}
            </p>
          ))}
        </section>

        <section className={styles.block}>
          <h4 className={styles.blockTitle}>Idiomas</h4>
          <p className={styles.line}>{profile.languages.join(' · ')}</p>
        </section>

        <footer className={styles.sheetFoot}>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </footer>
      </article>
    </Panel>
  )
}
