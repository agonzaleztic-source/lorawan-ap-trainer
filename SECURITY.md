# Seguridad

## Qué es esta app, en términos de superficie de ataque

Un sitio estático. No hay servidor, ni base de datos, ni cuentas, ni API. No se
recoge ningún dato personal y no sale una sola petición de red hacia terceros:
la app se sirve entera desde su propio origen y funciona sin conexión.

Lo único que persiste es el progreso de estudio —lecciones leídas, aciertos por
dominio, estado de las tarjetas— en el `localStorage` del navegador de quien
estudia. Nunca se envía a ninguna parte.

## Medidas

| Medida | Dónde |
|---|---|
| CSP con `script-src 'self'`, `object-src 'none'`, `base-uri 'none'` | `vite.config.js`, inyectada en el build |
| Sin recursos de terceros: tipografías autoalojadas | `public/fonts/`, `src/styles.js` |
| `referrer: no-referrer` | `vite.config.js` |
| Service worker limitado al propio origen | `src/sw.js` |
| Saneado de lo que vuelve de `localStorage` | `src/lib/store.js` |
| Acciones de CI fijadas por SHA y token sin permiso de escritura | `.github/workflows/deploy.yml` |
| Auditoría de dependencias y tests en cada push | `.github/workflows/deploy.yml` |
| Actualización automática de dependencias y acciones | `.github/dependabot.yml` |

No se usa `dangerouslySetInnerHTML`, `innerHTML`, `eval` ni `new Function` en
ningún punto del código. Todo el contenido de estudio es literal en
`src/data/`, y React escapa lo que pinta.

## Limitaciones conocidas

Son límites de la plataforma de publicación, no descuidos:

- **`frame-ancestors` no está.** Esa directiva se ignora cuando la CSP viaja en
  una etiqueta `<meta>`; hay que enviarla como cabecera HTTP y GitHub Pages no
  deja configurar cabeceras. Lo mismo aplica a `X-Content-Type-Options` y
  `Permissions-Policy`. La app se puede embeber en un iframe ajeno. Como no
  tiene sesión, ni formularios, ni acciones con efecto, el clickjacking no
  consigue nada aquí, pero conviene saberlo.
- **El origen es compartido.** En `usuario.github.io` todos los proyectos
  publicados por la misma cuenta comparten origen, así que comparten
  `localStorage`. Otro proyecto publicado bajo la misma cuenta podría leer o
  escribir el progreso de estudio. Por eso el estado que vuelve del almacén se
  valida campo a campo en vez de confiar en él. Un dominio propio aislaría esto.
- **`style-src` admite `'unsafe-inline'`.** La hoja de estilos se monta como
  `<style>` desde React. No hay ninguna entrada de usuario que llegue al DOM, así
  que no hay nada que inyectar; el vector que sí importa, la ejecución de
  scripts, está cerrado.

## Reportar un fallo

Abre una incidencia en el repositorio. No hay datos de usuarios que proteger, así
que no hace falta divulgación privada.
