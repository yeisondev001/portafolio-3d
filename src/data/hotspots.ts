/**
 * Puntos de interés del cuarto — ÚNICA fuente de verdad de las posiciones de cámara.
 *
 * Agregar una zona nueva = agregar un objeto a este array y su id al tipo.
 * No hay que tocar CameraRig.tsx ni Scene.tsx (CLAUDE.md).
 *
 * Sistema de coordenadas del cuarto (4 × 2,5 × 3,5 m, centrado en el origen):
 *   x: -2 (oeste, estantería) .. +2 (este, pizarra)
 *   y:  0 (piso) .. 2,5 (techo)
 *   z: -1,75 (norte, certificaciones) .. +1,75 (sur, puerta)
 */

export type HotspotId =
  | 'entrada'
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
}

export const HOTSPOTS: readonly Hotspot[] = [
  {
    id: 'entrada',
    label: 'Entrada',
    camera: [0, 1.6, 1.35],
    target: [0, 1.1, -1.4],
    marker: [0, 1.5, 1.15],
    panel: null,
    duration: 1.8,
  },
  {
    id: 'avatar',
    label: 'Sobre mí',
    camera: [0.72, 1.35, 0.35],
    target: [0.72, 1.15, -0.9],
    marker: [0.72, 1.45, -0.9],
    panel: 'sobre-mi',
  },
  {
    id: 'escritorio',
    label: 'Escritorio',
    camera: [-0.2, 1.25, -0.55],
    target: [-0.2, 1.02, -1.5],
    marker: [-0.2, 1.4, -1.45],
    // Sin panel automático: al llegar se elige entre monitor, celular y carpeta
    panel: null,
  },
  {
    id: 'certificaciones',
    label: 'Certificaciones',
    camera: [0, 1.7, -0.5],
    target: [0, 1.75, -1.75],
    marker: [0, 1.75, -1.6],
    panel: 'certificaciones',
  },
  {
    id: 'stack',
    label: 'Stack',
    camera: [0.8, 1.5, -0.3],
    target: [2, 1.5, -0.3],
    marker: [1.9, 1.5, -0.3],
    panel: 'stack',
  },
  {
    id: 'trayectoria',
    label: 'Trayectoria',
    camera: [-0.85, 1.35, -0.4],
    target: [-2, 1.1, -0.4],
    marker: [-1.65, 1.35, -0.4],
    panel: 'trayectoria',
  },
]

export const ENTRADA = HOTSPOTS[0]

export function getHotspot(id: HotspotId): Hotspot {
  const found = HOTSPOTS.find((h) => h.id === id)
  if (!found) throw new Error(`Hotspot desconocido: ${id}`)
  return found
}
