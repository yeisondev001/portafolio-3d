import { create } from 'zustand'
import type { HotspotId, PanelId } from '../data/hotspots'
import { getHotspot } from '../data/hotspots'

type State = {
  /** Punto de interés donde está parada la cámara */
  active: HotspotId
  /** Panel 2D abierto encima de la escena, si hay alguno */
  panel: PanelId | null
  /**
   * Elemento a destacar dentro del panel abierto.
   *
   * Lo llena el clic sobre un logo del tablero o un diploma del mural: el
   * panel trae decenas de fichas y sin esto abrirlo desde un elemento
   * concreto te deja buscándolo a mano.
   */
  panelFocus: string | null
  /**
   * El autor está haciendo la seña de que se acerquen.
   * Lo dispara Workstation al terminar de girar la silla (SPEC §3).
   */
  greeting: boolean
  /**
   * La cámara está viajando entre puntos. Lo usa la interfaz para atenuar
   * la navegación mientras dura el movimiento.
   */
  traveling: boolean
  /** Viajar a un punto. Abre su panel si tiene uno asociado. */
  goTo: (id: HotspotId) => void
  setTraveling: (traveling: boolean) => void
  startGreeting: () => void
  endGreeting: () => void
  openPanel: (panel: PanelId, focus?: string) => void
  closePanel: () => void
}

export const useStore = create<State>((set) => ({
  active: 'entrada',
  panel: null,
  panelFocus: null,
  greeting: false,
  traveling: false,

  goTo: (id) =>
    set((state) => {
      if (state.active === id) return state
      return { active: id, panel: getHotspot(id).panel, panelFocus: null }
    }),

  setTraveling: (traveling) => set({ traveling }),

  startGreeting: () => set({ greeting: true }),
  endGreeting: () => set({ greeting: false }),

  openPanel: (panel, focus) => set({ panel, panelFocus: focus ?? null }),
  /**
   * Cerrar un panel devuelve la cámara al punto del cuarto que le
   * corresponde. Sin esto quedarías con la nariz pegada al monitor y sin
   * panel, sin forma obvia de salir.
   */
  closePanel: () =>
    set((state) =>
      state.active === 'monitor'
        ? { panel: null, panelFocus: null, active: 'escritorio' }
        : { panel: null, panelFocus: null },
    ),
}))
