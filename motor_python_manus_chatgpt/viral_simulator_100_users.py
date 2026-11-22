"""
===========================================================================
SIMULADOR OBLIGATORIO DE 100 USUARIOS REALISTAS DE TIKTOK v22 ULTRA-DETAIL
- Ejecuta Revisión 1 (Director / QA Técnico + Zero-Bugs + Jugabilidad)
- Ejecuta Revisión 2 (100 Usuarios Realistas de TikTok con 4 arquetipos:
  Impacientes, Curiosos, Escépticos y Fans de Retos)
- GUARDA AUTOMÁTICAMENTE `reporte_100_usuarios.md` y `reporte_100_usuarios.json`
  con TODAS LAS NOTAS (Nota Final /100, Nota Hook, Nota Ritmo, Nota Visual,
  Nota Cierre, Hold Rate 3s, Retención, Likes, Comentarios, Guardados,
  Compartidos y Feedback de los usuarios) para enseñárselo SIEMPRE al usuario!
- SI SACA < 90/100: devuelve `passed=False` y obliga a editar y re-ejecutar!
===========================================================================
"""
import json
import random
from auditor_guion_viral import audit_script


def run_mandatory_100_user_simulation(
    script_text,
    duration_sec,
    sfx_events,
    zero_bug_issues=None,
    playability_issues=None,
    has_contact_sheet=True,
    has_loop_or_cta=True,
    attempt=1,
):
    zero_bug_issues = zero_bug_issues or []
    playability_issues = playability_issues or []

    print("\n" + "=" * 70)
    print(f"🧪 SIMULADOR OBLIGATORIO DE 100 USUARIOS TIKTOK — INTENTO #{attempt}")
    print("=" * 70)

    # 1. Auditoría de Guion + Técnica
    script_score, script_issues = audit_script(script_text, int(duration_sec))
    sfx_count = len(sfx_events)
    sfx_density = sfx_count / max(1.0, duration_sec)

    tech_issues = list(zero_bug_issues) + list(playability_issues)
    if sfx_count < max(5, int(duration_sec / 4.2)):
        tech_issues.append(f"Pocos SFX ({sfx_count} en {duration_sec:.0f}s). Sube densidad con sfx_choreographer.py.")
    if not has_contact_sheet:
        tech_issues.append("Falta qa_contact_sheet.png (QA Visual 3x3).")

    # Notas desglosadas sobre 100
    nota_guion = script_score
    nota_sonido = min(100, int(60 + min(40, sfx_density * 140)))
    nota_visual = max(30, 100 - 25 * len(zero_bug_issues) - 25 * len(playability_issues) - (0 if has_contact_sheet else 20))
    nota_cierre = 96 if has_loop_or_cta else 68

    # 2. Simulación de 100 Usuarios Realistas (4 Arquetipos)
    rng = random.Random(len(script_text) * 13 + sfx_count * 7 + attempt)
    archetypes = [
        ("Impaciente (Scroll rápido)", 30, 0.25),
        ("Curioso promedio",           35, 0.58),
        ("Escéptico exigente",         20, 0.42),
        ("Fan de retos/datos",         15, 0.85),
    ]

    hook_q = min(1.0, (nota_guion / 100.0) * (nota_visual / 100.0))
    pace_q = min(1.0, (nota_sonido / 100.0) * 0.5 + (nota_guion / 100.0) * 0.5)
    end_q = nota_cierre / 100.0

    hold_3s = watched_15s = completed = likes = comments = saves = shares = 0
    drops = {"0-3s": 0, "3-15s": 0, "15s-fin": 0}
    archetype_stats = {}

    for name, count, base_pat in archetypes:
        a_comp = 0
        for _ in range(count):
            pat = min(0.98, max(0.05, base_pat + rng.uniform(-0.12, 0.12)))
            if rng.random() > (hook_q * 0.88 + 0.11 * pat):
                drops["0-3s"] += 1
                continue
            hold_3s += 1

            if rng.random() > (pace_q * 0.85 + 0.14 * pat):
                drops["3-15s"] += 1
                continue
            watched_15s += 1

            if rng.random() > (end_q * 0.84 + 0.15 * pat):
                drops["15s-fin"] += 1
                continue
            completed += 1
            a_comp += 1

            if rng.random() < (0.36 * hook_q * end_q): likes += 1
            if rng.random() < (0.11 * end_q): comments += 1
            if rng.random() < (0.18 * hook_q * end_q): saves += 1
            if rng.random() < (0.15 * hook_q * end_q): shares += 1
        archetype_stats[name] = f"{a_comp}/{count} completaron"

    # Penalización directa si hay bugs visuales o de jugabilidad
    bug_penalty = 18 * (len(zero_bug_issues) + len(playability_issues))
    viral_score = int(round(
        0.28 * nota_guion +
        0.22 * hold_3s +
        0.20 * min(100, completed * 1.35) +
        0.15 * nota_visual +
        0.15 * min(100, (likes + comments * 3 + saves * 2 + shares * 3) * 1.35)
    )) - bug_penalty
    viral_score = max(0, min(100, viral_score))
    passed = (viral_score >= 90) and (len(zero_bug_issues) == 0) and (len(playability_issues) == 0)

    report = {
        "attempt": attempt,
        "viral_score": viral_score,
        "passed": passed,
        "notas": {
            "guion_anti_ia": nota_guion,
            "visual_y_detalle": nota_visual,
            "sonido_y_sfx": nota_sonido,
            "cierre_y_bucle": nota_cierre,
        },
        "metricas_100_usuarios": {
            "hold_rate_3s_pct": hold_3s,
            "retencion_15s_pct": watched_15s,
            "completado_pct": completed,
            "likes": likes,
            "comentarios": comments,
            "guardados": saves,
            "compartidos": shares,
            "abandonos": drops,
            "por_arquetipo": archetype_stats,
        },
        "fallos_detectados": script_issues + tech_issues,
    }

    with open("reporte_100_usuarios.json", "w", encoding="utf-8") as jf:
        json.dump(report, jf, indent=2, ensure_ascii=False)

    md = f"""# 📊 REPORTE OBLIGATORIO — SIMULADOR 100 USUARIOS TIKTOK (Intento #{attempt})

## 🏆 NOTA FINAL DE VIRALIDAD: **{viral_score}/100** — {"✅ APROBADO (>= 90/100)" if passed else "🚨 SUSPENSO (< 90/100 — EDITAR Y REPETIR)"}

### 📈 Desglose de Notas
- **Guion Anti-IA y Ritmo:** {nota_guion}/100
- **Detalle Visual y Jugabilidad:** {nota_visual}/100
- **Audio, BGM y SFX ({sfx_count} efectos):** {nota_sonido}/100
- **Cierre / CTA / Bucle:** {nota_cierre}/100

### 📱 Resultados en 100 Usuarios Realistas de TikTok
- **Hold Rate (3s):** {hold_3s}%
- **Retención (15s):** {watched_15s}%
- **Completado hasta el final:** {completed}%
- **Interacciones:** ❤️ {likes} Likes | 💬 {comments} Comentarios | 🔖 {saves} Guardados | 🔁 {shares} Compartidos
- **Dónde dejaron de ver:** 0–3s: `{drops['0-3s']}` | 3–15s: `{drops['3-15s']}` | 15s–fin: `{drops['15s-fin']}`

### 👥 Comportamiento por Tipo de Usuario
""" + "\n".join(f"- **{k}:** {v}" for k, v in archetype_stats.items()) + "\n"

    if report["fallos_detectados"]:
        md += "\n### 🚨 Qué hay que mejorar antes de entregar\n" + "\n".join(f"- {x}" for x in report["fallos_detectados"]) + "\n"

    with open("reporte_100_usuarios.md", "w", encoding="utf-8") as mf:
        mf.write(md)

    print(md)
    return viral_score, passed, report
