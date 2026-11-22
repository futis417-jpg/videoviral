"""
===========================================================================
HYBRID AI-ART SCENE GENERATOR v24 TITAN (0€ VIA POLLINATIONS FLUX)
Por qué los vídeos hechos solo con `ctx.arc()` y `ctx.roundRect()` quedan
básicos: porque programar una habitación entera o una vaca en acuarela a
mano con Canvas es limitado.

ESTE MÓDULO GENERA FONDOS E ILUSTRACIONES 2D DE CALIDAD DE ESTUDIO (1080x1920)
con estilo 100% consistente (Style-Lock) gratis a 0€, para luego animarlos
con cámara Keyframe, parallax, HUDs, subrayados rojos, SFX y subtítulos pro!
Si no hay internet, cae suavemente al Scene Graph vectorial (`scene_graph_engine.js`).
===========================================================================
"""

import os
import urllib.parse
import urllib.request

STYLE_LOCKS = {
    "piensaque_flat": (
        "clean 2D flat vector editorial illustration, bold uniform 6px dark ink outlines, "
        "warm vibrant cel-shaded colors, cozy detailed background, Kurzgesagt meets modern Spanish "
        "TikTok explainer animation style, NO text, NO letters, NO watermark, vertical 9:16 composition"
    ),
    "abismo_xray": (
        "sleek dark blue technical cutaway X-ray 2D illustration, glowing cyan blueprint outlines, "
        "dramatic underwater or engineering lighting, clean modern infographic art, NO text, NO numbers, vertical 9:16"
    ),
    "docu_cinema": (
        "cinematic 2D graphic novel illustration, rich painterly lighting, dramatic sky and atmosphere, "
        "detailed environment, documentary film still aesthetic, NO text, NO watermark, vertical 9:16"
    ),
    "neon_synthwave": (
        "vibrant 2D synthwave neon illustration, purple magenta and cyan glow, 2.5D perspective road or skyline, "
        "clean crisp vector edges, gaming aesthetic, NO text, NO HUD, vertical 9:16"
    ),
    "ink_watercolor": (
        "hand-drawn editorial black ink and soft watercolor illustration on warm cream textured paper #F3EEE3, "
        "minimalist charming French book illustration style, subtle red ink accent, NO text, vertical 9:16"
    ),
    "storytime_comic": (
        "clean cozy 2D webcomic animation background, warm lamp light, detailed room or night street, "
        "consistent dark outline, expressive atmospheric colors, NO text, NO speech bubbles, vertical 9:16"
    ),
}


def generate_scene_plate_free(prompt_es_or_en, style_key="piensaque_flat", out_path="scene_plate_01.jpg", seed=42):
    """Descarga una ilustración 2D 1080x1920 de estudio gratis (0€) vía Pollinations Flux."""
    style_suffix = STYLE_LOCKS.get(style_key, STYLE_LOCKS["piensaque_flat"])
    full_prompt = f"{prompt_es_or_en}, {style_suffix}"
    encoded = urllib.parse.quote(full_prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1080&height=1920&nologo=true&seed={seed}&model=flux"

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 v24-Titan-Studio"})
    try:
        with urllib.request.urlopen(req, timeout=45) as resp, open(out_path, "wb") as f:
            f.write(resp.read())
        if os.path.getsize(out_path) > 15_000:
            print(f"🎨 Ilustración 2D de estudio generada (0€): {out_path}")
            return out_path
    except Exception as e:
        print(f"⚠️ No se pudo descargar ilustración remota ({e}). Se usará Scene Graph vectorial local.")
    return None


def generate_all_scene_plates(scene_prompts, style_key="piensaque_flat", out_dir="scene_plates"):
    """Genera todas las láminas de escenas del vídeo con estilo bloqueado (mismo seed base)."""
    os.makedirs(out_dir, exist_ok=True)
    paths = []
    for i, sp in enumerate(scene_prompts):
        out = os.path.join(out_dir, f"plate_{i:02d}.jpg")
        res = generate_scene_plate_free(sp, style_key=style_key, out_path=out, seed=100 + i)
        paths.append(res)
    return paths
