import { useEffect, useState } from 'react'
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
 * Cada diploma se toca desde cualquier punto del cuarto, no solo de cerca: el
 * clic viaja la cámara hasta el mural y abre ESE diploma en grande, ocupando
 * el marco entero. Desde el punto de las certificaciones el marco llena la
 * pantalla, así que se lee como si lo tuvieras en la mano.
 *
 * La animación es CSS y no toca la escena, así que no hace falta pedirle
 * frames al canvas (CLAUDE.md regla 2): el `<Html transform>` solo se
 * recalcula cuando se mueve la cámara.
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
  const goTo = useStore((s) => s.goTo)

  const [openedId, setOpenedId] = useState<string | null>(null)

  const zoomed = active === 'certificaciones'

  // Al irse del mural, el marco vuelve a mostrar todos los diplomas
  useEffect(() => {
    if (active !== 'certificaciones') setOpenedId(null)
  }, [active])

  // Con un panel abierto este HTML se transparenta por detrás. Ver StackBoard.
  if (panel) return null

  const opened = certifications.find((cert) => cert.id === openedId) ?? null

  /** Abre un diploma. De lejos, el viaje de la cámara es parte de la animación. */
  const abrir = (id: string) => {
    setOpenedId(id)
    if (!zoomed) goTo('certificaciones')
  }

  return (
    <Html
      transform
      scale={(BOARD_WIDTH / CANVAS_WIDTH) * DREI_TRANSFORM_FACTOR}
      zIndexRange={[8, 0]}
      wrapperClass={styles.wrapper}
    >
      <div className={styles.board}>
        {opened ? (
          /* La key reinicia la animación al saltar de un diploma a otro */
          <div key={opened.id} className={styles.single}>
            <div className={styles.singleHead}>
              <button type="button" className={styles.back} onClick={() => setOpenedId(null)}>
                ← Todas
              </button>
              <span className={styles.singleMeta}>
                {opened.name} · {opened.issuer} · {opened.year}
              </span>
            </div>

            {opened.image ? (
              <img
                className={styles.big}
                src={opened.image}
                alt={`Certificado de ${opened.name}, ${opened.issuer}`}
              />
            ) : (
              <span
                className={styles.big}
                style={{ background: opened.placeholder }}
                aria-hidden="true"
              >
                {opened.name.charAt(0)}
              </span>
            )}
          </div>
        ) : (
          <div className={styles.all}>
            <div className={styles.grid}>
              {certifications.map((cert) => (
                <button
                  key={cert.id}
                  type="button"
                  className={styles.cert}
                  onClick={() => abrir(cert.id)}
                  aria-label={`Ver ${cert.name} en grande`}
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

            {/* El pie aparece solo de cerca: de lejos es texto ilegible que
                hace ver el mural como una página web */}
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
        )}
      </div>
    </Html>
  )
}
