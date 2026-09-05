import { useEffect, useState } from 'react'
import styles from './RotateHint.module.css'

/**
 * Sugerencia de girar el teléfono, solo en celular y solo estando parado.
 *
 * El cuarto mide 5 m de ancho y en una pantalla vertical el ancho visible es
 * como un tercio del alto: no entra. Se puede abrir el lente, pero lo que
 * entra de más entra deformado, o acercar la cámara, pero entonces se ve un
 * pedazo del cuarto. No hay encuadre vertical que muestre todo — es óptica,
 * no maquetado.
 *
 * Acostado el problema desaparece: la proporción pasa a ser más ancha que
 * 16:9 y se ve el cuarto entero, con el escritorio, el mural y el tablero.
 *
 * Así que parado se muestra un encuadre propio, centrado en el autor, y se
 * avisa que girando hay más. No se fuerza ni se bloquea nada: el sitio
 * funciona igual sin girar.
 */

/** Se recuerda por pestaña: avisar una vez alcanza, repetirlo molesta */
const SEEN = 'rotate-hint-visto'

export function RotateHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let guardado = false
    try {
      guardado = sessionStorage.getItem(SEEN) === '1'
    } catch {
      // Modo privado o cookies bloqueadas: se muestra igual, no es grave
    }
    if (guardado) return

    const query = window.matchMedia('(orientation: portrait) and (max-width: 620px)')
    const aplicar = () => setVisible(query.matches)

    aplicar()
    query.addEventListener('change', aplicar)
    return () => query.removeEventListener('change', aplicar)
  }, [])

  if (!visible) return null

  const cerrar = () => {
    setVisible(false)
    try {
      sessionStorage.setItem(SEEN, '1')
    } catch {
      // Ver arriba
    }
  }

  return (
    <div className={styles.hint} role="status">
      <span className={styles.icon} aria-hidden="true">
        ⟳
      </span>
      <span>Girá el teléfono para ver el cuarto completo</span>
      <button type="button" className={styles.close} onClick={cerrar} aria-label="Entendido">
        ✕
      </button>
    </div>
  )
}
