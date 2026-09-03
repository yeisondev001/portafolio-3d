/**
 * Convierte un diploma (PDF o imagen) en el .webp que se cuelga en el marco.
 *
 *   node scripts/preparar-certificaciones.mjs power-bi ~/Downloads/cert.pdf
 *
 * El `id` tiene que coincidir con el de src/data/certifications.ts; de ahí
 * sale el nombre del archivo y así el dato y la imagen no se despegan.
 *
 * Los PDF se rasterizan con pdftoppm (Poppler). Es la única dependencia que
 * no está en package.json: se instala aparte y solo hace falta al preparar
 * un diploma nuevo, no para compilar ni para correr el sitio.
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

/** El marco mide 1,45 m y el diploma se puede abrir en grande en el panel */
const MAX_WIDTH = 1600
/** Puntos por pulgada al rasterizar el PDF. 200 da de sobra para MAX_WIDTH. */
const DPI = 200
const QUALITY = 80

const SALIDA = 'public/img/certificaciones'

const [, , id, origen] = process.argv

if (!id || !origen) {
  console.error('uso: node scripts/preparar-certificaciones.mjs <id> <archivo>')
  process.exit(1)
}

if (!/^[a-z0-9-]+$/.test(id)) {
  console.error(`id inválido: "${id}". Solo minúsculas, números y guiones.`)
  process.exit(1)
}

if (!fs.existsSync(origen)) {
  console.error(`no existe: ${origen}`)
  process.exit(1)
}

/** Devuelve la ruta de un PNG con la primera página; para imágenes, el original */
function rasterizar(archivo) {
  if (path.extname(archivo).toLowerCase() !== '.pdf') return archivo

  const prefijo = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cert-')), 'pagina')
  try {
    execFileSync('pdftoppm', ['-png', '-r', String(DPI), '-f', '1', '-l', '1', archivo, prefijo])
  } catch {
    console.error('falta pdftoppm (Poppler). Instalar con: winget install oschwartz10612.Poppler')
    process.exit(1)
  }

  // pdftoppm numera la salida y la cantidad de dígitos depende del total de páginas
  const carpeta = path.dirname(prefijo)
  const png = fs.readdirSync(carpeta).find((f) => f.endsWith('.png'))
  if (!png) {
    console.error('pdftoppm no generó ninguna página')
    process.exit(1)
  }
  return path.join(carpeta, png)
}

fs.mkdirSync(SALIDA, { recursive: true })

const png = rasterizar(origen)
const destino = path.join(SALIDA, `${id}.webp`)

const info = await sharp(png)
  .resize({ width: MAX_WIDTH, withoutEnlargement: true })
  .webp({ quality: QUALITY })
  .toFile(destino)

const kb = Math.round(info.size / 1024)
console.log(`${destino}  ${info.width}×${info.height}  ${kb} KB`)
