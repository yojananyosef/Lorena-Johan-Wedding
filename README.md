# 🎮 Juego de Invitación de Boda

## ¿De qué trata?

Este es un **juego side‑scroller** interactivo que sirve como invitación digital para la boda de **Lorena & Johan**.  El jugador controla al personaje seleccionado (Lorena o Johan) y debe recolectar bayas y anillos mientras avanza por un paisaje inspirado en la boda.  Al alcanzar la puntuación objetivo, los personajes se reúnen en una escena final romántica.

El proyecto está construido con **React** y **Vite**, utilizando canvas‑2D para la lógica del juego y una serie de assets (sprites, fondos, música, etc.) incluidos en la carpeta `src/assets`.

## Tecnologías usadas
- React 19
- Vite 8
- JavaScript (ESM)
- HTML / CSS (moderno, con animaciones y efectos visuales)
- **Bun** (runtime/paquete manager opcional para iniciar y desarrollar rápidamente)

## Requisitos previos
- **Bun** instalado (versión ≥ 1.0).  Si no lo tienes, puedes instalarlo con:
```bash
curl https://bun.sh/install | bash
```
- Node.js **no** es necesario para ejecutar con Bun, aunque sigue estando en `package.json` por compatibilidad.

## Instalación
1. Clona o abre el proyecto en tu máquina.
2. En la raíz del proyecto, ejecuta:
```bash
bun install
```
   Esto instalará todas las dependencias declaradas en `package.json` usando el gestor de paquetes de Bun.

## Desarrollo
- Para iniciar el servidor de desarrollo con recarga en caliente:
```bash
bun run dev
```
  Se abrirá la aplicación en `http://localhost:5173` (puedes cambiar el puerto en `vite.config.js` si lo deseas).

- Otras tareas útiles definidas en `package.json`:
  - `bun run build` – Genera una versión de producción en la carpeta `dist/`.
  - `bun run preview` – Sirve la build de producción localmente.
  - `bun run lint` – Ejecuta ESLint sobre el código fuente.

## Estructura del proyecto
```
├─ public/               # Archivos estáticos (index.html, favicons…)
├─ src/
│   ├─ assets/          # Imágenes, sprites, música
│   ├─ components/      # Pantallas: IntroScreen, SelectScreen, GameScreen, EndScreen
│   ├─ App.jsx          # Punto de entrada React
│   └─ main.jsx         # Monta la aplicación en el DOM
├─ index.html            # Plantilla HTML
├─ vite.config.js        # Configuración de Vite
└─ package.json          # Dependencias y scripts
```

## Ejecutar la versión de producción
```bash
bun run build   # Compila la app
bun run preview # La sirve en http://localhost:4173
```

## Comentario final
Este juego está pensado para ser **visualmente atractivo** y **fácil de compartir**.  Puedes personalizar los assets (imágenes y música) para que coincidan con el estilo de tu boda, o añadir más niveles y desafíos.

---
*¡Disfruta creando y jugando! 🎉*
