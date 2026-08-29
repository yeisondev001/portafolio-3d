import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/**
 * Pide cuadros cuando nadie más los pide.
 *
 * Con `frameloop="demand"` la escena se dibuja solo cuando algo llama a
 * `invalidate()`. Eso deja dos agujeros:
 *
 * 1. **Los modelos llegan tarde.** El avatar y los muebles se descargan de
 *    forma asíncrona; cuando terminan, ya nadie está pidiendo dibujar y el
 *    cuarto se queda en negro.
 * 2. **La pestaña arranca en segundo plano.** Si el visitante abre el link
 *    en una pestaña que no está mirando, el navegador no ejecuta cuadros;
 *    al volver, la escena sigue sin dibujarse.
 *
 * La solución es barata: unos pocos cuadros repartidos en los primeros
 * segundos, y uno cada vez que la pestaña vuelve a estar visible.
 */

/** Momentos, en milisegundos, en que se pide dibujar tras montar la escena */
const WAKE_AT = [0, 120, 400, 1000, 2500, 5000]

/**
 * Pide un cuadro al montarse.
 *
 * Puesto DENTRO de un `<Suspense>`, se monta justo cuando los modelos de ese
 * límite terminan de cargar. Eso es mejor que adivinar con temporizadores: si
 * la descarga tarda diez segundos, el aviso llega igual.
 */
export function WakeOnLoad() {
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    invalidate()
    // Un par más, por si la geometría comprimida tarda un instante extra en
    // decodificarse después de que React ya montó el componente
    const timers = [60, 250, 700].map((ms) => setTimeout(invalidate, ms))
    return () => timers.forEach(clearTimeout)
  }, [invalidate])

  return null
}

export function Wake() {
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    const timers = WAKE_AT.map((ms) => setTimeout(invalidate, ms))

    const onVisible = () => {
      if (!document.hidden) invalidate()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      timers.forEach(clearTimeout)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [invalidate])

  return null
}
