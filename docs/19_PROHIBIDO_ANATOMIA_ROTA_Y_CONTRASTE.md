# 🚨 LEYES DE ANATOMÍA LIMPIA, CONTRASTE Y RITMO v23 (TOLERANCIA CERO)

Estos **5 desastres visuales** matan cualquier vídeo y están **100% PROHIBIDOS** en v23:

---

## ❌ DESASTRE 1: BRAZOS-SALCHICHA SALIENDO DE LA CINTURA / ENTREPIERNA
- **PROHIBIDO** dibujar un tubo largo color piel saliendo del estómago o entrepierna de un personaje para simular que "toca algo" o "hace cosquillas". Queda grotesco e inapropiado.
- **SOLUCIÓN v23:** Los brazos nacen SIEMPRE en el **hombro** (`y = torsoTop + 18`), tienen longitud proporcionada (`<= 0.85 * torsoH`) y, si necesitas mostrar un toque o gesto de mano, usa **`V23.Props.drawCleanHand`** en un **plano detalle (close-up)** o **`V14.drawHumanAtGround`**.

## ❌ DESASTRE 2: FORMAS VAGAS QUE NO SE ENTIENDEN (ÓVALOS ROSAS / DIAGRAMAS RAROS)
- **PROHIBIDO** dibujar dos círculos rosa con garabatos encima fingiendo que es un cerebro, o un óvalo rosa vacío en un escenario de teatro.
- **SOLUCIÓN v23:** Usa SIEMPRE **`motor_escenas_v23/pro_props_library.js` (`V23.Props`)**:
  - `V23.Props.drawRealBrain(ctx, cx, cy, scale, t)` (cerebro limpio con dos hemisferios y pliegues reales + chispas neuronales).
  - `V23.Props.drawCleanHand(ctx, cx, cy, scale, angle)` (mano limpia y proporcionada).
  - `V23.Props.drawRuler(ctx, cx, cy, width)` (regla real con marcas milimétricas).
  - `V23.Props.drawSteamingMug(ctx, cx, cy, scale, t)` (taza con vapor animado).

## ❌ DESASTRE 3: LÍNEAS O TEXTOS CLAROS SOBRE FONDOS CLAROS (ILEGIBLE)
- **PROHIBIDO** poner líneas amarillas o blancas sobre un cielo azul claro, un sol o un fondo beige sin contraste.
- **SOLUCIÓN v23:** Si el fondo es claro (día/papel), usa **tinta oscura `#1C1B19`** o encierra el gráfico en una **tarjeta oscura semitransparente** (`rgba(15, 23, 42, 0.88)`). Contraste mínimo obligatorio: **alto y nítido en móvil**.

## ❌ DESASTRE 4: PERSONAJES TAPANDO BOTONES O TÍTULOS PISANDO VENTANAS
- **PROHIBIDO** dibujar un personaje delante de una píldora CTA (`¿SÍ O IMPOSIBLE?`) tapando las letras, o poner un título (`EL TRAMO RECTO`) encima de una ventana.
- **SOLUCIÓN v23 (RESERVA DE ZONAS):**
  - Títulos superiores: solo sobre fondo limpio (sin ventanas ni lámparas detrás).
  - Personajes: nunca se colocan en la misma coordenada `Y` que una píldora de texto o botón.

## ❌ DESASTRE 5: ESTIRAR 1 SOLA IDEA DE 10 SEGUNDOS DURANTE 50 SEGUNDOS
- **PROHIBIDO** tener al espectador mirando las mismas 2 líneas (A y B) durante 50 segundos cambiando fondos random (parque, teatro, autopista) detrás. Eso aburre mortalmente.
- **SOLUCIÓN v23:**
  - Si el tema es **1 sola ilusión o dato simple**, haz un vídeo **ultra ágil de 22–28 segundos**.
  - Si quieres un vídeo de **50–90 segundos**, mete **3 a 4 pruebas, datos o giros distintos** (cada uno en su propio mundo visual coherente con lo que dice la voz, jamás fondos aleatorios sin relación!).
