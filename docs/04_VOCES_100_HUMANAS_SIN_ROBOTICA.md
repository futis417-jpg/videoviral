# 🎙️ VOCES 100% HUMANAS A 0€ (SOLUCIÓN DEFINITIVA A LA VOZ ROBÓTICA)

## 1. EL GRAN SECRETO QUE ARREGLA LA VOZ ROBÓTICA
En packs anteriores se generaba cada frase por separado y luego se pegaban con `apad`. Eso **rompe la prosodia natural** del hablante (cada frase empieza fría y termina seca) y suena robótico.

### Solución v14 en `generar_video_v14_god_engine.py`:
1. **SÍNTESIS EN UNA SOLA PASADA CONTINUA (1-PASS):**
   - Para vídeos de 1 narrador, enviamos **TODO EL GUION COMPLETO EN UNA SOLA LLAMADA** a `edge-tts` (con `pitch=+0Hz` SIEMPRE, `rate="+5%"` a `"+7%"`) y capturamos los tiempos exactos de cada palabra mediante `WordBoundary`.
   - Así el motor neuronal lee el párrafo entero con **respiraciones reales, subidas y bajadas de tono naturales y cero cortes artificiales**.
2. **KOKORO-82M (0€ OPEN-SOURCE, CALIDAD TOP):**
   - Si el entorno tiene `kokoro` instalado (`pip install kokoro soundfile`), el motor lo usa automáticamente con `em_alex` (hombre) / `ef_dora` (mujer) en español.
3. **ELEVENLABS 100% OPCIONAL:**
   - Si algún día pones `ELEVENLABS_API_KEY`, se activa solo con `/with-timestamps`. Si no pones nada, gasta **0€**.
4. **MASTERING CÁLIDO + SIDECHAIN DUCKING REAL:**
   - Cadena FFmpeg: `highpass=f=75` + calidez en `190Hz` + presencia suave en `4200Hz` + compresor suave (`ratio=2.4`) + **Sidechain Ducking** para que las bandas sonoras de 24s (`44.1kHz`) bajen al instante cuando hablas y respiren en las pausas.

## 2. MEJORES VOCES 100% GRATIS PARA CHROMEBOOK (ESTUDIO HTML)
- **Google AI Studio (`aistudio.google.com`):** Gemini TTS gratis (incluye modo Multi-Speaker para diálogos de 2 voces ultra humanos).
- **Fish Audio (`fish.audio`):** Voces en español súper realistas en plan gratis.
- **CapCut Web (`capcut.com`):** Texto a voz gratis en navegador.
