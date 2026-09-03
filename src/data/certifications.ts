/**
 * Certificaciones — el mural de la pared norte.
 *
 * Las imágenes son .webp y salen de `scripts/preparar-certificaciones.mjs`,
 * que convierte el PDF o la foto del diploma. El nombre del archivo tiene que
 * ser el `id`, así el dato y la imagen no se despegan:
 *
 *   node scripts/preparar-certificaciones.mjs <id> <archivo>
 *
 * TODO: las que están sin `image` son de mentira y esperan el escaneo real
 * (SPEC §12). Se borran o se completan, pero no se publican así.
 */

export type Certification = {
  id: string
  name: string
  issuer: string
  /** Año de emisión */
  year: number
  /** Ruta dentro de public/. Sin imagen se muestra un bloque de color. */
  image?: string
  placeholder: string
  /** Link donde el emisor permite verificarla */
  verify?: string
}

export const certifications: Certification[] = [
  {
    id: 'power-bi',
    name: 'Power BI',
    issuer: 'Santander Open Academy',
    year: 2026,
    image: '/img/certificaciones/power-bi.webp',
    // Rojo Santander, para cuando la imagen todavía no cargó
    placeholder: '#ec0000',
  },
  {
    id: 'devops',
    name: 'Fundamentos de DevOps',
    issuer: 'Instituto',
    year: 2025,
    placeholder: '#4a7fa8',
  },
  {
    id: 'docker',
    name: 'Docker y contenedores',
    issuer: 'Instituto',
    year: 2025,
    placeholder: '#3a8cd9',
  },
  {
    id: 'react',
    name: 'Desarrollo web con React',
    issuer: 'Instituto',
    year: 2024,
    placeholder: '#4a9c9c',
  },
  {
    id: 'ingles',
    name: 'Inglés B2',
    issuer: 'Instituto',
    year: 2024,
    placeholder: '#8c7a5b',
  },
]
