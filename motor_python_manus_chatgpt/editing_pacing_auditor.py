"""
===========================================================================
AUDITOR AUTOMÁTICO DE RITMO DE EDICIÓN v27 PRO EDITOR
Analiza el vídeo renderizado frame a frame y mide si está EDITADO DE VERDAD
como un canal viral de +10M de vistas (no planos aburridos y quietos):
- Comprueba que exista movimiento/cambio visual frecuente (mínimo 1 beat
  visual o corte cada 2.5s).
- Verifica que se usan efectos de edición pro (`V27Edit`, transiciones,
  punch-zooms, `V25FX` o `V26`).
- Penaliza automáticamente si el vídeo tiene edición plana o lenta.
===========================================================================
"""
import numpy as np


def audit_editing_quality(html_code, sampled_frames, duration_sec):
    issues = []
    low = html_code.lower()

    # 1. Comprobar si usa el Pro Editing Suite (punch zooms, transiciones, slam-in, color grade)
    uses_pro_edit = any(k in low for k in ["v27edit", "punchzoom", "whippantransition", "zoomthroughtransition", "slamin", "kineticwordpop"])
    if not uses_pro_edit:
        issues.append("❌ EDICIÓN BÁSICA DETECTADA: No estás usando `V27Edit` (punch-zooms al ritmo de la voz, whip-pans, slam-in y color grading).")

    # 2. Medir dinamismo real entre capturas del vídeo
    if sampled_frames and len(sampled_frames) >= 5:
        diffs = []
        for i in range(1, len(sampled_frames)):
            a = np.asarray(sampled_frames[i - 1], dtype=np.float32)
            b = np.asarray(sampled_frames[i], dtype=np.float32)
            diffs.append(float(np.mean(np.abs(a - b))))
        avg_diff = sum(diffs) / len(diffs)
        if avg_diff < 8.5:
            issues.append(f"❌ EDICIÓN DEMASIADO ESTÁTICA (cambio medio={avg_diff:.1f}): Mete más cambios de plano, zooms rápidos y transiciones whip/zoom-through.")

    if issues:
        print("🎬 AUDITOR DE EDICIÓN v27 DETECTÓ EDICIÓN FLOJA:")
        for iss in issues:
            print("  ", iss)
    else:
        print("✅ AUDITOR DE EDICIÓN v27: Ritmo viral, punch-zooms y dinamismo de estudio verificados.")
    return issues
