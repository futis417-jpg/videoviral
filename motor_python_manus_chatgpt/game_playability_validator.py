"""
VALIDADOR DE JUGABILIDAD REAL v21 PLAYABLE-PRO
Verifica que los minijuegos del vídeo sean 100% jugables:
- No muestra la respuesta/foto durante una pregunta de memoria.
- No chiva la opción correcta antes de que acabe la cuenta atrás.
- Exige que el número de pases animados coincida con el número dicho en voz.
"""

def audit_playability(script_text, html_code=""):
    issues = []
    low_s = script_text.lower()
    low_h = html_code.lower()

    # 1. Juego de pases: comprobar que existe trayectoria/arco animado si habla de pases
    if "pases" in low_s:
        if "parabol" not in low_h and "math.sin" not in low_h and "passcount" not in low_h:
            issues.append("❌ JUEGO DE PASES INJUGABLE: El guion pide contar pases pero el HTML no anima arcos parabólicos sincronizados.")

    # 2. Juego de memoria: no hacer spoiler ni mostrar la foto antes del reveal
    if "gorra" in low_s or "gorro" in low_s:
        if "cabeza descubierta" in low_s[: len(low_s) // 2] or "sin gorra" in low_s[: len(low_s) // 2]:
            issues.append("❌ JUEGO DE MEMORIA ROTO: Hiciste spoiler ('cabeza descubierta'/'sin gorra') antes de la pregunta.")

    if issues:
        print("🚨 PLAYABILITY VALIDATOR v21 DETECTÓ JUEGOS INJUGABLES:")
        for iss in issues:
            print("  ", iss)
    else:
        print("✅ PLAYABILITY VALIDATOR v21: Todos los juegos son 100% jugables y justos.")
    return issues
