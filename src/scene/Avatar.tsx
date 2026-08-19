import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Bone, Euler, Object3D, Quaternion, Vector3 } from 'three'

const MODEL = '/models/avatar.glb'

/**
 * Pose de reposo provisional. El avatar viene en T-Pose (brazos extendidos),
 * que nunca es una pose final. Hasta que lleguen las animaciones de Mixamo
 * (fase 4, SPEC §14) le bajamos los brazos para que se vea como una persona
 * parada y no como un maniquí.
 *
 * Si algún brazo queda al revés, invertir el signo acá.
 */
const ARM_DOWN = 1.25 // radianes
const FOREARM_BEND = 0.12

/** Cuánto puede girar la cabeza siguiendo a la cámara, en radianes */
const HEAD_YAW_LIMIT = 0.6
const HEAD_PITCH_LIMIT = 0.35
/** Qué tan rápido alcanza la cabeza su objetivo (0-1 por frame) */
const HEAD_EASE = 0.12

// Objetos reutilizados: nunca se crean dentro de useFrame (CLAUDE.md)
const CAMERA_LOCAL = new Vector3()
const REST_Q = new Quaternion()
const TARGET_Q = new Quaternion()
const OFFSET_Q = new Quaternion()
const OFFSET_E = new Euler()

function clamp(value: number, limit: number): number {
  return Math.max(-limit, Math.min(limit, value))
}

type Props = {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Avatar({ position = [0.72, 0, -0.7], rotation = [0, 0, 0] }: Props) {
  const { scene } = useGLTF(MODEL)
  const invalidate = useThree((s) => s.invalidate)
  const camera = useThree((s) => s.camera)

  const root = useRef<Object3D>(null)
  const head = useRef<Bone | null>(null)
  const restQ = useRef(new Quaternion())
  const currentYaw = useRef(0)
  const currentPitch = useRef(0)

  // La escena del GLB se usa tal cual: hay un solo avatar en el cuarto
  const model = useMemo(() => scene, [scene])

  useEffect(() => {
    const bone = (name: string) => model.getObjectByName(name) as Bone | undefined

    // Bajar los brazos desde la T-Pose
    const leftArm = bone('LeftArm')
    const rightArm = bone('RightArm')
    const leftForeArm = bone('LeftForeArm')
    const rightForeArm = bone('RightForeArm')

    if (leftArm) leftArm.rotation.z = -ARM_DOWN
    if (rightArm) rightArm.rotation.z = ARM_DOWN
    if (leftForeArm) leftForeArm.rotation.z = -FOREARM_BEND
    if (rightForeArm) rightForeArm.rotation.z = FOREARM_BEND

    head.current = bone('Head') ?? null
    if (head.current) restQ.current.copy(head.current.quaternion)

    invalidate()
  }, [model, invalidate])

  useFrame(() => {
    const bone = head.current
    if (!bone || !bone.parent) return

    // Dirección hacia la cámara, en el espacio local del padre del cuello
    CAMERA_LOCAL.copy(camera.position)
    bone.parent.worldToLocal(CAMERA_LOCAL)

    const targetYaw = clamp(Math.atan2(CAMERA_LOCAL.x, CAMERA_LOCAL.z), HEAD_YAW_LIMIT)
    const targetPitch = clamp(
      -Math.atan2(CAMERA_LOCAL.y, Math.hypot(CAMERA_LOCAL.x, CAMERA_LOCAL.z)),
      HEAD_PITCH_LIMIT,
    )

    const deltaYaw = targetYaw - currentYaw.current
    const deltaPitch = targetPitch - currentPitch.current

    currentYaw.current += deltaYaw * HEAD_EASE
    currentPitch.current += deltaPitch * HEAD_EASE

    OFFSET_E.set(currentPitch.current, currentYaw.current, 0, 'YXZ')
    OFFSET_Q.setFromEuler(OFFSET_E)
    REST_Q.copy(restQ.current)
    TARGET_Q.copy(REST_Q).multiply(OFFSET_Q)
    bone.quaternion.copy(TARGET_Q)

    // Mientras la cabeza siga acomodándose se piden frames; al llegar se corta
    // y la escena vuelve a congelarse (CLAUDE.md regla 2)
    if (Math.abs(deltaYaw) > 0.001 || Math.abs(deltaPitch) > 0.001) invalidate()
  })

  return <primitive ref={root} object={model} position={position} rotation={rotation} />
}

useGLTF.preload(MODEL)
