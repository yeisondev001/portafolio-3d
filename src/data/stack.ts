/**
 * Tecnologías que domina el autor — la pizarra del cuarto.
 *
 * ESTA LISTA ESTÁ INFERIDA de los repositorios públicos de github.com/yeisondev001
 * (lenguaje principal de cada repo y su fecha). Sirve como punto de partida,
 * pero solo el autor sabe qué maneja de verdad y a qué nivel:
 * **hay que revisarla y corregirla antes de publicar.**
 *
 * Agregar una tecnología = agregar un objeto a este array (CLAUDE.md regla 4).
 */

export type Level = 'fuerte' | 'solido' | 'aprendiendo'

export type Category = 'lenguaje' | 'frontend' | 'backend' | 'movil' | 'devops'

export type Tech = {
  id: string
  name: string
  category: Category
  level: Level
  /** Una línea: dónde lo usaste, qué hiciste con esto */
  note?: string
  /** Ids de `projects.ts` donde aparece */
  projects?: string[]
  color: string
}

export const LEVEL_LABEL: Record<Level, string> = {
  fuerte: 'Lo manejo bien',
  solido: 'Lo uso con soltura',
  aprendiendo: 'Lo estoy aprendiendo',
}

export const CATEGORY_LABEL: Record<Category, string> = {
  lenguaje: 'Lenguajes',
  frontend: 'Frontend',
  backend: 'Backend',
  movil: 'Móvil',
  devops: 'DevOps e infraestructura',
}

/** Orden en que se muestran las categorías en el panel */
export const CATEGORY_ORDER: Category[] = ['lenguaje', 'frontend', 'backend', 'movil', 'devops']

export const stack: Tech[] = [
  // ── Lenguajes ──
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'lenguaje',
    level: 'fuerte',
    note: 'El que más aparece en mis proyectos.',
    color: '#d9b84a',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'lenguaje',
    level: 'solido',
    note: 'Lo que uso hoy, incluido este portafolio.',
    projects: ['portafolio'],
    color: '#4a7fd9',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'lenguaje',
    level: 'solido',
    note: 'Aplicaciones web y automatizaciones.',
    color: '#4a8cd9',
  },
  {
    id: 'csharp',
    name: 'C#',
    category: 'lenguaje',
    level: 'solido',
    note: 'Sistemas de gestión: inventario, reservas, cartelera.',
    color: '#7a5bd9',
  },
  {
    id: 'dart',
    name: 'Dart',
    category: 'lenguaje',
    level: 'solido',
    color: '#3aa8b8',
  },

  // ── Frontend ──
  {
    id: 'html',
    name: 'HTML y CSS',
    category: 'frontend',
    level: 'fuerte',
    color: '#d97a4a',
  },
  {
    id: 'vue',
    name: 'Vue',
    category: 'frontend',
    level: 'aprendiendo',
    color: '#4aa87a',
  },
  {
    id: 'three',
    name: 'Three.js',
    category: 'frontend',
    level: 'aprendiendo',
    note: 'El cuarto que estás recorriendo.',
    projects: ['portafolio'],
    color: '#8c8c8c',
  },

  // ── Backend ──
  {
    id: 'dotnet',
    name: '.NET',
    category: 'backend',
    level: 'solido',
    color: '#6b5bd9',
  },
  {
    id: 'node',
    name: 'Node.js',
    category: 'backend',
    level: 'solido',
    color: '#5b9c4a',
  },

  // ── Móvil ──
  {
    id: 'flutter',
    name: 'Flutter',
    category: 'movil',
    level: 'solido',
    note: 'Aplicaciones móviles multiplataforma.',
    color: '#3a8cb8',
  },

  // ── DevOps ──
  {
    id: 'docker',
    name: 'Docker',
    category: 'devops',
    level: 'fuerte',
    note: 'Contenedores y Docker Compose en varios proyectos.',
    color: '#3a8cd9',
  },
  {
    id: 'cicd',
    name: 'CI/CD',
    category: 'devops',
    level: 'solido',
    note: 'Pipelines de integración y entrega continua.',
    color: '#4a9c9c',
  },
  {
    id: 'ansible',
    name: 'Ansible',
    category: 'devops',
    level: 'solido',
    note: 'Automatización de configuración de servidores.',
    color: '#c74a4a',
  },
  {
    id: 'nginx',
    name: 'Nginx',
    category: 'devops',
    level: 'solido',
    color: '#4a9c5b',
  },
  {
    id: 'monitoreo',
    name: 'Prometheus y Grafana',
    category: 'devops',
    level: 'aprendiendo',
    note: 'Monitoreo y visualización de métricas.',
    color: '#d97a3a',
  },
  {
    id: 'git',
    name: 'Git y GitFlow',
    category: 'devops',
    level: 'fuerte',
    color: '#d95b3a',
  },
]
