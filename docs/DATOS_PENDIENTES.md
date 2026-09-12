# Datos pendientes antes de publicar

El sitio ya usa la información profesional pública confirmada. Para completar
los elementos que no deben inferirse ni publicarse sin autorización faltan:

- `email`: correo profesional que Yeison quiera hacer público.
- `cv`: copiar el PDF definitivo a `public/cv.pdf` y establecer `cv: '/cv.pdf'`
  en `src/data/profile.ts`.
- `mode`: modalidad laboral preferida, si desea mostrarla.
- `languages`: idiomas y niveles confirmados.
- `seeking`: establecer `true` solo si desea anunciar búsqueda activa.
- Foto real para el panel «Sobre mí».
- Escaneos de las certificaciones que todavía usan bloques de color.
- Enlaces públicos de demostración para los proyectos que tengan una versión
  visitable sin credenciales ni datos internos.

Mientras estos valores sigan pendientes, la interfaz los oculta en vez de
mostrar información falsa o enlaces rotos.
