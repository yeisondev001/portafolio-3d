import { create } from 'zustand'
import type { HotspotId, PanelId } from '../data/hotspots'
import { getHotspot } from '../data/hotspots'

type State = {
  /** Punto de interés donde está parada la cámara */
  active: HotspotId
  /** Panel 2D abierto encima de la escena, si hay alguno */
  panel: PanelId | null
  /** Viajar a un punto. Abre su panel si tiene uno asociado. */
  goTo: (id: HotspotId) => void
  openPanel: (panel: PanelId) => void
  closePanel: () => void
}

export const useStore = create<State>((set) => ({
  active: 'entrada',
  panel: null,

  goTo: (id) =>
    set((state) => {
      if (state.active === id) return state
      return { active: id, panel: getHotspot(id).panel }
    }),

  openPanel: (panel) => set({ panel }),
  closePanel: () => set({ panel: null }),
}))
