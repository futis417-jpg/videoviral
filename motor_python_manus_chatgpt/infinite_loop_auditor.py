"""
===========================================================================
AUDITOR DE BUCLE INFINITO INVISIBLE — v33 INFINITE-LOOP APEX
Verifica que el vídeo está diseñado para repetirse SIN QUE EL ESPECTADOR
SE DÉ CUENTA (disparando el Rewatch Rate > 125% en TikTok/Reels/Shorts):
1. Comprueba puente gramatical de bucle al final del guion (o conector limpio).
2. Comprueba que el HTML llama a `V33.Loop.applySeamlessLoopEnd` (match-cut
   hacia el Frame 0 en los últimos 0.45s).
===========================================================================
"""


LOOP_BRIDGE_ENDINGS = [
    "por eso", "y por eso", "así que", "porque", "ahora sabes",
    "por eso mismo", "y justo por eso", "ya sabes", "si alguna vez",
    "cuando", "mientras", "entonces"
]


def audit_infinite_loop(script_text, html_code=""):
    issues = []
    low_s = script_text.strip().lower()
    tail = low_s[-75:] if len(low_s) > 75 else low_s

    has_verbal_bridge = any(b in tail for b in LOOP_BRIDGE_ENDINGS) or tail.endswith("...") or tail.endswith(",")
    if not has_verbal_bridge:
        issues.append("⚠️ BUCLE VERBAL MEJORABLE: Termina el guion con un puente directo hacia la frase 1 (ej. '...y por eso mismo,' -> 'si tu coche cae al agua...') para que se repita sin que se note!")

    low_h = html_code.lower()
    if "applyseamlessloopend" not in low_h and "drawloopbridgefade" not in low_h:
        issues.append("⚠️ FALTA MATCH-CUT DE BUCLE VISUAL: Llama a `V33.Loop.applySeamlessLoopEnd(ctx, t, data.duration, drawFrame0)` en los últimos 0.45s.")

    if issues:
        print("♾️ AUDITOR DE BUCLE INFINITO v33:")
        for iss in issues:
            print("  ", iss)
    else:
        print("✅ AUDITOR DE BUCLE INFINITO v33: Puente verbal + Match-Cut visual al Frame 0 verificados.")
    return issues
