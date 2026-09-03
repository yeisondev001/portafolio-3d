import { lazy, Suspense } from 'react'
import { Scene } from './scene/Scene'
import { Hud } from './ui/Hud'
import { useStore } from './store/useStore'

// Los paneles 2D no entran al bundle inicial: se descargan al abrirlos
// por primera vez (CLAUDE.md, convenciones de código)
const ProjectsPanel = lazy(() => import('./ui/ProjectsPanel'))
const StackPanel = lazy(() => import('./ui/StackPanel'))
const AboutPanel = lazy(() => import('./ui/AboutPanel'))
const ContactPanel = lazy(() => import('./ui/ContactPanel'))
const CertsPanel = lazy(() => import('./ui/CertsPanel'))
const CareerPanel = lazy(() => import('./ui/CareerPanel'))
const CvPanel = lazy(() => import('./ui/CvPanel'))

export function App() {
  const panel = useStore((s) => s.panel)

  return (
    <>
      <Scene />
      <Hud />
      <Suspense fallback={null}>
        {panel === 'proyectos' && <ProjectsPanel />}
        {panel === 'stack' && <StackPanel />}
        {panel === 'sobre-mi' && <AboutPanel />}
        {panel === 'contacto' && <ContactPanel />}
        {panel === 'certificaciones' && <CertsPanel />}
        {panel === 'trayectoria' && <CareerPanel />}
        {panel === 'cv' && <CvPanel />}
      </Suspense>
    </>
  )
}
