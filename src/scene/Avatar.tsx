import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Bone, Euler, Object3D, Quaternion, Vector3 } from 'three'

const MODEL = '/models/avatar.glb'
/**
 * El modelo viene comprimido con Draco (4,3 MB → 0,7 MB). El decodificador
 * se sirve desde /public/draco en vez del CDN de Google: sin dependencias
 * de terceros y funciona sin conexión.
 */
const DRACO_PATH = '/draco/'

/** Cuánto se separan los brazos del cuerpo. 0 = pegados, 0.4 = bastante abiertos */
const ARM_SPREAD = 0.22
/** Cuánto puede girar la cabeza siguiendo a la cámara, en radianes */
const HEAD_YAW_LIMIT = 0.6
const HEAD_PITCH_LIMIT = 0.35
/** Qué tan rápido alcanza la cabeza su objetivo (0-1 por frame) */
const HEAD_EASE = 0.12

// Objetos reutilizados: nunca se crean dentro de useFrame (CLAUDE.md)
const CAMERA_LOCAL = new Vector3()
const BONE_DIR = new Vector3()
const WANTED_DIR = new Vector3()
const WORLD_Q = new Quaternion()
const ROT_Q = new Quaternion()
const OFFSET_Q = new Quaternion()
const OFFSET_E = new Euler()

function clamp(value: number, limit: number): number {
  return Math.max(-limit, Math.min(limit, value))
}

/**
 * Apunta un hueso hacia una dirección del mundo.
 *
 * Rotar el hueso sobre un eje fijo no sirve: cada rig orienta sus huesos
 * distinto, y si el eje coincide con el largo del hueso, el brazo gira sobre
 * sí mismo en vez de bajar. Acá se calcula la rotación exacta que lleva al
 * hueso desde donde apunta hasta donde queremos, sin suponer nada del rig.
 *
 * Es idempotente: guarda la rotación original y parte siempre de ella, así
 * recargar en caliente no acumula giros.
 */
function aimBone(bone: Bone | undefined, childName: string, wanted: Vector3) {
  const child = bone?.getObjectByName(childName)
  if (!bone || !child) return

  const rest = (bone.userData.restQuaternion ??= bone.quaternion.clone()) as Quaternion
  bone.quaternion.copy(rest)
  bone.updateWorldMatrix(true, false)

  // Hacia dónde apunta el hueso, en su propio espacio
  BONE_DIR.copy(child.position).normalize()

  // La dirección deseada, traída del mundo al espacio del hueso
  bone.getWorldQuaternion(WORLD_Q).invert()
  WANTED_DIR.copy(wanted).normalize().applyQuaternion(WORLD_Q)

  ROT_Q.setFromUnitVectors(BONE_DIR, WANTED_DIR)
  bone.quaternion.multiply(ROT_Q)
  bone.updateMatrixWorld(true)
}

type Props = {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Avatar({ position = [0.72, 0, -0.85], rotation = [0, 0, 0] }: Props) {
  const { scene } = useGLTF(MODEL, DRACO_PATH)
  const invalidate = useThree((s) => s.invalidate)
  const camera = useThree((s) => s.camera)

  const head = useRef<Bone | null>(null)
  const headRest = useRef(new Quaternion())
  const currentYaw = useRef(0)
  const currentPitch = useRef(0)

  // Hay un solo avatar en el cuarto, así que se usa la escena del GLB tal cual
  const model = useMemo(() => scene, [scene])

  useEffect(() => {
    const bone = (name: string) => model.getObjectByName(name) as Bone | undefined

    // Bajar los brazos desde la T-Pose. Se hace acá, y no con una animación,
    // porque hasta la fase 4 no hay clips de Mixamo cargados (SPEC §14).
    aimBone(bone('LeftArm'), 'LeftForeArm', new Vector3(-ARM_SPREAD, -1, 0))
    aimBone(bone('RightArm'), 'RightForeArm', new Vector3(ARM_SPREAD, -1, 0))
    aimBone(bone('LeftForeArm'), 'LeftHand', new Vector3(-ARM_SPREAD * 0.5, -1, 0.12))
    aimBone(bone('RightForeArm'), 'RightHand', new Vector3(ARM_SPREAD * 0.5, -1, 0.12))

    head.current = bone('Head') ?? null
    if (head.current) headRest.current.copy(head.current.quaternion)

    invalidate()
  }, [model, invalidate])

  useFrame(() => {
    const bone = head.current
    if (!bone?.parent) return

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
    bone.quaternion.copy(headRest.current).multiply(OFFSET_Q)

    // Mientras la cabeza siga acomodándose se piden frames; al llegar se corta
    // y la escena vuelve a congelarse (CLAUDE.md regla 2)
    if (Math.abs(deltaYaw) > 0.001 || Math.abs(deltaPitch) > 0.001) invalidate()
  })

  return <primitive object={model as Object3D} position={position} rotation={rotation} />
}

useGLTF.preload(MODEL, DRACO_PATH)
