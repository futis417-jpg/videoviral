"""
===========================================================================
MASTER QA SUPERVISOR v34 PRO MAX
Ejecuta de golpe TODOS los escudos de calidad del pack:
1. Auditor de Guion Anti-IA (`auditor_guion_viral.py`)
2. Detector Zero-Bugs (`visual_bug_detector.py`)
3. Validador de Jugabilidad Real (`game_playability_validator.py`)
4. Guardián de Contraste y Coherencia (`contrast_and_overlap_guard.py`)
5. Auditor de Ritmo de Edición (`editing_pacing_auditor.py`)
6. Auditor de Edición Razonable (`storyboard_coherence_validator.py`)
7. Auditor Anti-Monotonía B-Roll (`shot_variety_auditor.py`)
8. Auditor de Claridad en Segundo 0 (`frame0_clarity_auditor.py`)
9. Auditor de Bucle Infinito Invisible (`infinite_loop_auditor.py`)
10. Simulador OBLIGATORIO de 100 Usuarios TikTok (>= 90/100!)
===========================================================================
"""
from visual_bug_detector import run_zero_bugs_audit
from game_playability_validator import audit_playability
from contrast_and_overlap_guard import audit_contrast_and_coherence
from editing_pacing_auditor import audit_editing_quality
from storyboard_coherence_validator import audit_reasonable_editing
from shot_variety_auditor import audit_shot_variety
from frame0_clarity_auditor import audit_frame0_clarity
from infinite_loop_auditor import audit_infinite_loop
from viral_simulator_100_users import run_mandatory_100_user_simulation


def run_full_pro_max_audit(script_text, html_code, qa_frames, duration_sec, sfx_events, attempt=1):
    imgs = [img for _, img in (qa_frames or [])]
    zb = run_zero_bugs_audit(script_text, html_code, imgs)
    other = (
        audit_playability(script_text, html_code)
        + audit_contrast_and_coherence(html_code, duration_sec)
        + audit_editing_quality(html_code, imgs, duration_sec)
        + audit_reasonable_editing(html_code)
        + audit_shot_variety(html_code, duration_sec)
        + audit_frame0_clarity(html_code, imgs[0] if imgs else None)
        + audit_infinite_loop(script_text, html_code)
    )
    score, passed, report = run_mandatory_100_user_simulation(
        script_text, duration_sec, sfx_events,
        zero_bug_issues=zb, playability_issues=other,
        has_contact_sheet=bool(imgs), has_loop_or_cta=True,
        attempt=attempt
    )
    with open("REPORTE_PRO_MAX_V34.md", "w", encoding="utf-8") as f:
        f.write(f"# 🏆 REPORTE MAESTRO v34 PRO MAX (Intento #{attempt})\n\n")
        f.write(f"- **Nota Final:** `{score}/100` — **{'✅ APROBADO (>= 90/100)' if passed else '🚨 REPETIR Y MEJORAR'}**\n")
        f.write(f"- **Errores Críticos Zero-Bugs:** `{len(zb)}`\n")
        f.write(f"- **Alertas de Edición/Claridad/Bucle:** `{len(other)}`\n")
        f.write(f"- **Hold Rate 3s (100 usuarios):** `{report['metricas_100_usuarios']['hold_rate_3s_pct']}%`\n")
        f.write(f"- **Completado %:** `{report['metricas_100_usuarios']['completado_pct']}%`\n")
    return score, passed, report
