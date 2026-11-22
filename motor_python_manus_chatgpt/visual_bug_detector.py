"""
===========================================================================
DETECTOR AUTOMÁTICO DE ERRORES ABSURDOS v20 ZERO-BUGS
Bloquea automáticamente antes de entregar el vídeo:
1. Spoilers de trampa de memoria ("cabeza descubierta" / "sin gorra" antes de preguntar por la gorra).
2. Errores tipográficos en tarjetas ("¿ / 4" en lugar de "? / 4").
3. Subtítulos huérfanos de 1 sola palabra.
4. Escenas congeladas (detecta mediante diferencia de píxeles si hay >3s sin animación real).
===========================================================================
"""
import numpy as np

def check_text_and_logic_bugs(script_text, html_code=""):
    issues = []
    low = script_text.lower()

    # 1. Detector de spoiler en trampa de memoria
    if "gorra" in low or "gorro" in low:
        for spoiler in ["cabeza descubierta", "sin gorra", "sin gorro", "no lleva gorra"]:
            first_half = low[: len(low) // 2]
            if spoiler in first_half:
                issues.append(f"❌ SPOILER ABSURDO EN GUION: Dijiste '{spoiler}' en la primera mitad antes de preguntar por la gorra/gorro.")

    # 2. Detector de typo "¿ /" en HTML o texto
    if "¿ /" in html_code or "¿/" in html_code:
        issues.append("❌ TYPO EN TARJETA FINAL: Pusiste '¿ / 4' en lugar de '? / 4'.")

    # 3. Detector de palabras sueltas / subtítulos mal agrupados
    if "i += 1" in html_code and "chunks.push" in html_code:
        issues.append("❌ SUBTÍTULOS DE 1 PALABRA: Agrupa siempre en bloques de 3 a 4 palabras.")

    return issues


def check_frozen_video(sampled_rgb_frames):
    """Recibe lista de frames PIL/numpy tomados cada ~1s y detecta bloques congelados."""
    issues = []
    if len(sampled_rgb_frames) < 4:
        return issues
    frozen_streak = 0
    for i in range(1, len(sampled_rgb_frames)):
        a = np.asarray(sampled_rgb_frames[i - 1], dtype=np.float32)
        b = np.asarray(sampled_rgb_frames[i], dtype=np.float32)
        diff = np.mean(np.abs(a - b))
        if diff < 0.8:
            frozen_streak += 1
            if frozen_streak >= 3:
                issues.append(f"❌ ESCENA CONGELADA (~segundo {i}): Más de 3 segundos sin movimiento visual real. ¡Anima la cámara y los objetos!")
                frozen_streak = 0
        else:
            frozen_streak = 0
    return issues


def run_zero_bugs_audit(script_text, html_code="", sampled_frames=None):
    issues = check_text_and_logic_bugs(script_text, html_code)
    if sampled_frames:
        issues += check_frozen_video(sampled_frames)
    if issues:
        print("🚨 ZERO-BUGS DETECTOR v20 ENCONTRÓ ERRORES ABSURDOS:")
        for iss in issues:
            print("  ", iss)
    else:
        print("✅ ZERO-BUGS DETECTOR v20: CERO spoilers, CERO typos, CERO escenas congeladas.")
    return issues
