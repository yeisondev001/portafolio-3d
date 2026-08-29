/**
 * Certificaciones — el cuadro de la pared norte.
 *
 * TODO: reemplazar por las reales (SPEC §12). Las imágenes de los diplomas
 * van en `public/img/` y se referencian desde `image`.
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
    id: 'devops',
    name: 'Fundamentos de DevOps',
    issuer: 'Instituto',
    year: 2025,
    placeholder: '#4a7fa8',
    verify: 'https://ejemplo.com/verificar',
  },
  {
    id: 'docker',
    name: 'Docker y contenedores',
    issuer: 'Instituto',
    year: 2025,
    placeholder: '#3a8cd9',
    verify: 'https://ejemplo.com/verificar',
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
