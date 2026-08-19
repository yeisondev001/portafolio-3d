import { BackSide } from 'three'

/** Medidas del cuarto en metros. Escala real (SPEC §15). */
export const ROOM = {
  width: 4, // x: -2 (oeste) .. +2 (este)
  height: 2.5, // y: 0 (piso) .. 2,5 (techo)
  depth: 3.5, // z: -1,75 (norte) .. +1,75 (sur)
} as const

export function Room() {
  return (
    <group>
      {/* Una caja invertida resuelve paredes, piso y techo en un solo draw call */}
      <mesh position={[0, ROOM.height / 2, 0]}>
        <boxGeometry args={[ROOM.width, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial color="#b6aea3" side={BackSide} />
      </mesh>

      {/* Piso aparte, más oscuro, para que se lea la profundidad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#6f665e" />
      </mesh>
    </group>
  )
}
