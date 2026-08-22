/**
 * Convierte los .fbx de Mixamo a un JSON liviano con solo las pistas de animación.
 *
 * Así el lector de FBX no entra al bundle: en el navegador alcanza con
 * AnimationClip.parse() sobre el JSON.
 *
 * Mixamo nombra los huesos "mixamorig:Hips" y el avatar de Avaturn los llama
 * "Hips". Como el AnimationMixer une pistas y huesos por nombre, acá se saca
 * el prefijo y quedan compatibles sin pasar por Blender.
 *
 *   node scripts/convertir-animaciones.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

const INPUT_DIR = 'raw/animaciones'
const OUTPUT = 'public/models/animaciones.json'
const AVATAR = 'public/models/avatar.glb'

/** Decimales que se conservan. 4 es de sobra para rotaciones. */
const PRECISION = 4

/** Nombres de los huesos que existen de verdad en el avatar */
function avatarBones() {
  const glb = fs.readFileSync(AVATAR)
  const jsonLength = glb.readUInt32LE(12)
  const json = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8'))
  return new Set((json.nodes ?? []).map((node) => node.name).filter(Boolean))
}

function round(values, decimals) {
  const factor = 10 ** decimals
  return Array.from(values, (value) => Math.round(value * factor) / factor)
}

const bones = avatarBones()

const loader = new FBXLoader()
const clips = {}

for (const file of fs.readdirSync(INPUT_DIR).filter((f) => f.endsWith('.fbx'))) {
  const name = path.basename(file, '.fbx')
  const buffer = fs.readFileSync(path.join(INPUT_DIR, file))
  const group = loader.parse(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
    '',
  )

  const clip = group.animations[0]
  if (!clip) {
    console.log(`  ${name}: sin animaciones, se saltea`)
    continue
  }

  // "mixamorig:Hips.position" → "Hips.position"
  for (const track of clip.tracks) {
    track.name = track.name.replace(/^mixamorig[:_]?/i, '')
  }

  const before = clip.tracks.length

  // Fuera las pistas que apuntan a huesos inexistentes: el AnimationMixer
  // avisa por consola por cada una y no aportan nada
  clip.tracks = clip.tracks.filter((track) => bones.has(track.name.split('.')[0]))

  // Recortar decimales: el JSON pasa de ~1,4 MB a una fracción
  for (const track of clip.tracks) {
    track.times = round(track.times, 3)
    track.values = round(track.values, PRECISION)
  }

  clip.name = name
  clips[name] = clip.toJSON(clip)

  console.log(
    `  ${name.padEnd(18)} ${clip.duration.toFixed(2)}s  ` +
      `${String(clip.tracks.length).padStart(3)} pistas ` +
      `(${before - clip.tracks.length} descartadas)  ` +
      `${clip.tracks[0]?.times.length ?? 0} fotogramas`,
  )
}

/**
 * Los gestos de Mixamo son de pie y los clips sentados no mueven los brazos
 * (SPEC §14). La salida es armar un clip nuevo: piernas y cadera de uno,
 * torso y brazos del otro.
 *
 * Las piernas se congelan en su primer fotograma sentado y se estiran a lo
 * largo del gesto, así el avatar queda sentado moviendo los brazos.
 */
const LOWER_BODY = new Set([
  'Hips',
  'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase',
  'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase',
])

function combinar(nombre, base, gesto) {
  if (!clips[base] || !clips[gesto]) return

  const duracion = clips[gesto].duration
  const tracks = []

  // Tren superior: el gesto, tal cual
  for (const track of clips[gesto].tracks) {
    if (!LOWER_BODY.has(track.name.split('.')[0])) tracks.push(track)
  }

  // Tren inferior: la pose sentada, congelada
  for (const track of clips[base].tracks) {
    if (!LOWER_BODY.has(track.name.split('.')[0])) continue
    const salto = track.values.length / track.times.length
    const primero = track.values.slice(0, salto)
    tracks.push({
      ...track,
      times: [0, duracion],
      values: [...primero, ...primero],
    })
  }

  clips[nombre] = { ...clips[gesto], name: nombre, tracks }
  console.log(`  ${nombre.padEnd(18)} ${duracion.toFixed(2)}s  ${tracks.length} pistas  (combinado)`)
}

combinar('sitting-beckoning', 'sitting', 'beckoning')

// El gesto de pie ya cumplió su papel de ingrediente: no se manda al navegador
delete clips.beckoning

fs.writeFileSync(OUTPUT, JSON.stringify(clips))
console.log('---')
console.log(`${OUTPUT}  ${(fs.statSync(OUTPUT).size / 1024).toFixed(0)} KB`)
