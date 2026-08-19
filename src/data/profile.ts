/**
 * Datos del autor. Fuente de verdad para la barra fija y el panel Sobre mí.
 * TODO: reemplazar por los datos reales (SPEC §12).
 */
export const profile = {
  name: 'Tu Nombre',
  role: 'Desarrollador Frontend',

  email: 'tumail@ejemplo.com',
  linkedin: 'https://linkedin.com/in/usuario',
  github: 'https://github.com/usuario',
  cv: '/cv.pdf',

  // Disponibilidad — vive en el panel Sobre mí desde que el cuarto no tiene ventana
  location: 'Ciudad, País',
  mode: 'Remoto o híbrido',
  languages: ['Español (nativo)', 'Inglés (intermedio)'],
  seeking: true,
} as const
