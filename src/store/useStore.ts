import { create } from 'zustand'
import type { HotspotId, PanelId } from '../data/hotspots'
import { getHotspot } from '../data/hotspots'

type State = {
  /** Punto de interés donde está parada la cámara */
  active: HotspotId
  /** Panel 2D abierto encima de la escena, si hay alguno */
  panel: PanelId | null
  /**
   * El autor está haciendo la seña de que se acerquen.
   * Lo dispara Workstation al terminar de girar la silla (SPEC §3).
   */
  greeting: boolean
  /** Viajar a un punto. Abre su panel si tiene uno asociado. */
  goTo: (id: HotspotId) => void
  startGreeting: () => void
  endGreeting: () => void
  openPanel: (panel: PanelId) => void
  closePanel: () => void
}

export const useStore = create<State>((set) => ({
  active: 'entrada',
  panel: null,
  greeting: false,

  goTo: (id) =>
    set((state) => {
      if (state.active === id) return state
      return { active: id, panel: getHotspot(id).panel }
    }),

  startGreeting: () => set({ greeting: true }),
  endGreeting: () => set({ greeting: false }),

  openPanel: (panel) => set({ panel }),
  /**
   * Cerrar un panel devuelve la cámara al punto del cuarto que le
   * corresponde. Sin esto quedarías con la nariz pegada al monitor y sin
   * panel, sin forma obvia de salir.
   */
  closePanel: () =>
    set((state) =>
      state.active === 'monitor' ? { panel: null, active: 'escritorio' } : { panel: null },
    ),
}))
