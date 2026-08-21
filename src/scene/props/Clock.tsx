import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

/**
 * Reloj de pared con la hora real del visitante.
 *
 * Es un truco viejo y funciona siempre: la gente mira la hora, se da cuenta
 * de que coincide con la suya, y eso convierte la escena de "un dibujo" en
 * "un lugar". Cuesta dos rotaciones por cuadro.
 *
 * Sin números: los textos largos van en los paneles 2D, no dibujados en la
 * escena (SPEC §7). Un reloj analógico se lee igual sin ellos.
 */
export function Clock({
  position,
  radius = 0.13,
}: {
  position: [number, number, number]
  radius?: number
}) {
  const hours = useRef<Group>(null)
  const minutes = useRef<Group>(null)

  useFrame(() => {
    if (!hours.current || !minutes.current) return
    const now = new Date()
    const minute = now.getMinutes() + now.getSeconds() / 60
    const hour = (now.getHours() % 12) + minute / 60

    // Las agujas giran en sentido horario: de ahí el signo negativo
    minutes.current.rotation.z = -(minute / 60) * Math.PI * 2
    hours.current.rotation.z = -(hour / 12) * Math.PI * 2
  })

  return (
    <group position={position}>
      {/* Caja */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, 0.035, 24]} />
        <meshStandardMaterial color="#33302c" roughness={0.6} />
      </mesh>
      {/* Esfera */}
      <mesh position={[0, 0, 0.019]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.88, radius * 0.88, 0.004, 24]} />
        <meshStandardMaterial color="#ded8cc" roughness={0.9} />
      </mesh>

      {/* Marcas de las horas */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * radius * 0.72, Math.cos(angle) * radius * 0.72, 0.023]}
            rotation={[0, 0, -angle]}
          >
            <boxGeometry args={[0.008, i % 3 === 0 ? 0.026 : 0.015, 0.003]} />
            <meshStandardMaterial color="#3a3630" roughness={0.9} />
          </mesh>
        )
      })}

      {/* Aguja de las horas */}
      <group ref={hours}>
        <mesh position={[0, radius * 0.24, 0.027]}>
          <boxGeometry args={[0.011, radius * 0.48, 0.004]} />
          <meshStandardMaterial color="#2b2825" roughness={0.7} />
        </mesh>
      </group>

      {/* Aguja de los minutos */}
      <group ref={minutes}>
        <mesh position={[0, radius * 0.34, 0.03]}>
          <boxGeometry args={[0.008, radius * 0.68, 0.004]} />
          <meshStandardMaterial color="#2b2825" roughness={0.7} />
        </mesh>
      </group>

      <mesh position={[0, 0, 0.033]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.011, 0.011, 0.006, 12]} />
        <meshStandardMaterial color="#8a7a5c" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}
