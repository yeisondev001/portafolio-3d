# Portafolio 3D — Convenciones

Portafolio personal 3D: el visitante recorre una recreación del cuarto del autor
navegando entre puntos de interés fijos.

**Antes de escribir código, leer [docs/SPEC.md](docs/SPEC.md).**
Para saber qué toca hacer, ver [docs/PLAN.md](docs/PLAN.md).

Idioma: **comentarios, commits y documentación en español.**
Código (nombres de variables, funciones, tipos) en inglés.

---

## Stack

TypeScript · Vite · React 19 · Three.js · React Three Fiber · drei · Zustand · CSS Modules

**No agregar dependencias sin justificarlo contra el presupuesto de peso.**
Antes de instalar algo, revisar si drei ya lo resuelve.

Explícitamente fuera del proyecto: motores de física, Astro, Tailwind, Spline,
postprocesado pesado. Los motivos están en SPEC.md §5.

---

## Reglas que no se rompen

### 1. La navegación es por puntos, nunca libre

No se agregan `OrbitControls`, `PointerLockControls`, `FlyControls` ni controles de
teclado. La cámara solo se mueve viajando entre puntos definidos en
`src/data/hotspots.ts`. Esta decisión sostiene el rendimiento y el funcionamiento
en celular; ver SPEC.md §2.

### 2. Renderizado bajo demanda

El `<Canvas>` usa `frameloop="demand"`. La escena está congelada salvo cuando algo
se mueve.

- Toda animación continua debe llamar `invalidate()` en cada frame.
- Al terminar una transición, dejar de llamarlo.
- Nunca poner un `useFrame` que corra siempre "por las dudas".

### 3. Sin sombras ni luces en tiempo real (a partir de fase 5)

La iluminación va horneada en las texturas desde Blender.
No usar `castShadow`, `receiveShadow`, ni luces que se muevan.
Preferir `MeshBasicMaterial` donde el lightmap ya trae la luz.

Durante las fases 1-4 se permiten luces provisionales para poder ver algo.

### 4. El contenido vive en `src/data/`

Nunca escribir a mano un proyecto, certificación o tecnología dentro de un componente.
Agregar contenido = editar un array tipado. Los componentes solo leen y muestran.

### 5. El presupuesto de rendimiento manda

| Métrica | Meta | Máximo |
|---|---|---|
| Peso total | < 3 MB | 5 MB |
| FPS desktop | 60 | 45 |
| FPS celular | 45 | 30 |
| Triángulos | < 80.000 | 120.000 |
| Draw calls | < 25 | 40 |
| Textura | ≤ 2048 px | 2048 px |

Se audita al cerrar cada fase, no al final.

### 6. Un solo idioma visual

El estilo es **realismo estilizado** (SPEC §15): escala real en metros, geometría
simple, paleta limitada, una fuente de luz cálida.

El avatar puede tener más detalle que el cuarto — eso es normal. Lo que no puede pasar
es que estén en estilos distintos. Nada de muebles cartoon junto a un avatar
semi-realista.

Al sumar cualquier objeto: verificar escala real y que no compita visualmente con el
avatar.

### 7. El contenido se lee en 2D, no dentro de la escena

Los textos largos van en paneles HTML sobre el canvas, nunca dibujados como texto 3D
ni embebidos en una pantalla dentro de la escena. Motivos de legibilidad y de
accesibilidad en SPEC.md §4 y §8.

---

## Cómo agregar una zona nueva al cuarto

1. Agregar el objeto a `src/data/hotspots.ts` (posición de cámara, hacia dónde mira,
   dónde flota el puntito).
2. Agregar el `id` al tipo `HotspotId`.
3. Si abre un panel 2D, crearlo en `src/ui/` y registrarlo.

No hay que tocar `CameraRig.tsx` ni `Scene.tsx`. Si hace falta tocarlos, el diseño
se rompió: avisar antes de seguir.

---

## Convenciones de código

- Componentes en `PascalCase.tsx`, un componente por archivo.
- Hooks en `useAlgo.ts`.
- Todo tipado. Nada de `any`; si aparece un tipo difícil de Three.js, dejar comentario.
- Vectores como tuplas `[number, number, number]`, no objetos `Vector3`, salvo dentro
  de `useFrame`.
- Los objetos `Vector3`, geometrías y materiales que se crean en cada frame se
  reutilizan fuera del componente. Nunca crear objetos dentro de `useFrame`.
- Los paneles 2D se cargan con `React.lazy`. No entran en el bundle inicial.

---

## Assets

- Modelos: `.glb` comprimidos, procesados con `npx gltfjsx modelo.glb --types --transform`.
- Texturas: `.ktx2` para lo que va en la escena, `.webp` para las capturas de los paneles.
- Todo en `public/`, referenciado por ruta absoluta (`/models/cuarto.glb`).
- Antes de sumar un modelo nuevo, verificar el presupuesto de triángulos.

---

## Trabajo

- Cajas primero, modelos después. Que funcione antes que se vea bien.
- Datos de mentira son válidos hasta que llegue el contenido real. No frenar por eso.
- Probar en celular real en cada fase, no solo achicando la ventana.
- Al cerrar una fase, marcar las casillas en `docs/PLAN.md`.
