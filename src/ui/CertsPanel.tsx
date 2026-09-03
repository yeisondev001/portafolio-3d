import { useCallback, useEffect, useState } from 'react'
import { certifications } from '../data/certifications'
import { useStore } from '../store/useStore'
import { Panel } from './Panel'
import styles from './Content.module.css'

/**
 * Certificaciones en 2D: la lista completa, con el diploma que se puede abrir
 * en grande.
 *
 * El mural del cuarto muestra los mismos diplomas y también los agranda, pero
 * dentro del marco. Acá el límite es la pantalla, así que un escaneo se lee
 * entero aunque tenga letra chica.
 */
export default function CertsPanel() {
  const focus = useStore((s) => s.panelFocus)
  const [zoomId, setZoomId] = useState<string | null>(null)

  const zoom = certifications.find((cert) => cert.id === zoomId) ?? null

  // Ver StackPanel: ref de callback porque el panel se monta de cero
  const scrollToFocus = useCallback((node: HTMLElement | null) => {
    node?.scrollIntoView({ block: 'center' })
  }, [])

  /*
   * Esc cierra primero la vista grande y recién después el panel.
   *
   * Panel escucha en burbuja; este escucha en captura, que corre antes, y
   * corta la propagación. Sin eso una sola tecla cerraba las dos cosas.
   */
  useEffect(() => {
    if (!zoom) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setZoomId(null)
    }

    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [zoom])

  return (
    <Panel title="Certificaciones" subtitle={`${certifications.length} certificaciones`}>
      <div className={styles.grid}>
        {certifications.map((cert) => (
          <article
            key={cert.id}
            ref={cert.id === focus ? scrollToFocus : undefined}
            className={`${styles.card} ${cert.id === focus ? styles.cardFocus : ''}`}
          >
            <button
              type="button"
              className={styles.thumbButton}
              onClick={() => setZoomId(cert.id)}
              aria-label={`Ver ${cert.name} en grande`}
            >
              {cert.image ? (
                <img
                  className={`${styles.thumb} ${styles.scan}`}
                  src={cert.image}
                  alt={`Certificado de ${cert.name}, ${cert.issuer}`}
                  loading="lazy"
                />
              ) : (
                <span
                  className={styles.thumb}
                  style={{ background: cert.placeholder }}
                  aria-hidden="true"
                >
                  {cert.name.charAt(0)}
                </span>
              )}
              <span className={styles.thumbHint}>Ver en grande</span>
            </button>

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

      {zoom && (
        /* Clic en el fondo para cerrar; el diploma se lo queda para él */
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={zoom.name}
          onClick={() => setZoomId(null)}
        >
          <figure className={styles.lightboxFigure} onClick={(event) => event.stopPropagation()}>
            {zoom.image ? (
              <img
                className={styles.lightboxImage}
                src={zoom.image}
                alt={`Certificado de ${zoom.name}, ${zoom.issuer}`}
              />
            ) : (
              <span
                className={styles.lightboxBlock}
                style={{ background: zoom.placeholder }}
                aria-hidden="true"
              >
                {zoom.name.charAt(0)}
              </span>
            )}

            <figcaption className={styles.lightboxCaption}>
              <span>
                {zoom.name} · {zoom.issuer} · {zoom.year}
              </span>
              <button type="button" className={styles.copy} onClick={() => setZoomId(null)}>
                Cerrar
              </button>
            </figcaption>
          </figure>
        </div>
      )}
    </Panel>
  )
}
