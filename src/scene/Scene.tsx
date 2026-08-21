import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { HOTSPOTS, ENTRADA } from '../data/hotspots'
import { Room } from './Room'
import { Avatar } from './Avatar'
import { Props } from './props/Props'
import { CameraRig } from './CameraRig'
import { Hotspot } from './Hotspot'

/** En celular se baja el techo de resolución para no calentar el equipo (SPEC §7.4) */
const isTouch =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export function Scene() {
  return (
    <Canvas
      // La escena está congelada salvo durante los viajes de cámara (CLAUDE.md regla 2)
      frameloop="demand"
      dpr={[1, isTouch ? 1.5 : 2]}
      camera={{ fov: 55, near: 0.1, far: 50, position: ENTRADA.camera }}
    >
      {/*
        Luces provisionales de las fases 1-4. Se reemplazan por luz horneada
        en la fase 5 (CLAUDE.md regla 3). Ya imitan el esquema nocturno
        de SPEC §15: velador cálido dominante + monitor frío sobre el avatar.
      */}
      {/* Ambiente casi nulo: el cuarto es de noche y todo lo que se ve
          tiene que venir del velador o del monitor (SPEC §15) */}
      <ambientLight intensity={0.12} />

      {/* Velador: fuente cálida dominante */}
      <pointLight
        position={[0.65, 1.12, -1.45]}
        intensity={9}
        distance={4.5}
        decay={2}
        color="#ffbe72"
      />

      {/* Monitor: luz fría que le pega al avatar en la cara y el pecho */}
      <pointLight
        position={[-0.2, 1.05, -1.25]}
        intensity={3.5}
        distance={3}
        decay={2}
        color="#9ec3ff"
      />

      {/* Relleno mínimo para que los rincones no queden en negro puro */}
      <hemisphereLight args={['#5b6472', '#191512', 0.3]} />

      <Room />
      <Props />

      {/* De pie junto a la silla, mirando a la puerta, hasta que lleguen
          las animaciones de Mixamo (fase 4) */}
      <Suspense fallback={null}>
        <Avatar position={[0.72, 0, -0.9]} rotation={[0, 0.15, 0]} />
      </Suspense>
      <CameraRig />

      {HOTSPOTS.map((hotspot) => (
        <Hotspot key={hotspot.id} data={hotspot} />
      ))}
    </Canvas>
  )
}
