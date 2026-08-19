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
      <ambientLight intensity={0.5} />
      <pointLight position={[0.65, 1.15, -1.45]} intensity={7} distance={6} color="#ffcf94" />
      <pointLight position={[-0.2, 1.1, -1.35]} intensity={3} distance={3.5} color="#9fc4ff" />

      <Room />
      <Props />

      {/* De pie al lado de la silla hasta que lleguen las animaciones de Mixamo */}
      <Suspense fallback={null}>
        <Avatar position={[0.72, 0, -0.55]} rotation={[0, Math.PI, 0]} />
      </Suspense>
      <CameraRig />

      {HOTSPOTS.map((hotspot) => (
        <Hotspot key={hotspot.id} data={hotspot} />
      ))}
    </Canvas>
  )
}
