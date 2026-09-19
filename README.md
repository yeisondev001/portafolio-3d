<div align="center">

# Portafolio 3D

**Un portafolio donde entrás a mi cuarto.**

Recreación 3D en tiempo real de mi espacio de trabajo. El visitante viaja entre
puntos de interés fijos y el contenido —proyectos, certificaciones, stack, CV—
se lee en paneles 2D sobre la escena.

<!-- TODO: reemplazar por una captura real del cuarto (guardar en docs/assets/) -->
<!-- <img src="docs/assets/screenshot.png" alt="Vista del cuarto" width="720"> -->

<!-- TODO: descomentar cuando el deploy esté listo -->
<!-- [![Live](https://img.shields.io/badge/demo-vercel-000?style=for-the-badge&logo=vercel)](https://portafolio-3d.vercel.app) -->

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React 19](https://img.shields.io/badge/React%2019-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org)
[![React Three Fiber](https://img.shields.io/badge/R3F-8D4A41?style=flat-square)](https://docs.pmnd.rs)
[![Zustand](https://img.shields.io/badge/Zustand-F97316?style=flat-square)](https://github.com/pmndrs/zustand)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## Por qué

La mayoría de los portafolios son una lista de tarjetas que nadie mira hasta el final.
Este empieza por otra parte: **una impresión**. El visitante entra a un cuarto nocturno,
el avatar está de espaldas trabajando, se interrumpe, gira la silla y saluda.
A partir de ahí, el 3D es solo el envoltorio: el contenido se lee en 2D, accesible
también desde una barra fija para quien tiene 40 segundos.

## Cómo funciona

La decisión fundacional: **el visitante no camina**. No hay WASD ni cámara libre.
Hay puntos de interés flotando en la escena; al elegir uno, la cámara se desliza
suavemente hasta esa posición. Esta decisión habilita todo lo demás:

- **Funciona idéntico en celular** — tocar un punto equivale a hacer clic.
- **Renderizado bajo demanda** — `frameloop="demand"`: la escena se dibuja solo
  cuando algo cambia. No se calienta ni drena batería.
- **Sin motor de física** — no hay colisiones que resolver.
- **Luz horneada** — la iluminación se calcula una vez en Blender y queda pintada
  en las texturas. Cero costo en runtime, sin sombras en tiempo real.

### Presupuesto de rendimiento

| Métrica | Meta | Máximo |
|---|---|---|
| Peso total | < 3 MB | 5 MB |
| Carga en 4G | < 4 s | 6 s |
| FPS desktop | 60 | 45 |
| FPS celular | 45 | 30 |
| Triángulos | < 80.000 | 120.000 |
| Draw calls | < 25 | 40 |

Se audita al cerrar cada fase, no al final.

## Stack

| Capa | Elección |
|---|---|
| Lenguaje | TypeScript |
| Base | Vite |
| UI | React 19 + CSS Modules |
| 3D | Three.js + React Three Fiber + drei |
| Estado | Zustand (~1 KB) |
| Assets | `.glb` con Draco · `.ktx2` · `.webp` |
| Deploy | Vercel |

El peso real del sitio lo definen los modelos y las texturas, no las librerías:
el código ronda los **250 KB**.

## El contenido se agrega editando datos, no código

Todo vive en `src/data/` como arrays tipados. Agregar un proyecto, una
certificación o una zona nueva del cuarto es editar un objeto — nunca se toca
la escena a mano:

```ts
// src/data/hotspots.ts — única fuente de verdad de la navegación
{
  id: 'escritorio',
  label: 'Escritorio',
  camera: [number, number, number],   // dónde se posiciona la cámara
  target: [number, number, number],   // hacia dónde mira
  marker: [number, number, number],   // dónde flota el puntito
  panel: 'proyectos',                 // panel que abre al llegar
}
```

## Estructura

```
src/
├─ scene/        # <Canvas>, cuarto, rig de cámara, avatar, props
├─ ui/           # paneles 2D (cargan con React.lazy) + barra fija
├─ data/         # TODO el contenido: proyectos, stack, hotspots, perfil
├─ store/        # Zustand: punto activo, panel abierto
└─ styles/
scripts/         # compresión de texturas y conversión de animaciones
docs/            # SPEC.md (por qué) · PLAN.md (fases)
```

## Correrlo en local

```bash
npm install
npm run dev      # desarrollo
npm run build    # producción (tsc + vite build)
npm run preview  # previsualizar el build
```

Requiere Node 18+ y un navegador con WebGL 2.

## Diseño y decisiones

Toda la especificación —el concepto, la navegación, el estilo visual, el avatar,
las reglas de rendimiento y lo que se descartó con motivos— está documentada:

- [docs/SPEC.md](docs/SPEC.md) — qué se construye y por qué
- [docs/PLAN.md](docs/PLAN.md) — fases de trabajo y estado

## Créditos

- Muebles de [Quaternius](https://quaternius.com) via [Poly Pizza](https://poly.pizza) — licencia CC0
- Animaciones del avatar de [Mixamo](https://www.mixamo.com)
- Referencias técnicas: [My Room in 3D](https://github.com/brunosimon/my-room-in-3d) · [Jesse Zhou](https://www.jesse-zhou.com)

## Licencia

El código y el diseño: reservados. Los assets de terceros mantienen sus
licencias originales (ver créditos).

---

<div align="center">

<!-- TODO: completar con los links reales cuando se definan (src/data/profile.ts) -->
**[Portafolio](https://portafolio-3d.vercel.app)** · [LinkedIn](https://linkedin.com/in/usuario) · [GitHub](https://github.com/yeisondev001) · [Descargar CV](cv.pdf)

</div>
