# 🧠 DIRECCIÓN RAZONABLE (CERO COSAS ALEATORIAS) + ANIMACIÓN REAL v28

El mayor error de las IAs al "editar más" es meter **glitches, zooms, fondos y sonidos al azar**. Eso marea y queda cutre.
Un editor profesional **NUNCA hace nada sin motivo**. Sigue estas **5 Reglas de Dirección Razonable**:

---

## 1. PLANIFICA EL BEAT SHEET ANTES DE PROGRAMAR (CADA 3–5 SEGUNDOS)
Antes de escribir el HTML, divide el guion en **6 a 12 beats lógicos** con:
- **Qué dice la voz** → **Qué acción visual exacta lo demuestra** (si habla de agua subiendo, el agua sube; si habla de un mensaje, aparece el bocadillo; **PROHIBIDO** cambiar a un parque o autopista que no tiene nada que ver).
- **Por qué se mueve la cámara (`camera_intent`):**
  - *Establecer situación* → Plano general suave (`z: 1.0 → 1.04`).
  - *Señalar un detalle clave* → **Zoom dirigido + `V28Anim.drawSpotlightFocus` + `V28Anim.drawCircleHighlight` o `V28Anim.drawCurvedArrow`** apuntando justo a ese detalle.
  - *Golpe / Mito / Error* → `V27Edit.slamIn` + micro-shake + `myth_buzzer.wav` (máximo 2–3 veces en todo el vídeo para que impacte de verdad).
  - *Cambio de lugar o capítulo* → `V27Edit.whipPanTransition` o `V27Edit.zoomThroughTransition` + `whoosh_zoom.wav`.
  - *Mismo lugar, siguiente idea* → **Corte limpio o reencuadre**, NO whip-pan gratuito.

## 2. ANIMACIÓN REAL DE ESTUDIO (`motor_escenas_v28/disney_motion_engine.js` → `V28Anim`)
- **Física real, nunca lineal:** Todo movimiento de entrada usa `V28Anim.spring(localT)` y todo salto usa `V28Anim.anticipationJump` (se agacha antes de saltar y se aplasta al caer).
- **Personajes vivos que actúan lo que dice la voz (`V28Anim.drawExpressiveCharacter`):**
  - Cambia la **emoción** en cada frase (`neutral` → `thinking` → `shocked` → `smug` → `happy`).
  - Dirige las pupilas (`lookAtX, lookAtY`) **hacia el objeto o dato del que están hablando**.
  - Cambia el **gesto de manos** (`point_up` al dar un dato, `chin_think` al preguntar, `hands_up` al celebrar o sorprenderse).
- **Infografías que se dibujan vivas:** Usa `V28Anim.drawCurvedArrow`, `V28Anim.drawCircleHighlight` y `V28Anim.drawAnimatedBarChart` en lugar de poner textos estáticos.
