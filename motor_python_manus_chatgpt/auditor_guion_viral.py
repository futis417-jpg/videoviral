"""
AUDITOR AUTOMÁTICO DE GUIONES VIRALES v17 PRO CINEMA
Bloquea guiones con olor a IA Y también guiones sosos de libro de texto/biología
que no tienen historia, ni datos impactantes, ni giro real.
"""
import re

BANNED_AI_AND_TEXTBOOK = [
    "alguna vez te has preguntado",
    "es fascinante",
    "sumérgete",
    "descubre el secreto",
    "en este vídeo descubriremos",
    "en este video descubriremos",
    "en resumen",
    "en conclusión",
    "cabe destacar",
    "es importante mencionar",
    "hola amigos",
    "bienvenidos a",
    "dale like y sígueme",
    "sin embargo",
    "por lo tanto",
    "asimismo",
    "tronco cerebral",
    "proteger y humedecer",
    "coordina el reflejo",
    "a voluntad",
    "se contraen",
    "se dilatan",
    "puedes intervenir",
]

NUMBER_WORDS = [
    "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
    "once", "doce", "quince", "veinte", "treinta", "cuarenta", "cincuenta",
    "sesenta", "setenta", "ochenta", "noventa", "cien", "cientos", "mil", "millón", "millones"
]

def audit_script(text, target_duration=50):
    low = text.lower()
    issues = []
    score = 100

    found = [p for p in BANNED_AI_AND_TEXTBOOK if p in low]
    if found:
        score -= 22 * len(found)
        issues.append(f"❌ CLICHÉS DE IA / LIBRO DE TEXTO DETECTADOS: {found}")

    raw_nums = re.findall(r"\b\d+[\d.,%]*\b", text)
    if raw_nums:
        score -= 10
        issues.append(f"⚠️ Números en dígitos (escríbelos en letras): {raw_nums[:6]}")

    has_concrete_data = any(re.search(rf"\b{w}\b", low) for w in NUMBER_WORDS)
    if not has_concrete_data:
        score -= 15
        issues.append("⚠️ FALTA DATO CONCRETO: Mete al menos 1 cifra, año o estadística real en letras.")

    sentences = [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]
    avg_words = sum(len(s.split()) for s in sentences) / max(1, len(sentences))
    if avg_words > 14.5:
        score -= 15
        issues.append(f"⚠️ Frases muy largas (media {avg_words:.1f} palabras). Intercala golpes cortos de 2-5 palabras.")

    total_words = len(text.split())
    est_sec = total_words / 2.65
    if total_words < 90 and target_duration >= 45:
        score -= 15
        issues.append(f"⚠️ Guion demasiado corto ({total_words} palabras ≈ {est_sec:.1f}s). Desarrolla un giro o historia real.")

    score = max(0, score)
    print(f"📊 AUDITORÍA v17 — Puntuación Viral: {score}/100 ({total_words} palabras ≈ {est_sec:.1f}s)")
    for iss in issues:
        print("  ", iss)
    if score >= 85 and not found:
        print("✅ GUION APROBADO v17 PRO CINEMA (0% olor a IA / 0% libro de texto).")
    return score, issues
