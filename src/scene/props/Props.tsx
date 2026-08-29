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
import { useStore } from '../../store/useStore'
import { Cables } from './Cables'
import { Clock } from './Clock'
import { MonitorScreen } from './MonitorScreen'

const WOOD_DARK = '#5b4630'
const METAL = '#2f2e2c'
const PAPER = '#cfc7b8'
const FRAME = '#3a3430'
const SCREEN = '#4a6f96'
const CERAMIC = '#b8ada0'
const CORK = '#a8845a'

// ── Muebles descargados ──────────────────────────────────────────────

type Vec3 = [number, number, number]

function Mueble({
  file,
  position,
  rotation,
  scale,
}: {
  file: string
  position: Vec3
  rotation?: Vec3
  scale: number
}) {
  const { scene } = useGLTF(`/models/muebles/${file}.glb`)
  return <primitive object={scene} position={position} rotation={rotation} scale={scale} />
}

/**
 * Factor para llevar cada modelo a medidas reales, calculado contra su caja
 * contenedora medida. Cambiar un modelo obliga a recalcular su factor.
 */
const FURNITURE: { file: string; position: Vec3; rotation?: Vec3; scale: number }[] = [
  // Norte: el escritorio, con el avatar delante
  { file: 'escritorio', position: [-0.9, 0, -1.85], scale: 0.81 },
  { file: 'papelera', position: [-0.05, 0, -1.9], scale: 0.18 },

  // Oeste: la estantería de la trayectoria
  { file: 'estanteria', position: [-2.32, 0, 0.9], rotation: [0, Math.PI / 2, 0], scale: 0.42 },

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

  return (
    <group position={position} rotation={rotation}>
      <Piece position={[0, 0, 0]} size={[w, h, d]} color={FRAME} roughness={0.6} radius={0.008} />
      <Piece
        position={[0, 0, d * 0.7]}
        size={[w * 0.86, h * 0.86, d * 0.4]}
        color={inner}
        roughness={0.95}
        radius={0.004}
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

/** Certificaciones: escalonadas, no en fila */
const CERTS = [
  { x: 0.62, y: 1.62, w: 0.34, h: 0.44 },
  { x: 1.12, y: 1.9, w: 0.38, h: 0.48 },
  { x: 1.64, y: 1.6, w: 0.34, h: 0.44 },
  { x: 1.12, y: 1.24, w: 0.3, h: 0.38 },
]

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

  return (
    <group>
      {FURNITURE.map((item) => (
        <Mueble key={item.file} {...item} />
      ))}

      <Cables />
      <Clock position={[2.15, 2.3, -2.16]} />

      {/* ── Sobre el escritorio ── */}
      {/* Monitor, apenas girado hacia la silla */}
      <group position={[-0.9, 0, -1.98]} rotation={[0, -0.16, 0]}>
        <Monitor />
      </group>

      {/* Teclado, girado igual que el monitor */}
      <Piece
        position={[-0.9, 0.768, -1.72]}
        rotation={[0, -0.16, 0]}
        size={[0.42, 0.018, 0.14]}
        color={METAL}
        roughness={0.7}
        radius={0.006}
      />

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
      />

      {/* Carpeta: la descarga del CV. Torcida, como quedan las carpetas */}
      <Piece
        position={[-0.42, 0.775, -2.02]}
        rotation={[0, -0.28, 0]}
        size={[0.23, 0.035, 0.31]}
        color={PAPER}
        roughness={0.95}
        radius={0.006}
      />

      {/* Taza: el objeto que dice que acá vive alguien */}
      <group position={[-0.28, 0, -1.95]}>
        <Piece position={[0, 0.8, 0]} size={[0.082, 0.095, 0.082]} color={CERAMIC} roughness={0.35} radius={0.03} />
        <Piece position={[0.055, 0.805, 0]} size={[0.022, 0.055, 0.02]} color={CERAMIC} roughness={0.35} radius={0.01} />
      </group>

      {/* ── Pared norte ── */}
      {CERTS.map((cert) => (
        <Framed
          key={`${cert.x}-${cert.y}`}
          position={[cert.x, cert.y, -2.17]}
          size={[cert.w, cert.h, 0.028]}
          onClick={() => goTo('certificaciones')}
        />
      ))}

      {/* Cartel con nombre y rol, arriba del escritorio */}
      <Framed position={[-0.9, 2.28, -2.17]} size={[1.0, 0.22, 0.03]} inner="#d9d2c4" />

      {/* Corcho con post-its, en el extremo izquierdo de la pared norte */}
      <group position={[-2.05, 1.6, -2.16]}>
        <Piece position={[0, 0, 0]} size={[0.72, 0.56, 0.03]} color={FRAME} radius={0.008} />
        <Piece position={[0, 0, 0.014]} size={[0.66, 0.5, 0.02]} color={CORK} roughness={1} radius={0.004} />
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

      {/* ── Pared este: la pizarra del stack ── */}
      <Framed
        position={[2.46, 1.6, -1.75]}
        size={[1.15, 0.82, 0.035]}
        rotation={[0, -Math.PI / 2, 0]}
        inner="#dcd8ce"
        onClick={() => goTo('stack')}
      />

      {/* Póster sobre la estantería, apenas torcido */}
      <Framed
        position={[-2.46, 1.75, -0.15]}
        size={[0.62, 0.85, 0.028]}
        rotation={[0, Math.PI / 2, 0.02]}
        inner="#8c6b5a"
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

// Se precargan para que no aparezcan de a uno mientras el visitante entra
for (const item of FURNITURE) useGLTF.preload(`/models/muebles/${item.file}.glb`)
useGLTF.preload('/models/muebles/silla.glb')
