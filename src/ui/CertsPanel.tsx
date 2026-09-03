import { useCallback } from 'react'
import { certifications } from '../data/certifications'
import { useStore } from '../store/useStore'
import { Panel } from './Panel'
import styles from './Content.module.css'

export default function CertsPanel() {
  const focus = useStore((s) => s.panelFocus)

  // Ver StackPanel: ref de callback porque el panel se monta de cero
  const scrollToFocus = useCallback((node: HTMLElement | null) => {
    node?.scrollIntoView({ block: 'center' })
  }, [])

  return (
    <Panel title="Certificaciones" subtitle={`${certifications.length} certificaciones`}>
      <div className={styles.grid}>
        {certifications.map((cert) => (
          <article
            key={cert.id}
            ref={cert.id === focus ? scrollToFocus : undefined}
            className={`${styles.card} ${cert.id === focus ? styles.cardFocus : ''}`}
          >
            {cert.image ? (
              <img
                className={`${styles.thumb} ${styles.scan}`}
                src={cert.image}
                alt={`Certificado de ${cert.name}, ${cert.issuer}`}
                loading="lazy"
              />
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
