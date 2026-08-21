/**
 * Puntos de interés del cuarto — ÚNICA fuente de verdad de las posiciones de cámara.
 *
 * Agregar una zona nueva = agregar un objeto a este array y su id al tipo.
 * No hay que tocar CameraRig.tsx ni Scene.tsx (CLAUDE.md).
 *
 * Sistema de coordenadas del cuarto (5 × 2,7 × 4,4 m, centrado en el origen):
 *   x: -2,5 (oeste, estantería) .. +2,5 (este, pizarra y cama)
 *   y:  0 (piso) .. 2,7 (techo)
 *   z: -2,2 (norte, escritorio y certificaciones) .. +2,2 (sur, puerta)
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
    camera: [-0.6, 1.62, 1.72],
    target: [-0.2, 1.15, -1.5],
    marker: [-0.6, 1.5, 1.5],
    panel: null,
    duration: 1.8,
  },
  {
    id: 'avatar',
    label: 'Sobre mí',
    camera: [0.24, 1.32, 0.28],
    target: [0.2, 1.12, -1.2],
    marker: [0.2, 1.5, -1.2],
    panel: 'sobre-mi',
  },
  {
    id: 'escritorio',
    label: 'Escritorio',
    camera: [-0.62, 1.22, -1.0],
    target: [-0.62, 1.04, -1.95],
    marker: [-0.62, 1.4, -1.87],
    // Sin panel automático: al llegar se elige entre monitor, celular y carpeta
    panel: null,
  },
  {
    id: 'certificaciones',
    label: 'Certificaciones',
    camera: [0.98, 1.7, -1.05],
    target: [0.98, 1.62, -2.2],
    marker: [0.98, 1.58, -2.03],
    panel: 'certificaciones',
  },
  {
    id: 'stack',
    label: 'Stack',
    camera: [1.05, 1.68, -0.3],
    target: [2.5, 1.68, -0.3],
    marker: [2.32, 1.68, -0.3],
    panel: 'stack',
  },
  {
    id: 'trayectoria',
    label: 'Trayectoria',
    camera: [-1.35, 1.28, -0.15],
    target: [-2.5, 1.1, -0.15],
    marker: [-2.14, 1.28, -0.15],
    panel: 'trayectoria',
  },
]

export const ENTRADA = HOTSPOTS[0]

export function getHotspot(id: HotspotId): Hotspot {
  const found = HOTSPOTS.find((h) => h.id === id)
  if (!found) throw new Error(`Hotspot desconocido: ${id}`)
  return found
}
