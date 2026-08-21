# Plan de trabajo

> Fases ordenadas. **Cada fase termina en algo publicable.**
> El riesgo real de este proyecto no es técnico: es que quede a medias.
> Por eso lo más vistoso (el avatar) va tarde, y el contenido va temprano.

Ver [SPEC.md](./SPEC.md) para las decisiones de diseño y las reglas de rendimiento.

---

## Estado general

| Fase | Nombre | Estado |
|---|---|---|
| 1 | Cuarto navegable | ⬜ pendiente |
| 2 | Lo que un reclutador necesita | ⬜ pendiente |
| 3 | Certificaciones, stack y trayectoria | ⬜ pendiente |
| 4 | Avatar | ⬜ pendiente |
| 5 | Puerta, pulido y publicación | ⬜ pendiente |

---

## Fase 1 — Cuarto navegable

**Objetivo:** que el movimiento de cámara entre puntos se sienta bien.
Si esto no convence, nada de lo demás importa.

Todo con formas primitivas (cajas y planos). **Sin modelos, sin texturas.**

### Base
- [x] Proyecto Vite + React + TypeScript
- [x] Instalar `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`
- [x] `Scene.tsx` con `<Canvas>`, `frameloop="demand"`, `dpr` adaptativo

### El cuarto
- [x] `Room.tsx`: piso, 4 paredes, techo. Cuarto cerrado.
- [x] Iluminación provisional. Ya imita el esquema nocturno de SPEC §15.
- [x] Cajas marcando cada objeto: escritorio, monitor, celular, carpeta, silla,
      velador, pizarra, estantería, pared de diplomas, cartel, puerta
- [x] Segunda pasada de composición: bordes redondeados, sombras de contacto,
      objetos en ángulo, materiales diferenciados
- [x] Cuarto ampliado a 5 × 2,7 × 4,4 m
- [x] Que parezca un cuarto y no una oficina: cama, mesa de luz, campera,
      zapatillas, cables, corcho con post-its, reloj con la hora real
- [x] Secuencia de entrada: el autor está de espaldas y gira la silla (SPEC §3)
- [ ] Objetos personales del autor (instrumento, consola, mascota, ciudad)

### Navegación
- [x] `src/data/hotspots.ts` con los 6 puntos (SPEC §3)
- [x] `Hotspot.tsx`: puntito con pulso + `<button>` accesible.
      Se resolvió con `<Html>` de drei: el pulso lo anima CSS, así no hace falta
      pedir frames continuos y además es un botón real.
- [x] `CameraRig.tsx`: viaje suave entre puntos con desaceleración al llegar
- [x] `invalidate()` durante el viaje, congelar al terminar
- [x] Ocultar el punto en el que ya estás parado
- [x] Estado en Zustand: punto activo, panel abierto

### Barra fija
- [x] `src/data/profile.ts` con nombre, rol y links (datos de mentira)
- [x] `TopBar.tsx`: nombre + rol a la izquierda, `[CV] [Mail] [in] [gh]` a la derecha
- [x] Segunda fila con los accesos a las zonas
- [x] Colapsar en celular: identidad apilada, zonas con scroll horizontal

### Prueba de humo del avatar

El avatar es el corazón del proyecto (SPEC §14), así que se valida temprano aunque el
trabajo fino vaya en la fase 4. Objetivo: confirmar que el efecto funciona, no pulirlo.

- [ ] Generar avatar en **Avaturn** desde una foto
- [ ] Montarlo sentado en la silla, sin pulir
- [ ] Una animación de saludo de Mixamo
      (Mixamo no lee `.glb`: usar el FBX de referencia de Avaturn como intermediario — SPEC §14)
- [ ] **La cabeza sigue a la cámara**
- [ ] Mirarlo animado dentro del cuarto y decidir si el parecido alcanza

Si no alcanza, escalar según el camino de decisión de SPEC §14 **antes** de seguir.

### Verificación
- [ ] Probar en celular real vía red local
- [ ] Navegable con Tab y teclado

**Terminado cuando:** se pueden recorrer las 6 zonas con clic y con la barra, en PC y
en celular, sin tirones y sin marear — y el avatar saluda y sigue con la mirada.

---

## Fase 2 — Lo que un reclutador necesita

**Objetivo:** que el portafolio ya cumpla su función aunque el cuarto siga siendo cajas.
**Publicable al terminar esta fase.**

### Proyectos (el monitor)
- [ ] `src/data/projects.ts` con la estructura definitiva
- [ ] Acercamiento especial del monitor: la pantalla llena la vista
- [ ] `ProjectsPanel.tsx`: grilla de proyectos sobre la vista 3D
- [ ] Detalle: captura, descripción, stack, links (pestaña nueva)
- [ ] Cargar imágenes solo al abrir el panel (lazy)
- [ ] Cargar los proyectos reales

### CV (la carpeta)
- [ ] `public/cv.pdf`
- [ ] Clic en la carpeta → descarga directa, sin panel
- [ ] Mismo botón en la barra fija

### Contacto (el celular)
- [ ] `ContactPanel.tsx`: mail con `mailto:`, LinkedIn, GitHub
- [ ] Botón de copiar el mail al portapapeles, con confirmación visual

### Sobre mí (el avatar)
- [ ] `AboutPanel.tsx` con el texto real
- [ ] Foto real opcional junto al avatar

### Comportamiento común de los paneles
- [ ] Componente base de panel reutilizado por todos
- [ ] Botón de salir que devuelve la cámara al cuarto
- [ ] Cerrar con `Esc` y con el botón de atrás del navegador
- [ ] Responsive: una columna en celular, botones ≥ 44 px
- [ ] Todos los paneles con `React.lazy`

**Terminado cuando:** un desconocido puede, desde el celular y sin ayuda, ver los
proyectos, bajar el CV y encontrar el mail.

---

## Fase 3 — Certificaciones, stack y trayectoria

- [ ] `src/data/certifications.ts`, `stack.ts`, `career.ts`
- [ ] Diplomas como planos con textura sobre la pared norte
- [ ] Clic en un diploma → se agranda con emisor, fecha y link de verificación
- [ ] Pizarra con los logos del stack
- [ ] Clic en una tecnología → nivel, años, proyectos donde se usó
- [ ] Estantería: cada libro un trabajo o estudio
- [ ] `CareerPanel.tsx`: línea de tiempo con puesto, lugar, fechas, una línea
- [ ] Sumar ubicación, modalidad e idiomas al panel Sobre mí
- [ ] Atlas de texturas para los logos (un solo archivo, no 20)
- [ ] Auditar presupuesto: peso, draw calls, FPS en celular

**Terminado cuando:** el cuarto tiene todo el contenido real adentro.

---

## Fase 4 — Avatar

El pulido del corazón del proyecto. La versión cruda ya se validó en la fase 1.
Ver SPEC §14 para los criterios.

### Modelo
- [ ] Avatar definitivo (Avaturn, o el camino al que se haya escalado)
- [ ] Revisar el pelo aparte — es lo que más rompe el parecido
- [ ] Vestirlo con una prenda característica del autor
- [ ] `gltfjsx --types --transform` para optimizar y tipar

### Animación
- [ ] Bajar el FBX de referencia de Avaturn y llevarlo a Mixamo (no lee `.glb`)
- [ ] Animaciones de Mixamo: sentado inactivo, saludar, señalar el monitor
- [ ] Preferir un clip sentado que ya traiga gesto de brazos; mezclar tren superior
      e inferior de dos clips es el plan B, más caro (SPEC §14)
- [ ] Elegido el clip, mover la silla para que calce con él, no al revés
- [ ] Respiración / inactividad sutil — obligatorio, evita el efecto estatua
- [ ] Máquina de estados: inactivo → saluda al entrar → señala al acercarse
- [ ] Transiciones suaves entre animaciones
- [ ] Afinar el seguimiento de cabeza: límite de giro, suavizado, sin quiebres de cuello

### Integración visual (SPEC §15)
- [ ] Iluminar el avatar con un mapa de ambiente tomado del propio cuarto
- [ ] Sombra de contacto bajo la silla y los pies — sin esto parece flotar
- [ ] Verificar que avatar y cuarto compartan el mismo tratamiento de color

### Rendimiento
- [ ] `invalidate()` continuo mientras el avatar se mueve (rompe el `demand`; medir el costo)
- [ ] Evaluar congelar la animación cuando el avatar no está a la vista
- [ ] Verificar presupuesto de triángulos y peso con el avatar dentro

**Terminado cuando:** el avatar saluda al entrar, sigue con la mirada y señala el monitor,
sin bajar de 30 FPS en celular.

---

## Fase 5 — Puerta, pulido y publicación

### El cuarto de verdad
- [ ] Modelar el cuarto en Blender siguiendo el estilo de SPEC §15
      (escala real, geometría simple, paleta limitada)
- [ ] Hornear la luz nocturna: velador cálido dominante + monitor frío sobre el avatar,
      resto del cuarto en penumbra
- [ ] Objetos decorativos: poster, consola, instrumento, plantas
- [ ] Revisar que nada compita visualmente con el avatar
- [ ] **Hornear la iluminación** y pasar los materiales a `MeshBasicMaterial`
- [ ] Comprimir: Draco/Meshopt + texturas KTX2

### La entrada
- [ ] La puerta como pantalla de carga: cerrada mientras carga, se abre al terminar
- [ ] Cartel con nombre y rol visible al entrar
- [ ] Sonido ambiente sutil, con botón de silencio (arranca silenciado)

### Para que nadie quede afuera
- [ ] Versión 2D de respaldo para dispositivos sin WebGL
- [ ] `<noscript>` con nombre, rol, links y contacto
- [ ] Metadatos Open Graph con captura del cuarto

### Cierre
- [ ] Revisar la licencia de Avaturn antes de publicar (SPEC §14)
- [ ] Auditar contra el presupuesto de SPEC.md §7
- [ ] Probar en celular de gama baja y en 4G real
- [ ] Deploy en Vercel + dominio

**Terminado cuando:** cumple el presupuesto de rendimiento y se puede mandar a un
reclutador sin aclaraciones.

---

## Reglas del plan

1. **No se salta de fase.** Cada una termina publicable.
2. **El presupuesto se audita al cerrar cada fase**, no al final. Un problema de
   rendimiento detectado en la fase 5 es carísimo de arreglar.
3. **Cajas antes que modelos.** Primero que funcione, después que sea lindo.
4. **Datos de mentira son válidos** hasta que llegue el contenido real. No bloquear.
5. **Probar en celular real en cada fase**, no solo en el simulador del navegador.
