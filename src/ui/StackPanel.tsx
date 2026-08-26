import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  LEVEL_LABEL,
  stack,
  type Level,
} from '../data/stack'
import { Panel } from './Panel'
import styles from './StackPanel.module.css'

const LEVEL_CLASS: Record<Level, string> = {
  fuerte: styles.barFuerte,
  solido: styles.barSolido,
  aprendiendo: styles.barAprendiendo,
}

export default function StackPanel() {
  return (
    <Panel title="Stack" subtitle={`${stack.length} tecnologías`}>
      <p className={styles.legend}>
        {(Object.keys(LEVEL_LABEL) as Level[]).map((level) => (
          <span key={level} className={styles.legendItem}>
            <span className={`${styles.bar} ${LEVEL_CLASS[level]}`} />
            {LEVEL_LABEL[level]}
          </span>
        ))}
      </p>

      {CATEGORY_ORDER.map((category) => {
        const items = stack.filter((tech) => tech.category === category)
        if (items.length === 0) return null

        return (
          <section key={category} className={styles.group}>
            <h3 className={styles.groupTitle}>{CATEGORY_LABEL[category]}</h3>

            <div className={styles.grid}>
              {items.map((tech) => (
                <article
                  key={tech.id}
                  className={styles.card}
                  style={{ borderLeftColor: tech.color }}
                >
                  <span className={styles.dot} style={{ background: tech.color }} />
                  <div>
                    <h4 className={styles.name}>{tech.name}</h4>
                    <p className={styles.level}>{LEVEL_LABEL[tech.level]}</p>
                    {tech.note && <p className={styles.note}>{tech.note}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </Panel>
  )
}
