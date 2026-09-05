import { useEffect } from 'react'
import { invalidate, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'

/**
 * Mantiene constante el campo de visión HORIZONTAL.
 *
 * Una cámara en perspectiva fija el vertical: `fov` es el ángulo de arriba a
 * abajo, y el de los costados sale de multiplicarlo por la proporción de la
 * ventana. Al angostarse la pantalla, el campo horizontal se achica solo.
 *
 * En un celular vertical eso era brutal. Con 375 x 812 la proporción es 0,46
 * y el campo horizontal caía de 85° a 27°: desde la entrada no se veía el
 * cuarto sino la espalda del avatar llenando la pantalla. No era un problema
 * de estilos, era la cámara.
 *
 * Acá se recalcula el vertical para que el horizontal sea siempre el que da
 * 55° en 16:9. En pantallas iguales o más anchas que esa no cambia nada, así
 * que el encuadre de escritorio queda exactamente como estaba.
 */

/** Proporción de referencia: con esta o más ancha, el fov no se toca */
const REFERENCE_ASPECT = 16 / 9
/** El fov vertical de siempre, el que define el encuadre de escritorio */
const REFERENCE_FOV = 55
/**
 * Tope del fov vertical.
 *
 * Sin límite, un celular angosto pediría 127° y la escena se vería de ojo de
 * pez: las paredes se curvan y los muebles de los bordes se estiran.
 *
 * A 80° tampoco servía, por otro motivo: en un iPhone el tercio de arriba de
 * la pantalla quedaba en techo vacío. El campo vertical de más no agrega
 * cuarto, agrega pared.
 *
 * Y a 70° seguía deformando: al abrir el lente, lo que entra de más entra
 * estirado en los bordes. A 62° casi no se nota. Lo que se pierde de ancho
 * lo recupera el encuadre propio de cada punto para pantallas verticales
 * —ver `portrait` en hotspots.ts—, que acerca la cámara en vez de abrir
 * el lente.
 */
const MAX_FOV = 62

/**
 * El fov vertical que corresponde a una proporción de ventana.
 *
 * Se exporta porque CameraRig también lo necesita: para saber cuánto alejar la
 * cámara de una pared tiene que conocer el campo horizontal, y ese sale del
 * vertical. Leerlo de `camera.fov` era fràgil — ver el comentario allá.
 */
export function effectiveFov(aspect: number): number {
  const halfWidth = Math.tan((REFERENCE_FOV * Math.PI) / 360) * REFERENCE_ASPECT
  const needed = (2 * Math.atan(halfWidth / aspect) * 180) / Math.PI
  return Math.min(Math.max(REFERENCE_FOV, needed), MAX_FOV)
}

export function Lens() {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)

  useEffect(() => {
    const lens = camera as PerspectiveCamera
    if (!lens.isPerspectiveCamera) return

    const fov = effectiveFov(size.width / size.height)
    if (Math.abs(lens.fov - fov) < 0.01) return

    lens.fov = fov
    lens.updateProjectionMatrix()
    // La escena está congelada salvo que se le pida un frame (CLAUDE.md regla 2)
    invalidate()
  }, [camera, size])

  return null
}
