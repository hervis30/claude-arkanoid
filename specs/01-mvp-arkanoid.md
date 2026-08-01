# SPEC 01 — MVP jugable de Arkanoid

> **Estado:** Implementado
> **Depende de:** Ninguno
> **Fecha:** 2026-08-01
> **Objetivo:** Construir un Arkanoid jugable de principio a fin (start, juego, victoria, game over) en HTML5 Canvas + JS vanilla usando los assets existentes.

## Alcance

**Incluye:**

- Canvas fijo de 480x600px, centrado en la página, con fondo oscuro.
- Un solo nivel fijo con grid de bloques (8 columnas x 6 filas) usando los 7 colores del spritesheet.
- Pala controlada con teclado (flechas izquierda/derecha o A/D).
- Física de rebote: paredes y bloques con reflexión especular; pala con ángulo variable según punto de impacto.
- Cada bloque se rompe con un solo golpe, dispara la animación de explosión (`EXPLOSION_FRAMES`) y suma puntos según su color.
- Sistema de 3 vidas: al caer la bola por debajo de la pala, se pierde una vida y la bola se reinicia sobre la pala; si las vidas llegan a 0, Game Over.
- Puntuación en memoria (sin persistencia entre sesiones).
- Sonidos: `ball-bounce.mp3` al rebotar en pared/pala, `break-sound.mp3` al romper un bloque.
- Estados de juego: Start → Playing → (Game Over | Victoria) → Start.
- Victoria al romper todos los bloques del nivel.

**Fuera de alcance (para specs futuros):**

- Múltiples niveles o progresión entre niveles.
- High scores persistentes (localStorage).
- Power-ups.
- Bloques con resistencia variable (más de un golpe).
- Controles por mouse o touch.
- Diseño responsive del canvas.

## Modelo de datos

```js
// Estado global del juego
const state = {
  screen: 'START', // 'START' | 'PLAYING' | 'GAME_OVER' | 'VICTORY'
  score: 0,
  lives: 3,
  blocks: [], // ver estructura Block abajo
};

// Pala
const paddle = {
  x: 195, y: 570, w: 90, h: 14, speed: 6, // px/frame
};

// Bola
const ball = {
  x: 240, y: 560, radius: 8,
  vx: 3, vy: -3, // px/frame
};

// Bloque individual
// { x, y, w: 56, h: 20, color: 'red', points: 70, alive: true }
```

Convenciones:

- Origen de coordenadas: esquina superior izquierda.
- Velocidades en píxeles/frame (loop basado en `requestAnimationFrame`).
- Grid de bloques: 8 columnas x 6 filas, generado al iniciar `PLAYING`.
- Tabla de puntos por color:

  | Color   | Puntos |
  | ------- | ------ |
  | gray    | 10     |
  | cyan    | 20     |
  | green   | 30     |
  | yellow  | 40     |
  | magenta | 50     |
  | hotpink | 60     |
  | red     | 70     |

- Asignación de color por fila (de arriba hacia abajo, 6 filas de las 7 disponibles): red, hotpink, magenta, yellow, green, cyan.

## Plan de implementación

1. Crear `index.html` con el `<canvas>` de 480x600px centrado, cargando `assets/spritesheet.js` y un nuevo `game.js`. Estado: pantalla en blanco/negra, sin errores en consola.
2. En `game.js`, implementar el loop principal (`requestAnimationFrame`) y la pantalla `START`: cargar el spritesheet y mostrar un mensaje "Pulsa una tecla para empezar".
3. Implementar la pala: dibujo con `drawSprite('paddle', ...)` y movimiento horizontal con flechas/A-D, limitado a los bordes del canvas.
4. Implementar la bola: dibujo con `drawSprite('ball', ...)`, movimiento con `vx`/`vy`, y rebote en paredes izquierda/derecha/superior.
5. Implementar la colisión bola-pala con ángulo variable según punto de impacto, más el sonido `ball-bounce.mp3`.
6. Generar el grid de bloques (8x6) al entrar en `PLAYING` y dibujarlos con `drawSprite('block_<color>', ...)`.
7. Implementar la colisión bola-bloque: al impactar, marcar el bloque como no vivo, reproducir la animación de explosión (`EXPLOSION_FRAMES`/`EXPLOSION_DURATION`), sumar los puntos del color y reproducir `break-sound.mp3`.
8. Implementar la pérdida de vida: cuando la bola cae por debajo de la pala, `lives -= 1`, se reinicia la posición de la bola sobre la pala, y se muestra el contador de vidas en pantalla.
9. Implementar la transición a `GAME_OVER` cuando `lives === 0`, mostrando puntuación final y mensaje para reiniciar.
10. Implementar la transición a `VICTORY` cuando todos los bloques están rotos, mostrando puntuación final y mensaje para reiniciar.
11. Cablear el reinicio: desde `GAME_OVER` o `VICTORY`, pulsar una tecla vuelve a `START` con el estado reseteado (score, lives, blocks, posición de pala/bola).

## Criterios de aceptación

- [ ] Al abrir `index.html` en el navegador, el juego carga sin errores en la consola.
- [ ] En la pantalla `START` se muestra un mensaje de inicio y el juego arranca al pulsar una tecla.
- [ ] La pala se mueve horizontalmente con las flechas izquierda/derecha (o A/D) y no sale de los límites del canvas.
- [ ] La bola rebota correctamente en las paredes izquierda, derecha y superior.
- [ ] La bola rebota en la pala con un ángulo distinto según el punto de impacto (borde izquierdo, centro, borde derecho).
- [ ] Al golpear un bloque, este desaparece, se reproduce la animación de explosión de su color y se reproduce `break-sound.mp3`.
- [ ] Al golpear un bloque gris se suman exactamente 10 puntos; al golpear uno rojo se suman exactamente 70 puntos.
- [ ] Cada rebote en pared o pala reproduce `ball-bounce.mp3`.
- [ ] Cuando la bola cae por debajo de la pala, se resta una vida y la bola se reinicia sobre la pala.
- [ ] Al llegar a 0 vidas, se muestra la pantalla `GAME_OVER` con la puntuación final.
- [ ] Al romper los 48 bloques del grid, se muestra la pantalla `VICTORY` con la puntuación final.
- [ ] Desde `GAME_OVER` o `VICTORY`, pulsar una tecla reinicia el juego a la pantalla `START` con score en 0, 3 vidas y el grid completo de bloques.

## Decisiones

- **Sí:** HTML5 Canvas + JS vanilla sin build system. Coherente con `assets/spritesheet.js`, que ya está escrito como script plano sin imports/exports.
- **No:** Vite u otro bundler. Innecesario para el alcance del MVP; se puede introducir en un spec futuro si el proyecto crece.
- **No:** framework de juego (Phaser) ni UI (React). Excesivo para un MVP de un solo nivel.
- **Sí:** un solo nivel fijo con grid 8x6. Cubre el objetivo "jugable de principio a fin" sin la complejidad de gestionar progresión de niveles.
- **No:** niveles múltiples o generación aleatoria. Se evalúa en un spec futuro de progresión.
- **Sí:** ángulo de rebote variable en la pala según punto de impacto. Es el comportamiento esperado de Arkanoid y no añade complejidad significativa.
- **Sí:** sistema de 3 vidas con reinicio de bola. Comportamiento clásico del género, ya validado con el usuario.
- **No:** persistencia de puntuación (localStorage). El MVP no la requiere; se deja para un spec futuro de high scores.
- **Sí:** bloques de un solo golpe (sin resistencia variable). Simplifica el modelo de datos y la lógica de colisión para el MVP.
- **Sí:** tabla de puntos escalonada (10-70) por color, en vez de un valor único. Se decidió durante la fase de preguntas por dar más profundidad sin costo de implementación relevante.

## Riesgos

| Riesgo                                                                 | Mitigación                                                                                   |
| ------------------------------------------------------------------------| ---------------------------------------------------------------------------------------------|
| Los navegadores bloquean el autoplay de audio antes de una interacción del usuario | Los sonidos solo se reproducen después de que el usuario pulsa una tecla (pantalla `START`), momento en que ya hubo interacción. |
| Túnel de la bola a través de bloques/pala a alta velocidad (frames largos) | Mantener velocidades moderadas (`vx`/`vy` bajos) y usar detección de colisión por posición previa/actual en cada frame. |

## Lo que **no** está en este spec

- Múltiples niveles o progresión entre niveles.
- High scores persistentes (localStorage).
- Power-ups.
- Bloques con resistencia variable (más de un golpe).
- Controles por mouse o touch.
- Diseño responsive del canvas.
- Bundler o build system (Vite, etc.).

Cada uno de estos, si se implementa, irá en su propio spec.
