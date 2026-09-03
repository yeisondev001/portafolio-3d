/**
 * Datos del autor. Fuente de verdad para la barra fija y el panel Sobre mí.
 * TODO: reemplazar por los datos reales (SPEC §12).
 */
export const profile = {
  name: 'Tu Nombre',
  role: 'Desarrollador Frontend',

  /** Dos o tres líneas. Encabeza el CV. */
  summary:
    'Desarrollador web con foco en que lo que se construye llegue a producción ' +
    'y se pueda mantener. Escribo la interfaz y armo los despliegues, y me ' +
    'interesa el camino completo entre el código y el servidor.',

  email: 'tumail@ejemplo.com',
  linkedin: 'https://www.linkedin.com/in/yeison-rojas-henriquez',
  github: 'https://github.com/yeisondev001',
  cv: '/cv.pdf',

  // Disponibilidad — vive en el panel Sobre mí desde que el cuarto no tiene ventana
  location: 'Ciudad, País',
  mode: 'Remoto o híbrido',
  languages: ['Español (nativo)', 'Inglés (intermedio)'],
  seeking: true,
} as const
