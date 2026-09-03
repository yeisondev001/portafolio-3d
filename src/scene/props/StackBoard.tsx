import { Html } from '@react-three/drei'
import { stack } from '../../data/stack'
import { useStore } from '../../store/useStore'
import styles from './StackBoard.module.css'

/**
 * El tablero del stack, con los logos sobre la pizarra.
 *
 * Mismo principio que la pantalla del monitor: HTML real pegado a la
 * superficie, con su perspectiva. Desde la puerta se ven los logos y se
 * entiende de qué va el tablero aunque no se lean los nombres.
 *
 * Sin barra de encabezado ni botones flotantes: la primera versión los tenía
 * y se leía como una diapositiva pegada a la pared. Lo único de interfaz
 * aparece cuando la cámara ya está encima.
 *
 * Los logos son de Simple Icons (CC0). Vienen monocromos, así que se usan de
 * máscara y se pintan con el color de cada marca — ver el CSS.
 */

/** Ancho del tablero en la escena, en metros */
const BOARD_WIDTH = 1.0
/** Ancho del lienzo HTML en píxeles */
const CANVAS_WIDTH = 1150
/** Factor interno de `<Html transform>` de drei. Ver MonitorScreen.tsx. */
const DREI_TRANSFORM_FACTOR = 40

/**
 * Inclinación de cada logo, en grados.
 *
 * Puestos perfectamente rectos se leen como una tabla; torcidos un grado o
 * dos parecen calcomanías pegadas a mano. Sale del id para que no cambie en
 * cada dibujado.
 */
function tilt(id: string): number {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 1000
  return ((hash % 9) - 4) * 0.6
}

export function StackBoard() {
  const active = useStore((s) => s.active)
  const openPanel = useStore((s) => s.openPanel)

  const zoomed = active === 'stack'

  return (
    <Html
      transform
      position={[0, 0, 0.021]}
      scale={(BOARD_WIDTH / CANVAS_WIDTH) * DREI_TRANSFORM_FACTOR}
      zIndexRange={[8, 0]}
      wrapperClass={styles.wrapper}
    >
      <div className={`${styles.board} ${zoomed ? styles.interactive : ''}`}>
        <div className={styles.grid}>
          {stack.map((tech) => (
            <span
              key={tech.id}
              className={styles.tech}
              style={{ transform: `rotate(${tilt(tech.id)}deg)` }}
            >
              <span
                className={styles.logo}
                style={{
                  backgroundColor: tech.color,
                  maskImage: `url(/img/stack/${tech.id}.svg)`,
                  WebkitMaskImage: `url(/img/stack/${tech.id}.svg)`,
                }}
                aria-hidden="true"
              />
              <span className={styles.name}>{tech.name}</span>
            </span>
          ))}
        </div>

        {zoomed && (
          <div className={styles.foot}>
            <span className={styles.label}>Mi stack</span>
            <button type="button" className={styles.more} onClick={() => openPanel('stack')}>
              Ver niveles y detalle
            </button>
          </div>
        )}
      </div>
    </Html>
  )
}
