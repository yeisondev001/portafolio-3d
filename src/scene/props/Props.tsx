/**
 * Muebles y objetos del cuarto. Siguen siendo cajas, pero con bordes
 * redondeados, materiales diferenciados y desorden.
 * Se reemplazan por modelos de Blender en la fase 5.
 *
 * Las posiciones están en metros y deben coincidir con los puntos de
 * `src/data/hotspots.ts`. Si se mueve un mueble, revisar su hotspot.
 *
 * Reglas de composición, por lo aprendido en las primeras pruebas:
 *  1. Nada perfectamente paralelo a las paredes: un par de grados alcanzan.
 *  2. Objetos a distintas alturas, no todos a la altura del escritorio.
 *  3. Huecos. El espacio vacío es lo que hace que un cuarto se sienta amplio.
 *  4. Esto es un CUARTO, no una oficina: tiene que haber dónde dormir.
 *  5. Lo específico gana a lo realista. Un cuarto genérico bien modelado no
 *     dice nada; uno imperfecto con las cosas del autor dice todo.
 */
import type { ThreeEvent } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { useStore } from '../../store/useStore'
import { Cables } from './Cables'
import { Clock } from './Clock'

const WOOD = '#7d6247'
const WOOD_DARK = '#5b4630'
const METAL = '#2f2e2c'
const PAPER = '#cfc7b8'
const FRAME = '#3a3430'
const SCREEN = '#4a6f96'
const LAMP = '#e8bd77'
const FABRIC = '#6b5f52'
const PLANT = '#4a6340'
const CERAMIC = '#b8ada0'
const SHEETS = '#9c8f7e'
const BLANKET = '#6a5d6e'
const CORK = '#a8845a'

type PieceProps = {
  position: [number, number, number]
  size: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  roughness?: number
  metalness?: number
  radius?: number
  onClick?: (event: ThreeEvent<MouseEvent>) => void
  onPointerOver?: () => void
  onPointerOut?: () => void
}

/**
 * Caja con los cantos redondeados. Es el cambio más barato y más notorio:
 * un bisel de pocos milímetros atrapa la luz y el objeto deja de leerse
 * como un cubo de CAD.
 */
export function Piece({
  position,
  size,
  rotation,
  color = WOOD,
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
 * La pantalla del monitor. Es el objeto más importante del cuarto: al hacerle
 * clic la cámara se mete adentro y aparece el panel de proyectos por encima
 * (SPEC §5).
 *
 * Es clickeable el objeto mismo, no un puntito flotando al lado — señalar una
 * pantalla con un puntito sería redundante.
 */
function Screen() {
  const goTo = useStore((s) => s.goTo)

  return (
    <Piece
      position={[0, 1.08, 0.014]}
      size={[0.57, 0.33, 0.01]}
      color={SCREEN}
      roughness={0.15}
      radius={0.003}
      onClick={(event) => {
        event.stopPropagation()
        goTo('monitor')
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    />
  )
}

/** Marco con lámina adentro: diplomas, pizarra, pósters, fotos */
function Framed({
  position,
  size,
  rotation,
  inner = PAPER,
  onClick,
}: {
  position: [number, number, number]
  size: [number, number, number]
  rotation?: [number, number, number]
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

/** Escritorio con patas: el hueco de abajo es lo que da sensación de espacio */
function Desk() {
  const legs: [number, number][] = [
    [-0.78, -0.24],
    [0.78, -0.24],
    [-0.78, 0.24],
    [0.78, 0.24],
  ]

  return (
    <group position={[-0.62, 0, -1.87]}>
      <Piece position={[0, 0.735, 0]} size={[1.75, 0.045, 0.62]} radius={0.016} />
      {legs.map(([x, z]) => (
        <Piece
          key={`${x}-${z}`}
          position={[x, 0.36, z]}
          size={[0.055, 0.72, 0.055]}
          color={WOOD_DARK}
          radius={0.008}
        />
      ))}
      <Piece position={[0, 0.6, -0.24]} size={[1.62, 0.09, 0.03]} color={WOOD_DARK} radius={0.006} />
    </group>
  )
}

/** Silla girada, con una campera colgada del respaldo */
export function Chair() {
  // Sin posición propia: la ubica y la hace girar Workstation.tsx
  return (
    <group>
      <Piece position={[0, 0.45, 0]} size={[0.46, 0.07, 0.46]} color={FABRIC} radius={0.02} />
      <Piece
        position={[0, 0.74, -0.21]}
        size={[0.44, 0.52, 0.06]}
        rotation={[-0.07, 0, 0]}
        color={FABRIC}
        radius={0.02}
      />
      <Piece position={[0, 0.22, 0]} size={[0.07, 0.46, 0.07]} color={METAL} roughness={0.4} metalness={0.6} />
      <Piece
        position={[0, 0.03, 0]}
        size={[0.44, 0.04, 0.44]}
        color={METAL}
        roughness={0.4}
        metalness={0.6}
        radius={0.02}
      />

      {/* Campera colgada del respaldo, caída hacia un lado */}
      <group position={[-0.06, 0.72, -0.26]} rotation={[0.1, 0, -0.08]}>
        <Piece position={[0, 0, 0]} size={[0.36, 0.46, 0.07]} color="#4a4a55" roughness={1} radius={0.03} />
        <Piece
          position={[-0.14, -0.2, 0.01]}
          rotation={[0, 0, 0.22]}
          size={[0.1, 0.3, 0.06]}
          color="#43434e"
          roughness={1}
          radius={0.03}
        />
      </group>
    </group>
  )
}

/**
 * La cama. Es lo que convierte una oficina en un cuarto.
 * Deshecha a propósito: una cama tendida se ve a showroom.
 */
function Bed() {
  return (
    <group position={[1.88, 0, 0.55]}>
      {/* Estructura y colchón */}
      <Piece position={[0, 0.16, 0]} size={[1.02, 0.28, 1.98]} color={WOOD_DARK} radius={0.02} />
      <Piece position={[0, 0.37, 0]} size={[0.98, 0.2, 1.94]} color={SHEETS} roughness={1} radius={0.04} />
      {/* Respaldo, contra el norte */}
      <Piece position={[0, 0.62, -1.0]} size={[1.04, 0.72, 0.07]} color={WOOD_DARK} radius={0.02} />

      {/* Manta arrugada, corrida hacia los pies y torcida */}
      <Piece
        position={[0.04, 0.5, 0.34]}
        rotation={[0, 0.07, 0]}
        size={[0.96, 0.1, 1.1]}
        color={BLANKET}
        roughness={1}
        radius={0.05}
      />
      <Piece
        position={[-0.16, 0.55, 0.62]}
        rotation={[0.12, -0.3, 0.05]}
        size={[0.5, 0.09, 0.42]}
        color={BLANKET}
        roughness={1}
        radius={0.05}
      />

      {/* Almohadas, una más caída que la otra */}
      <Piece
        position={[-0.22, 0.53, -0.76]}
        rotation={[0, 0.14, 0.05]}
        size={[0.48, 0.13, 0.32]}
        color="#c6bcab"
        roughness={1}
        radius={0.06}
      />
      <Piece
        position={[0.25, 0.51, -0.72]}
        rotation={[0, -0.22, -0.03]}
        size={[0.46, 0.11, 0.3]}
        color="#bdb2a1"
        roughness={1}
        radius={0.06}
      />
    </group>
  )
}

/** Mesa de luz con una foto y un vaso */
function Nightstand() {
  return (
    <group position={[2.22, 0, -0.72]} rotation={[0, -0.12, 0]}>
      <Piece position={[0, 0.26, 0]} size={[0.42, 0.52, 0.4]} color={WOOD} radius={0.014} />
      <Piece position={[0, 0.36, 0.19]} size={[0.36, 0.14, 0.03]} color={WOOD_DARK} radius={0.006} />

      {/* Foto de tu vida fuera del código: humaniza más que cualquier texto */}
      <Framed position={[-0.09, 0.63, 0.02]} size={[0.17, 0.21, 0.02]} rotation={[0, 0.35, 0]} inner="#7d8b74" />
      {/* Vaso */}
      <Piece position={[0.12, 0.58, 0.06]} size={[0.07, 0.11, 0.07]} color="#aab7bd" roughness={0.15} radius={0.03} />
    </group>
  )
}

const BOOKS = [
  { z: -0.36, y: 0.55, h: 0.24, color: '#7a4438', tilt: 0 },
  { z: -0.28, y: 0.55, h: 0.22, color: '#3f5568', tilt: 0 },
  { z: -0.2, y: 0.54, h: 0.2, color: '#6d6142', tilt: 0.16 },
  { z: 0.16, y: 0.98, h: 0.25, color: '#4a5c46', tilt: 0 },
  { z: 0.24, y: 0.97, h: 0.23, color: '#7a4438', tilt: 0 },
  { z: 0.33, y: 0.96, h: 0.21, color: '#55506b', tilt: -0.19 },
  { z: -0.3, y: 1.42, h: 0.23, color: '#3f5568', tilt: 0 },
  { z: -0.22, y: 1.41, h: 0.21, color: '#6d6142', tilt: 0 },
]

function Bookshelf() {
  return (
    <group position={[-2.34, 0, -0.15]}>
      <Piece position={[0, 1.0, 0]} size={[0.3, 2.0, 1.0]} color={WOOD_DARK} radius={0.014} />
      {[0.42, 0.86, 1.3, 1.74].map((y) => (
        <Piece key={y} position={[0.02, y, 0]} size={[0.28, 0.026, 0.96]} radius={0.006} />
      ))}
      {BOOKS.map((book) => (
        <Piece
          key={`${book.z}-${book.y}`}
          position={[0.02, book.y + book.h / 2 - 0.11, book.z]}
          size={[0.16, book.h, 0.045]}
          rotation={[book.tilt, 0, 0]}
          color={book.color}
          roughness={0.95}
          radius={0.004}
        />
      ))}
      {/* Foto apoyada en un estante */}
      <Framed position={[0.06, 1.46, 0.3]} size={[0.15, 0.19, 0.02]} rotation={[0, 0.2, 0]} inner="#8b7f6d" />
    </group>
  )
}

const CERTS = [
  { x: 0.55, y: 1.62, w: 0.32, h: 0.42 },
  { x: 0.98, y: 1.86, w: 0.36, h: 0.46 },
  { x: 1.42, y: 1.6, w: 0.32, h: 0.42 },
  { x: 0.98, y: 1.28, w: 0.28, h: 0.36 },
]

/** Post-its del corcho: en qué está trabajando ahora */
const NOTES = [
  { x: -0.2, y: 0.14, color: '#d9c56a', tilt: 0.08 },
  { x: 0.02, y: 0.17, color: '#8fbf83', tilt: -0.12 },
  { x: 0.22, y: 0.1, color: '#d99b7a', tilt: 0.05 },
  { x: -0.14, y: -0.11, color: '#8fb2c9', tilt: -0.06 },
  { x: 0.14, y: -0.14, color: '#d9c56a', tilt: 0.14 },
]

/**
 * Corcho con post-its. Es lo que más rápido comunica que estás activo,
 * y se actualiza editando un array.
 */
function Corkboard() {
  return (
    <group position={[-1.62, 1.55, -2.16]}>
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
  )
}

export function Props() {
  const goTo = useStore((s) => s.goTo)

  return (
    <group>
      <Desk />
      <Bookshelf />
      <Bed />
      <Nightstand />
      <Corkboard />
      <Cables />
      <Clock position={[1.9, 2.24, -2.16]} />

      {/* ── Sobre el escritorio ── */}
      <group position={[-0.62, 0, -1.95]} rotation={[0, -0.13, 0]}>
        <Piece position={[0, 0.79, 0]} size={[0.2, 0.02, 0.14]} color={METAL} roughness={0.4} metalness={0.5} />
        <Piece position={[0, 0.87, 0]} size={[0.05, 0.16, 0.05]} color={METAL} roughness={0.4} metalness={0.5} />
        <Piece position={[0, 1.08, 0]} size={[0.6, 0.36, 0.022]} color={METAL} roughness={0.5} radius={0.008} />
        <Screen />
      </group>

      <Piece
        position={[-0.62, 0.768, -1.7]}
        rotation={[0, -0.13, 0]}
        size={[0.42, 0.018, 0.14]}
        color={METAL}
        roughness={0.7}
        radius={0.006}
      />

      {/* Velador: la fuente cálida dominante */}
      <group position={[-1.36, 0, -1.95]}>
        <Piece
          position={[0, 0.775, 0]}
          size={[0.16, 0.025, 0.16]}
          color={METAL}
          roughness={0.4}
          metalness={0.5}
          radius={0.01}
        />
        <Piece position={[0, 0.9, 0]} size={[0.028, 0.25, 0.028]} color={METAL} roughness={0.4} metalness={0.5} />
        <Piece position={[0, 1.05, 0]} size={[0.2, 0.15, 0.2]} color={LAMP} roughness={0.9} radius={0.02} />
      </group>

      {/* Celular: el contacto */}
      <Piece
        position={[-0.05, 0.767, -1.77]}
        rotation={[0, 0.5, 0]}
        size={[0.072, 0.011, 0.15]}
        color={METAL}
        roughness={0.25}
        radius={0.008}
      />

      {/* Carpeta: la descarga del CV. Torcida, como quedan las carpetas */}
      <Piece
        position={[-0.15, 0.775, -2.03]}
        rotation={[0, -0.28, 0]}
        size={[0.23, 0.035, 0.31]}
        color={PAPER}
        roughness={0.95}
        radius={0.006}
      />

      {/* Taza */}
      <group position={[0.02, 0, -1.95]}>
        <Piece position={[0, 0.8, 0]} size={[0.082, 0.095, 0.082]} color={CERAMIC} roughness={0.35} radius={0.03} />
        <Piece position={[0.055, 0.805, 0]} size={[0.022, 0.055, 0.02]} color={CERAMIC} roughness={0.35} radius={0.01} />
      </group>

      {/* Papelera bajo el escritorio */}
      <Piece
        position={[0.18, 0.14, -1.87]}
        size={[0.22, 0.28, 0.22]}
        color={METAL}
        roughness={0.6}
        metalness={0.3}
        radius={0.02}
      />

      {/* Zapatillas tiradas al pie de la cama, cada una a su aire */}
      <Piece
        position={[1.15, 0.05, 1.72]}
        rotation={[0, 0.6, 0]}
        size={[0.11, 0.1, 0.28]}
        color="#5a5b60"
        roughness={1}
        radius={0.03}
      />
      <Piece
        position={[0.98, 0.05, 1.58]}
        rotation={[0, -0.25, 0.06]}
        size={[0.11, 0.1, 0.28]}
        color="#5a5b60"
        roughness={1}
        radius={0.03}
      />

      {/* ── Certificaciones: escalonadas, no en fila ── */}
      {CERTS.map((cert) => (
        <Framed key={`${cert.x}-${cert.y}`} position={[cert.x, cert.y, -2.17]} size={[cert.w, cert.h, 0.028]} />
      ))}

      {/* Cartel con nombre y rol, arriba del escritorio */}
      <Framed position={[-0.62, 2.22, -2.17]} size={[0.95, 0.2, 0.03]} inner="#d9d2c4" />

      {/* ── Pizarra del stack: pared este, arriba de la cama ── */}
      <Framed
        position={[2.44, 1.68, -0.3]}
        size={[1.0, 0.72, 0.035]}
        rotation={[0, -Math.PI / 2, 0]}
        inner="#dcd8ce"
        onClick={() => goTo('stack')}
      />

      {/* Póster sobre la estantería: pared oeste, apenas torcido */}
      <Framed
        position={[-2.44, 1.72, 1.1]}
        size={[0.62, 0.85, 0.028]}
        rotation={[0, Math.PI / 2, 0.02]}
        inner="#8c6b5a"
      />

      {/* ── Planta en el rincón sur ── */}
      <group position={[-2.1, 0, 1.85]}>
        <Piece position={[0, 0.16, 0]} size={[0.26, 0.32, 0.26]} color={CERAMIC} roughness={0.8} radius={0.03} />
        <Piece position={[0, 0.55, 0]} size={[0.05, 0.5, 0.05]} color="#4a5a3c" radius={0.02} />
        <Piece
          position={[-0.13, 0.78, 0.04]}
          rotation={[0.3, 0.5, 0.4]}
          size={[0.3, 0.02, 0.14]}
          color={PLANT}
          radius={0.01}
        />
        <Piece
          position={[0.14, 0.86, -0.05]}
          rotation={[-0.25, -0.4, -0.35]}
          size={[0.28, 0.02, 0.13]}
          color={PLANT}
          radius={0.01}
        />
        <Piece
          position={[0.02, 0.95, 0.12]}
          rotation={[0.4, 0.1, 0.15]}
          size={[0.24, 0.02, 0.12]}
          color="#3f5637"
          radius={0.01}
        />
      </group>

      {/* ── Alfombra girada: lo que más rompe la cuadrícula del piso ── */}
      <mesh position={[-0.5, 0.006, -0.35]} rotation={[-Math.PI / 2, 0, 0.14]}>
        <planeGeometry args={[2.5, 2.0]} />
        <meshStandardMaterial color="#5c4f45" roughness={1} />
      </mesh>

      {/* ── Puerta: pared sur ── */}
      <group position={[-0.85, 0, 2.17]}>
        <Piece position={[0, 1.03, 0]} size={[0.92, 2.06, 0.05]} color={WOOD_DARK} radius={0.01} />
        <Piece position={[0, 1.03, -0.02]} size={[0.84, 1.98, 0.03]} color="#6a563e" radius={0.008} />
        <Piece
          position={[0.36, 1.0, -0.05]}
          size={[0.05, 0.05, 0.11]}
          color={METAL}
          roughness={0.3}
          metalness={0.7}
          radius={0.02}
        />
      </group>
    </group>
  )
}
