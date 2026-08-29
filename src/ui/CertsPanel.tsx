import { certifications } from '../data/certifications'
import { Panel } from './Panel'
import styles from './Content.module.css'

export default function CertsPanel() {
  return (
    <Panel title="Certificaciones" subtitle={`${certifications.length} certificaciones`}>
      <div className={styles.grid}>
        {certifications.map((cert) => (
          <article key={cert.id} className={styles.card}>
            {cert.image ? (
              <img className={styles.thumb} src={cert.image} alt={cert.name} loading="lazy" />
            ) : (
              <div
                className={styles.thumb}
                style={{ background: cert.placeholder }}
                aria-hidden="true"
              >
                {cert.name.charAt(0)}
              </div>
            )}

            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{cert.name}</h3>
              <p className={styles.cardMeta}>
                {cert.issuer} · {cert.year}
              </p>
              {cert.verify && (
                <a className={styles.verify} href={cert.verify} target="_blank" rel="noreferrer">
                  Verificar →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
