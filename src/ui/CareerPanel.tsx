import { career } from '../data/career'
import { Panel } from './Panel'
import styles from './Content.module.css'

/**
 * Trayectoria: trabajo y estudio en una sola línea de tiempo.
 *
 * Separarlos en dos listas obliga al lector a reconstruir mentalmente el orden.
 * Juntos se lee de un vistazo; el punto relleno distingue trabajo del hueco,
 * que es estudio.
 */
export default function CareerPanel() {
  return (
    <Panel title="Trayectoria" subtitle="Trabajo y estudio">
      <ol className={styles.timeline}>
        {career.map((item) => (
          <li
            key={item.id}
            className={`${styles.milestone} ${item.kind === 'estudio' ? styles.study : ''}`}
          >
            <span className={styles.period}>{item.period}</span>
            <h3 className={styles.role}>{item.role}</h3>
            <p className={styles.place}>{item.place}</p>
            <p>{item.description}</p>
          </li>
        ))}
      </ol>
    </Panel>
  )
}
