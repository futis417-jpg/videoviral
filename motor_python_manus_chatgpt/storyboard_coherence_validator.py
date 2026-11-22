"""
===========================================================================
VALIDADOR DE EDICIÓN RAZONABLE Y ANTI-ALEATORIEDAD v28 DIRECTOR PRO
Asegura que el vídeo NO mete efectos, transiciones ni fondos "porque sí":
1. Verifica que NO haya spam de efectos de choque (chromaticImpact / speedLines).
2. Verifica que se usen animaciones con intención (`V28Anim`, `V27Edit`, `V25Director`).
3. Valida el Beat Sheet (`storyboard_v28.json` si existe) para comprobar que
   cada escena tiene una `visual_reason` y `camera_intent` claras.
===========================================================================
"""
import json
import os


def audit_reasonable_editing(html_code, storyboard_path="storyboard_v28.json"):
    issues = []
    low = html_code.lower()

    # 1. Bloquear spam de efectos agresivos (usarlos con cabeza, no en cada segundo!)
    chroma_calls = low.count("chromaticimpact(")
    speed_calls = low.count("drawspeedlines(")
    if chroma_calls > 4:
        issues.append(f"❌ ABUSO DE GLITCH RGB ({chroma_calls} llamadas): Úsalo solo en 1-3 impactos clave, no aleatoriamente.")
    if speed_calls > 4:
        issues.append(f"❌ ABUSO DE SPEED LINES ({speed_calls} llamadas): Úsalas solo en picos de acción real.")

    # 2. Comprobar que usa física/animación avanzada (V28Anim o V18/V14/V16)
    has_rich_anim = any(k in low for k in ["v28anim", "drawexpressivecharacter", "drawcurvedarrow", "drawcirclehighlight", "drawspotlightfocus", "anticipationjump", "v18.ink"])
    if not has_rich_anim:
        issues.append("⚠️ FALTA ANIMACIÓN AVANZADA V28: Usa `V28Anim` (expresiones, flechas curvas, círculos highlight, spotlight focus, squash & stretch).")

    # 3. Validar Storyboard Beat Sheet si existe
    if os.path.exists(storyboard_path):
        try:
            with open(storyboard_path, "r", encoding="utf-8") as f:
                sb = json.load(f)
            beats = sb.get("beats", [])
            if len(beats) < 4:
                issues.append("⚠️ STORYBOARD POBRE: Define al menos 5-8 beats narrativos con `visual_reason` y `camera_intent`.")
            for i, b in enumerate(beats):
                if not b.get("visual_reason") or not b.get("camera_intent"):
                    issues.append(f"❌ BEAT #{i+1} SIN INTENCIÓN: Cada plano debe explicar POR QUÉ se muestra y qué hace la cámara.")
                    break
        except Exception as e:
            issues.append(f"⚠️ Error leyendo storyboard_v28.json: {e}")

    if issues:
        print("🎯 AUDITOR DE EDICIÓN RAZONABLE v28 DETECTÓ PROBLEMAS:")
        for iss in issues:
            print("  ", iss)
    else:
        print("✅ AUDITOR DE EDICIÓN RAZONABLE v28: Cero efectos aleatorios; animación y dirección con intención verificadas.")
    return issues
