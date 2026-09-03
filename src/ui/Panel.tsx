import { useEffect, type ReactNode } from 'react'
import { useStore } from '../store/useStore'
import styles from './Panel.module.css'

/**
 * Marco común de los paneles 2D.
 *
 * Se encarga de lo aburrido que hay que hacer bien igual: cerrar con `Esc`,
 * cerrar con el botón de atrás del navegador, y devolver la cámara al cuarto
 * al salir.
 */
export function Panel({
  title,
  subtitle,
  lift,
  children,
}: {
  title: string
  subtitle?: string
  /**
   * El contenido se levanta desde abajo al abrirse, como si lo hubieras
   * agarrado del escritorio. Para los objetos que se levantan de verdad:
   * la carpeta del CV y el celular.
   */
  lift?: boolean
  children: ReactNode
}) {
  const closePanel = useStore((s) => s.closePanel)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel()
    }

    // El botón de atrás cierra el panel en vez de sacar al visitante del sitio
    window.history.pushState({ panel: true }, '')
    const onPop = () => closePanel()

    window.addEventListener('keydown', onKey)
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('popstate', onPop)
    }
  }, [closePanel])

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label={title}>
      <header className={styles.head}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <button type="button" className={styles.close} onClick={closePanel}>
          Volver al cuarto
        </button>
      </header>

      <div className={`${styles.body} ${lift ? styles.stage : ''}`}>
        <div className={`${styles.inner} ${lift ? styles.lift : ''}`}>{children}</div>
      </div>
    </div>
  )
}
