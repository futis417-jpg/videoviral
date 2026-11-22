# 🚀 EDICIÓN NIVEL AFTER EFFECTS / CAPCUT PRO + REGLA ANTI-MONOTONÍA v31

**PROHIBIDO HACER VÍDEOS DONDE UN SOLO PERSONAJE SE MUEVE ARRIBA Y ABAJO TODO EL RATO.**
En los vídeos virales de +10M de vistas, **el personaje solo aparece el 25–35% del tiempo**. El otro **65–75%** son **planos B-Roll distintos, infografías vivas, objetos en primer plano y tipografía cinética**:

## 1. LA REGLA DE ROTACIÓN VISUAL (CAMBIO DE PLANO CADA 2.5 – 4.0 SEGUNDOS)
Nunca repitas el mismo tipo de plano 2 veces seguidas. Rota entre estas **5 familias visuales**:
1. **Tipografía Cinética Full-Screen (`V31.AE.drawFullKineticSlide`):** Para golpes fuertes y ganchos (`["NO LLAMES", "AL 112"]`).
2. **Planos B-Roll Auto-Animados (`V31.BRoll`):**
   - `drawNeuralNetworkBroll` (cerebro/psicología), `drawLiveChatFeedBroll` (mensajes/ventas), `drawAnimatedMapRouteBroll` (viajes/historia), `drawDangerGaugeBroll` (riesgo/presión), `drawRadarScanBroll`, `drawBlueprintScanBroll` (ingeniería/X-Ray), `drawGearsMechanismBroll` (causa-efecto), `drawStormWeatherBroll`.
3. **Tarjetas Glassmorphism 3D + Gráficas/Props (`V31.AE.drawGlassCard3D` + `V30.Props` + `V28Anim.drawAnimatedBarChart`).**
4. **Zoom a Micro-Detalle (`V29.Edit.magnifyingLoupe` + `V29.Edit.freezeFrameCallout` + `V28Anim.drawCurvedArrow`).**
5. **Reacción de Personaje (`V30.Cast` / `V28Anim.drawExpressiveCharacter`):** Solo en cortes de reacción o presentación (máx. 30% del vídeo), con cambios reales de emoción y gesto.

## 2. POSTPRODUCCIÓN AFTER EFFECTS EN CADA CORTE (`V31.AE`)
- **Cámara orgánica continua:** `V31.AE.applyOrganicCamera(ctx, t, localT, dur)` + `V27Edit.applyAutoPunchZoom`.
- **Transiciones reales de estudio:** Alterna `V31.AE.diagonalSlashTransition`, `V31.AE.shutterSplitTransition`, `V27Edit.whipPanTransition` y `V27Edit.zoomThroughTransition`.
- **Light Leaks en entradas de capítulo:** `V31.AE.drawLightLeak(ctx, localT, 0.45)`.
- **Etalonaje Final en FFmpeg (`generar_video_v31_aftereffects.py`):** Contraste/saturación cinematográfica (`eq=contrast=1.06:saturation=1.14`) + `unsharp` + H.264 High Profile `-crf 15`.
