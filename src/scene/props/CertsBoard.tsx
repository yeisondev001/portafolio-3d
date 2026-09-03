import { Html } from '@react-three/drei'
import { certifications } from '../../data/certifications'
import { useStore } from '../../store/useStore'
import styles from './CertsBoard.module.css'

/**
 * El mural de certificaciones: los diplomas escaneados, colgados dentro del
 * marco grande de la pared norte.
 *
 * Mismo principio que el tablero del stack: HTML real pegado a la superficie.
 * Los escaneos son imágenes de verdad, así que de cerca se leen; de lejos son
 * manchas de papel, que es exactamente lo que se ve al entrar a un cuarto.
 *
 * Los .webp salen de `scripts/preparar-certificaciones.mjs`.
 */

/** Ancho de la lámina interior del marco, en metros. Ver `Framed` en Props.tsx. */
const BOARD_WIDTH = 1.276
/** Ancho del lienzo HTML en píxeles */
const CANVAS_WIDTH = 1200
/** Factor interno de `<Html transform>` de drei. Ver MonitorScreen.tsx. */
const DREI_TRANSFORM_FACTOR = 40

export function CertsBoard() {
  const active = useStore((s) => s.active)
  const panel = useStore((s) => s.panel)
  const openPanel = useStore((s) => s.openPanel)

  const zoomed = active === 'certificaciones'

  // Con un panel abierto este HTML se transparenta por detrás. Ver StackBoard.
  if (panel) return null

  return (
    <Html
      transform
      scale={(BOARD_WIDTH / CANVAS_WIDTH) * DREI_TRANSFORM_FACTOR}
      zIndexRange={[8, 0]}
      wrapperClass={styles.wrapper}
    >
      <div className={`${styles.board} ${zoomed ? styles.interactive : ''}`}>
        <div className={styles.grid}>
          {certifications.map((cert) => (
            <button
              key={cert.id}
              type="button"
              className={styles.cert}
              onClick={() => openPanel('certificaciones', cert.id)}
            >
              {cert.image ? (
                <img
                  className={styles.scan}
                  src={cert.image}
                  alt={`Certificado de ${cert.name}, ${cert.issuer}`}
                />
              ) : (
                <span
                  className={styles.scan}
                  style={{ background: cert.placeholder }}
                  aria-hidden="true"
                >
                  {cert.name.charAt(0)}
                </span>
              )}
              <span className={styles.name}>{cert.name}</span>
              <span className={styles.issuer}>
                {cert.issuer} · {cert.year}
              </span>
            </button>
          ))}
        </div>

        {zoomed && (
          <div className={styles.foot}>
            <span className={styles.label}>Certificaciones</span>
            <button
              type="button"
              className={styles.more}
              onClick={() => openPanel('certificaciones')}
            >
              Ver todas en detalle
            </button>
          </div>
        )}
      </div>
    </Html>
  )
}
