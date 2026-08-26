/**
 * Los proyectos del portafolio.
 *
 * Agregar uno = agregar un objeto a este array. No hay backend ni base de
 * datos: se edita el archivo, se hace push, y Vercel reconstruye el sitio
 * solo (CLAUDE.md regla 4).
 *
 * Las capturas van en `public/img/`. Formato `.webp`, ancho 1200 px basta.
 *
 * TODO: reemplazar por los proyectos reales (SPEC §12).
 */

export type Project = {
  id: string
  name: string
  /** Una línea. Es lo que se lee en la grilla. */
  tagline: string
  /** Dos o tres párrafos: qué problema resuelve y qué papel tuviste. */
  description: string
  stack: string[]
  /** Ruta dentro de public/. Si falta, se muestra un marcador de color. */
  image?: string
  /** Color del marcador mientras no haya captura */
  placeholder: string
  demo?: string
  repo?: string
  year: number
}

export const projects: Project[] = [
  {
    id: 'tienda',
    name: 'Tienda online',
    tagline: 'E-commerce con carrito, pagos y panel de administración.',
    description:
      'Un comercio electrónico completo: catálogo con filtros, carrito persistente, ' +
      'pasarela de pago y un panel donde el dueño carga productos sin tocar código. ' +
      'Me encargué del frontend y de la integración con la pasarela.',
    stack: ['React', 'TypeScript', 'Node', 'PostgreSQL'],
    placeholder: '#5b7a8c',
    demo: 'https://ejemplo.com',
    repo: 'https://github.com/usuario/tienda',
    year: 2026,
  },
  {
    id: 'dashboard',
    name: 'Panel de métricas',
    tagline: 'Visualización de datos en tiempo real para un equipo de ventas.',
    description:
      'Reemplazó una planilla que se actualizaba a mano todas las mañanas. ' +
      'Muestra objetivos, avance por vendedor y comparación contra el mes anterior. ' +
      'Lo más difícil fue que cargara rápido con varios años de historial.',
    stack: ['React', 'Chart.js', 'Firebase'],
    placeholder: '#7a6b8c',
    demo: 'https://ejemplo.com',
    repo: 'https://github.com/usuario/dashboard',
    year: 2025,
  },
  {
    id: 'reservas',
    name: 'Sistema de reservas',
    tagline: 'Turnos online para un consultorio, con recordatorios automáticos.',
    description:
      'El paciente elige día y horario según la disponibilidad real, y recibe un ' +
      'recordatorio el día anterior. Bajó bastante la cantidad de turnos perdidos.',
    stack: ['Next.js', 'Prisma', 'PostgreSQL'],
    placeholder: '#6b8c6b',
    repo: 'https://github.com/usuario/reservas',
    year: 2025,
  },
  {
    id: 'portafolio',
    name: 'Este portafolio',
    tagline: 'Un cuarto 3D navegable, hecho con Three.js.',
    description:
      'El sitio que estás mirando. Escena 3D con navegación por puntos fijos, ' +
      'avatar animado y renderizado bajo demanda para que ande bien en celular.',
    stack: ['Three.js', 'React Three Fiber', 'TypeScript', 'Blender'],
    placeholder: '#8c7a5b',
    repo: 'https://github.com/yeisondev001/portafolio-3d',
    year: 2026,
  },
]
