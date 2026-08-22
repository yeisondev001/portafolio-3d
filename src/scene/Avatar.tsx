import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Bone,
  Euler,
  LoopOnce,
  LoopRepeat,
  Quaternion,
  Vector3,
} from 'three'
import { useStore } from '../store/useStore'

const MODEL = '/models/avatar.glb'
const CLIPS = '/models/animaciones.json'
/**
 * El modelo viene comprimido con Draco (4,3 MB → 0,7 MB). El decodificador
 * se sirve desde /public/draco en vez del CDN de Google: sin dependencias
 * de terceros y funciona sin conexión.
 */
const DRACO_PATH = '/draco/'

/** Cuánto puede girar la cabeza siguiendo a la cámara, en radianes */
const HEAD_YAW_LIMIT = 0.6
const HEAD_PITCH_LIMIT = 0.2
/** Qué tan rápido alcanza la cabeza su objetivo (0-1 por frame) */
const HEAD_EASE = 0.12
/** Segundos que tarda el cruce entre dos animaciones */
const FADE = 0.4
/**
 * Cuadros por segundo a los que corre la animación.
 *
 * El avatar en movimiento rompe el `frameloop="demand"` (CLAUDE.md regla 2):
 * hay que pedir frames de forma continua. Se piden 30 por segundo en vez de
 * 60 — en una animación sentada y sutil no se nota, y es la mitad de trabajo
 * para el celular.
 */
const ANIMATION_FPS = 30

// Objetos reutilizados: nunca se crean dentro de useFrame (CLAUDE.md)
const CAMERA_LOCAL = new Vector3()
const HEAD_BASE = new Quaternion()
const OFFSET_Q = new Quaternion()
const OFFSET_E = new Euler()

function clamp(value: number, limit: number): number {
  return Math.max(-limit, Math.min(limit, value))
}

type ClipJSON = Parameters<typeof AnimationClip.parse>[0]

let clipsPromise: Promise<AnimationClip[]> | null = null
function loadClips(): Promise<AnimationClip[]> {
  clipsPromise ??= fetch(CLIPS)
    .then((response) => response.json() as Promise<Record<string, ClipJSON>>)
    .then((data) => Object.values(data).map((json) => AnimationClip.parse(json)))
  return clipsPromise
}

type Props = {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Avatar({ position = [0, 0, 0], rotation = [0, 0, 0] }: Props) {
  const { scene } = useGLTF(MODEL, DRACO_PATH)
  const invalidate = useThree((s) => s.invalidate)
  const camera = useThree((s) => s.camera)
  const active = useStore((s) => s.active)
  const greeting = useStore((s) => s.greeting)
  const endGreeting = useStore((s) => s.endGreeting)

  const [ready, setReady] = useState(false)
  const mixer = useRef<AnimationMixer | null>(null)
  const actions = useRef<Map<string, AnimationAction>>(new Map())
  const current = useRef<AnimationAction | null>(null)

  const head = useRef<Bone | null>(null)
  const currentYaw = useRef(0)
  const currentPitch = useRef(0)

  /**
   * Qué animación corresponde ahora.
   *
   * `sitting-beckoning` es un clip armado: piernas sentadas de `sitting`,
   * brazos del `Beckoning` de Mixamo, que es de pie. Ver
   * scripts/convertir-animaciones.mjs.
   */
  const wanted = greeting
    ? 'sitting-beckoning'
    : active === 'escritorio'
      ? 'sitting-pointing'
      : 'sitting'

  useEffect(() => {
    head.current = (scene.getObjectByName('Head') as Bone) ?? null

    let cancelled = false
    loadClips().then((clips) => {
      if (cancelled) return
      const instance = new AnimationMixer(scene)
      mixer.current = instance
      for (const clip of clips) actions.current.set(clip.name, instance.clipAction(clip))
      setReady(true)
    })

    return () => {
      cancelled = true
      mixer.current?.stopAllAction()
      mixer.current = null
      actions.current.clear()
    }
  }, [scene])

  // Cruce entre animaciones
  useEffect(() => {
    if (!ready) return
    const next = actions.current.get(wanted)
    if (!next || next === current.current) return

    // La seña se hace una vez y vuelve a la pose sentada; el resto son bucles
    const once = wanted === 'sitting-beckoning'
    next
      .reset()
      .setLoop(once ? LoopOnce : LoopRepeat, Infinity)
      .fadeIn(FADE)
      .play()
    next.clampWhenFinished = once

    current.current?.fadeOut(FADE)
    current.current = next

    if (!once) return
    const timer = setTimeout(() => endGreeting(), (next.getClip().duration - FADE) * 1000)
    return () => clearTimeout(timer)
  }, [ready, wanted, endGreeting])

  // Pedir cuadros mientras haya animación corriendo
  useEffect(() => {
    if (!ready) return
    const id = setInterval(invalidate, 1000 / ANIMATION_FPS)
    return () => clearInterval(id)
  }, [ready, invalidate])

  useFrame((_, delta) => {
    mixer.current?.update(delta)

    // La cabeza se resuelve DESPUÉS de la animación, para pisarla:
    // así el seguimiento de mirada funciona sobre cualquier pose (SPEC §14)
    const bone = head.current
    if (!bone?.parent) return

    CAMERA_LOCAL.copy(camera.position)
    bone.parent.worldToLocal(CAMERA_LOCAL)

    const targetYaw = clamp(Math.atan2(CAMERA_LOCAL.x, CAMERA_LOCAL.z), HEAD_YAW_LIMIT)
    const targetPitch = clamp(
      -Math.atan2(CAMERA_LOCAL.y, Math.hypot(CAMERA_LOCAL.x, CAMERA_LOCAL.z)),
      HEAD_PITCH_LIMIT,
    )

    currentYaw.current += (targetYaw - currentYaw.current) * HEAD_EASE
    currentPitch.current += (targetPitch - currentPitch.current) * HEAD_EASE

    HEAD_BASE.copy(bone.quaternion)
    OFFSET_E.set(currentPitch.current, currentYaw.current, 0, 'YXZ')
    OFFSET_Q.setFromEuler(OFFSET_E)
    bone.quaternion.copy(HEAD_BASE).multiply(OFFSET_Q)
  })

  return <primitive object={scene} position={position} rotation={rotation} />
}

useGLTF.preload(MODEL, DRACO_PATH)
