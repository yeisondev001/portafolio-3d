/**
 * Muebles provisionales del cuarto: todo son cajas.
 * "Cajas primero, modelos después" (CLAUDE.md). Se reemplazan por modelos en la fase 5.
 *
 * Las posiciones están en metros y deben coincidir con los puntos de
 * `src/data/hotspots.ts`. Si se mueve un mueble, revisar su hotspot.
 */

const WOOD = '#8a7159'
const DARK = '#3b3a38'
const PAPER = '#d8d2c6'
const SCREEN = '#5c7fa8'
const LAMP = '#e8c07a'

type BoxProps = {
  position: [number, number, number]
  size: [number, number, number]
  color?: string
}

function Box({ position, size, color = WOOD }: BoxProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function Props() {
  return (
    <group>
      {/* ── Escritorio, contra la pared norte ── */}
      <Box position={[0, 0.375, -1.4]} size={[1.8, 0.75, 0.65]} />

      {/* Monitor: los proyectos */}
      <Box position={[-0.2, 0.79, -1.5]} size={[0.06, 0.1, 0.06]} color={DARK} />
      <Box position={[-0.2, 1.03, -1.5]} size={[0.62, 0.38, 0.05]} color={SCREEN} />

      {/* Velador: fuente de luz cálida dominante (SPEC §15) */}
      <Box position={[0.65, 0.87, -1.5]} size={[0.12, 0.24, 0.12]} color={DARK} />
      <Box position={[0.65, 1.04, -1.5]} size={[0.22, 0.14, 0.22]} color={LAMP} />

      {/* Celular: contacto */}
      <Box position={[-0.72, 0.765, -1.2]} size={[0.08, 0.02, 0.15]} color={DARK} />

      {/* Carpeta: descarga del CV */}
      <Box position={[0.25, 0.77, -1.15]} size={[0.24, 0.04, 0.32]} color={PAPER} />

      {/* ── Silla ── */}
      <Box position={[0.72, 0.45, -0.85]} size={[0.5, 0.08, 0.5]} color={DARK} />
      <Box position={[0.72, 0.73, -0.63]} size={[0.5, 0.55, 0.08]} color={DARK} />
      <Box position={[0.72, 0.2, -0.85]} size={[0.1, 0.4, 0.1]} color={DARK} />

      {/* ── Certificaciones: pared norte ── */}
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <Box key={x} position={[x, 1.75, -1.72]} size={[0.5, 0.62, 0.03]} color={PAPER} />
      ))}

      {/* Cartel con nombre y rol, visible al entrar */}
      <Box position={[0, 2.25, -1.72]} size={[1.5, 0.28, 0.03]} color={DARK} />

      {/* ── Pizarra del stack: pared este ── */}
      <Box position={[1.96, 1.5, -0.3]} size={[0.04, 0.9, 1.3]} color={PAPER} />

      {/* ── Estantería de trayectoria: pared oeste ── */}
      <Box position={[-1.85, 0.9, -0.4]} size={[0.3, 1.8, 1.1]} />
      {[0.45, 0.9, 1.35].map((y) => (
        <Box key={y} position={[-1.83, y, -0.4]} size={[0.28, 0.03, 1.06]} color={DARK} />
      ))}

      {/* ── Puerta: pared sur ── */}
      <Box position={[0, 1.05, 1.72]} size={[0.9, 2.1, 0.05]} color={DARK} />
    </group>
  )
}
