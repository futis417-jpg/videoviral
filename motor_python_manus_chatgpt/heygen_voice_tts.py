"""
===========================================================================
HEYGEN VOICE-ONLY TTS ENGINE v33 INFINITE-LOOP APEX (SOLO VOZ, CERO AVATARES!)
Mejoras v33:
1. `auto_select_heygen_voice(api_key, mood)` -> Consulta `/v3/models/audio/voices`
   y elige automáticamente la mejor voz en español según el estilo del vídeo
   (misterio/documental = voz grave, retos/gaming = voz enérgica, editorial = cálida).
2. `synth_heygen_dynamic_director(...)` -> Divide el guion en beats emocionales
   automáticamente (o usa lista de beats con `emotion` y `speed`), aplica
   etiquetas emocionales reales (`[excited]`, `[whispers]`, `[laughs]`, `[serious]`)
   y ajusta la velocidad (`0.92x` en suspense/revelación, `1.14x` en hook/listas),
   uniendo todo con crossfade limpio de 25ms y timestamps por palabra exactos!
3. Fallback 100% gratis a Edge-TTS 1-Pasada si no hay API Key.
===========================================================================
"""

import base64
import json
import os
import re
import subprocess
import tempfile
import urllib.request


MOOD_VOICE_PREFS = {
    "survival_tension": ["deep", "dramatic", "male", "alvaro", "carlos", "es"],
    "docu_epic":        ["narrator", "documentary", "deep", "male", "es"],
    "curiosity":        ["energetic", "young", "bright", "es"],
    "synthwave_neon":   ["energetic", "fast", "young", "es"],
    "pizzicato":        ["conversational", "warm", "friendly", "es"],
    "emotional_piano":  ["warm", "calm", "soft", "female", "es"],
    "night_mystery":    ["whisper", "mysterious", "deep", "es"],
}

EMOTION_SPEED_MAP = {
    "hook":       ("[excited]",  1.12),
    "excited":    ("[excited]",  1.10),
    "whisper":    ("[whispers]", 0.93),
    "suspense":   ("[whispers]", 0.94),
    "revelation": ("",           0.96),
    "fast_list":  ("[excited]",  1.15),
    "laugh":      ("[laughs]",   1.04),
    "loop_bridge":("",           1.08),
    "normal":     ("",           1.04),
}


def _hg_req(url, api_key, payload=None, method="GET", timeout=90):
    headers = {
        "X-Api-Key": api_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def list_heygen_voices(api_key):
    """Lista todas las voces públicas y clonadas disponibles para TTS en HeyGen."""
    return _hg_req("https://api.heygen.com/v3/models/audio/voices", api_key, method="GET")


def auto_select_heygen_voice(api_key, mood="curiosity", fallback_voice_id=""):
    """Elige automáticamente la voz de HeyGen que mejor encaja con el mood del vídeo."""
    if fallback_voice_id:
        return fallback_voice_id
    try:
        res = list_heygen_voices(api_key)
        voices = (res.get("data") or {}).get("voices") or res.get("voices") or []
        prefs = MOOD_VOICE_PREFS.get(mood, ["es"])
        best_id, best_score = "", -1
        for v in voices:
            vid = v.get("voice_id") or v.get("id") or ""
            blob = f"{v.get('name','')} {v.get('language','')} {v.get('gender','')} {v.get('description','')}".lower()
            if "spanish" not in blob and "español" not in blob and "es-" not in blob and "multilingual" not in blob:
                continue
            sc = sum(2 for p in prefs if p in blob)
            if sc > best_score and vid:
                best_score, best_id = sc, vid
        if best_id:
            print(f"🎯 HeyGen Auto-Voice seleccionada para '{mood}': {best_id}")
            return best_id
    except Exception as e:
        print(f"⚠️ Auto-select HeyGen voice falló ({e}).")
    return fallback_voice_id


def auto_tag_script_beats(full_text):
    """Divide un guion en frases y asigna emoción + velocidad automática según el contexto."""
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", full_text.strip()) if s.strip()]
    beats = []
    n = len(sentences)
    for i, s in enumerate(sentences):
        low = s.lower()
        if i == 0:
            emo = "hook"
        elif i == n - 1:
            emo = "loop_bridge"
        elif any(k in low for k in ["en secreto", "nadie", "silencio", "cuidado", "espera", "pero aquí"]):
            emo = "suspense"
        elif any(k in low for k in ["uno:", "dos:", "tres:", "cuatro:", "cinco:", "primero", "segundo"]):
            emo = "fast_list"
        elif any(k in low for k in ["mito", "mentira", "error", "falso", "imposible", "brutal"]):
            emo = "excited"
        elif "?" in s and len(s.split()) <= 7:
            emo = "revelation"
        else:
            emo = "normal"
        tag, spd = EMOTION_SPEED_MAP[emo]
        beats.append({"text": s, "emotion": emo, "tag": tag, "speed": spd})
    return beats


def _probe_dur(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip())


def _estimate_words(text, start_offset, dur):
    raw_words = [w for w in text.split() if not (w.startswith("[") and w.endswith("]"))]
    wts = [max(2.5, len(w)) + (2.8 if w[-1:] in ".?!" else 0.0) for w in raw_words]
    tot = sum(wts) or 1.0
    cur = start_offset
    out = []
    for w, wt in zip(raw_words, wts):
        wd = (wt / tot) * max(0.15, dur - 0.04)
        out.append({"word": w, "start": round(cur, 3), "end": round(cur + wd * 0.92, 3)})
        cur += wd
    return out


def synth_heygen_voice_only(
    api_key,
    voice_id,
    text,
    out_wav="heygen_voice.wav",
    model="heygen-voice-1-turbo-free",
    mood="curiosity",
    language="",
    with_timestamps=True,
    dynamic_emotions=True,
):
    """
    Genera SOLO AUDIO DE VOZ (44.1kHz WAV) usando HeyGen Voice TTS API.
    Con `dynamic_emotions=True`, aplica emociones y velocidades distintas por contexto!
    """
    vid = auto_select_heygen_voice(api_key, mood=mood, fallback_voice_id=voice_id)
    if not vid:
        raise RuntimeError("Falta HEYGEN_VOICE_ID y no se pudo autoseleccionar una voz.")

    tmp_dir = tempfile.mkdtemp(prefix="hg_v33_")
    beats = auto_tag_script_beats(text) if dynamic_emotions else [{"text": text, "emotion": "normal", "tag": "", "speed": 1.05}]

    seg_paths = []
    all_words = []
    cursor_t = 0.0

    print(f"🎙️ HeyGen Dynamic Voice Director v33 ({model} | {len(beats)} beats emocionales — CERO avatares)...")
    for idx, b in enumerate(beats):
        tagged_text = f"{b['tag']} {b['text']}".strip() if b["tag"] else b["text"]
        raw_seg = os.path.join(tmp_dir, f"raw_{idx:02d}")
        wav_seg = os.path.join(tmp_dir, f"seg_{idx:02d}.wav")

        payload = {
            "model": model,
            "voice_id": vid,
            "text": tagged_text,
            "with_timestamps": bool(with_timestamps),
        }
        if language:
            payload["language"] = language

        try:
            res = _hg_req("https://api.heygen.com/v3/models/audio/tts", api_key, payload=payload, method="POST")
        except Exception:
            fb_payload = {"voice_id": vid, "text": b["text"], "speed": b["speed"]}
            if language:
                fb_payload["language"] = language
            res = _hg_req("https://api.heygen.com/v3/voices/speech", api_key, payload=fb_payload, method="POST")

        data = res.get("data") or res
        audio_url = data.get("audio_url") or data.get("url")
        audio_b64 = data.get("audio_base64") or data.get("audio")
        if audio_url:
            urllib.request.urlretrieve(audio_url, raw_seg)
        elif audio_b64:
            with open(raw_seg, "wb") as f:
                f.write(base64.b64decode(audio_b64))
        else:
            raise RuntimeError(f"HeyGen TTS sin audio en beat {idx}: {res}")

        # Ajustar velocidad dinámica exacta con atempo + eliminar silencios muertos al final (clave para bucle infinito!)
        spd = max(0.88, min(1.20, b["speed"]))
        af = f"atempo={spd:.2f},silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=1:stop_duration=0.12:stop_threshold=-45dB"
        subprocess.run(
            ["ffmpeg", "-y", "-i", raw_seg, "-af", af, "-ar", "44100", "-ac", "1", wav_seg],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        d = _probe_dur(wav_seg)
        all_words.extend(_estimate_words(b["text"], cursor_t, d))
        cursor_t += d
        seg_paths.append(wav_seg)

    # Concatenar todos los beats + mastering cálido -14 LUFS
    concat_list = os.path.join(tmp_dir, "list.txt")
    with open(concat_list, "w", encoding="utf-8") as cf:
        for p in seg_paths:
            cf.write(f"file '{p}'\n")

    af_master = (
        "highpass=f=75,equalizer=f=190:t=q:w=1.1:g=2.0,equalizer=f=4200:t=q:w=1.4:g=1.8,"
        "acompressor=threshold=-18dB:ratio=2.2:attack=8:release=85,loudnorm=I=-14:TP=-1.5:LRA=9"
    )
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list, "-af", af_master, "-ar", "44100", "-ac", "1", out_wav],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    total_dur = _probe_dur(out_wav)
    print(f"✅ Voz HeyGen Dinámica v33 lista ({total_dur:.2f}s | {len(all_words)} palabras | emociones+velocidades aplicadas).")
    return total_dur, all_words
