/**
 * Muebles provisionales del cuarto. Siguen siendo cajas, pero con bordes
 * redondeados, materiales diferenciados y algo de desorden.
 * Se reemplazan por modelos de Blender en la fase 5.
 *
 * Las posiciones están en metros y deben coincidir con los puntos de
 * `src/data/hotspots.ts`. Si se mueve un mueble, revisar su hotspot.
 *
 * Tres reglas de composición, por lo aprendido en la primera prueba:
 *  1. Nada perfectamente paralelo a las paredes: un par de grados alcanzan.
 *  2. Objetos a distintas alturas, no todos a la altura del escritorio.
 *  3. Huecos. El espacio vacío es lo que hace que un cuarto se sienta amplio.
 */
import { RoundedBox } from '@react-three/drei'

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

type PieceProps = {
  position: [number, number, number]
  size: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  roughness?: number
  metalness?: number
  radius?: number
}

/**
 * Caja con los cantos redondeados. Es el cambio más barato y más notorio:
 * un bisel de pocos milímetros atrapa la luz y el objeto deja de leerse
 * como un cubo de CAD.
 */
function Piece({
  position,
  size,
  rotation,
  color = WOOD,
  roughness = 0.85,
  metalness = 0,
  radius = 0.012,
}: PieceProps) {
  return (
    <RoundedBox
      args={size}
      radius={Math.min(radius, Math.min(...size) / 2.2)}
      smoothness={2}
      position={position}
      rotation={rotation}
    >
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </RoundedBox>
  )
}

/** Marco con lámina adentro: diplomas, pizarra, pósters */
function Framed({
  position,
  size,
  rotation,
  inner = PAPER,
}: {
  position: [number, number, number]
  size: [number, number, number]
  rotation?: [number, number, number]
  inner?: string
}) {
  const [w, h, d] = size
  return (
    <group position={position} rotation={rotation}>
      <Piece position={[0, 0, 0]} size={[w, h, d]} color={FRAME} roughness={0.6} radius={0.008} />
      <Piece
        position={[0, 0, d * 0.7]}
        size={[w * 0.86, h * 0.86, d * 0.4]}
        color={inner}
        roughness={0.95}
        radius={0.004}
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
    <group position={[-0.62, 0, -1.42]}>
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
      {/* Travesaño trasero, para que las patas no queden sueltas */}
      <Piece position={[0, 0.6, -0.24]} size={[1.62, 0.09, 0.03]} color={WOOD_DARK} radius={0.006} />
    </group>
  )
}

/** Silla girada: el ángulo es lo que rompe la cuadrícula */
function Chair() {
  return (
    <group position={[0.62, 0, -0.92]} rotation={[0, 0.22, 0]}>
      <Piece position={[0, 0.45, 0]} size={[0.46, 0.07, 0.46]} color={FABRIC} radius={0.02} />
      <Piece
        position={[0, 0.74, -0.21]}
        size={[0.44, 0.52, 0.06]}
        rotation={[-0.07, 0, 0]}
        color={FABRIC}
        radius={0.02}
      />
      <Piece
        position={[0, 0.22, 0]}
        size={[0.07, 0.46, 0.07]}
        color={METAL}
        roughness={0.4}
        metalness={0.6}
      />
      <Piece
        position={[0, 0.03, 0]}
        size={[0.44, 0.04, 0.44]}
        color={METAL}
        roughness={0.4}
        metalness={0.6}
        radius={0.02}
      />
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
    <group position={[-1.84, 0, 0.3]}>
      <Piece position={[0, 1.0, 0]} size={[0.3, 2.0, 1.0]} color={WOOD_DARK} radius={0.014} />
      {[0.42, 0.86, 1.3, 1.74].map((y) => (
        <Piece key={y} position={[0.02, y, 0]} size={[0.28, 0.026, 0.96]} radius={0.006} />
      ))}
      {/* Libros a distintas alturas, algunos inclinados */}
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
    </group>
  )
}

const CERTS = [
  { x: 0.55, y: 1.62, w: 0.32, h: 0.42 },
  { x: 0.98, y: 1.86, w: 0.36, h: 0.46 },
  { x: 1.42, y: 1.6, w: 0.32, h: 0.42 },
  { x: 0.98, y: 1.28, w: 0.28, h: 0.36 },
]

export function Props() {
  return (
    <group>
      <Desk />
      <Chair />
      <Bookshelf />

      {/* ── Sobre el escritorio ── */}
      {/* Monitor, apenas girado hacia la silla */}
      <group position={[-0.62, 0, -1.5]} rotation={[0, -0.13, 0]}>
        <Piece
          position={[0, 0.79, 0]}
          size={[0.2, 0.02, 0.14]}
          color={METAL}
          roughness={0.4}
          metalness={0.5}
        />
        <Piece
          position={[0, 0.87, 0]}
          size={[0.05, 0.16, 0.05]}
          color={METAL}
          roughness={0.4}
          metalness={0.5}
        />
        <Piece position={[0, 1.08, 0]} size={[0.6, 0.36, 0.022]} color={METAL} roughness={0.5} radius={0.008} />
        <Piece position={[0, 1.08, 0.014]} size={[0.57, 0.33, 0.01]} color={SCREEN} roughness={0.15} radius={0.003} />
      </group>

      {/* Teclado, girado igual que el monitor */}
      <Piece
        position={[-0.62, 0.768, -1.25]}
        rotation={[0, -0.13, 0]}
        size={[0.42, 0.018, 0.14]}
        color={METAL}
        roughness={0.7}
        radius={0.006}
      />

      {/* Velador: la fuente cálida dominante */}
      <group position={[-1.36, 0, -1.5]}>
        <Piece
          position={[0, 0.775, 0]}
          size={[0.16, 0.025, 0.16]}
          color={METAL}
          roughness={0.4}
          metalness={0.5}
          radius={0.01}
        />
        <Piece
          position={[0, 0.9, 0]}
          size={[0.028, 0.25, 0.028]}
          color={METAL}
          roughness={0.4}
          metalness={0.5}
        />
        <Piece position={[0, 1.05, 0]} size={[0.2, 0.15, 0.2]} color={LAMP} roughness={0.9} radius={0.02} />
      </group>

      {/* Celular: el contacto */}
      <Piece
        position={[-0.05, 0.767, -1.32]}
        rotation={[0, 0.5, 0]}
        size={[0.072, 0.011, 0.15]}
        color={METAL}
        roughness={0.25}
        radius={0.008}
      />

      {/* Carpeta: la descarga del CV. Torcida, como quedan las carpetas */}
      <Piece
        position={[-0.15, 0.775, -1.58]}
        rotation={[0, -0.28, 0]}
        size={[0.23, 0.035, 0.31]}
        color={PAPER}
        roughness={0.95}
        radius={0.006}
      />

      {/* Taza: el objeto que dice que acá vive alguien */}
      <group position={[0.02, 0, -1.5]}>
        <Piece position={[0, 0.8, 0]} size={[0.082, 0.095, 0.082]} color={CERAMIC} roughness={0.35} radius={0.03} />
        <Piece position={[0.055, 0.805, 0]} size={[0.022, 0.055, 0.02]} color={CERAMIC} roughness={0.35} radius={0.01} />
      </group>

      {/* Papelera bajo el escritorio */}
      <Piece
        position={[0.18, 0.14, -1.42]}
        size={[0.22, 0.28, 0.22]}
        color={METAL}
        roughness={0.6}
        metalness={0.3}
        radius={0.02}
      />

      {/* ── Certificaciones: escalonadas, no en fila ── */}
      {CERTS.map((cert) => (
        <Framed key={`${cert.x}-${cert.y}`} position={[cert.x, cert.y, -1.72]} size={[cert.w, cert.h, 0.028]} />
      ))}

      {/* Cartel con nombre y rol, arriba del escritorio */}
      <Framed position={[-0.62, 2.05, -1.72]} size={[0.95, 0.2, 0.03]} inner="#d9d2c4" />

      {/* ── Pizarra del stack: pared este ── */}
      <Framed
        position={[1.94, 1.42, 0.1]}
        size={[1.15, 0.82, 0.035]}
        rotation={[0, -Math.PI / 2, 0]}
        inner="#dcd8ce"
      />

      {/* Póster sobre la estantería: pared oeste, apenas torcido */}
      <Framed
        position={[-1.94, 1.62, 1.05]}
        size={[0.62, 0.85, 0.028]}
        rotation={[0, Math.PI / 2, 0.02]}
        inner="#8c6b5a"
      />

      {/* ── Planta en el rincón: otra altura, formas orgánicas ── */}
      <group position={[1.6, 0, 1.15]}>
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
      <mesh position={[-0.15, 0.006, -0.35]} rotation={[-Math.PI / 2, 0, 0.14]}>
        <planeGeometry args={[2.3, 1.7]} />
        <meshStandardMaterial color="#5c4f45" roughness={1} />
      </mesh>

      {/* ── Puerta: pared sur ── */}
      <group position={[0, 0, 1.72]}>
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
