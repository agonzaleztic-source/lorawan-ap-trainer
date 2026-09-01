# LoRaWAN Accredited Professional — Entrenador

Curso y entrenador para el examen de acreditación de la LoRa Alliance. Incluye 24 lecciones
de teoría explicada, 146 preguntas con corrección razonada, 64 tarjetas de repaso, simulacro
cronometrado y calculadoras de radio (tiempo en aire, ciclo de trabajo y presupuesto de enlace).

El temario cubre los ocho dominios del examen en unas tres horas y media de lectura, pensado
para estudiarse en orden: cada bloque se apoya en el anterior.

Funciona en el navegador, se instala como app en el móvil y sigue funcionando sin conexión.

## Requisitos

- Node.js 20 o superior ([nodejs.org](https://nodejs.org))
- Git
- Visual Studio Code

## Arrancar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Los cambios en `src/App.jsx` se recargan solos.

Para ver la versión de producción tal cual quedará publicada:

```bash
npm run build
npm run preview
```

## Publicar en GitHub Pages

1. Crea un repositorio vacío en GitHub, **público** y sin README (lo trae este proyecto).

2. Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Entrenador LoRaWAN Accredited Professional"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

3. En GitHub, ve a **Settings → Pages** y en *Source* elige **GitHub Actions**.

4. Vuelve a la pestaña **Actions**. El workflow `Publicar en GitHub Pages` se ejecuta solo
   con cada push a `main`. Al terminar, la app queda en:

   `https://TU-USUARIO.github.io/TU-REPO/`

No hace falta tocar `vite.config.js`: la ruta base se calcula a partir del nombre del
repositorio durante el despliegue.

## Instalarla en el móvil

Abre la URL de GitHub Pages en el móvil:

- **Android (Chrome)**: menú ⋮ → *Añadir a pantalla de inicio*.
- **iOS (Safari)**: botón compartir → *Añadir a pantalla de inicio*.

Se abre a pantalla completa y, tras la primera visita, el service worker guarda todo en
caché para estudiar en el metro o en zonas sin cobertura.

## Estructura

```
├── index.html                  punto de entrada y metadatos
├── vite.config.js              base automática para GitHub Pages
├── src
│   ├── main.jsx                arranque de React y registro del service worker
│   ├── App.jsx                 componentes de la interfaz
│   ├── styles.js               hoja de estilos completa
│   ├── lib/radio.js            tiempo en aire, sensibilidad y utilidades
│   └── data
│       ├── domains.js          los ocho dominios temáticos
│       ├── lessons.js          las 24 lecciones de teoría
│       ├── questions.js        banco de preguntas de los tests
│       ├── cards.js            tarjetas de repaso
│       └── tables.js           tablas de referencia rápida
├── public
│   ├── manifest.webmanifest    permite instalarla como app
│   ├── sw.js                   caché para uso sin conexión
│   └── icon-*.png / icon.svg   iconos
└── .github/workflows/deploy.yml  publicación automática
```

El contenido de estudio está separado de la interfaz: todo vive en `src/data/`, así que puedes
ampliar el temario sin tocar una sola línea de React.

## Añadir una lección

En `src/data/lessons.js`. El cuerpo se compone de bloques con estos tipos:

```js
{ id: "phy4", dom: "phy", mins: 7, title: "Título de la lección",
  body: [
    { t: "p",       x: "Un párrafo normal." },
    { t: "h",       x: "Un subtítulo" },
    { t: "key",     x: "La idea que hay que retener." },
    { t: "warn",    x: "Una trampa habitual del examen." },
    { t: "list",    x: ["punto", "otro punto"] },
    { t: "num",     x: ["primer paso", "segundo paso"] },
    { t: "formula", x: "Tsym = 2^SF / BW", note: "Aclaración opcional." },
    { t: "table",   head: ["Col A", "Col B"], rows: [["a", "b"]] },
  ],
  checks: [
    { q: "¿Pregunta de comprobación?", opts: ["A", "B", "C", "D"], a: 1,
      exp: "Por qué la respuesta correcta lo es." },
  ] },
```

Las lecciones aparecen agrupadas por dominio y en el orden del array.

## Añadir preguntas al banco de tests

En `src/data/questions.js`. El campo `a` es el índice de la opción correcta empezando en cero:

```js
{ id: 75, dom: "cmd", q: "¿Qué comando ajusta el retardo de RX1?",
  opts: ["RXParamSetupReq", "RXTimingSetupReq", "DlChannelReq", "NewChannelReq"], a: 1,
  exp: "RXTimingSetupReq (0x08) modifica RECEIVE_DELAY1; RECEIVE_DELAY2 se deriva sumando 1 s." },
```

Los `dom` válidos son: `phy`, `arq`, `cls`, `sec`, `mac`, `cmd`, `reg`, `ops`.
Guarda, comprueba en local con `npm run dev`, y publica:

```bash
git add . && git commit -m "Nuevas preguntas de comandos MAC" && git push
```

En dos o tres minutos la versión actualizada está en tu móvil.

## Aviso sobre el contenido

El material se ha elaborado a partir de la documentación pública de la especificación
LoRaWAN. No procede del banco de preguntas oficial ni lo reproduce. La fuente definitiva
para el examen son los documentos de la LoRa Alliance: TS001 (Link Layer), RP002 (Regional
Parameters) y el resto de la Resource Library.
