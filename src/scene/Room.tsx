import { BackSide } from 'three'

/** Medidas del cuarto en metros. Escala real (SPEC §15). */
export const ROOM = {
  width: 5, // x: -2,5 (oeste) .. +2,5 (este)
  height: 2.7, // y: 0 (piso) .. 2,7 (techo)
  depth: 4.4, // z: -2,2 (norte) .. +2,2 (sur)
} as const

/** Posición de cada pared, para no repetir la cuenta en cada objeto */
export const WALL = {
  north: -ROOM.depth / 2,
  south: ROOM.depth / 2,
  west: -ROOM.width / 2,
  east: ROOM.width / 2,
} as const

const SKIRTING_HEIGHT = 0.1
const SKIRTING_DEPTH = 0.025

/** Zócalo perimetral: cuatro tiras pegadas a las paredes */
const ZOCALO: { position: [number, number, number]; size: [number, number, number] }[] = [
  {
    position: [0, SKIRTING_HEIGHT / 2, -ROOM.depth / 2 + SKIRTING_DEPTH / 2],
    size: [ROOM.width, SKIRTING_HEIGHT, SKIRTING_DEPTH],
  },
  {
    position: [0, SKIRTING_HEIGHT / 2, ROOM.depth / 2 - SKIRTING_DEPTH / 2],
    size: [ROOM.width, SKIRTING_HEIGHT, SKIRTING_DEPTH],
  },
  {
    position: [-ROOM.width / 2 + SKIRTING_DEPTH / 2, SKIRTING_HEIGHT / 2, 0],
    size: [SKIRTING_DEPTH, SKIRTING_HEIGHT, ROOM.depth],
  },
  {
    position: [ROOM.width / 2 - SKIRTING_DEPTH / 2, SKIRTING_HEIGHT / 2, 0],
    size: [SKIRTING_DEPTH, SKIRTING_HEIGHT, ROOM.depth],
  },
]

export function Room() {
  return (
    <group>
      {/* Una caja invertida resuelve paredes, piso y techo en un solo draw call */}
      <mesh position={[0, ROOM.height / 2, 0]}>
        <boxGeometry args={[ROOM.width, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial color="#8a8073" side={BackSide} roughness={1} />
      </mesh>

      {/* Piso aparte, más oscuro, para que se lea la profundidad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#4b423a" roughness={1} />
      </mesh>

      {/*
        Zócalo. Es un detalle chiquito con un efecto grande: marca dónde
        termina la pared y empieza el piso. Sin él, las dos superficies se
        funden y el cuarto se lee como una caja de cartón.
      */}
      {ZOCALO.map(({ position, size }) => (
        <mesh key={`${position[0]}-${position[2]}`} position={position}>
          <boxGeometry args={size} />
          <meshStandardMaterial color="#4f463c" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}
