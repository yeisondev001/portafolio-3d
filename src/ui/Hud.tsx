import { HOTSPOTS } from '../data/hotspots'
import { profile } from '../data/profile'
import { useStore } from '../store/useStore'
import styles from './Hud.module.css'

/**
 * La interfaz que va sobre la escena.
 *
 * Existe porque los tres datos que más importan —nombre, CV y contacto— son
 * justo los que un portafolio 3D tiende a esconder dentro de objetos que hay
 * que descubrir (SPEC §4).
 *
 * Pero el 3D es el protagonista: acá no hay fondos, ni cajas, ni píldoras.
 * Solo texto con una sombra suave, arriba la identidad y abajo las zonas,
 * dejando libre el centro de la pantalla, que es donde se mira.
 */
export function Hud() {
  const active = useStore((s) => s.active)
  const goTo = useStore((s) => s.goTo)
  const traveling = useStore((s) => s.traveling)

  return (
    <div className={styles.hud}>
      <header className={styles.top}>
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
      </header>

      <nav
        className={`${styles.zones} ${traveling ? styles.zonesTraveling : ''}`}
        aria-label="Zonas del cuarto"
      >
        {HOTSPOTS.filter((hotspot) => !hotspot.hidden).map((hotspot) => (
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
    </div>
  )
}
