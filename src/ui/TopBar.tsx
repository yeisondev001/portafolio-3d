import { HOTSPOTS } from '../data/hotspots'
import { profile } from '../data/profile'
import { useStore } from '../store/useStore'
import styles from './TopBar.module.css'

/**
 * Barra fija: nombre, rol, CV y contacto siempre visibles, más los accesos
 * directos a cada zona.
 *
 * Existe porque los tres datos que más importan son justo los que un
 * portafolio 3D tiende a esconder dentro de objetos (SPEC §4).
 */
export function TopBar() {
  const active = useStore((s) => s.active)
  const goTo = useStore((s) => s.goTo)

  return (
    <header className={styles.bar}>
      <div className={styles.row}>
        <div className={styles.identity}>
          <span className={styles.name}>{profile.name}</span>
          <span className={styles.role}>{profile.role}</span>
        </div>

        <nav className={styles.links} aria-label="Contacto">
          <a className={`${styles.link} ${styles.cv}`} href={profile.cv} download>
            CV
          </a>
          <a className={styles.link} href={`mailto:${profile.email}`}>
            Mail
          </a>
          <a className={styles.link} href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className={styles.link} href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>

      <nav className={styles.zones} aria-label="Zonas del cuarto">
        {HOTSPOTS.map((hotspot) => (
          <button
            key={hotspot.id}
            type="button"
            className={`${styles.zone} ${active === hotspot.id ? styles.zoneActive : ''}`}
            onClick={() => goTo(hotspot.id)}
            aria-current={active === hotspot.id ? 'true' : undefined}
          >
            {hotspot.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
