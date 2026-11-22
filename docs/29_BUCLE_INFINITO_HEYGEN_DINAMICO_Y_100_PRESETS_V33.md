# ♾️ BUCLE INFINITO INVISIBLE + HEYGEN EMOCIONES/VELOCIDADES + 104 PRESETS (v33)

## 1. CÓMO HACER UN BUCLE INFINITO SIN QUE EL ESPECTADOR SE ENTERE (`V33.Loop`)
Para disparar el **Rewatch Rate por encima del 130%**, aplica estas **3 reglas**:
1. **Puente Verbal Invisible:** Termina la última frase enlazando gramaticalmente con la primera palabra del vídeo (SIN decir *"hasta luego"* ni *"sígueme"* al final):
   - *Final:* **"...y justo por eso mismo,"**
   - *Inicio (0.00s):* **"si tu coche cae al agua, no llames al ciento doce."**
   - Al repetirse suena: *"...y justo por eso mismo, si tu coche cae al agua..."* — ¡el cerebro no nota el corte!
2. **Cero Silencio Final:** `heygen_voice_tts.py` recorta automáticamente el silencio muerto del final (`silenceremove`) y dispara `loop_riser_seamless.wav`.
3. **Match-Cut Visual al Frame 0:** En los últimos `0.45s` llama SIEMPRE a `V33.Loop.applySeamlessLoopEnd(ctx, t, data.duration, drawFrame0)`.

## 2. HEYGEN SOLO VOZ v33 CON EMOCIONES Y VELOCIDADES DINÁMICAS (`heygen_voice_tts.py`)
- **Auto-Selección de Voz:** `auto_select_heygen_voice(api_key, mood)` elige la mejor voz en español según el estilo del vídeo.
- **Emociones + Velocidad por Contexto:** `auto_tag_script_beats` aplica `[excited]` (`1.12x`) en el Hook y listas rápidas, `[whispers]` (`0.93x`) en suspense/secretos, `0.96x` en revelaciones y `1.08x` en el puente de bucle.

## 3. +100 PRESETS YA HECHOS (`motor_escenas_v33/mega_100_presets_studio.js` → `V33.Presets`)
Llama a cualquiera de los **104 presets** con una sola línea: `V33.Presets.draw("prop_money_bag", ctx, 540, 820, 1.0, t)`
- **36 Props:** `prop_smartphone`, `prop_laptop`, `prop_ai_chip`, `prop_money_bag`, `prop_chart_up`, `prop_dna`, `prop_fire`, `prop_lightning`, `prop_rocket`, `prop_alarm`, etc.
- **24 Personajes:** `char_detective`, `char_scientist`, `char_hacker`, `char_ceo_suit`, `char_astronaut`, `char_judge`, `char_survivor`, `char_robot_ai`, etc.
- **22 Mundos/Atmósferas:** `world_orbital_dark`, `world_cyber_neon`, `world_deep_ocean`, `world_emerald_money`, `world_matrix_code`, `world_space_cosmos`, etc.
- **22 Overlays/Sellos:** `fx_stamp_mito`, `fx_stamp_real`, `fx_stamp_giro`, `fx_badge_90pct`, `fx_badge_bucle`, etc.
- **40 SFX en `recursos/sfx/`** (10 nuevos: `boom_cinematic`, `glitch_zap`, `whoosh_heavy`, `camera_shutter`, `money_chaching`, `alarm_siren`, `vinyl_scratch`, `typing_keys`, `magic_sparkle`, `loop_riser_seamless`).
