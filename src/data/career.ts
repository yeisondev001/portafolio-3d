/**
 * Trayectoria — la estantería de la pared oeste.
 * Trabajo y estudio en una sola línea de tiempo, ordenada del más reciente
 * al más viejo.
 *
 * TODO: reemplazar por la real (SPEC §12).
 */

export type Milestone = {
  id: string
  /** Puesto o título */
  role: string
  /** Empresa o institución */
  place: string
  /** "2024" o "2023 — 2025". Si sigue en curso: "2025 — hoy" */
  period: string
  kind: 'trabajo' | 'estudio'
  /** Una o dos líneas: qué hacías y qué dejaste hecho */
  description: string
}

export const career: Milestone[] = [
  {
    id: 'actual',
    role: 'Desarrollador',
    place: 'Empresa',
    period: '2025 — hoy',
    kind: 'trabajo',
    description:
      'Desarrollo y mantenimiento de aplicaciones web, con parte del trabajo ' +
      'puesto en automatizar despliegues.',
  },
  {
    id: 'practica',
    role: 'Práctica profesional',
    place: 'Empresa',
    period: '2024 — 2025',
    kind: 'trabajo',
    description: 'Primer contacto con el trabajo en equipo y con proyectos reales en producción.',
  },
  {
    id: 'carrera',
    role: 'Ingeniería en Sistemas',
    place: 'Universidad',
    period: '2022 — 2026',
    kind: 'estudio',
    description: 'Formación en desarrollo de software, bases de datos e infraestructura.',
  },
]
