import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group } from 'three'
import { Avatar } from './Avatar'
import { Chair } from './props/Props'

/**
 * La silla giratoria con el autor sentado.
 *
 * Existe como componente aparte porque silla y avatar tienen que girar
 * JUNTOS: la entrada del sitio es el autor trabajando de espaldas que se
 * da vuelta para saludar al visitante. Si la silla no acompañara, el
 * cuerpo giraría dentro de un asiento quieto.
 *
 * Girar el grupo entero no es un atajo: una silla de escritorio gira de
 * verdad. Sale gratis y se lee correcto.
 */

/** Mirando al escritorio, de espaldas a la puerta */
const FACING_DESK = Math.PI
/** Mirando a quien entra */
const FACING_DOOR = -0.12
/** Segundos que tarda en darse vuelta */
const TURN_DURATION = 2.2
/** Segundos que espera antes de girar, para que el visitante alcance a ver */
const TURN_DELAY = 1.1

const POSITION: [number, number, number] = [0.2, 0, -1.2]

/** Suavizado con arranque y frenada — smootherstep */
function ease(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

export function Workstation() {
  const group = useRef<Group>(null)
  const invalidate = useThree((s) => s.invalidate)
  const elapsed = useRef(0)
  const done = useRef(false)

  useFrame((_, delta) => {
    if (done.current || !group.current) return

    elapsed.current += delta
    const progress = Math.min(1, Math.max(0, (elapsed.current - TURN_DELAY) / TURN_DURATION))

    group.current.rotation.y = FACING_DESK + (FACING_DOOR - FACING_DESK) * ease(progress)

    if (progress >= 1) {
      done.current = true
      return
    }
    invalidate()
  })

  return (
    <group ref={group} position={POSITION} rotation={[0, FACING_DESK, 0]}>
      <Chair />
      <Avatar />
    </group>
  )
}
