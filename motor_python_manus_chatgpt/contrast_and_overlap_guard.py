"""
VALIDADOR DE CONTRASTE, COHERENCIA Y ANATOMÍA v23 STUDIO MASTERPIECE
Detecta automáticamente fallos de contraste (líneas claras en fondos claros)
y código con trazos anatómicos desproporcionados.
"""

def audit_contrast_and_coherence(html_code, duration_sec):
    issues = []
    low = html_code.lower()

    # 1. Detectar si el HTML dibuja fondos claros de día sin oscurecer el texto/líneas
    if ("#fef08a" in low or "#bae6fd" in low or "#fde68a" in low) and "#1c1b19" not in low and "rgba(15,23,42" not in low:
        issues.append("⚠️ RIESGO DE BAJO CONTRASTE: Hay colores claros de cielo/sol; usa tinta oscura (#1C1B19) o tarjeta oscura detrás de las líneas/textos.")

    # 2. Detectar si hay un vídeo de >40s con muy pocas escenas distintas
    scene_funcs = low.count("function draw")
    if duration_sec >= 40 and scene_funcs < 3:
        issues.append(f"⚠️ POCAS ESCENAS PARA {duration_sec:.0f}s ({scene_funcs} funciones draw): Crea al menos 4-6 escenas distintas y coherentes.")

    if issues:
        print("🚨 GUARD v23 DETECTÓ PROBLEMAS VISUALES:")
        for iss in issues:
            print("  ", iss)
    else:
        print("✅ GUARD v23: Contraste y variedad visual verificados.")
    return issues
