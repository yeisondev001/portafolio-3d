import { useState } from 'react'
import { profile } from '../data/profile'
import { Panel } from './Panel'
import styles from './Content.module.css'

/**
 * Contacto — el celular del escritorio.
 *
 * Sin formulario: exige backend y antispam, y casi nadie los usa (SPEC §5).
 * El mail se puede copiar de un toque, que es lo que hace la gente cuando ya
 * tiene su cliente de correo abierto en otra pestaña.
 */
export default function ContactPanel() {
  const [copied, setCopied] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Sin permiso de portapapeles queda el link mailto, que siempre funciona
      setCopied(false)
    }
  }

  return (
    <Panel lift title="Contacto" subtitle="Escribime por donde te quede cómodo">
      <ul className={styles.contacts}>
        <li>
          <a className={styles.contact} href={`mailto:${profile.email}`}>
            <span>
              <span className={styles.contactLabel}>Mail</span>
              <span className={styles.contactValue}>{profile.email}</span>
            </span>
            <button
              type="button"
              className={styles.copy}
              onClick={(event) => {
                event.preventDefault()
                void copiar()
              }}
            >
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </a>
        </li>

        <li>
          <a
            className={styles.contact}
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <span className={styles.contactLabel}>LinkedIn</span>
              <span className={styles.contactValue}>Ver perfil</span>
            </span>
          </a>
        </li>

        <li>
          <a className={styles.contact} href={profile.github} target="_blank" rel="noreferrer">
            <span>
              <span className={styles.contactLabel}>GitHub</span>
              <span className={styles.contactValue}>Ver repositorios</span>
            </span>
          </a>
        </li>

        <li>
          <a className={styles.contact} href={profile.cv} download>
            <span>
              <span className={styles.contactLabel}>Currículum</span>
              <span className={styles.contactValue}>Descargar en PDF</span>
            </span>
          </a>
        </li>
      </ul>
    </Panel>
  )
}
