import { profile } from '../data/profile'
import { Panel } from './Panel'
import styles from './Content.module.css'

/**
 * Sobre mí.
 *
 * Incluye la disponibilidad —ubicación, modalidad, idiomas— porque el cuarto
 * no tiene ventana y ese contenido perdió su objeto propio (SPEC §5).
 *
 * TODO: falta la foto real junto al texto. No es opcional: el visitante ya vio
 * al avatar saludarlo, y la foto es la que confirma el parecido (SPEC §5).
 */
export default function AboutPanel() {
  return (
    <Panel title="Sobre mí" subtitle={profile.role}>
      <div className={styles.prose}>
        <p>
          Soy {profile.name}, {profile.role.toLowerCase()}. Trabajo en aplicaciones web y me
          interesa especialmente la parte de infraestructura: que lo que se construye llegue a
          producción y se pueda mantener.
        </p>
        <p>
          Vengo de proyectos donde me tocó tanto escribir la interfaz como armar los despliegues,
          y me gusta esa mezcla — entender el camino completo desde el código hasta el servidor.
        </p>
        <p>
          Este cuarto es uno de esos proyectos: lo hice para aprender 3D en el navegador y terminó
          siendo mi portafolio.
        </p>

        {profile.seeking && (
          <p className={styles.badge}>
            <span className={styles.dot} aria-hidden="true" />
            Disponible para nuevas oportunidades
          </p>
        )}

        <ul className={styles.meta}>
          <li className={styles.metaItem}>
            <span className={styles.metaLabel}>Ubicación</span>
            {profile.location}
          </li>
          <li className={styles.metaItem}>
            <span className={styles.metaLabel}>Modalidad</span>
            {profile.mode}
          </li>
          <li className={styles.metaItem}>
            <span className={styles.metaLabel}>Idiomas</span>
            {profile.languages.join(' · ')}
          </li>
        </ul>
      </div>
    </Panel>
  )
}
