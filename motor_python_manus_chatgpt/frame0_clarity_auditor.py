"""
===========================================================================
AUDITOR DE CLARIDAD EN EL SEGUNDO 0 — v32 INSTANT-HOOK UNIVERSE
Verifica que el vídeo NO empieza en negro ni con una intro lenta y que
el tema + gancho visual están claros desde t = 0.00s!
===========================================================================
"""
import numpy as np


def audit_frame0_clarity(html_code, first_frame_pil=None):
    issues = []
    low = html_code.lower()

    has_f0_hook = any(k in low for k in [
        "v32.frame0", "drawinstanttopiccoldopen", "drawvssplithook",
        "drawsecretfilehook", "drawhookbanner", "drawfullkineticslide"
    ])
    if not has_f0_hook:
        issues.append("❌ FALTA GANCHO VISUAL EN SEGUNDO 0: Usa `V32.Frame0.drawInstantTopicColdOpen` (o `drawVsSplitHook` / `drawSecretFileHook`) para que el tema se entienda en t=0.0s.")

    if first_frame_pil is not None:
        arr = np.asarray(first_frame_pil, dtype=np.float32)
        if float(np.mean(arr)) < 10.0:
            issues.append("❌ FRAME 0 EN NEGRO: Prohibido empezar en negro; el vídeo debe abrir con acción y titular claro desde el primer fotograma.")

    if issues:
        print("🎯 AUDITOR SEGUNDO 0 v32 DETECTÓ PROBLEMAS:")
        for iss in issues:
            print("  ", iss)
    else:
        print("✅ AUDITOR SEGUNDO 0 v32: Claridad instantánea en t=0.00s verificada.")
    return issues
