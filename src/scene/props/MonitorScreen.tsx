import { useState } from 'react'
import { Html } from '@react-three/drei'
import { projects, type Project } from '../../data/projects'
import { useStore } from '../../store/useStore'
import styles from './MonitorScreen.module.css'

/**
 * La interfaz que se ve DENTRO de la pantalla del monitor.
 *
 * No es una capa 2D encima de la escena: es HTML pegado a la superficie de
 * la pantalla, con su misma perspectiva e inclinación. Sigue siendo DOM real
 * —seleccionable, accesible y legible para buscadores (SPEC §9)— solo que
 * ubicado en el espacio.
 *
 * Se ve siempre, incluso desde la puerta. Eso resuelve de paso que la
 * pantalla esté "viva": desde lejos se nota que ahí pasa algo, aunque no
 * se pueda leer.
 */

/** Medidas de la pantalla en la escena, en metros */
const SCREEN_WIDTH = 0.57
/** Ancho del lienzo HTML en píxeles. Ver el comentario del CSS. */
const CANVAS_WIDTH = 1140
/**
 * Factor interno de `<Html transform>` de drei.
 *
 * Uno esperaría que un píxel del HTML equivalga a una unidad de la escena,
 * pero drei divide por `(distanceFactor ?? 10) / 400`, o sea multiplica por 40.
 * Sin compensarlo, la interfaz se dibuja 40 veces más chica de lo pedido y
 * queda como una manchita en el centro de la pantalla.
 *
 * Si algún día la interfaz vuelve a salir de otro tamaño, este es el número
 * a tocar — y conviene mirar primero si drei cambió ese factor.
 */
const DREI_TRANSFORM_FACTOR = 40

export function MonitorScreen() {
  const active = useStore((s) => s.active)
  const openPanel = useStore((s) => s.openPanel)
  const panel = useStore((s) => s.panel)
  const [selected, setSelected] = useState<Project | null>(null)

  // Solo se puede tocar cuando la cámara está encima. De lejos el clic
  // tiene que llegar a la pantalla 3D, que es la que acerca la cámara.
  const interactive = active === 'monitor'

  /*
   * Con un panel abierto este HTML se transparenta por detrás y ensucia la
   * lectura: el fondo del panel lo atenúa, pero no lo tapa. Como es DOM y no
   * geometría, la solución es no dibujarlo.
   */
  if (panel) return null

  return (
    <Html
      transform
      position={[0, 1.08, 0.013]}
      scale={(SCREEN_WIDTH / CANVAS_WIDTH) * DREI_TRANSFORM_FACTOR}
      zIndexRange={[8, 0]}
      wrapperClass={styles.wrapper}
    >
      <div className={`${styles.screen} ${interactive ? styles.interactive : ''}`}>
        {selected ? (
          <>
            <div className={styles.head}>
              <h2 className={styles.title}>{selected.name}</h2>
              <span className={styles.count}>{selected.year}</span>
            </div>

            <div className={styles.detail}>
              <p className={styles.description}>{selected.description}</p>
              <ul className={styles.tags}>
                {selected.stack.map((tech) => (
                  <li key={tech} className={styles.tag}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.foot}>
              <button type="button" className={styles.back} onClick={() => setSelected(null)}>
                ← Volver
              </button>
              <button
                type="button"
                className={styles.expand}
                onClick={() => openPanel('proyectos')}
              >
                Ver en grande
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.head}>
              <h2 className={styles.title}>Proyectos</h2>
              <span className={styles.count}>{projects.length}</span>
            </div>

            <div className={styles.grid}>
              {projects.slice(0, 4).map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className={styles.tile}
                  onClick={() => setSelected(project)}
                >
                  <span className={styles.badge} style={{ background: project.placeholder }}>
                    {project.name.charAt(0)}
                  </span>
                  <span>
                    <h3 className={styles.name}>{project.name}</h3>
                    <p className={styles.tagline}>{project.tagline}</p>
                  </span>
                </button>
              ))}
            </div>

            <div className={styles.foot}>
              <span className={styles.hint}>
                {interactive ? 'Elegí un proyecto' : 'Acercate para ver'}
              </span>
              <button
                type="button"
                className={styles.expand}
                onClick={() => openPanel('proyectos')}
              >
                Ver en grande
              </button>
            </div>
          </>
        )}
      </div>
    </Html>
  )
}
