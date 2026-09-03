import { Html } from '@react-three/drei'
import { stack, type Category } from '../../data/stack'
import { useStore } from '../../store/useStore'
import styles from './StackBoard.module.css'

/**
 * El tablero del stack, con los logos agrupados sobre la pizarra.
 *
 * Mismo principio que la pantalla del monitor: HTML real pegado a la
 * superficie, con su perspectiva. Sin barra de encabezado ni botones
 * flotantes — eso lo hacía leer como una diapositiva pegada a la pared.
 *
 * Los logos son de Simple Icons (CC0). Vienen monocromos, así que se usan de
 * máscara y se pintan con el color de cada marca — ver el CSS.
 *
 * De cerca cada logo es un botón: abre el panel en esa tecnología. Antes solo
 * respondía el enlace del pie, así que tocar un logo —que es lo primero que
 * uno hace— no pasaba nada.
 */

/** Ancho del tablero en la escena, en metros */
const BOARD_WIDTH = 1.0
/** Ancho del lienzo HTML en píxeles */
const CANVAS_WIDTH = 1150
/** Factor interno de `<Html transform>` de drei. Ver MonitorScreen.tsx. */
const DREI_TRANSFORM_FACTOR = 40

/**
 * Los bloques del tablero.
 *
 * No son las categorías tal cual: móvil tiene una sola tecnología y una fila
 * entera para ella desperdicia alto. Juntándola con backend entran cuatro
 * filas con aire, en vez de cinco apretadas.
 */
const GROUPS: { label: string; categories: Category[] }[] = [
  { label: 'Lenguajes', categories: ['lenguaje'] },
  { label: 'Frontend', categories: ['frontend'] },
  { label: 'Backend y móvil', categories: ['backend', 'movil'] },
  { label: 'DevOps e infraestructura', categories: ['devops'] },
]

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
  return ((hash % 9) - 4) * 0.5
}

export function StackBoard() {
  const active = useStore((s) => s.active)
  const openPanel = useStore((s) => s.openPanel)
  const panel = useStore((s) => s.panel)

  const zoomed = active === 'stack'

  /*
   * Con un panel abierto este HTML se transparenta por detrás y ensucia la
   * lectura: el fondo del panel lo atenúa, pero no lo tapa. Como es DOM y no
   * geometría, la solución es no dibujarlo.
   */
  if (panel) return null

  return (
    <Html
      transform
      position={[0, 0, 0.021]}
      scale={(BOARD_WIDTH / CANVAS_WIDTH) * DREI_TRANSFORM_FACTOR}
      zIndexRange={[8, 0]}
      wrapperClass={styles.wrapper}
    >
      <div className={`${styles.board} ${zoomed ? styles.interactive : ''}`}>
        {GROUPS.map((group) => {
          const items = stack.filter((tech) => group.categories.includes(tech.category))
          if (items.length === 0) return null

          return (
            <section key={group.label} className={styles.group}>
              <h3 className={styles.label}>{group.label}</h3>
              <div className={styles.row}>
                {items.map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    className={styles.tech}
                    style={{ transform: `rotate(${tilt(tech.id)}deg)` }}
                    onClick={() => openPanel('stack', tech.id)}
                    aria-label={`Ver ${tech.name} en detalle`}
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
                  </button>
                ))}
              </div>
            </section>
          )
        })}

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
