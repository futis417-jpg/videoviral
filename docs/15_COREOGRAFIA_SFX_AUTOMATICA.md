# 🔊 COREOGRAFÍA AUTOMÁTICA DE LOS 30 SFX (ADIÓS VÍDEOS MUDOS)

Uno de los fallos más grandes de las IAs es tener 30 efectos de sonido en la carpeta y usar solo 2.
En **v19 APEX**, `sfx_choreographer.py` lee automáticamente los timestamps de cada palabra y **dispara los 30 SFX de `recursos/sfx/`** según el contexto:
- **Inicio 0.05s:** `pop_ui.wav` / `pizzicato_pop.wav`.
- **Palabras de choque / giro (`pero`, `espera`, `peor`, `bestia`):** `sub_impact.wav`.
- **Mitos / errores (`mito`, `mentira`, `falso`, `error`):** `myth_buzzer.wav` o `red_cross_draw.wav`.
- **Listas / pasos (`uno`, `dos`, `tres`, `cuatro`):** `check_ok.wav`.
- **Subrayados / escritura:** `pen_underline.wav` y `pencil_scribble.wav`.
- **Rebobinado:** `rewind_vhs.wav`.
- **Notificaciones / chat:** `notif_msg.wav` y `bubble_msg.wav`.
- **Cambios de plano cada ~3.5s:** alterna `whoosh_zoom.wav`, `whoosh_slide.wav`, `whoosh_cinema.wav`, `page_flip.wav` y `ding_sparkle.wav`.
