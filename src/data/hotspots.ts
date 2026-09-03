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
  | 'cv'
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
  /**
   * Dónde flota el puntito clickeable en la escena.
   *
   * Sin marker no se dibuja ningún puntito: al punto se llega tocando un
   * objeto del cuarto o desde la barra. Distinto de `hidden`, que además lo
   * saca de la barra.
   */
  marker?: [number, number, number]
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
    /*
     * Mira derecho al norte, no hacia la izquierda.
     *
     * Apuntando a -0,5 el eje de la vista quedaba 16 grados a la izquierda y
     * el tablero del stack —que está en la pared este— caía 48 grados a la
     * derecha, fuera del medio campo de 43 que da un fov de 55 en pantalla
     * ancha: se veía una astilla en el borde. Derecho al norte queda a 32
     * grados y entra entero.
     *
     * El avatar pasa a estar apenas a la izquierda del centro en vez de
     * apenas a la derecha, que compone igual o mejor.
     *
     * En celular vertical el campo horizontal baja a 31 grados y no hay
     * encuadre que meta al avatar y al tablero a la vez: ahí el tablero se
     * alcanza por la barra de abajo.
     */
    target: [0.45, 1.12, -1.5],
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
    /*
     * Sobre el extremo izquierdo del escritorio, al lado del velador.
     *
     * NO encima del monitor. Ahí flotaba antes, a 16 cm por arriba, y desde
     * la puerta le quedaban entre 6 y 10 px de holgura según la ventana: como
     * es HTML por encima del canvas, el puntito siempre le gana el clic a la
     * geometría, así que apuntarle al monitor caía en el puntito y hacían
     * falta dos clics para llegar.
     *
     * Acá va sobre la esquina delantera izquierda, lejos del monitor en los
     * dos ejes. Le quedan entre 14 y 35 px de holgura, medido de 1440x900 a
     * 420x780 y contando la pastilla entera con su nombre, no solo el punto.
     */
    marker: [-1.52, 0.95, -1.62],
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
    /*
     * Debajo del marco, no encima.
     *
     * En el centro del mural le tapaba el diploma del medio: el puntito es
     * HTML por encima del canvas y siempre le gana el clic. Es el mismo
     * problema que tenía el escritorio con el monitor. Acá abajo le quedan
     * entre 17 y 27 px de holgura según la ventana.
     */
    marker: [1.15, 0.94, -2.14],
    // El marco mide 1,45 m; con algo de aire alrededor entra entero en cuadro
    fitWidth: 1.55,
    // Sin panel: los diplomas se leen en el mural mismo, igual que el stack en
    // su tablero. El panel queda detrás de "Ver todas en detalle".
    panel: null,
  },
  {
    id: 'stack',
    label: 'Stack',
    camera: [1.35, 1.6, -1.5],
    target: [2.5, 1.6, -1.5],
    marker: [2.32, 1.6, -1.5],
    fitWidth: 1.05,
    // Sin panel: el stack se lee en el tablero mismo. El panel queda
    // detrás del botón "Ver en detalle".
    panel: null,
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
