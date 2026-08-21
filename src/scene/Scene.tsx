import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { HOTSPOTS, ENTRADA } from '../data/hotspots'
import { Room } from './Room'
import { Avatar } from './Avatar'
import { Props } from './props/Props'
import { CameraRig } from './CameraRig'
import { Hotspot } from './Hotspot'

/**
 * Intensidades de las luces provisionales, todas juntas para poder ajustarlas
 * de un vistazo. Se reemplazan por luz horneada en la fase 5 (CLAUDE.md regla 3).
 *
 * La escena es nocturna (SPEC §15): el plafón da la luz general, el velador
 * pone el acento cálido sobre el escritorio y el monitor tira frío sobre el
 * avatar. Subir `ambient` aplana todo, así que conviene tocar antes `ceiling`.
 */
const LIGHTS = {
  ambient: 0.34,
  ceiling: 11,
  lamp: 13,
  monitor: 5,
  fill: 0.42,
} as const

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
      <ambientLight intensity={LIGHTS.ambient} />

      {/* Plafón del techo: la luz general del cuarto */}
      <pointLight
        position={[0, 2.35, -0.2]}
        intensity={LIGHTS.ceiling}
        distance={8}
        decay={2}
        color="#ffd9ab"
      />

      {/* Velador: el acento cálido sobre el escritorio */}
      <pointLight
        position={[0.65, 1.12, -1.45]}
        intensity={LIGHTS.lamp}
        distance={5}
        decay={2}
        color="#ffbe72"
      />

      {/* Monitor: luz fría que le pega al avatar en la cara y el pecho */}
      <pointLight
        position={[-0.2, 1.05, -1.2]}
        intensity={LIGHTS.monitor}
        distance={3.5}
        decay={2}
        color="#9ec3ff"
      />

      {/* Relleno para que los rincones no queden en negro puro */}
      <hemisphereLight args={['#7d8899', '#2a231d', LIGHTS.fill]} />

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
