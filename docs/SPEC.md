# Portafolio 3D — Especificación

> Documento de referencia del proyecto. Define **qué** se construye y **por qué**.
> Las decisiones acá tomadas no se cambian sin actualizar este archivo.

---

## 1. Concepto

Un portafolio personal donde el visitante entra a una recreación 3D del cuarto del autor.
El cuarto mide **5 × 2,7 × 4,4 m**.
Dentro del cuarto hay un avatar del autor, y el contenido real del portafolio
(proyectos, certificaciones, tecnologías, CV, contacto) está distribuido en objetos
del espacio.

**La idea central:** el 3D es el envoltorio y la navegación; el contenido se lee en 2D.
El espacio genera la impresión, la interfaz plana hace el trabajo de comunicar.

---

## 2. Navegación — decisión fundacional

**El visitante NO camina.** No hay WASD, no hay joystick, no hay control libre de cámara.

En su lugar: puntos de interés flotando en la escena. El visitante elige uno,
hace clic (o lo toca en el celular) y **la cámara se desliza suavemente** hasta esa posición.

### Por qué esta decisión

| Motivo | Detalle |
|---|---|
| **Funciona igual en celular** | Tocar un punto = hacer clic en un punto. Sin adaptaciones. |
| **Sin motor de física** | No hay que detectar colisiones ni evitar que atraviese paredes. |
| **Nadie se pierde** | Todo el contenido es alcanzable en un clic desde cualquier lado. |
| **Permite renderizado bajo demanda** | La escena está quieta salvo durante los viajes de cámara. Ver §7. |
| **Menos trabajo** | El tiempo va a que el cuarto se vea bien, no al sistema de movimiento. |

### Qué se descartó y por qué

- **Navegación libre en primera persona (WASD):** imposible de resolver bien en
  celular, exige colisiones, y la gente se pierde y no encuentra el contenido.
- **Cámara orbital libre (OrbitControls):** deja ver el cuarto desde afuera y por
  debajo del piso; rompe la ilusión.

---

## 3. El cuarto

```
                 PARED NORTE — certificaciones
        ┌──── [🏅] ── [🏅] ── [🏅] ── [🏅] ─────────┐
        │                                          │
        │          ┌──────────────┐                │
        │          │  🖥️  📱  📄  │ ●③ escritorio  │ 📋
  📚 ●⑥ │          └───────┬──────┘                │ ●⑤ pizarra
        │              🪑 👤  ●② avatar            │
        │                                          │
        │             ●① entrada                   │
        └───────────────── 🚪 ─────────────────────┘
                   PARED SUR — puerta
```

### Puntos de interés

| # | Punto | Objeto | Qué muestra |
|---|---|---|---|
| 0 | **Carga** | 🚪 Puerta cerrada | Es la pantalla de carga. Al terminar, se abre. |
| ① | **Entrada** | Cartel en la pared | Nombre y rol. Vista general. Ver la secuencia de entrada abajo. |
| ② | **Avatar** | 👤 Avatar en la silla | Panel **Sobre mí**, que incluye disponibilidad. Ver §14. |
| ③ | **Escritorio** | 🖥️ 📱 📄 | Tres objetos clickeables desde una sola posición. Ver abajo. |
| ④ | **Certificaciones** | 🖼️ Pared norte | Diplomas como cuadros. Clic en uno lo agranda. |
| ⑤ | **Stack** | 📋 Pizarra | Tecnologías que domina. |
| ⑥ | **Trayectoria** | 📚 Estantería | Experiencia laboral y educación. |

**El cuarto no tiene ventana.** Decisión del autor. Consecuencias:

- La luz pasa a ser nocturna: velador del escritorio + brillo del monitor (ver §15).
- La disponibilidad pierde su objeto y se fusiona con el panel Sobre mí.
- Quedan **6 puntos de interés**, no 7.

### La secuencia de entrada

La primera impresión del sitio, en orden:

1. La puerta cerrada mientras carga.
2. Se abre. El autor está **de espaldas**, trabajando frente al escritorio.
3. **Gira la silla** y queda mirando a quien entró.
4. Le hace la seña de que se acerque.

Por qué así y no con el avatar ya mirando a la puerta: que esté de espaldas
y se dé vuelta implica que **el visitante lo interrumpió**. Eso convierte al
visitante en alguien que llega a un lugar donde ya pasaban cosas, en vez de
alguien que mira una escena montada para él.

Implementación: silla y avatar giran juntos como un solo grupo
(`src/scene/Workstation.tsx`). Girar el grupo entero no es un atajo — una
silla de escritorio gira de verdad.

### El escritorio — tres objetos, una posición de cámara

Una sola parada, tres cosas para tocar. Es el punto más denso del cuarto a propósito:
concentra lo que más le importa a un reclutador.

| Objeto | Acción |
|---|---|
| 🖥️ **Monitor** | Acercamiento extra hasta llenar la vista → panel de **Proyectos**. |
| 📱 **Celular** | Panel de **Contacto**: mail, LinkedIn, GitHub. |
| 📄 **Carpeta** | Descarga directa del **CV en PDF**. Sin panel. |

### Objetos decorativos

Poster, consola, instrumento, mate, plantas. **No abren paneles ni tienen punto de
interés.** Existen para que el cuarto se sienta habitado y para dar señales de
personalidad sin costar interacción.

---

## 4. La barra fija — el atajo del visitante apurado

Los tres datos que más importan —**nombre, contacto y CV**— son justo los que un
portafolio 3D tiende a esconder dentro de objetos que hay que descubrir.

Por eso van **siempre visibles**, además de estar en el cuarto:

```
┌──────────────────────────────────────────────────────────┐
│  Nombre · Rol                    [CV] [Mail] [in] [gh]   │
└──────────────────────────────────────────────────────────┘
```

Y debajo, los accesos a las zonas: `Proyectos` · `Sobre mí` · `Certificaciones` ·
`Stack` · `Trayectoria`. Hacen exactamente lo mismo que los puntos de la escena.

**Regla:** el que quiere jugar recorre el cuarto; el que tiene 40 segundos ve el
nombre y baja el CV. El portafolio tiene que servir a los dos.

---

## 5. Contenido — cómo se muestra cada cosa

### Proyectos (el monitor)

Los proyectos son sitios web 2D, no piezas 3D.

**No se embeben los sitios reales dentro de la pantalla 3D.** Motivos:
- Muchos sitios bloquean ser mostrados dentro de otro sitio (cabeceras de seguridad).
- Aunque funcione, el texto queda ilegible a ese tamaño.

**Solución:** clic en el monitor → la cámara se acerca hasta llenar la vista →
aparece encima una interfaz 2D a pantalla completa con capturas / video corto,
descripción, stack usado y links (que abren en pestaña nueva).

Sensación buscada: *"entré a la computadora"*.

### CV (la carpeta)

Clic → descarga directa de `/cv.pdf`. Sin panel intermedio, sin formulario.
También accesible desde la barra fija.

Muchos reclutadores necesitan el archivo para cargarlo en su sistema. Si no lo
encuentran en 10 segundos, el portafolio falló aunque les haya gustado.

### Contacto (el celular)

Panel corto: mail (con `mailto:`), LinkedIn, GitHub. Botón de copiar el mail al
portapapeles. Sin formulario de contacto — nadie los usa y hay que mantener un backend.

### Sobre mí (el avatar)

3 o 4 párrafos: qué hace, qué le interesa, qué está buscando.

Incluye la **disponibilidad** (antes en la ventana): ciudad y país, modalidad
—remoto / híbrido / presencial—, idiomas, y si está buscando trabajo activamente.
Filtra las consultas que no corresponden y atrae las que sí.

**La foto real va sí o sí**, junto al avatar. El visitante ya vio al avatar saludarlo;
al ver la foto confirma el parecido y cierra el círculo. Esa confirmación pega más
fuerte que subir el realismo del modelo.

### Certificaciones (la pared norte)

Imágenes sobre planos. Clic → se agranda con emisor, fecha y link de verificación.

### Stack (la pizarra)

Logos de tecnologías sobre un plano. Clic → nivel, años de uso, proyectos donde se aplicó.

### Trayectoria (la estantería)

Cada libro del estante es un trabajo o un estudio. Clic → panel con la línea de
tiempo completa: puesto, empresa o institución, fechas, una línea de descripción.

---

## 6. Stack técnico

| Capa | Elección | Por qué |
|---|---|---|
| Lenguaje | **TypeScript** | Three.js tiene una API enorme; el autocompletado y los errores en tiempo de compilación ahorran horas. |
| Base | **Vite** | Arranque instantáneo, HMR que no reinicia la escena al guardar. |
| UI | **React 19** | Necesario para React Three Fiber. Maneja los paneles 2D. |
| 3D | **Three.js** | Estándar de facto en web. Comunidad y ejemplos abundantes. |
| Puente | **React Three Fiber** | Three.js declarativo. Limpieza automática de memoria, clics sobre objetos, estado compartido con la UI. |
| Helpers | **@react-three/drei** | Cámara, loaders, texto 3D, HDRI. Se importa solo lo que se usa. |
| Estado | **Zustand** | ~1 KB. Guarda el punto activo y el panel abierto. |
| Estilos | **CSS Modules** | Sin dependencias extra ni conceptos nuevos. |
| Deploy | **Vercel** | Estático, gratuito, HTTPS y CDN incluidos. |

**Peso estimado del código: ~250 KB.** El peso real del sitio lo definen los
modelos y las texturas, no las librerías.

### Descartado explícitamente

| Descartado | Motivo |
|---|---|
| **Astro** | Suma una herramienta a aprender. Su beneficio (SEO, cero JS) recién importa al publicar. Migrable después sin rehacer. |
| **Motor de física (Rapier / Cannon)** | Sin navegación libre no hay colisiones que resolver. |
| **Spline** | Runtime >1 MB, poco control, y el objetivo es demostrar capacidad propia. |
| **Postprocesado pesado (bloom, DOF)** | Costo alto en celular. Se evalúa solo para desktop al final. |
| **Babylon.js** | Válido, pero menos ejemplos del estilo buscado y bundle base mayor. |
| **Formulario de contacto** | Exige backend y antispam. Nadie los usa: `mailto:` y links alcanzan. |

---

## 7. Reglas de rendimiento

Estas cuatro pesan más que cualquier elección de librería.

### 7.1 Renderizado bajo demanda — `frameloop="demand"`

La escena está **quieta** salvo durante los viajes de cámara. Se dibuja solo cuando
algo cambia, no 60 veces por segundo de forma permanente.

Efecto en celular: no se calienta, no drena batería, no hay tirones.
**Esta optimización solo es posible gracias a la navegación por puntos.**

Implica: cualquier animación continua debe llamar `invalidate()` explícitamente.

### 7.2 Luz horneada (baked lighting)

La iluminación se calcula **una vez en Blender** y queda pintada dentro de las texturas.
En runtime el navegador solo muestra imágenes: costo cercano a cero.

- Materiales `MeshBasicMaterial` donde el lightmap ya trae la luz.
- **Sin sombras en tiempo real.** Van horneadas.
- El cuarto no cambia de iluminación, así que no se pierde nada.

### 7.3 Compresión de assets

| Tipo | Formato | Herramienta |
|---|---|---|
| Modelos | `.glb` + Draco o Meshopt | `gltfjsx --transform` |
| Texturas | `.ktx2` (Basis) | `gltf-transform` |
| Capturas de proyectos | `.webp` | — |

KTX2 importa especialmente: el celular lo mantiene comprimido **en memoria de video**,
no solo durante la descarga.

### 7.4 Techo de resolución

`dpr={[1, 2]}` en desktop, `[1, 1.5]` en celular. Las pantallas de alta densidad
harían renderizar 4× más píxeles sin diferencia visible.

### Presupuesto

| Métrica | Meta | Máximo tolerable |
|---|---|---|
| Peso total descargado | < 3 MB | 5 MB |
| Tiempo de carga en 4G | < 4 s | 6 s |
| FPS desktop | 60 | 45 |
| FPS celular gama media | 45 | 30 |
| Triángulos totales | < 80.000 | 120.000 |
| Draw calls | < 25 | 40 |
| Texturas | ≤ 2048 px | 2048 px |

Si una etapa rompe el presupuesto, se optimiza **antes** de pasar a la siguiente.

---

## 8. Celular

**Misma experiencia, no una versión reducida.** La navegación es idéntica porque
tocar un punto equivale a hacerle clic.

Lo que cambia automáticamente:

- Techo de resolución más bajo (§7.4).
- Paneles 2D en una columna, botones ≥ 44 px de alto.
- La barra fija colapsa: nombre + CV visibles, el resto en un menú.
- Texturas livianas si se detecta conexión lenta.

**Respaldo:** si el dispositivo no soporta WebGL, se muestra una versión 2D simple
con el mismo contenido. Nadie queda afuera.

---

## 9. Accesibilidad y SEO

Un `<canvas>` es invisible para Google y para los lectores de pantalla. Mitigaciones:

- El contenido real vive en HTML dentro de los paneles 2D, no dibujado en la escena.
- Los puntos de interés son `<button>` reales con `aria-label`, navegables con Tab.
- La barra fija es HTML común: nombre, rol y links son texto indexable.
- `<noscript>` con nombre, rol, links y contacto.
- Metadatos Open Graph con una captura del cuarto.

Si el SEO se vuelve prioritario, se migra a Astro (§6, "descartado").

---

## 10. Estructura de carpetas

```
pf/
├─ public/
│  ├─ cv.pdf           # el CV descargable
│  ├─ models/          # .glb optimizados
│  ├─ textures/        # .ktx2 / .webp
│  └─ img/             # capturas de proyectos, diplomas, logos
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ scene/
│  │  ├─ Scene.tsx         # <Canvas> y configuración global
│  │  ├─ Room.tsx          # geometría del cuarto
│  │  ├─ CameraRig.tsx     # el vuelo entre puntos
│  │  ├─ Hotspot.tsx       # el puntito clickeable
│  │  ├─ Avatar.tsx
│  │  └─ props/            # escritorio, monitor, celular, carpeta,
│  │                       # pizarra, estantería, velador, silla, puerta
│  ├─ ui/
│  │  ├─ TopBar.tsx        # barra fija: nombre, CV, contacto, zonas
│  │  ├─ Loader.tsx        # la puerta / pantalla de carga
│  │  ├─ ProjectsPanel.tsx
│  │  ├─ AboutPanel.tsx
│  │  ├─ ContactPanel.tsx
│  │  ├─ CertsPanel.tsx
│  │  ├─ StackPanel.tsx
│  │  └─ CareerPanel.tsx
│  ├─ store/
│  │  └─ useStore.ts       # Zustand: punto activo, panel abierto
│  ├─ data/
│  │  ├─ profile.ts        # nombre, rol, links, disponibilidad, idiomas
│  │  ├─ hotspots.ts       # ÚNICA fuente de verdad de las posiciones
│  │  ├─ projects.ts
│  │  ├─ certifications.ts
│  │  ├─ stack.ts
│  │  └─ career.ts         # experiencia y educación
│  ├─ hooks/
│  └─ styles/
└─ docs/
   ├─ SPEC.md             # este archivo
   └─ PLAN.md             # fases y tareas
```

**Regla de oro:** el contenido va en `src/data/`, nunca escrito a mano dentro de un
componente. Agregar un proyecto debe ser editar un array, no tocar la escena.

---

## 11. Modelo de datos de un punto de interés

```ts
export type HotspotId =
  | 'entrada'
  | 'avatar'
  | 'escritorio'
  | 'certificaciones'
  | 'stack'
  | 'trayectoria'

export type PanelId =
  | 'proyectos'
  | 'sobre-mi'      // incluye disponibilidad
  | 'contacto'
  | 'certificaciones'
  | 'stack'
  | 'trayectoria'

export type Hotspot = {
  id: HotspotId
  label: string                        // texto visible y aria-label
  camera: [number, number, number]     // dónde se posiciona la cámara
  target: [number, number, number]     // hacia dónde mira
  marker: [number, number, number]     // dónde flota el puntito en la escena
  panel: PanelId | null                // panel que abre al llegar, si abre alguno
  duration?: number                    // segundos del viaje (default 1.6)
}
```

`src/data/hotspots.ts` es la única fuente de verdad. Agregar una zona nueva al cuarto
= agregar un objeto a ese array. Nada más.

El escritorio es el único punto sin panel automático: al llegar, el visitante elige
entre monitor, celular y carpeta.

---

## 12. Contenido que debe aportar el autor

| Qué | Formato | Prioridad | Estado |
|---|---|---|---|
| Nombre y rol (una línea) | texto | 🔴 crítico | pendiente |
| CV | PDF | 🔴 crítico | pendiente |
| Mail, LinkedIn, GitHub | texto | 🔴 crítico | pendiente |
| Proyectos: nombre, descripción, stack, links | texto | 🔴 crítico | pendiente |
| Capturas o video corto de cada proyecto | WEBP / MP4 | 🔴 crítico | pendiente |
| Texto de "Sobre mí" | texto | 🔴 crítico | pendiente |
| Experiencia y educación con fechas | texto | 🟡 importante | pendiente |
| Certificaciones: imagen, emisor, fecha, link | PNG / PDF | 🟡 importante | pendiente |
| Tecnologías del stack + nivel + años | texto | 🟡 importante | pendiente |
| Ubicación, modalidad, idiomas | texto | 🟡 importante | pendiente |
| Foto de frente para generar el avatar | JPG / PNG | 🟢 fase 4 | pendiente |
| Hobbies / intereses (para los objetos decorativos) | texto | 🟢 opcional | pendiente |

El código se construye con datos de mentira hasta que lleguen los reales.

---

## 13. Herramientas externas

| Herramienta | Para qué | Costo |
|---|---|---|
| **Avaturn** | Generar el avatar 3D desde una foto (opción principal, ver §14) | gratis |
| **Ready Player Me** | Alternativa estilizada, si Avaturn no convence | gratis |
| **Mixamo** | Animaciones (saludar, señalar, sentado) | gratis |
| **Blender** | Modelar el cuarto y hornear la luz | gratis |
| **Poly Pizza / Sketchfab** | Muebles prehechos si hace falta | gratis (revisar licencia) |
| **gltf-transform / gltfjsx** | Optimizar y tipar los modelos | gratis |

---

## 14. El avatar

**Es el corazón del proyecto.** La razón de que esto sea 3D y no una web común es que
el autor está adentro, mirando al visitante y llamándolo. Todo lo demás es soporte.

### Requisito: tiene que parecerse de verdad

No alcanza con "un personaje inspirado en él". El objetivo es que quien lo conoce lo
reconozca al instante, y que quien no lo conoce, al ver la foto real en el panel
Sobre mí, confirme el parecido.

### Cómo se logra sin romper el presupuesto

**El parecido viene de la textura, no de la geometría.** La cara es una imagen pegada
sobre la malla. Una cabeza de pocos polígonos con la cara real fotografiada encima se
parece muchísimo y pesa poco.

Los polígonos definen el volumen (nariz, mentón, pómulos); la textura define la
identidad. Por eso parecido y rendimiento **no están en conflicto**.

### Camino de decisión

| Paso | Opción | Costo | Cuándo escalar |
|---|---|---|---|
| 1 | **Avaturn** — usa la foto real como textura facial | gratis | Empezar acá siempre |
| 2 | **Ready Player Me** — más estilizado | gratis | Si se prefiere el look ilustrado |
| 3 | **Escaneo con celular** (RealityScan / Polycam / KIRI) | gratis + horas de Blender | Si 1 y 2 no alcanzan |
| 4 | **Encargarlo** (Fiverr / Upwork), personaje riggeado desde fotos | USD 80–300 | Si hay presupuesto |

**Regla de evaluación:** el avatar se juzga *animado y dentro del cuarto*, nunca quieto
en un visor. Un modelo estático siempre decepciona; el mismo modelo saludando desde la
silla es otra cosa.

### Lo que vende la presencia

En orden de impacto, y todos más importantes que el conteo de polígonos:

1. **La cabeza sigue a la cámara.** El visitante se mueve entre puntos y el avatar lo
   sigue con la mirada. Pocas líneas de código, es lo que hace decir "me está mirando".
2. **Respiración e inactividad sutil.** Un modelo perfectamente quieto se lee como
   estatua. Obligatorio, no opcional.
3. **Saluda en el momento justo** — al entrar, no en loop eterno. Un saludo permanente
   deja de significar algo.
4. **Reacciona al acercarse** — cambia a señalar el monitor.

### Riesgos conocidos

- **El pelo rompe el parecido más que la cara.** Es lo primero que registra la gente,
  y es lo que peor sale en cualquier escaneo. Vale dedicarle atención aparte.
- **Cuanto más realista el modelo, menos perdona la animación.** Un avatar estilizado
  que se mueve raro pasa desapercibido; uno realista que se mueve raro perturba.
  Por eso las animaciones van de Mixamo (capturadas de personas reales), no a mano.
- **Una prenda característica identifica más que los rasgos finos.** Su campera, gorra
  o remera de siempre.

### Requisito técnico innegociable

Exportar `.glb` con esqueleto estándar compatible con Mixamo. Avaturn y Ready Player Me
cumplen; un escaneo crudo no, hay que riggearlo. **Elegir por parecido, no por lo técnico.**

### Qué entrega Avaturn

- `.glb` con cuerpo, cara texturizada con la foto real, pelo y ropa
- Esqueleto humanoide estándar, ya riggeado
- Blendshapes de ARKit y visemas → sirven para parpadeo y micro-expresiones
- Plan Basic gratuito, avatares y exportaciones ilimitados

**Ojo con dos cosas:**

1. **Mixamo no lee `.glb`.** Camino documentado: bajar el FBX de referencia de Avaturn →
   cargarlo en Mixamo → elegir animación → aplicarla al avatar en Blender.
2. **La licencia gratuita es de uso personal / no comercial.** Un portafolio personal
   entra, pero revisar los términos antes de publicar (fase 5). Alternativa con
   condiciones más permisivas: Ready Player Me.

---

### Cómo se anima (Mixamo)

La **T-Pose no es una pose final**, es la posición de reposo del esqueleto. Que el
avatar esté sentado, parado o saludando lo define la **animación**, que es un archivo
aparte: rotaciones de huesos en el tiempo. Cuerpo y movimiento se combinan al final.

Flujo completo:

1. En Avaturn, "Use with Mixamo animations" → bajar el **FBX de referencia**
   (Mixamo no lee `.glb`).
2. Subir ese FBX a Mixamo y elegir las animaciones, previsualizándolas con el avatar.
3. Descargar los clips.
4. En Blender: avatar + clips → un único `.glb`.
5. En el código: reproducir los clips y encadenar las transiciones.

**Tres gotchas conocidos:**

- **Sentado + saludo a la vez es más caro que cada cosa por separado.** Los saludos de
  Mixamo son de pie; los clips sentados no suelen mover los brazos. Combinarlos exige
  mezclar tren superior de un clip con tren inferior de otro. Lo barato: buscar un clip
  sentado que ya traiga gesto de brazos.
- **La silla se acomoda a la animación, no al revés.** Los clips sentados asumen una
  silla imaginaria a cierta altura. Primero se elige el clip, después se mueve la silla.
  Al revés el avatar queda flotando o hundido.
- **El seguimiento de mirada no es una animación.** Se hace por código, rotando el hueso
  del cuello hacia la cámara por encima del clip que esté corriendo. Por eso funciona en
  cualquier pose y no hay que grabarlo.

## 15. Estilo visual

**La decisión de diseño más importante del proyecto**, porque de ella depende que el
avatar pertenezca al cuarto en vez de verse pegado encima.

### El estilo: realismo estilizado

Ni fotorrealismo ni cartoon low poly. El avatar es semi-realista (§14); un cuarto
cartoon lo haría ver recortado de otra imagen.

| Elemento | Regla |
|---|---|
| **Escala** | Real, en metros. Un humano realista exige proporciones correctas: un escritorio mal escalado lo delata al instante. |
| **Geometría** | Simple, silueta clara. El detalle va en la textura, no en los polígonos. |
| **Paleta** | Limitada: 4 o 5 colores base + un acento. Los cuartos reales tienen demasiados colores y eso ensucia. |
| **Luz** | Nocturna. Velador del escritorio + brillo del monitor. Horneada. Ver abajo. |
| **Detalle** | Poco y concentrado. Todo lo que compite visualmente le roba atención al avatar. |

### La luz: cuarto de noche

Sin ventana (§3), la escena es nocturna y la iluminación sale de dos fuentes:

- **El velador** del escritorio — luz cálida, dominante, define el ambiente.
- **El monitor** — luz fría que le pega al avatar en la cara y en el pecho.

Esto no es una limitación, es una ventaja:

1. **La luz apunta al contenido.** El monitor es el punto más brillante de la escena,
   y ahí están los proyectos. La composición dirige la mirada sola.
2. **El contraste favorece al avatar.** Dos fuentes de temperatura distinta sobre la
   cara dan volumen; una luz plana de día lo aplanaría.
3. **Esconde el trabajo.** La oscuridad tapa las zonas sin detalle. Un cuarto de día
   exige que todo esté igual de resuelto; uno de noche, no.

**Regla:** el resto del cuarto queda claramente más oscuro que el escritorio. Las paredes
y los rincones caen en penumbra. Nada compite con el foco.

### Integrar el avatar al cuarto

Lo que hace que algo se vea "pegado" **no es el conteo de polígonos: es la luz.**
Si el avatar recibe la misma luz que la silla donde está sentado, pertenece — aunque
tenga más detalle que todo lo demás.

Tres medidas concretas:

1. **Mismo ambiente de luz** — iluminar el avatar con un mapa tomado del propio cuarto.
2. **Sombra de contacto** — mancha oscura difusa bajo la silla y los pies. Es una
   textura, cuesta cero, y sin eso el personaje parece flotar.
3. **Mismo tratamiento de color** — un ajuste final que pasa por encima de toda la
   escena y la unifica.

### Jerarquía visual

Que el avatar tenga **más detalle que el cuarto está bien** — en cine y videojuegos el
personaje siempre se lleva más presupuesto que el escenario. Lo que no puede pasar es
que estén en **estilos distintos**. Más detalle sí; otro idioma visual no.

Recurso extra: cuarto ligeramente más apagado, avatar en la zona de luz. El ojo va solo
adonde interesa.

### Referencias

| Sitio | Para qué mirarlo |
|---|---|
| [My Room in 3D](https://my-room-in-3d.vercel.app/) ([código](https://github.com/brunosimon/my-room-in-3d)) | **Técnica**: luz horneada, peso, fluidez. Su estilo es más cartoon del que buscamos, y no tiene personaje. |
| [Jesse's Ramen](https://www.jesse-zhou.com/) | **Navegación**: puntos de interés + paneles 2D. El 3D lleva al contenido sin intentar serlo. |
| [Bruno Simon](https://bruno-simon.com/) | Referencia de techo. Navegación libre, carga pesada, sufre en celular: lo que decidimos no hacer. |
