# 🎙️ PIPELINE HÍBRIDO v25 OMEGA: HEYGEN API (SOLO VOZ!) + ARTE 2D DE ESTUDIO + FX DE CINE

## 1. HEYGEN API = 100% SOLO VOZ (CERO AVATARES!)
En **v25 OMEGA**, HeyGen se usa **ÚNICAMENTE** para generar **voces humanas ultrarrealistas (TTS)** sin crear ningún avatar ni vídeo de persona hablando:
- **Endpoint Oficial Principal (`heygen_voice_tts.py`):**
  `POST https://api.heygen.com/v3/models/audio/tts` (Header: `X-Api-Key: $HEYGEN_API_KEY`)
  - **Modelo por defecto:** `"heygen-voice-1-turbo-free"` (¡GRATIS sin gastar créditos!) o `"heygen-voice-1"` / `"heygen-voice-1-turbo"`.
  - **Formato:** Devuelve **WAV 44.1 kHz** directo con `with_timestamps: true` para subtítulos sincronizados al milisegundo.
  - **Etiquetas emocionales reales dentro del guion:** Puedes meter `[excited]`, `[whispers]`, `[laughs]` para dar emoción humana real a la narración.
- **Fallback Starfish:** `POST https://api.heygen.com/v3/voices/speech` (soporta `speed` 0.5–2.0x y word timestamps).
- **Listar tus voces:** `GET https://api.heygen.com/v3/models/audio/voices`.
- **Si no pones API Key:** Cae automáticamente a **Edge-TTS 1-Pasada (0€)** con `pitch=+0Hz` y `WordBoundary`.

---

## 2. EL SECRETO DE LOS VÍDEOS DE +10M DE VISTAS (3 CAPAS REALES)
1. **Capa 1 — Láminas Ilustradas 2D con Style-Lock (`ai_art_scene_generator.py`, 0€):**
   - Genera fondos/escenas 1080×1920 con estilo visual de estudio (`piensaque_flat`, `abismo_xray`, `docu_cinema`, `neon_synthwave`, `ink_watercolor`, `storytime_comic`), cero texto quemado y grosor de línea uniforme.
2. **Capa 2 — Timeline Director + Motion Graphics (`V25Director` + `V14` + `V16` + `V18` + `V23.Props`):**
   - Anima cada lámina con **Ken Burns / Zoom-to-Detail**, personajes anclados, subrayados rojos, cronómetros, retos 100% jugables y subtítulos limpios.
3. **Capa 3 — Postproducción After-Effects (`V25FX` + FFmpeg `-14 LUFS`):**
   - Partículas flotantes, God Rays, Speed Lines en momentos de choque, Film Grain sutil, transiciones (`whip`/`flash`/`iris`), Auto-SFX (30 SFX) y mastering de audio broadcast `-14 LUFS`.
