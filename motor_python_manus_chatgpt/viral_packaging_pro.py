"""
===========================================================================
VIRAL PACKAGING & HASHTAGS PRO GENERATOR — v34 PRO MAX
Genera automáticamente para TikTok / Reels / YouTube Shorts:
- 3 Ganchos de Portada (Frame 0)
- Descripción optimizada para SEO en TikTok/Shorts
- Stack exacto de 6 Hashtags (2 amplios + 2 de nicho + 2 de formato)
- Comentario fijado (Comment Bait) para disparar respuestas y algoritmo!
===========================================================================
"""
import json

NICHE_HASHTAGS = {
    "psicologia":   ["#psicologia", "#curiosidades", "#mente", "#sabiasque", "#viral", "#parati"],
    "supervivencia":["#supervivencia", "#datocurioso", "#seguridad", "#sabiasque", "#viral", "#fyp"],
    "dinero":       ["#marketing", "#psicologiadeventas", "#negocios", "#dinero", "#viral", "#parati"],
    "gaming":       ["#gaming", "#videojuegos", "#curiosidadesgaming", "#datos", "#viral", "#fyp"],
    "historia":     ["#historia", "#historiasreales", "#documental", "#datos", "#viral", "#parati"],
    "ciencia":      ["#ciencia", "#curiosidades", "#fisica", "#sabiasque", "#viral", "#fyp"],
}


def build_viral_package(topic, niche="curiosidades", hook_line="", out_path="viral_package_v34.json"):
    tags = NICHE_HASHTAGS.get(niche.lower(), ["#curiosidades", "#sabiasque", "#datos", "#animacion2d", "#viral", "#parati"])
    pkg = {
        "topic": topic,
        "frame0_cover_title": (hook_line or topic).upper()[:42],
        "tiktok_description": f"{hook_line or topic} 👀 ¿Tú también habías caído en esto? Te leo abajo 👇 {' '.join(tags)}",
        "hashtags": tags,
        "pinned_comment_bait": "Sé sincero: ¿en qué segundo te diste cuenta del giro? 👇",
        "posting_checklist": [
            "Subir en 1080x1920 a 30fps (CRF 15 H.264 High Profile).",
            "Añadir portada Frame 0 con texto grande legible sin sonido.",
            "Publicar comentario fijado en los primeros 60 segundos.",
            "Responder a los primeros 5 comentarios con preguntas cortas."
        ]
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(pkg, f, indent=2, ensure_ascii=False)
    print(f"📦 VIRAL PACKAGING v34 guardado en {out_path} | Hashtags: {' '.join(tags)}")
    return pkg
