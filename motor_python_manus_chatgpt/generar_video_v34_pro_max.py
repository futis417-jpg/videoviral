"""
===========================================================================
MOTOR v34 PRO MAX (1080x1920, 30fps)
- Voz Prioritaria:
  1. HeyGen Voice TTS (`HEYGEN_API_KEY`, SOLO VOZ, cero avatares, WAV 44.1kHz!)
  2. ElevenLabs (`ELEVENLABS_API_KEY`, opcional)
  3. Edge-TTS 1-Pasada (0€, `pitch=+0Hz`, WordBoundary exacto)
- AUTO-SFX CHOREOGRAPHER (`sfx_choreographer.py`) -> usa los 30 SFX al ms!
- 9 Bandas Sonoras Evolutivas de 50s (44.1kHz) + Sidechain Ducking + `-14 LUFS`
- Pipeline Híbrido AI-Art (`ai_art_scene_generator.py`) + V25FX + V25Director
- Render Playwright HTML5 -> FFmpeg (crf 16 + unsharp nitidez) + QA Contact Sheet 3x3
- TODOS LOS VALIDADORES + SIMULADOR OBLIGATORIO 100 USUARIOS (>= 90/100!)
===========================================================================
"""

import asyncio
import base64
import io
import json
import math
import os
import subprocess
import tempfile
import urllib.request
from PIL import Image

from sfx_choreographer import choreograph_sfx
from qa_checker import build_contact_sheet
from viral_simulator_100_users import run_mandatory_100_user_simulation
from visual_bug_detector import run_zero_bugs_audit
from game_playability_validator import audit_playability
from contrast_and_overlap_guard import audit_contrast_and_coherence
from editing_pacing_auditor import audit_editing_quality
from storyboard_coherence_validator import audit_reasonable_editing
from shot_variety_auditor import audit_shot_variety
from frame0_clarity_auditor import audit_frame0_clarity
from infinite_loop_auditor import audit_infinite_loop
from master_qa_supervisor_v34 import run_full_pro_max_audit
from viral_packaging_pro import build_viral_package
from heygen_voice_tts import synth_heygen_voice_only
from ai_art_scene_generator import generate_all_scene_plates

TARGET_DURATION = 50
ENGINE_MODE = "XRAY_SURVIVAL"        # INK_PAPER_EDITORIAL | GAMIFIED_CHALLENGE | XRAY_SURVIVAL | ANCHORED_TOWN | DOCU_CINEMA | NEON_GAMING_HUD | CUSTOM
BGM_MOOD    = "survival_tension"     # curiosity | emotional_piano | survival_tension | docu_epic | synthwave_neon | night_mystery | pizzicato | cinematic_build | lofi_story | none

VOICES_EDGE = {"A": "es-ES-ElviraNeural", "B": "es-ES-AlvaroNeural", "N": "es-ES-AlvaroNeural"}
VOICE_RATE  = "+6%"

# 1. HEYGEN API (SOLO VOZ — CERO AVATARES!)
HEYGEN_API_KEY     = os.getenv("HEYGEN_API_KEY", "").strip()
HEYGEN_VOICE_ID    = os.getenv("HEYGEN_VOICE_ID", "").strip()
HEYGEN_VOICE_MODEL = os.getenv("HEYGEN_VOICE_MODEL", "heygen-voice-1-turbo-free").strip()

# 2. ELEVENLABS API (OPCIONAL)
ELEVENLABS_API_KEY  = os.getenv("ELEVENLABS_API_KEY", "").strip()
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB").strip()

W, H, FPS = 1080, 1920, 30
OUT_MASTER_AUDIO = "audio_master_v34.wav"
OUT_TIMINGS = "timings_v34.json"
OUT_VIDEO = "video_viral_v34_pro_max.mp4"

BGM_MAP = {
    "curiosity":        "recursos/bgm/bgm_curiosity_50s.wav",
    "emotional_piano":  "recursos/bgm/bgm_emotional_piano_50s.wav",
    "survival_tension": "recursos/bgm/bgm_survival_tension_50s.wav",
    "docu_epic":        "recursos/bgm/bgm_docu_epic_50s.wav",
    "synthwave_neon":   "recursos/bgm/bgm_synthwave_neon_50s.wav",
    "night_mystery":    "recursos/bgm/bgm_night_mystery_50s.wav",
    "pizzicato":        "recursos/bgm/bgm_editorial_pizzicato_50s.wav",
    "cinematic_build":  "recursos/bgm/bgm_cinematic_build_50s.wav",
    "lofi_story":       "recursos/bgm/bgm_lofi_story_50s.wav",
}

GUION_COMPLETO = (
    "Si tu coche cae al agua, no llames al ciento doce. "
    "En serio. La mayoría pierde segundos clave buscando el móvil o empujando la puerta. "
    "No se va a abrir. El coche flota entre treinta segundos y dos minutos, a veces mucho menos. "
    "El agua entra por abajo y la presión bloquea la puerta con cientos de kilos. "
    "En las pelis te dicen que esperes a que se llene. Para entonces no hay salida. Es un mito. "
    "Así que rebobina y haz esto en orden exacto. "
    "Uno: suelta el cinturón al instante. "
    "Dos: baja la ventanilla antes de que falle el sistema eléctrico. "
    "Tres: saca primero a los niños. Cuatro: sal tú por la ventanilla. "
    "Guarda esto hoy, porque justo por eso mismo,"
)


def get_dur(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", path], capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def master_voice_single_pass(in_path, out_wav):
    af = (
        "highpass=f=75,equalizer=f=190:t=q:w=1.1:g=2.2,equalizer=f=4200:t=q:w=1.4:g=2.0,"
        "acompressor=threshold=-18dB:ratio=2.4:attack=8:release=85,loudnorm=I=-14:TP=-1.5:LRA=9"
    )
    subprocess.run(["ffmpeg", "-y", "-i", in_path, "-af", af, "-ar", "44100", "-ac", "1", out_wav], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


async def synth_edge_single_pass(full_text, out_wav):
    import edge_tts

    raw_mp3 = out_wav + ".raw.mp3"
    comm = edge_tts.Communicate(full_text, VOICES_EDGE["N"], rate=VOICE_RATE, pitch="+0Hz")
    words = []
    with open(raw_mp3, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                s = chunk["offset"] / 10_000_000
                d = chunk["duration"] / 10_000_000
                words.append({"word": chunk["text"], "start": round(s, 3), "end": round(s + d, 3)})
    master_voice_single_pass(raw_mp3, out_wav)
    os.remove(raw_mp3)
    return get_dur(out_wav), words


def synth_elevenlabs_single_pass(full_text, out_wav):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}/with-timestamps?output_format=mp3_44100_128"
    body = json.dumps({"text": full_text, "model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.44, "similarity_boost": 0.80, "style": 0.30}}).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    raw_mp3 = out_wav + ".el.mp3"
    with open(raw_mp3, "wb") as f:
        f.write(base64.b64decode(data["audio_base64"]))
    master_voice_single_pass(raw_mp3, out_wav)
    os.remove(raw_mp3)
    align = data.get("alignment") or data.get("normalized_alignment") or {}
    words, cw, ws, we = [], "", None, 0.0
    for ch, s, e in zip(align.get("characters", []), align.get("character_start_times_seconds", []), align.get("character_end_times_seconds", [])):
        if ch.isspace():
            if cw: words.append({"word": cw, "start": round(ws, 3), "end": round(we, 3)}); cw, ws = "", None
        else:
            if ws is None: ws = s
            cw += ch; we = e
    if cw: words.append({"word": cw, "start": round(ws, 3), "end": round(we, 3)})
    return get_dur(out_wav), words


async def build_audio():
    tmp = tempfile.mkdtemp(prefix="v34_pm_")
    voice_full = os.path.join(tmp, "voice_full.wav")

    # PRIORIDAD DE VOZ: 1. HeyGen Voice TTS (SOLO VOZ!) -> 2. ElevenLabs -> 3. Edge-TTS 0€
    if HEYGEN_API_KEY and HEYGEN_VOICE_ID:
        cur_t, words = synth_heygen_voice_only(
            HEYGEN_API_KEY, HEYGEN_VOICE_ID, GUION_COMPLETO,
            out_wav=voice_full, model=HEYGEN_VOICE_MODEL, mood=BGM_MOOD, with_timestamps=True, dynamic_emotions=True
        )
    elif ELEVENLABS_API_KEY:
        cur_t, words = synth_elevenlabs_single_pass(GUION_COMPLETO, voice_full)
    else:
        cur_t, words = await synth_edge_single_pass(GUION_COMPLETO, voice_full)

    # AUTO-SFX CHOREOGRAPHER: inyecta 12-25+ SFX de recursos/sfx/ automáticamente!
    sfx_events = choreograph_sfx(words, cur_t)

    mix_in, mix_f, labels, idx = ["-i", voice_full], ["[0:a]asplit=2[v_main][v_sc]"], ["[v_main]"], 1
    bgm_p = BGM_MAP.get(BGM_MOOD, "")
    if bgm_p and os.path.exists(bgm_p):
        mix_in += ["-stream_loop", "-1", "-i", bgm_p]
        mix_f.append(f"[{idx}:a]atrim=0:{cur_t:.3f},volume=0.14,aresample=44100[bgm_raw];[bgm_raw][v_sc]sidechaincompress=threshold=0.03:ratio=4.5:attack=20:release=220[bgm_duck]")
        labels.append("[bgm_duck]"); idx += 1

    for ev in sfx_events:
        sp = ev["sfx"]
        if sp and os.path.exists(sp):
            ms = max(0, int(ev["time"] * 1000))
            mix_in += ["-i", sp]
            mix_f.append(f"[{idx}:a]adelay={ms}|{ms},volume={ev['vol']},aresample=44100[s{idx}]")
            labels.append(f"[s{idx}]"); idx += 1

    mix_f.append(f"{''.join(labels)}amix=inputs={len(labels)}:duration=first:normalize=0,alimiter=limit=0.95[master]")
    subprocess.run(["ffmpeg", "-y"] + mix_in + ["-filter_complex", ";".join(mix_f), "-map", "[master]", "-c:a", "pcm_s16le", OUT_MASTER_AUDIO], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    payload = {"duration": round(cur_t, 3), "engine": ENGINE_MODE, "words": words, "sfx_events": sfx_events}
    with open(OUT_TIMINGS, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    return payload


async def render_omega_html(html_file, timings):
    from playwright.async_api import async_playwright

    total_dur = timings["duration"]
    total_frames = int(math.ceil(total_dur * FPS))
    qa_marks = {int(total_frames * p): f"{int(p*100)}%" for p in [0.05, 0.16, 0.28, 0.40, 0.52, 0.64, 0.76, 0.88, 0.96]}
    qa_frames = []

    cmd = [
        "ffmpeg", "-y", "-f", "image2pipe", "-vcodec", "png", "-r", str(FPS), "-i", "-",
        "-i", OUT_MASTER_AUDIO,
        "-vf", "eq=contrast=1.06:saturation=1.14,unsharp=5:5:0.5:5:5:0.0",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "fast", "-crf", "15", "-profile:v", "high", "-movflags", "+faststart",
        "-c:a", "aac", "-b:a", "192k", "-shortest", OUT_VIDEO,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": W, "height": H})
        await page.goto("file://" + os.path.abspath(html_file))
        await page.evaluate("(d) => window.loadExternalConfig(d)", timings)
        el = page.locator("#stage")
        for f_idx in range(total_frames):
            await page.evaluate("(t) => window.renderAt(t)", f_idx / FPS)
            png = await el.screenshot(type="png")
            if f_idx in qa_marks:
                qa_frames.append((qa_marks[f_idx], Image.open(io.BytesIO(png)).convert("RGB")))
            proc.stdin.write(png)
        await browser.close()

    proc.stdin.close()
    proc.wait()
    build_contact_sheet(qa_frames, "qa_contact_sheet.png")

    with open(html_file, "r", encoding="utf-8") as hf:
        html_src = hf.read()
    score, passed, _ = run_full_pro_max_audit(
        GUION_COMPLETO, html_src, qa_frames, total_dur, timings["sfx_events"], attempt=1
    )
    build_viral_package("Supervivencia en coche sumergido", niche="supervivencia", hook_line="Si tu coche cae al agua, NO llames al 112")
    print(f"✅ Vídeo v34 PRO MAX renderizado: {OUT_VIDEO} ({total_dur:.2f}s | Viralidad: {score}/100 | Aprobado={passed})")


async def main():
    timings = await build_audio()
    html_path = "motor_html_chromebook/estudio_v34_pro_max.html"
    if not os.path.exists(html_path):
        html_path = "estudio_v34_pro_max.html"
    await render_omega_html(html_path, timings)


if __name__ == "__main__":
    asyncio.run(main())
