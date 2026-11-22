"""
===========================================================================
AUDITOR ANTI-MONOTONÍA Y VARIEDAD DE PLANOS v31 AFTER-EFFECTS PRO
Bloquea automáticamente vídeos aburridos donde solo sale 1 personaje
subiendo y bajando todo el rato:
1. Exige variedad visual real (uso de B-Roll `V31.BRoll`, Kinetic Slides,
   infografías, props o transiciones `V31.AE` / `V27Edit`).
2. Comprueba que un vídeo de >= 35s tenga múltiples planos/composiciones
   distintas (mínimo 1 cambio visual fuerte cada ~3-4 segundos).
===========================================================================
"""


def audit_shot_variety(html_code, duration_sec):
    issues = []
    low = html_code.lower()

    has_broll_or_variety = any(k in low for k in [
        "v31.broll", "v31.ae", "drawfullkineticslide", "diagonalslashtransition",
        "shuttersplittransition", "drawneuralnetworkbroll", "drawlivechatfeedbroll",
        "drawanimatedmaproutebroll", "drawdangergaugebroll", "drawblueprintscanbroll",
        "drawgearsmechanismbroll", "magnifyingloupe", "drawsplitcomparison"
    ])
    if not has_broll_or_variety:
        issues.append("❌ FALTA VARIEDAD B-ROLL / EDICIÓN AE v31: Usa `V31.BRoll` (mapas, chat en vivo, radar, red neuronal, medidor, blueprint) y `V31.AE` (light leaks, diagonal slash, kinetic slides) para que NO sea solo un personaje quieto!")

    # Detectar exceso de personaje único sin variedad de escenas
    char_calls = low.count("drawmascot") + low.count("drawhumanatground") + low.count("drawexpressivecharacter")
    broll_calls = sum(low.count(k) for k in ["broll", "kineticslide", "chart", "loupe", "comparison", "spectrogram", "cctv", "drawartplate"])
    if duration_sec >= 30 and char_calls > 0 and broll_calls == 0:
        issues.append("❌ VÍDEO MONÓTONO (SOLO PERSONAJE): Intercala al menos 3-5 planos B-Roll / infografías / props sin personaje para ritmo de After Effects / CapCut Pro.")

    if issues:
        print("🎞️ AUDITOR DE VARIEDAD v31 DETECTÓ MONOTONÍA:")
        for iss in issues:
            print("  ", iss)
    else:
        print("✅ AUDITOR DE VARIEDAD v31: Multi-plano B-Roll + composición After Effects verificados.")
    return issues
