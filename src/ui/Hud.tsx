import { useEffect, useRef } from 'react'
import { HOTSPOTS } from '../data/hotspots'
import { profile } from '../data/profile'
import { useStore } from '../store/useStore'
import styles from './Hud.module.css'

/* En vertical el contenido pegado a los objetos 3D se lee muy chico. Estos
   accesos conservan la llegada directa al contenido sin quitar el recorrido
   del cuarto en pantallas amplias. */
const MOBILE_PANEL_BY_ZONE = {
  certificaciones: 'certificaciones',
  stack: 'stack',
} as const

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
  const openPanel = useStore((s) => s.openPanel)
  const traveling = useStore((s) => s.traveling)
  const zones = useRef<HTMLElement>(null)

  // En celular las zonas no entran todas y la barra scrollea. Si la activa
  // queda fuera de vista, el visitante no ve dónde está parado.
  useEffect(() => {
    const actual = zones.current?.querySelector('[aria-current="true"]')
    actual?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [active])

  const visitZone = (id: (typeof HOTSPOTS)[number]['id']) => {
    const mobilePanel = MOBILE_PANEL_BY_ZONE[id as keyof typeof MOBILE_PANEL_BY_ZONE]
    if (mobilePanel && window.matchMedia('(max-width: 620px)').matches) {
      openPanel(mobilePanel)
      return
    }
    goTo(id)
  }

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
        ref={zones}
        className={`${styles.zones} ${traveling ? styles.zonesTraveling : ''}`}
        aria-label="Zonas del cuarto"
      >
        <button
          type="button"
          className={`${styles.zone} ${styles.mobileProject}`}
          onClick={() => openPanel('proyectos')}
        >
          Proyectos
        </button>
        {HOTSPOTS.filter((hotspot) => !hotspot.hidden).map((hotspot) => (
          <button
            key={hotspot.id}
            type="button"
            className={`${styles.zone} ${active === hotspot.id ? styles.zoneActive : ''}`}
            onClick={() => visitZone(hotspot.id)}
            aria-current={active === hotspot.id ? 'true' : undefined}
          >
            {hotspot.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
