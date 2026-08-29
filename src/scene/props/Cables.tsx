import { useMemo } from 'react'
import { CatmullRomCurve3, TubeGeometry, Vector3 } from 'three'

/**
 * Cables del escritorio.
 *
 * Un cuarto real es un desastre de cables y nadie los modela, así que su
 * ausencia se nota sin que uno sepa por qué. Son curvas que cuelgan por
 * gravedad: eso mismo —una línea colgando— es lo que rompe la rigidez de
 * un cuarto hecho de cajas y modelos rectos.
 *
 * Van entre el borde trasero del escritorio y la pared norte (z = -2,2).
 * Ojo con meterlos más atrás: quedan del otro lado de la pared.
 */
const PATHS: [number, number, number][][] = [
  // Del monitor al piso, colgando por detrás del escritorio
  [
    [-0.9, 0.78, -2.1],
    [-0.94, 0.5, -2.16],
    [-0.98, 0.16, -2.14],
    [-1.08, 0.02, -2.05],
    [-1.26, 0.015, -2.0],
  ],
  // Del velador, colgando hasta el piso
  [
    [-1.52, 0.76, -2.08],
    [-1.58, 0.5, -2.16],
    [-1.6, 0.18, -2.14],
    [-1.52, 0.015, -2.02],
  ],
  // Uno suelto sobre el escritorio, enrulado
  [
    [-0.58, 0.775, -1.94],
    [-0.46, 0.782, -2.04],
    [-0.36, 0.775, -1.92],
    [-0.44, 0.782, -1.84],
  ],
]

export function Cables() {
  const geometries = useMemo(
    () =>
      PATHS.map((points) => {
        const curve = new CatmullRomCurve3(points.map((point) => new Vector3(...point)))
        return new TubeGeometry(curve, 24, 0.008, 5, false)
      }),
    [],
  )

  return (
    <group>
      {geometries.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshStandardMaterial color="#1e1c1a" roughness={0.65} />
        </mesh>
      ))}
    </group>
  )
}
