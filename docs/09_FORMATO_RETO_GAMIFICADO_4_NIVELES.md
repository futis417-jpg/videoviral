# 🎮 FORMATO RETO GAMIFICADO DE 3–4 NIVELES (ESTILO @NEURAPSICOO — RETENCIÓN +100%)

Este formato es el rey absoluto de la retención en vídeos de **60s a 180s** (monetizables en TikTok/YouTube Shorts): convierte al espectador en **jugador activo** desde el segundo 0.

---

## 1. LA ESTRUCTURA EXACTA DE 6 PIEZAS QUE MANTIENE AL ESPECTADOR PEGADO
1. **EL RETO + BARRA DE PROGRESO SUPERIOR (`FALLO | 4 | 3 | 2 | 1`):**
   - Abre con: *"Tu cerebro va a fallar cuatro veces en este vídeo. Te reto a que no te pille ninguna."*
   - La barra superior (`V16.HUD.drawTopTracker`) permanece visible todo el vídeo. Cada vez que el espectador cae en una trampa, ese número se convierte en una **X roja (`[X]`)** con `myth_buzzer.wav`.
2. **LA TRAMPA PLANTADA PARA EL FINAL (0:06 → 2:06):**
   - Justo antes del Nivel 4, planta una escena breve en un **Monitor CCTV de Seguridad** (`V16.HUD.drawCCTVMonitor`): *"Pero antes, fíjate bien en lo que roba este ladrón, porque al final te lo voy a preguntar."*
   - Eso crea un **Open Loop de 2 minutos** que obliga a ver el vídeo entero.
3. **INTERACTIVIDAD REAL CON BARRA DE CUENTA ATRÁS (`⏳ ELIGE [====---]`):**
   - En cada nivel, deja **2.5 a 3.5 segundos** con `V16.HUD.drawCountdownBar` y opciones claras (`A` vs `B`, o 3 píldoras `NEGRO | ROJO | GRIS`) para que el espectador elija antes de revelar el truco.
4. **VISUALIZACIÓN DE DATOS E INFOGRAFÍAS DE ALTO IMPACTO:**
   - **Antes/Después con divisor vertical (`V16.HUD.drawBeforeAfterSplit`):** Compara el fotograma inicial con el final (`ANTES` | `AHORA`) para revelar cambios lentos (*ceguera al cambio*).
   - **Pictograma de Estadística (`V16.HUD.drawPictogramCard`):** Ej. `7 DE CADA 10 NO VIERON EL CAMBIO` con 7 siluetas rojas y 3 verdes.
   - **Espectrograma / Ondas Neón (`V16.HUD.drawSpectrogram`):** Para trucos de audio o ciencia del sonido.
   - **Polaroid en Foco de Luz (`V16.HUD.drawPolaroidSpotlight`):** Para memoria falsa, recuerdos o giros dramáticos.
5. **PRESENTADOR / MASCOTA CONSISTENTE (`V16.HUD.drawMascotHost`):**
   - Personaje simpático con sudadera, expresiones vivas, dedos señalando, ojos cerrados y cúpula cerebral opcional que reacciona a cada prueba.
6. **TARJETA DE PUNTUACIÓN FINAL (`TE HA PILLADO ? / 4`):**
   - Cierra con `V16.HUD.drawFinalScoreCard` + *"Comenta cuántas veces te ha pillado tu cerebro"*. Dispara cientos de comentarios (`"3/4"`, `"Me pilló todas"`, `"El del gorro me voló la cabeza"`).
