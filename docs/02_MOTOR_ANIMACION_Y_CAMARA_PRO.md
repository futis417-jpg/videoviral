# 🎥 MOTOR DE ANIMACIÓN Y CÁMARA PRO v14 (LOS 12 PRINCIPIOS EN CÓDIGO)

Un vídeo de +10M de vistas NO es una diapositiva con dibujos quietos. Cada escena debe tener **vida continua**:

## 1. LOS 6 MOVIMIENTOS OBLIGATORIOS EN CADA ESCENA
1. **Cámara Keyframe (`V14.applyCamera`):**
   - Interpola suavemente `z0 -> z1`, `x0 -> x1`, `y0 -> y1` y `tilt` durante toda la escena.
   - Usa `zoom_to_detail` (1.0x → 1.5x hacia el objeto clave) cuando la voz señala un detalle concreto.
   - Usa `camera_shake` (`shake: 14`) de 0.22s en impactos (`sub_impact.wav`, `myth_buzzer.wav`).
2. **Respiración y Parpadeo Constante:**
   - Incluso cuando un personaje está quieto escuchando, su torso respira (`sin(t * 3.0) * 3px`) y sus ojos parpadean cada ~3.5 segundos.
3. **Ciclo de Caminar / Correr Real (2 Segmentos):**
   - Brazos y piernas oscilan en fase opuesta (`arm = -leg`) con ligero rebote vertical (`abs(sin(t * freq)) * 10px`).
4. **Física de Entrada (`spring` / `easeOutBack`):**
   - Ningún cartel, checklist, notificación, bocadillo o personaje entra "de golpe" ni linealmente. Todos entran con rebote elástico suave en `0.28s`.
5. **Movimiento Secundario del Entorno:**
   - Agua ondulando + burbujas subiendo; nubes deslizándose; humo/vapor saliendo de una taza; agujas de reloj girando; estrellas titilando; hojas o partículas de polvo flotando en un haz de luz volumétrica (`V14.volumetricBeam`).
6. **Transiciones con Intención Narrativa:**
   - `slide_room` (deslizamiento lateral entre 2 lugares físicos).
   - `whip_pan` (corte rápido de energía alta).
   - `iris_wipe` (foco dramático circular).
   - `curtain_open` (telón físico abriéndose para historias/experimentos).
   - `rewind_vhs` (`⏪ REBOBINANDO` para corregir un error o mito).
   - `morph_loop` (los últimos `0.40s` funden limpio hacia el Frame 0 para bucle infinito).
