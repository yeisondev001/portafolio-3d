import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useStore } from '../store/useStore'
import { ENTRADA, getHotspot } from '../data/hotspots'

// Vectores reutilizados fuera del componente: nunca se crean objetos
// dentro de useFrame (CLAUDE.md, convenciones de código)
const START_POS = new Vector3()
const START_TARGET = new Vector3()
const END_POS = new Vector3()
const END_TARGET = new Vector3()

const DEFAULT_DURATION = 1.6

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
  const invalidate = useThree((s) => s.invalidate)
  const setTraveling = useStore((s) => s.setTraveling)

  const progress = useRef(1)
  const duration = useRef(DEFAULT_DURATION)
  const isFirstRun = useRef(true)
  /** Hacia dónde mira la cámara en este momento */
  const lookAt = useRef(new Vector3(...ENTRADA.target))

  useEffect(() => {
    const hotspot = getHotspot(active)

    // Al cargar la página no se viaja: se aparece directamente en la entrada
    if (isFirstRun.current) {
      isFirstRun.current = false
      camera.position.set(...hotspot.camera)
      lookAt.current.set(...hotspot.target)
      camera.lookAt(lookAt.current)
      invalidate()
      return
    }

    START_POS.copy(camera.position)
    START_TARGET.copy(lookAt.current)
    END_POS.set(...hotspot.camera)
    END_TARGET.set(...hotspot.target)
    progress.current = 0
    duration.current = hotspot.duration ?? DEFAULT_DURATION
    setTraveling(true)
    invalidate()
  }, [active, camera, invalidate, setTraveling])

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
