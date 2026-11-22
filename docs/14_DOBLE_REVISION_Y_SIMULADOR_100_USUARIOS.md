# 🧪 DOBLE REVISIÓN OBLIGATORIA + SIMULADOR DE 100 USUARIOS TIKTOK (>= 90/100)

En **v19 APEX**, **NUNCA** se entrega un vídeo a la primera sin pasar el **Doble Filtro de Viralidad**:

## REVISIÓN 1 — OJO DE DIRECTOR (TÉCNICA Y VISUAL)
1. **Contact Sheet 3×3 (`qa_contact_sheet.png`):** Comprueba que cero puertas flotan, cero ventanas salen en el cielo, cero texto está tapado y cero escenas parecen PowerPoint.
2. **Densidad de SFX (`sfx_choreographer.py`):** Mínimo **1 SFX cada 2.5–3.5 segundos** (12 a 25+ sonidos reales de `recursos/sfx/` en un vídeo de 50s).
3. **Auditor de Guion (`auditor_guion_viral.py`):** 0% clichés de IA, 0% libro de texto, ritmo percusivo y datos reales.

## REVISIÓN 2 — SIMULACIÓN DE 100 USUARIOS REALISTAS DE TIKTOK (`viral_simulator_100_users.py`)
Evalúa tu vídeo como si lo vieran **100 usuarios reales haciendo scroll rápido** y mide:
- **¿En qué segundo deslizan?** (0–3s, 3–15s o 15s–fin).
- **Hold Rate 3s**, **Completado**, **Likes**, **Comentarios** y **Compartidos**.
- **REGLA INQUEBRANTABLE:** Si la puntuación es **< 90/100**, **DEBES EDITAR** el punto débil (reforzar el hook de 0–3s, meter más SFX y cambios de plano, añadir un re-hook en el segundo 8 o mejorar el remate final) y **VOLVER A PASAR LA PRUEBA** hasta alcanzar **`>= 90/100`**.
