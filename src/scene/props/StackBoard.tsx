import { Html } from '@react-three/drei'
import { LEVEL_LABEL, stack } from '../../data/stack'
import { useStore } from '../../store/useStore'
import styles from './StackBoard.module.css'

/**
 * El tablero del stack, con los logos dibujados sobre la pizarra.
 *
 * Mismo principio que la pantalla del monitor: HTML real pegado a la
 * superficie, con su perspectiva. Desde la puerta se ven los logos y se
 * entiende de qué va el tablero aunque no se lean los nombres; al acercarse
 * se vuelve legible y tocable.
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
        <div className={styles.head}>
          <h2 className={styles.title}>Stack</h2>
          <span className={styles.count}>{stack.length}</span>
        </div>

        <div className={styles.grid}>
          {stack.map((tech) => (
            <span key={tech.id} className={styles.tech}>
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
              {zoomed && <span className={styles.level}>{LEVEL_LABEL[tech.level]}</span>}
            </span>
          ))}
        </div>

        <div className={styles.foot}>
          <span className={styles.hint}>{zoomed ? 'Mi stack' : 'Acercate para ver'}</span>
          <button type="button" className={styles.expand} onClick={() => openPanel('stack')}>
            Ver en detalle
          </button>
        </div>
      </div>
    </Html>
  )
}
