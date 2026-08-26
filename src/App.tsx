import { lazy, Suspense } from 'react'
import { Scene } from './scene/Scene'
import { TopBar } from './ui/TopBar'
import { useStore } from './store/useStore'

// Los paneles 2D no entran al bundle inicial: se descargan al abrirlos
// por primera vez (CLAUDE.md, convenciones de código)
const ProjectsPanel = lazy(() => import('./ui/ProjectsPanel'))

export function App() {
  const panel = useStore((s) => s.panel)

  return (
    <>
      <Scene />
      <TopBar />
      <Suspense fallback={null}>{panel === 'proyectos' && <ProjectsPanel />}</Suspense>
    </>
  )
}
