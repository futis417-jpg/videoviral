---
name: viral-2d-pro-max-v34
description: Estudio definitivo (~37 MB) para producir vídeos verticales animados 2D (1080x1920, 9:16, 30fps) con calidad real de +1M a +10M de vistas. Usa HeyGen API EXCLUSIVAMENTE para VOZ TTS (POST /v3/models/audio/tts, cero avatares, con modelo heygen-voice-1-turbo-free, etiquetas emocionales y timestamps; Edge-TTS 0€ / ElevenLabs como fallback), Pipeline Híbrido de ilustraciones 2D de estudio (0€ Style-Lock) + V25 Cinematic FX Engine (film grain, god rays, partículas, speed lines, contadores, transiciones whip/iris/flash) + V25 Timeline Director + 6 Motores Full-Bleed + Pro Props Library + Leyes de Jugabilidad Real + Zero-Bugs Detector + Auto-SFX Choreographer (30 SFX) + 9 BGM evolutivos de 50s (44.1kHz) + Simulador OBLIGATORIO de 100 Usuarios TikTok (>= 90/100 con reporte completo de notas al usuario). Úsala automáticamente cuando el usuario dé un tema.
---

# 👑 SKILL v34 PRO MAX (EDICIÓN DEFINITIVA) — HEYGEN SOLO VOZ + CINE 2D HÍBRIDO + FX DE ESTUDIO + >= 90/100

> **EJECUCIÓN INMEDIATA (ZERO-PROMPT):**
> Cuando el usuario escriba un **TEMA** (y opcionalmente segundos `25s`/`50s`/`90s`, estilo `papel`/`reto`/`xray`/`docu`/`gaming`/`dialogo` o `@cuenta`), **NO HAGAS PREGUNTAS NI RESUMAS EL PACK.**
> **PRODUCE EL VÍDEO, PÁSALO OBLIGATORIAMENTE POR TODOS LOS VALIDADORES + SIMULADOR DE 100 USUARIOS HASTA >= 90/100, Y ENTREGA EL VÍDEO + EL REPORTE COMPLETO DE NOTAS AL USUARIO.**

---

## 🏆 LEY ABSOLUTA v34 PRO MAX — MILES DE CÁMARAS, PERSONAJES Y MUNDOS + PACKAGING VIRAL + SUPERVISOR TOTAL (`docs/00_GUIA_MAESTRA_PRO_MAX_V34.md` + `motor_escenas_v34/`)
- **8,640+ Movimientos de Cámara (`V34.Camera.applyRig` + `applyLensPostFX`):** 12 rigs (`dolly_in`, `crash_zoom`, `dolly_zoom_vertigo`, `orbit_3d`, `dutch_reveal`, `tracking_pan`, `whip_settle`, `crane_drop`, `punch_snap`, `spiral_in`, `handheld_docu`) × 6 easings × 6 shakes × 5 lens FX × 4 speed-ramps.
- **22,400+ Personajes + 1,920+ Mundos + Widgets (`V34.Factory`):** `drawCharacterCombo`, `drawWorldCombo` y `drawAnimatedWidget` (`progress_ring`, `breaking_news_bar`, `social_counter`) sumados a los **104 presets (`V33.Presets`)**, **6 mundos (`V32.Worlds`)**, **8 B-Rolls (`V31.BRoll`)**, **14 props (`V30`/`V23`)** y **50 SFX** (`sfx_choreographer.py`).
- **Packaging Viral Completo (`viral_packaging_pro.py`):** Entrega SIEMPRE el vídeo `.mp4` + **título de portada + descripción SEO + 6 hashtags óptimos + comentario fijado**.
- **Supervisor Total de 10 Escudos (`master_qa_supervisor_v34.py`):** Pasa los 10 validadores + Simulador de 100 Usuarios hasta **`>= 90/100`** y enseña todas las notas.

## ♾️ LEY SUPREMA v33 — BUCLE INFINITO INVISIBLE + HEYGEN EMOCIONES/VELOCIDADES + 104 PRESETS + 40 SFX (`docs/29` + `motor_escenas_v33/`)
- **Bucle Infinito Sin Que Se Note (`V33.Loop` + `infinite_loop_auditor.py`):** Termina el guion con puente gramatical directo a la frase 1 (`'...y justo por eso mismo,'` → `'si tu coche cae al agua...'`), cero silencio final y llama a `V33.Loop.applySeamlessLoopEnd(ctx, t, data.duration, drawFrame0)` en los últimos `0.45s`.
- **HeyGen Solo Voz Dinámica (`heygen_voice_tts.py`):** Auto-elige la mejor voz según `BGM_MOOD` y cambia emoción (`[excited]`, `[whispers]`, `[laughs]`) + velocidad (`0.93x`–`1.15x`) en cada beat del guion.
- **104 Presets Ya Hechos (`V33.Presets.draw(id, ctx, x, y, sc, t)`):** 36 props + 24 personajes + 22 mundos + 22 sellos/HUDs + **40 SFX** en `recursos/sfx/`.

## ⚡ LEY #000 (v32) — CLARIDAD EN EL SEGUNDO 0 + MUNDOS Y CAST YA HECHOS (`docs/28` + `motor_escenas_v32/`)
- **Entendible en t = 0.00s (incluso sin sonido):** Abre SIEMPRE con `V32.Frame0.drawInstantTopicColdOpen` (o `drawVsSplitHook` / `drawSecretFileHook`) + escena protagonista visible desde el primer fotograma (verificado por `frame0_clarity_auditor.py`).
- **Usa las piezas ya hechas (12 personajes + 6 mundos + 10 B-Rolls + 14 props):** `V32.Worlds` (Classroom, SpaceOrbit, HospitalLab, Supermarket, Courtroom, CityRooftop), `V32.MoreCast` (Doctor, Astronaut, Chef, Student, Police, RobotAI) y `V32.Moves` (runAcross, popFromBottom, floatOrbit, shakePanic, slideInLeft, zoomPulse).

## 🚀 LEY MÁXIMA v31 — ACABADO AFTER EFFECTS / CAPCUT PRO + CERO MONOTONÍA (`docs/27` + `motor_escenas_v31/`)
**PROHIBIDO un solo personaje moviéndose arriba y abajo.** El personaje aparece MÁXIMO el 30% del vídeo; el otro 70% son planos distintos cada **2.5–4.0s**:
- **10 B-Rolls Auto-Animados (`V31.BRoll`):** `drawNeuralNetworkBroll`, `drawLiveChatFeedBroll`, `drawAnimatedMapRouteBroll`, `drawDangerGaugeBroll`, `drawRadarScanBroll`, `drawBlueprintScanBroll`, `drawGearsMechanismBroll`, `drawStormWeatherBroll`.
- **Compositor After Effects (`V31.AE`):** `applyOrganicCamera` (handheld cinema), `renderParallax3D`, `diagonalSlashTransition`, `shutterSplitTransition`, `glitchSliceTransition`, `drawLightLeak`, `drawGlassCard3D` y `drawFullKineticSlide`.
- **Bloqueo automático:** `shot_variety_auditor.py` rechaza cualquier vídeo monótono de un solo personaje.

## 👑 LEY SUPREMA v30 — CAST, PROPS Y SISTEMA DE RETENCIÓN (`docs/26` + `motor_escenas_v30/`)
- **Cero dibujos improvisados raros:** Usa SIEMPRE los **6 personajes listos (`V30.Cast`: Detective, Scientist, Thief, Gamer, Pilot, Client)** y los **14+ objetos pro (`V30.Props`: Smartphone, CarSide con ventanilla animada, Airplane, AnalogClock, MoneyStack, Lightbulb, Padlock, HeartECG, WarningSign, Trophy + `V23.Props`)**.
- **Retención de otro nivel (`V30.Editor`):** Aplica SIEMPRE `drawHookBanner` en 0–2.8s, `drawOpenLoopBadge` para mantener el gancho vivo, `drawPatternInterrupt` cada 6–8s, `drawSplitComparison` en mitos/comparativas y `drawLoopBridgeFade` al final para bucle infinito.

## 💎 LEY #00 — HIPER-EDICIÓN Y MICRO-DETALLES (`docs/25` + `motor_escenas_v29/hyper_edit_and_detail_engine.js`)
- **Cero superficies planas de plástico:** Usa `V29.Detail.drawWoodTexture`, `drawBrickWall`, `drawGlassReflection` y `drawAmbientOcclusion` en tus escenarios.
- **Edición nivel Premiere/After Effects:** Usa `V29.Edit.magnifyingLoupe` (lupa 1.8x en detalles), `V29.Edit.freezeFrameCallout` (ficha técnica con línea líder), `V29.Edit.kineticLowerThird` (rótulo documental) y `V29.Edit.drawChapterBar`.

## 🧠 LEY #0 — EDICIÓN RAZONABLE (CERO COSAS ALEATORIAS) + ANIMACIÓN DISNEY (`docs/24` + `motor_escenas_v28/disney_motion_engine.js`)
**PROHIBIDO meter efectos, glitches, transiciones o fondos al azar.** Cada corte, zoom, SFX y gesto DEBE tener una razón narrativa directa:
- **Planifica primero los beats:** Mismo lugar = corte/reencuadre limpio; cambio de lugar/capítulo = `whipPanTransition` o `zoomThroughTransition`; detalle importante = `V28Anim.drawSpotlightFocus` + `V28Anim.drawCurvedArrow` / `drawCircleHighlight`.
- **Animación de verdad (`V28Anim`):** Usa `V28Anim.drawExpressiveCharacter` (cambiando `emotion`, `gesture` y `lookAtX/Y` en cada frase), `V28Anim.anticipationJump` (squash & stretch), `V28Anim.spring` y `V28Anim.drawAnimatedBarChart`.
- **Control Anti-Spam:** Máximo 2–3 golpes `chromaticImpact` / `drawSpeedLines` en los picos reales (validado por `storyboard_coherence_validator.py`).

## ✂️ LEY SUPREMA DE EDICIÓN PRO (`docs/23` + `motor_escenas_v27/pro_editing_suite.js`)
Un vídeo sin edición pro NO es viral. **EN TODOS LOS VÍDEOS DEBES USAR `V27Edit`:**
- **Auto Punch-In Zooms al ritmo de la voz:** `V27Edit.applyAutoPunchZoom(ctx, t, beats)` en cada palabra de impacto.
- **Transiciones con Motion Blur:** `V27Edit.whipPanTransition` y `V27Edit.zoomThroughTransition` entre escenas (nunca cortes secos ni planos quietos >2.5s).
- **Slam-In + Kinetic Pops + RGB Impact:** `V27Edit.slamIn`, `V27Edit.kineticWordPop`, `V27Edit.chromaticImpact`, `V27Edit.highlighterSweep`.
- **Acabado After Effects:** `V27Edit.colorGrade` + `V25FX.drawCinemaFinish` + `V27Edit.drawRetentionBar` + **Auditor de Edición (`editing_pacing_auditor.py`)** obligatorio.

## 🎯 0. CLONACIÓN EXACTA DE LOS 5 ARQUETIPOS VIRALES (`docs/22` + `motor_escenas_v26/five_viral_archetypes.js`)
Elige automáticamente el arquetipo exacto según el tema y clona su estética, HUD y subtítulos al 100%:
1. **`NEURA_PSICO`** (`V26.NeuraPsico` + `V16.HUD`): Retos 4 niveles, fondo orbital, `FALLO | 4 | 3 | 2 | 1`, CCTV, `⏳ ELIGE`, `+95%`, sellos rojos inclinados, subtítulos píldora oscura + amarillo.
2. **`INK_EDITORIAL`** (`V18.Ink`): Papel crema `#F3EEE3`, pluma escribiendo, subrayado rojo, bocadillo tinta, sello `12:00`, subtítulos doble marco + `■` rojo.
3. **`NEON_GAMING`** (`V26.NeonGaming`): Carretera 2.5D neón, skyline púrpura, 6 estrellas + candado, foco `R.I.P.`, subtítulos caja azul 4 puntos.
4. **`ABISMO_XRAY`** (`V26.AbismoXRay` + `V14`): Corte X-Ray cian, agua + burbujas, `PRESIÓN DEL AGUA (kg)`, targeting verde `SALIDA`, `TIEMPO`, `MITO`, `⏪ REBOBINANDO`, checklist.
5. **`DOCU_25D`** (`V26.Docu25D` + `V25Director` + `V25FX`): Historias reales 2.5D, lluvia/god rays, placa fecha `23·12·1971`, bio-tags, subtítulos mayúsculas blanco + amarillo.

## 🎙️ 1. MOTOR DE VOZ PRO (`heygen_voice_tts.py` — HEYGEN SOLO VOZ, CERO AVATARES!)
- **Prioridad 1 — HeyGen Voice TTS (`HEYGEN_API_KEY`):** Usa `POST https://api.heygen.com/v3/models/audio/tts` (modelo `heygen-voice-1-turbo-free` o `heygen-voice-1`, **SOLO VOZ WAV 44.1kHz, JAMÁS AVATARES!**) con `with_timestamps: true` y etiquetas emocionales `[excited]`, `[whispers]`, `[laughs]`. Fallback: `POST /v3/voices/speech`.
- **Prioridad 2 — ElevenLabs (`ELEVENLABS_API_KEY`):** Opcional.
- **Prioridad 3 — Edge-TTS 1-Pasada (0€):** Síntesis continua (`pitch=+0Hz`, `WordBoundary`) + mastering `-14 LUFS` + **Auto-SFX Choreographer** (12–25+ de los **30 SFX**) + **9 BGM evolutivos de 50s (44.1kHz)** con Sidechain Ducking.

---

## 🎨 2. MOTOR VISUAL DE ESTUDIO 3 CAPAS (`docs/20` + `V25Director` + `V25FX`)
1. **Láminas Ilustradas 2D con Style-Lock (`ai_art_scene_generator.py`, 0€):** Genera ilustraciones 1080×1920 limpias (sin texto quemado, grosor de línea uniforme) y anímalas con `V25Director.drawArtPlate` (Ken Burns / Zoom-to-Detail). En modo 100% vectorial/offline usa `V14` (Scene Graph anclado) + `V16` (HUD Gamificado) + `V18` (Tinta y Papel) + `V23.Props` (cerebro real, mano limpia, regla, taza).
2. **Postproducción After-Effects (`motor_escenas_v25/cinematic_fx_engine.js` → `V25FX`):** Aplica SIEMPRE `drawCinemaFinish` (film grain + viñeta), `drawParticles`, `drawGodRays`, `drawSpeedLines` en impactos, `drawKineticBadge`, `drawAnimatedCounter` y transiciones `whip` / `flash` / `iris`.
3. **Director Declarativo (`motor_escenas_v25/timeline_director.js`):** Usa `V25Director.renderTimeline` para cambios de escena limpios y cero fotogramas congelados.

---

## 🧪 3. SIMULADOR OBLIGATORIO DE 100 USUARIOS + MOSTRAR TODAS LAS NOTAS
Ejecuta SIEMPRE `viral_simulator_100_users.py` y **muestra al usuario en tu respuesta final**:
- **Nota Final (`/100`)** — OBLIGATORIO **`>= 90/100`** (si saca menos, edita y repite hasta aprobar).
- **Desglose:** Guion Anti-IA (`/100`), Detalle Visual y Jugabilidad (`/100`), Audio y SFX (`/100`), Cierre y Bucle (`/100`).
- **100 Usuarios TikTok:** Hold Rate 3s, Retención 15s, Completado %, Likes, Comentarios, Guardados, Compartidos y abandonos por tramo (`0-3s`, `3-15s`, `15s-fin`).

---

## 🚨 4. TOLERANCIA CERO A ERRORES (TODOS LOS ESCUDOS ACTIVOS)
- **Anti-PowerPoint (`docs/10`):** Cero cabeceras `01/02/03`, cero cajas negras sobre fondo vacío, cero texto de libro de biología.
- **Anatomía y Contraste (`docs/19`):** Cero brazos-salchicha, cero óvalos vagos, alto contraste siempre, cero personajes tapando botones, cero estirar 1 idea de 10s a 50s.
- **Jugabilidad Real (`docs/17`):** Pases parabólicos reales DESPUÉS de `¿Listo?`; foto oculta (`?`) en memoria sin spoilers; Stroop sin chivar color; ilusiones ópticas animando la demostración.
- **Zero-Bugs (`docs/16`):** Cero subtítulos de 1 palabra, cero typos (`? / 4`, jamás `¿ / 4`), QA Contact Sheet 3×3 verificado.
