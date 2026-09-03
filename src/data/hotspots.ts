/**
 * Puntos de interés del cuarto — ÚNICA fuente de verdad de las posiciones de cámara.
 *
 * Agregar una zona nueva = agregar un objeto a este array y su id al tipo.
 * No hay que tocar CameraRig.tsx ni Scene.tsx (CLAUDE.md).
 *
 * Sistema de coordenadas del cuarto (5 × 2,7 × 4,4 m, centrado en el origen):
 *   x: -2,5 (oeste: cama y estantería) .. +2,5 (este: pizarra)
 *   y:  0 (piso) .. 2,7 (techo)
 *   z: -2,2 (norte: escritorio y certificaciones) .. +2,2 (sur: puerta)
 *
 * Distribución B, "barrido horario": el recorrido gira siempre hacia el
 * mismo lado —avatar, escritorio, certificaciones, stack, trayectoria—
 * para que la cámara nunca cruce el cuarto de punta a punta.
 */

export type HotspotId =
  | 'entrada'
  | 'monitor'
  | 'avatar'
  | 'escritorio'
  | 'certificaciones'
  | 'stack'
  | 'trayectoria'

export type PanelId =
  | 'proyectos'
  | 'sobre-mi' // incluye disponibilidad
  | 'contacto'
  | 'certificaciones'
  | 'stack'
  | 'trayectoria'

export type Hotspot = {
  id: HotspotId
  /** Texto del botón y aria-label */
  label: string
  /** Dónde se posiciona la cámara */
  camera: [number, number, number]
  /** Hacia dónde mira */
  target: [number, number, number]
  /** Dónde flota el puntito clickeable en la escena */
  marker: [number, number, number]
  /** Panel que abre al llegar, si abre alguno */
  panel: PanelId | null
  /** Segundos que dura el viaje */
  duration?: number
  /**
   * No se muestra ni como puntito ni en la barra: se llega haciendo clic
   * sobre el objeto mismo. Es el caso del monitor.
   */
  hidden?: boolean
  /**
   * Ancho en metros que tiene que entrar completo en la pantalla.
   *
   * Sin esto la distancia se calcula contra el campo de visión vertical, y en
   * un celular en vertical el horizontal es mucho menor: la pantalla del
   * monitor se cortaba por los costados. Con esto la cámara se aleja lo
   * necesario según la forma de la ventana.
   */
  fitWidth?: number
}

export const HOTSPOTS: readonly Hotspot[] = [
  {
    id: 'entrada',
    label: 'Entrada',
    camera: [0.45, 1.62, 1.7],
    target: [-0.5, 1.12, -1.5],
    marker: [0.45, 1.48, 1.5],
    panel: null,
    duration: 1.8,
  },
  {
    id: 'avatar',
    label: 'Sobre mí',
    camera: [0.0, 1.32, 0.4],
    target: [-0.02, 1.12, -1.15],
    marker: [-0.02, 1.5, -1.15],
    panel: 'sobre-mi',
  },
  {
    id: 'escritorio',
    label: 'Escritorio',
    camera: [-0.9, 1.24, -1.02],
    target: [-0.9, 1.04, -1.98],
    marker: [-0.9, 1.42, -1.9],
    // Sin panel automático: al llegar se elige entre monitor, celular y carpeta
    panel: null,
  },
  {
    /**
     * Acercamiento a la pantalla del monitor.
     *
     * A 40 cm y con el campo de visión de la escena, la pantalla ocupa
     * alrededor del 85% del alto: llena la vista sin recortarse, y la
     * interfaz que vive dentro de la pantalla se vuelve legible y tocable.
     */
    id: 'monitor',
    label: 'Proyectos',
    fitWidth: 0.6,
    camera: [-0.962, 1.08, -1.597],
    target: [-0.902, 1.08, -1.967],
    marker: [-0.902, 1.08, -1.96],
    // Sin panel: los proyectos se leen en la pantalla misma. El panel 2D
    // queda como alternativa, detrás del botón "Ver en grande" (SPEC §5).
    panel: null,
    duration: 1.2,
    hidden: true,
  },
  {
    id: 'certificaciones',
    label: 'Certificaciones',
    camera: [1.15, 1.62, -1.15],
    target: [1.15, 1.62, -2.2],
    marker: [1.15, 1.62, -2.05],
    panel: 'certificaciones',
  },
  {
    id: 'stack',
    label: 'Stack',
    camera: [1.12, 1.6, -1.75],
    target: [2.5, 1.6, -1.75],
    marker: [2.32, 1.6, -1.75],
    panel: 'stack',
  },
  {
    id: 'trayectoria',
    label: 'Trayectoria',
    camera: [-1.15, 1.32, 0.9],
    target: [-2.5, 1.15, 0.9],
    marker: [-2.1, 1.32, 0.9],
    panel: 'trayectoria',
  },
]

export const ENTRADA = HOTSPOTS[0]

export function getHotspot(id: HotspotId): Hotspot {
  const found = HOTSPOTS.find((h) => h.id === id)
  if (!found) throw new Error(`Hotspot desconocido: ${id}`)
  return found
}
