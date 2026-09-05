import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { PerspectiveCamera } from 'three'
import { useStore } from '../store/useStore'
import { ENTRADA, getHotspot } from '../data/hotspots'
import type { Hotspot } from '../data/hotspots'

// Vectores reutilizados fuera del componente: nunca se crean objetos
// dentro de useFrame (CLAUDE.md, convenciones de código)
const START_POS = new Vector3()
const START_TARGET = new Vector3()
const END_POS = new Vector3()
const END_TARGET = new Vector3()
const AWAY = new Vector3()

const DEFAULT_DURATION = 1.6

/**
 * El encuadre que corresponde a la forma de la ventana.
 *
 * Parado, un punto puede tener el suyo propio: ver `portrait` en hotspots.ts.
 */
function framing(hotspot: Hotspot, aspect: number) {
  return aspect < 1 && hotspot.portrait ? hotspot.portrait : hotspot
}

/** Suavizado con arranque y frenada — smootherstep */
function ease(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

/**
 * Mueve la cámara entre puntos de interés.
 * Es el único que toca la cámara: no hay controles de teclado ni de mouse
 * (CLAUDE.md regla 1).
 */
export function CameraRig() {
  const active = useStore((s) => s.active)
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const invalidate = useThree((s) => s.invalidate)
  const setTraveling = useStore((s) => s.setTraveling)

  const progress = useRef(1)
  const duration = useRef(DEFAULT_DURATION)
  const isFirstRun = useRef(true)
  /** Hacia dónde mira la cámara en este momento */
  const lookAt = useRef(new Vector3(...ENTRADA.target))

  useEffect(() => {
    const hotspot = getHotspot(active)
    const shot = framing(hotspot, size.width / size.height)

    // Al cargar la página no se viaja: se aparece directamente en la entrada
    if (isFirstRun.current) {
      isFirstRun.current = false
      camera.position.set(...shot.camera)
      lookAt.current.set(...shot.target)
      camera.lookAt(lookAt.current)
      invalidate()
      return
    }

    START_POS.copy(camera.position)
    START_TARGET.copy(lookAt.current)
    END_POS.set(...shot.camera)
    END_TARGET.set(...shot.target)

    // Alejarse si la ventana es angosta y el objeto no entraría a lo ancho
    if (hotspot.fitWidth) {
      const lens = camera as PerspectiveCamera
      AWAY.copy(END_POS).sub(END_TARGET)
      const base = AWAY.length()
      AWAY.normalize()

      const vertical = (lens.fov * Math.PI) / 180
      const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * lens.aspect)
      // Un 6% de aire para que no quede pegado a los bordes
      const needed = (hotspot.fitWidth / 2 / Math.tan(horizontal / 2)) * 1.06

      END_POS.copy(END_TARGET).addScaledVector(AWAY, Math.max(base, needed))
    }
    progress.current = 0
    duration.current = hotspot.duration ?? DEFAULT_DURATION
    setTraveling(true)
    invalidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, camera, invalidate, setTraveling])

  /*
   * Al girar el teléfono cambia el encuadre, y hay que saltar al nuevo sin
   * animar: girar la pantalla no es viajar a otro lado del cuarto, y una
   * cámara desplazándose sola después de rotar se lee como un error.
   *
   * Solo cuando cambia de parado a acostado o al revés. Agrandar una ventana
   * de escritorio no toca nada.
   */
  const wasPortrait = useRef(size.width / size.height < 1)

  useEffect(() => {
    const isPortrait = size.width / size.height < 1
    if (isPortrait === wasPortrait.current) return
    wasPortrait.current = isPortrait

    const shot = framing(getHotspot(active), size.width / size.height)
    progress.current = 1
    camera.position.set(...shot.camera)
    lookAt.current.set(...shot.target)
    camera.lookAt(lookAt.current)
    invalidate()
  }, [size, active, camera, invalidate])

  useFrame((_, delta) => {
    if (progress.current >= 1) return

    progress.current = Math.min(1, progress.current + delta / duration.current)
    if (progress.current >= 1) setTraveling(false)
    const t = ease(progress.current)

    camera.position.lerpVectors(START_POS, END_POS, t)
    lookAt.current.lerpVectors(START_TARGET, END_TARGET, t)
    camera.lookAt(lookAt.current)

    // Se piden frames solo mientras dura el viaje. Al llegar se deja de pedir
    // y la escena vuelve a congelarse (CLAUDE.md regla 2).
    invalidate()
  })

  return null
}
