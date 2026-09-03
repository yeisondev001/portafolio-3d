/**
 * El cuarto: muebles descargados + los objetos chicos que siguen siendo cajas.
 *
 * DISTRIBUCIÓN B — "barrido horario" (SPEC §3).
 * El contenido está ordenado en el sentido de las agujas del reloj arrancando
 * por el escritorio, así la cámara nunca cruza el cuarto de punta a punta:
 *
 *        NORTE
 *   [escritorio+monitor]        certificaciones
 *   OESTE: cama, estantería     ESTE: pizarra del stack
 *        SUR: puerta
 *
 * Los muebles grandes son modelos de Quaternius (licencia CC0), bajados de
 * poly.pizza y guardados en public/models/muebles/. Vienen en escalas
 * arbitrarias, así que cada uno lleva su factor medido para llegar a metros
 * reales. Todos apoyan la base en Y = 0.
 *
 * Por qué modelos y no cajas: cada mueble era entre 3 y 14 cajas sueltas, y
 * cada caja es un draw call. Un modelo es una sola malla. Ver SPEC §7.
 *
 * Lo que sigue siendo cajas a propósito: el monitor (su pantalla es el plano
 * al que va pegada la interfaz de proyectos, con precisión), los diplomas, la
 * pizarra y los objetos chiquitos del escritorio.
 */
import { useGLTF, RoundedBox } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { HotspotId } from '../../data/hotspots'
import { profile } from '../../data/profile'
import { useStore } from '../../store/useStore'
import { Cables } from './Cables'
import { Clock } from './Clock'
import { MonitorScreen } from './MonitorScreen'
import { StackBoard } from './StackBoard'

const WOOD_DARK = '#5b4630'
const METAL = '#2f2e2c'
const PAPER = '#cfc7b8'
const FRAME = '#3a3430'
const SCREEN = '#4a6f96'
const CERAMIC = '#b8ada0'

// ── Muebles descargados ──────────────────────────────────────────────

type Vec3 = [number, number, number]

function Mueble({
  file,
  position,
  rotation,
  scale,
  onClick,
}: {
  file: string
  position: Vec3
  rotation?: Vec3
  scale: number
  onClick?: () => void
}) {
  const { scene } = useGLTF(`/models/muebles/${file}.glb`)
  const interactive = onClick
    ? {
        onClick,
        onPointerOver: () => {
          document.body.style.cursor = 'pointer'
        },
        onPointerOut: () => {
          document.body.style.cursor = 'auto'
        },
      }
    : {}

  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
      {...interactive}
    />
  )
}

/**
 * Factor para llevar cada modelo a medidas reales, calculado contra su caja
 * contenedora medida. Cambiar un modelo obliga a recalcular su factor.
 */
const FURNITURE: {
  file: string
  position: Vec3
  rotation?: Vec3
  scale: number
  /** Si lleva zona, el mueble es clickeable y viaja hasta ese punto */
  zone?: HotspotId
}[] = [
  // Norte: el escritorio, con el avatar delante
  { file: 'escritorio', position: [-0.9, 0, -1.85], scale: 0.81 },
  { file: 'papelera', position: [-0.05, 0, -1.9], scale: 0.18 },

  // Oeste: la estantería de la trayectoria
  { file: 'estanteria', position: [-2.32, 0, 0.9], rotation: [0, Math.PI / 2, 0], scale: 0.42, zone: 'trayectoria' },

  // Este: la zona de descanso, del lado contrario al escritorio.
  //
  // La cama NO se rota: el modelo ya viene con el largo sobre el eje Z. Con
  // el giro de 90° que tenía antes quedaba cruzada, metiéndose dos metros
  // hacia el centro del cuarto y tapando el paso hacia el escritorio.
  { file: 'cama', position: [2.0, 0, 0.35], scale: 0.505 },
  { file: 'mesa-de-luz', position: [2.2, 0, -0.85], scale: 0.55 },
  { file: 'comoda', position: [2.24, 0, -1.75], rotation: [0, -Math.PI / 2, 0], scale: 0.4 },

  // Sur: la puerta
  { file: 'puerta', position: [0.6, 0, 2.16], scale: 0.5 },

  // Rincón sureste y centro
  { file: 'planta', position: [2.1, 0, 1.7], scale: 2.2 },
  { file: 'alfombra', position: [0.15, 0.004, 0.1], rotation: [0, 0.16, 0], scale: 0.75 },
]

// ── Piezas de caja: lo chico y lo plano ──────────────────────────────

type PieceProps = {
  position: Vec3
  size: Vec3
  rotation?: Vec3
  color?: string
  roughness?: number
  metalness?: number
  radius?: number
  onClick?: (event: ThreeEvent<MouseEvent>) => void
  onPointerOver?: () => void
  onPointerOut?: () => void
}

/**
 * Caja con los cantos redondeados. Un bisel de pocos milímetros atrapa la luz
 * y el objeto deja de leerse como un cubo de CAD.
 */
export function Piece({
  position,
  size,
  rotation,
  color = WOOD_DARK,
  roughness = 0.85,
  metalness = 0,
  radius = 0.012,
  ...events
}: PieceProps) {
  return (
    <RoundedBox
      args={size}
      radius={Math.min(radius, Math.min(...size) / 2.2)}
      smoothness={2}
      position={position}
      rotation={rotation}
      {...events}
    >
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </RoundedBox>
  )
}

/**
 * Aire acondicionado split, del tipo que hay en una casa.
 *
 * Construido y no descargado: los modelos que encontré eran unidades
 * exteriores o de galpón, con aspecto industrial. Un split de pared es una
 * caja blanca redondeada con la rejilla y el deflector abajo — sale más
 * preciso a mano que buscando el modelo correcto, y son cuatro piezas.
 *
 * Mide 90 × 28 × 20 cm, que es el tamaño real de un equipo chico.
 * Modelado mirando hacia +Z; el giro lo pone contra la pared que toque.
 */
function AirConditioner({ position, rotation }: { position: Vec3; rotation?: Vec3 }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Cuerpo */}
      <Piece
        position={[0, 0, 0]}
        size={[0.9, 0.28, 0.2]}
        color="#f4f2ee"
        roughness={0.55}
        radius={0.05}
      />
      {/* Boca de salida, hundida en el frente inferior */}
      <Piece
        position={[0, -0.088, 0.096]}
        size={[0.78, 0.055, 0.02]}
        color="#c8c5c0"
        roughness={0.85}
        radius={0.008}
      />
      {/* Deflector, apenas inclinado como cuando está apagado */}
      <Piece
        position={[0, -0.112, 0.082]}
        rotation={[-0.3, 0, 0]}
        size={[0.78, 0.028, 0.085]}
        color="#eceae5"
        roughness={0.5}
        radius={0.01}
      />
      {/* Lucecita de encendido */}
      <Piece
        position={[0.3, -0.052, 0.101]}
        size={[0.05, 0.012, 0.008]}
        color="#7fd4a0"
        roughness={0.3}
        radius={0.004}
      />
    </group>
  )
}

/** Marco con lámina adentro: diplomas, pizarra, pósters, cartel */
function Framed({
  position,
  size,
  rotation,
  inner = PAPER,
  onClick,
}: {
  position: Vec3
  size: Vec3
  rotation?: Vec3
  inner?: string
  onClick?: () => void
}) {
  const [w, h, d] = size
  const interactive = onClick
    ? {
        onClick,
        onPointerOver: () => {
          document.body.style.cursor = 'pointer'
        },
        onPointerOut: () => {
          document.body.style.cursor = 'auto'
        },
      }
    : {}

  /*
   * La lámina va justo sobre la cara del marco, apenas sobresaliendo.
   *
   * No puede ir hundida: el marco es una caja maciza y la taparía por
   * completo — el primer intento dejó las certificaciones como un rectángulo
   * negro. Tampoco muy adelante, que se lee como dos cajas apiladas.
   * Sobresalir tres milímetros es el punto justo.
   */
  return (
    <group position={position} rotation={rotation}>
      <Piece position={[0, 0, 0]} size={[w, h, d]} color={FRAME} roughness={0.6} radius={0.008} />
      <Piece
        position={[0, 0, d * 0.5]}
        size={[w * 0.88, h * 0.88, d * 0.14]}
        color={inner}
        roughness={0.95}
        radius={0.003}
        {...interactive}
      />
    </group>
  )
}

/**
 * La pantalla del monitor: el objeto más importante del cuarto.
 *
 * De lejos, el clic acerca la cámara. De cerca, los clics los maneja la
 * interfaz que vive dentro de la pantalla (MonitorScreen).
 */
/**
 * El monitor completo: base, columna, marco y pantalla.
 *
 * Todo el conjunto es clickeable, no solo el rectángulo de la pantalla —
 * desde la puerta ese rectángulo mide pocos píxeles y era imposible acertarle.
 * Un solo clic lleva derecho al acercamiento, desde donde sea que estés.
 *
 * Ya estando encima, los clics dejan de moverse: los maneja la interfaz que
 * vive dentro de la pantalla.
 */
function Monitor() {
  const goTo = useStore((s) => s.goTo)
  const active = useStore((s) => s.active)
  const zoomed = active === 'monitor'

  return (
    <group
      onClick={(event) => {
        if (zoomed) return
        event.stopPropagation()
        goTo('monitor')
      }}
      onPointerOver={() => {
        if (!zoomed) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <Piece position={[0, 0.79, 0]} size={[0.2, 0.02, 0.14]} color={METAL} roughness={0.4} metalness={0.5} />
      <Piece position={[0, 0.87, 0]} size={[0.05, 0.16, 0.05]} color={METAL} roughness={0.4} metalness={0.5} />
      <Piece position={[0, 1.08, 0]} size={[0.6, 0.36, 0.022]} color={METAL} roughness={0.5} radius={0.008} />

      {/* Panel oscuro detrás de la interfaz, para que la pantalla se lea
          como pantalla incluso antes de que el HTML aparezca */}
      <Piece
        position={[0, 1.08, 0.014]}
        size={[0.57, 0.33, 0.01]}
        color={SCREEN}
        roughness={0.15}
        radius={0.003}
      />
      <MonitorScreen />
    </group>
  )
}

/**
 * La silla. Sin posición propia: la ubica y la hace girar Workstation.tsx,
 * porque tiene que girar junto con el avatar.
 */
export function Chair() {
  const { scene } = useGLTF('/models/muebles/silla.glb')
  return <primitive object={scene} scale={0.98} />
}

/** Post-its del corcho: en qué está trabajando ahora */
const NOTES = [
  { x: -0.2, y: 0.14, color: '#d9c56a', tilt: 0.08 },
  { x: 0.02, y: 0.17, color: '#8fbf83', tilt: -0.12 },
  { x: 0.22, y: 0.1, color: '#d99b7a', tilt: 0.05 },
  { x: -0.14, y: -0.11, color: '#8fb2c9', tilt: -0.06 },
  { x: 0.14, y: -0.14, color: '#d9c56a', tilt: 0.14 },
]

export function Props() {
  const goTo = useStore((s) => s.goTo)
  const openPanel = useStore((s) => s.openPanel)
  const activeZone = useStore((s) => s.active)

  /** Objetos que abren algo al tocarlos: cursor de mano y clic */
  const clickable = (action: () => void) => ({
    onClick: (event: { stopPropagation: () => void }) => {
      event.stopPropagation()
      action()
    },
    onPointerOver: () => {
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      document.body.style.cursor = 'auto'
    },
  })

  return (
    <group>
      {FURNITURE.map(({ zone, ...item }) => (
        <Mueble key={item.file} {...item} onClick={zone ? () => goTo(zone) : undefined} />
      ))}

      <Cables />
      <Clock position={[2.15, 2.3, -2.16]} />

      {/* Alto sobre la pared oeste, corrido del rincón: pegado a la esquina
          pisaba las dos paredes y se leía flotando */}
      <AirConditioner position={[-2.39, 2.24, -0.75]} rotation={[0, Math.PI / 2, 0]} />

      {/* ── Sobre el escritorio ── */}
      {/* Monitor, apenas girado hacia la silla */}
      <group position={[-0.9, 0, -1.98]} rotation={[0, -0.16, 0]}>
        <Monitor />
      </group>

      {/* Teclado, girado igual que el monitor */}
      <Mueble file="teclado" position={[-0.9, 0.758, -1.72]} rotation={[0, -0.16, 0]} scale={1.56} />

      {/* Velador: la fuente cálida dominante */}
      <Mueble file="velador" position={[-1.52, 0.755, -1.98]} rotation={[0, 0.4, 0]} scale={0.8} />

      {/* Celular: el contacto */}
      <Piece
        position={[-0.32, 0.767, -1.78]}
        rotation={[0, 0.5, 0]}
        size={[0.072, 0.011, 0.15]}
        color={METAL}
        roughness={0.25}
        radius={0.008}
        {...clickable(() => openPanel('contacto'))}
      />

      {/*
        Carpeta: descarga directa del CV, sin panel intermedio (SPEC §5).
        Un ancla creada al vuelo es la forma de disparar una descarga desde
        un objeto 3D, que no puede ser un <a> de verdad.
      */}
      <Piece
        position={[-0.42, 0.775, -2.02]}
        rotation={[0, -0.28, 0]}
        size={[0.23, 0.035, 0.31]}
        color={PAPER}
        roughness={0.95}
        radius={0.006}
        {...clickable(() => {
          const link = document.createElement('a')
          link.href = profile.cv
          link.download = ''
          link.click()
        })}
      />

      {/* Taza: el objeto que dice que acá vive alguien */}
      <group position={[-0.28, 0, -1.95]}>
        <Piece position={[0, 0.8, 0]} size={[0.082, 0.095, 0.082]} color={CERAMIC} roughness={0.35} radius={0.03} />
        <Piece position={[0.055, 0.805, 0]} size={[0.022, 0.055, 0.02]} color={CERAMIC} roughness={0.35} radius={0.01} />
      </group>

      {/*
        ── Pared norte: las certificaciones ──

        Un solo marco grande de 1,45 × 1,02 m, en vez de cuatro marquitos que
        leían como una galería de cajas.

        Es un marco construido y no un modelo descargado a propósito: los
        modelos de cuadros traen su obra pintada en la textura, y acá hace
        falta una superficie LIMPIA donde después van los diplomas escaneados.
        Una pintura decorativa como contenedor de certificaciones no dice nada.

        TODO: cuando lleguen los escaneos, la lámina interior lleva la imagen
        del diploma en vez del color plano.
      */}
      <Framed
        position={[1.15, 1.62, -2.16]}
        size={[1.45, 1.02, 0.06]}
        inner="#e0d8c8"
        onClick={() => goTo('certificaciones')}
      />

      {/* Cartel con nombre y rol, arriba del escritorio */}
      <Framed position={[-0.9, 2.28, -2.17]} size={[1.0, 0.22, 0.03]} inner="#d9d2c4" />

      {/* Corcho con post-its, en el extremo izquierdo de la pared norte.
          El tablero es un modelo; los post-its siguen siendo piezas porque
          salen de un array y se van a editar seguido. */}
      <group position={[-2.05, 1.6, -2.17]}>
        <Mueble file="corcho" position={[0, -0.28, 0]} scale={1.05} />
        {NOTES.map((note) => (
          <Piece
            key={`${note.x}-${note.y}`}
            position={[note.x, note.y, 0.028]}
            rotation={[0, 0, note.tilt]}
            size={[0.13, 0.13, 0.006]}
            color={note.color}
            roughness={1}
            radius={0.003}
          />
        ))}
      </group>

      {/*
        ── Pared este: el tablero del stack ──

        El marco es una pieza y el contenido es HTML pegado a su cara, igual
        que la pantalla del monitor. Los logos se ven desde la puerta; al
        acercarse aparecen también los niveles.
      */}
      <group position={[2.46, 1.6, -1.75]} rotation={[0, -Math.PI / 2, 0]}>
        <Piece
          position={[0, 0, 0]}
          size={[1.15, 0.82, 0.04]}
          color={FRAME}
          roughness={0.6}
          radius={0.008}
          onClick={(event) => {
            if (activeZone === 'stack') return
            event.stopPropagation()
            goTo('stack')
          }}
          onPointerOver={() => {
            if (activeZone !== 'stack') document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto'
          }}
        />
        <StackBoard />
      </group>

      {/*
        Pared oeste: la pintura decorativa.

        Es el modelo que antes hacía de certificaciones. Acá sí corresponde:
        trae su propia obra en la textura y no tiene que contener nada.

        El giro en Z lleva la cara del cuadro —que mira hacia arriba— a mirar
        hacia el este, o sea hacia adentro del cuarto.
      */}
      <Mueble
        file="cuadro"
        position={[-2.46, 1.72, -0.1]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={3.36}
      />

      {/* ── Suelto ── */}
      {/* Zapatillas al pie de la cama, cada una a su aire */}
      <Piece
        position={[1.42, 0.05, 1.6]}
        rotation={[0, 0.6, 0]}
        size={[0.11, 0.1, 0.28]}
        color="#5a5b60"
        roughness={1}
        radius={0.03}
      />
      <Piece
        position={[1.26, 0.05, 1.46]}
        rotation={[0, -0.25, 0.06]}
        size={[0.11, 0.1, 0.28]}
        color="#5a5b60"
        roughness={1}
        radius={0.03}
      />
    </group>
  )
}

/**
 * TODOS los modelos que usa la escena, no solo los de `FURNITURE`.
 *
 * Esta lista tiene que estar completa. Un modelo que se renderiza pero no se
 * precarga no se pide hasta que React llega a él suspendiendo, y mientras
 * tanto bloquea a todos los demás: el velador quedó afuera y retrasó el
 * cuarto entero de 0,8 a 6 segundos.
 */
const MODELS = [
  ...FURNITURE.map((item) => item.file),
  'silla',
  'velador',
  'teclado',
  'cuadro',
  'corcho',
]

for (const file of MODELS) useGLTF.preload(`/models/muebles/${file}.glb`)
