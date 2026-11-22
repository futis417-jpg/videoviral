# 🏆 GUÍA MAESTRA DEFINITIVA — PACK v34 PRO MAX (EDICIÓN FINAL)

Sigue exactamente este flujo de **5 pasos claros** para producir vídeos de nivel **+1M a +10M de vistas** sin un solo error:

1. **PASO 1 — GUION ANTI-IA + BUCLE INFINITO (`docs/07`, `docs/08`, `docs/29`):**
   - Escribe un guion conversacional con **Hook en t=0.00s** (sin saludos), **Re-Hooks cada 6–8s**, datos concretos en letras y **puente gramatical de bucle infinito** al final (*"...y justo por eso mismo,"* → conecta con la palabra 1).
2. **PASO 2 — VOZ HUMANA DINÁMICA + 50 SFX + 9 BGM (`heygen_voice_tts.py` + `sfx_choreographer.py`):**
   - Prioridad 1: **HeyGen API SOLO VOZ** (`auto_select_heygen_voice` + emociones `[excited]`/`[whispers]`/`[laughs]` + velocidades dinámicas `0.93x`–`1.15x`, CERO avatares). Fallback 0€: Edge-TTS 1-Pasada.
   - Mezcla automática con **50 SFX** (`sfx_choreographer.py`, con J-Cuts y `loop_riser_seamless.wav`) + **9 BGM evolutivos de 50s** con Sidechain Ducking y mastering `-14 LUFS`.
3. **PASO 3 — DIRECCIÓN VISUAL MULTI-PLANO PRO MAX (`V34` + `V33` + `V32` + `V31` + `V30` + `V29` + `V28` + `V27`):**
   - **Segundo 0 claro (`V32.Frame0`):** Titular instantáneo + mundo protagonista visibles en `t = 0.00s`.
   - **Miles de movimientos de cámara (`V34.Camera.applyRig` + `applyLensPostFX`):** 12 rigs × 6 easings × 6 shakes × 5 lens FX × 4 speed-ramps.
   - **Miles de personajes/escenas/objetos (`V34.Factory` + `V33.Presets` + `V32.Worlds` + `V31.BRoll` + `V30`):** Rota cada 2.5–3.8s entre B-Rolls, widgets, props, lupas y personajes (personaje máx. 30% del tiempo).
   - **Bucle visual invisible (`V33.Loop.applySeamlessLoopEnd`):** Match-cut suave al Frame 0 en los últimos `0.45s`.
4. **PASO 4 — RENDER CINEMA + PACKAGING VIRAL (`generar_video_v34_pro_max.py` + `viral_packaging_pro.py`):**
   - Exporta en `1080×1920`, `30fps`, H.264 High Profile `-crf 15`, color grading `eq` + `unsharp` + genera `viral_package_v34.json` (título, descripción, hashtags y comentario fijado).
5. **PASO 5 — SUPERVISOR TOTAL DE 10 ESCUDOS + 100 USUARIOS (`master_qa_supervisor_v34.py`):**
   - Pasa todos los validadores y el Simulador de 100 Usuarios hasta **`>= 90/100`** y **muestra TODAS las notas + hashtags + paquete viral al usuario**.
