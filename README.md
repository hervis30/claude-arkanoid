# Arkanoid

Juego de Arkanoid/Breakout jugable de principio a fin, construido con HTML5 Canvas y JavaScript vanilla, sin dependencias ni build system.

## Cómo jugar

Abrí `index.html` en el navegador (no requiere servidor ni instalación).

- **Mover la pala:** flechas izquierda/derecha o `A`/`D`.
- **Empezar / reiniciar:** pulsar cualquier tecla en la pantalla de inicio, game over o victoria.
- **Objetivo:** romper los 48 bloques del nivel sin dejar caer la bola.

## Funcionalidades implementadas

- Canvas fijo de 480x600px centrado en la página, con fondo negro; el fondo de la página es gris oscuro.
- Un nivel fijo con grid de bloques de 8 columnas x 6 filas, usando los 7 colores del spritesheet.
- Física de rebote en paredes y pala, con ángulo de rebote variable según el punto de impacto en la pala.
- Bloques de un solo golpe: al romperse disparan una animación de explosión (sprite por color) y suman puntos según su color:

  | Color   | Puntos |
  | ------- | ------ |
  | gray    | 10     |
  | cyan    | 20     |
  | green   | 30     |
  | yellow  | 40     |
  | magenta | 50     |
  | hotpink | 60     |
  | red     | 70     |

- Sistema de 3 vidas, representadas con sprites de la bola (en vez de un número) en la esquina superior izquierda; al caer la bola se pierde una vida y se reinicia sobre la pala.
- Puntuación en memoria, mostrada como texto en la esquina superior derecha (sin persistencia entre sesiones).
- Efectos de sonido: `ball-bounce.mp3` al rebotar en pared/pala, `break-sound.mp3` al romper un bloque.
- Estados de juego: Start → Playing → (Game Over | Victoria) → Start, con reinicio completo del estado al pulsar una tecla.

## Estructura del proyecto

```
index.html              # Canvas y carga de scripts
game.js                 # Lógica del juego (estado, física, colisiones, render)
assets/
  spritesheet-breakout.png  # Sprite sheet de pala, bola y bloques
  spritesheet.js             # Helper para cargar y dibujar sprites/animaciones
  sounds/
    ball-bounce.mp3
    break-sound.mp3
specs/                  # Specs del proyecto (workflow /spec y /spec-impl)
```

## Fuera de alcance (por ahora)

- Múltiples niveles o progresión entre niveles.
- High scores persistentes (localStorage).
- Power-ups.
- Bloques con resistencia variable (más de un golpe).
- Controles por mouse o touch.
- Diseño responsive del canvas.

## Workflow de desarrollo

Este repo sigue un workflow spec-driven (ver `CLAUDE.md`): las specs viven en `specs/` y se implementan con los comandos `/spec` y `/spec-impl`.
