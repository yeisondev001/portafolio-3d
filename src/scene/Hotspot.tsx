import { Html } from '@react-three/drei'
import type { Hotspot as HotspotData } from '../data/hotspots'
import { useStore } from '../store/useStore'
import styles from './Hotspot.module.css'

export function Hotspot({ data }: { data: HotspotData }) {
  const active = useStore((s) => s.active)
  const goTo = useStore((s) => s.goTo)

  // El punto donde ya estás parado no se muestra
  if (active === data.id) return null

  return (
    <Html position={data.marker} center zIndexRange={[20, 0]}>
      <button
        type="button"
        className={styles.dot}
        onClick={() => goTo(data.id)}
        aria-label={`Ir a ${data.label}`}
      >
        <span className={styles.label}>{data.label}</span>
      </button>
    </Html>
  )
}
