/**
 * Comprime las texturas de un .glb: las reescala y las vuelve a codificar.
 *
 * Existe porque el CLI de gltf-transform trae una copia de sharp que falla en
 * Windows ("colourspace: parameter space not set"). Este script usa la sharp
 * instalada en el proyecto, que sí funciona.
 *
 *   node scripts/comprimir-texturas.mjs entrada.glb salida.glb [maxPx] [calidad]
 */
import fs from 'node:fs'
import sharp from 'sharp'

const [input, output, maxPxArg, qualityArg] = process.argv.slice(2)
const MAX_PX = Number(maxPxArg ?? 512)
const QUALITY = Number(qualityArg ?? 80)

const glb = fs.readFileSync(input)
const jsonLength = glb.readUInt32LE(12)
const json = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8'))
const binStart = 20 + jsonLength + 8
const binLength = glb.readUInt32LE(20 + jsonLength)
const bin = glb.subarray(binStart, binStart + binLength)

// Bytes actuales de cada bufferView
const views = json.bufferViews.map((view) => {
  const start = view.byteOffset ?? 0
  return Buffer.from(bin.subarray(start, start + view.byteLength))
})

// La cara se ve de cerca en el punto 'avatar', asi que su textura conserva
// resolucion y calidad altas. El resto del cuerpo se ve a distancia.
const HQ_IMAGES = new Set()
for (const material of json.materials ?? []) {
  if (!/body|head|face/i.test(material.name ?? '')) continue
  const texture = material.pbrMetallicRoughness?.baseColorTexture
  if (texture) HQ_IMAGES.add(json.textures[texture.index].source)
}

let before = 0
let after = 0

for (const [index, image] of (json.images ?? []).entries()) {
  const viewIndex = image.bufferView
  if (viewIndex === undefined) continue

  const original = views[viewIndex]
  before += original.length

  const isHq = HQ_IMAGES.has(index)
  const maxPx = isHq ? MAX_PX * 2 : MAX_PX
  const quality = isHq ? Math.min(95, QUALITY + 12) : QUALITY

  const pipeline = sharp(original, { failOn: 'none' })
  const meta = await pipeline.metadata()
  const needsAlpha = meta.hasAlpha === true

  const resized = pipeline.resize({
    width: Math.min(meta.width ?? maxPx, maxPx),
    height: Math.min(meta.height ?? maxPx, maxPx),
    fit: 'inside',
  })

  // Con canal alfa hay que mantener PNG: el JPEG no lo soporta y el pelo
  // depende de la transparencia
  const encoded = needsAlpha
    ? await resized.png({ compressionLevel: 9, palette: true, quality }).toBuffer()
    : await resized.jpeg({ quality, mozjpeg: true }).toBuffer()

  views[viewIndex] = encoded
  image.mimeType = needsAlpha ? 'image/png' : 'image/jpeg'
  after += encoded.length

  const label = `${meta.width}x${meta.height} ${needsAlpha ? 'PNG' : 'JPEG'}${isHq ? ' (cara)' : ''}`
  console.log(
    `  imagen ${String(index).padStart(2)}  ${label.padEnd(16)}` +
      `${(original.length / 1024).toFixed(0).padStart(5)} KB → ${(encoded.length / 1024).toFixed(0).padStart(5)} KB`,
  )
}

// Rearmar el binario con los desplazamientos nuevos, alineados a 4 bytes
const chunks = []
let offset = 0
json.bufferViews.forEach((view, index) => {
  const padding = (4 - (offset % 4)) % 4
  if (padding) {
    chunks.push(Buffer.alloc(padding))
    offset += padding
  }
  view.byteOffset = offset
  view.byteLength = views[index].length
  chunks.push(views[index])
  offset += views[index].length
})

const newBin = Buffer.concat(chunks)
const binPadded = Buffer.concat([newBin, Buffer.alloc((4 - (newBin.length % 4)) % 4)])
json.buffers[0].byteLength = newBin.length

const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
const jsonPadded = Buffer.concat([
  jsonBuffer,
  Buffer.alloc((4 - (jsonBuffer.length % 4)) % 4, 0x20),
])

const header = Buffer.alloc(12)
header.write('glTF', 0)
header.writeUInt32LE(2, 4)
header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + binPadded.length, 8)

const jsonHeader = Buffer.alloc(8)
jsonHeader.writeUInt32LE(jsonPadded.length, 0)
jsonHeader.write('JSON', 4)

const binHeader = Buffer.alloc(8)
binHeader.writeUInt32LE(binPadded.length, 0)
binHeader.write('BIN\0', 4)

fs.writeFileSync(output, Buffer.concat([header, jsonHeader, jsonPadded, binHeader, binPadded]))

console.log('---')
console.log(`texturas: ${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024 / 1024).toFixed(2)} MB`)
console.log(
  `archivo:  ${(glb.length / 1024 / 1024).toFixed(2)} MB → ${(fs.statSync(output).size / 1024 / 1024).toFixed(2)} MB`,
)
