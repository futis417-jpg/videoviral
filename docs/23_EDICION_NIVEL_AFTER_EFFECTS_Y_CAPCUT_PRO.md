# ✂️ MANUAL DE EDICIÓN PRO v27 — NIVEL AFTER EFFECTS / CAPCUT PRO / PREMIERE

¿Por qué un vídeo con los mismos dibujos puede parecer **amateur** o parecer de **+10M de vistas**?
**POR LA EDICIÓN.** En v27 PRO EDITOR es **OBLIGATORIO** aplicar estas **7 reglas de edición profesional** (`motor_escenas_v27/pro_editing_suite.js` → `V27Edit`):

1. **REGLA DEL GOLPE CADA 1.8 SEGUNDOS (PUNCH-IN ZOOMS A LA VOZ):**
   - Llama SIEMPRE a `const beats = V27Edit.getAutoBeatTimes(data.words);` y dentro de `renderAt(t)` aplica `V27Edit.applyAutoPunchZoom(ctx, t, beats, 0.10)`.
   - Cada vez que la voz suelta una palabra potente (*"no"*, *"mito"*, *"trampa"*, *"cuatro"*, *"espera"*), la cámara pega un **punch-in rápido + micro-shake** exactamente al milisegundo de la voz.

2. **CERO CORTES SECOS ABURRIDOS — USA TRANSICIONES DE ESTUDIO:**
   - Cambia de escena usando `V27Edit.whipPanTransition` (whip-pan con motion blur direccional real) o `V27Edit.zoomThroughTransition` (match-cut con zoom + flash).
   - **J-Cut de Audio:** En `sfx_choreographer.py`, el `whoosh_zoom.wav` / `whoosh_slide.wav` entra **0.12s ANTES** del cambio visual de plano para que el corte se sienta fluido como en Premiere/After Effects.

3. **SLAM-IN EN TODOS LOS ELEMENTOS (NUNCA APARECER DE GOLPE):**
   - Cada sello (`TE RETO`, `MITO`), tarjeta de estadística (`+95%`), flecha o badge entra con `V27Edit.slamIn` (`1.65x → 0.93x → 1.00x`) + `sub_impact.wav` o `pop_ui.wav`.

4. **KINETIC WORD POPS EN CLÍMAX:**
   - En los 2–3 momentos más fuertes del guion, suelta 1 palabra gigante cinética en pantalla con `V27Edit.kineticWordPop(ctx, "MITO", 540, 820, localT)` + `V27Edit.chromaticImpact(ctx, localT)`.

5. **HIGHLIGHTER SWEEP EN TEXTOS CLAVE:**
   - Cuando muestres una frase importante o un dato, pasa un subrayador animado por detrás con `V27Edit.highlighterSweep` o `V18.Ink.drawRedUnderline`.

6. **COLOR GRADING UNIFICADO (`V27Edit.colorGrade`) + FILM GRAIN (`V25FX.drawCinemaFinish`):**
   - Aplica siempre una capa sutil de etalonaje (`teal_orange`, `noir_docu`, `neon_cyber` o `deep_ocean`) + grano fino + viñeta para que todo parezca renderizado en After Effects y jamás como un HTML plano.

7. **BARRA DE RETENCIÓN SUPERIOR (`V27Edit.drawRetentionBar`):**
   - Mantén la barra fina superior avanzando al ritmo del vídeo para reducir abandonos en los últimos 10 segundos.
