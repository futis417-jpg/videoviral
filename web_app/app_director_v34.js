/**
 * =========================================================================
 * WEB VIRAL STUDIO v34 PRO MAX — DIRECTOR INTELIGENTE (FIX CLOUDFLARE AI)
 * - Voz MeloTTS frase por frase (nunca peta por texto largo!)
 * - Dibujos Flux 2D de uno en uno + respaldo Pollinations Flux 0€
 * - Muestra progreso real en vivo y errores reales si falla algo
 * =========================================================================
 */

const BGM_FILES = {
  survival_tension: "recursos/bgm/bgm_survival_tension_50s.wav",
  curiosity:        "recursos/bgm/bgm_curiosity_50s.wav",
  docu_epic:        "recursos/bgm/bgm_docu_epic_50s.wav",
  synthwave_neon:   "recursos/bgm/bgm_synthwave_neon_50s.wav",
  pizzicato:        "recursos/bgm/bgm_editorial_pizzicato_50s.wav",
  emotional_piano:  "recursos/bgm/bgm_emotional_piano_50s.wav",
  night_mystery:    "recursos/bgm/bgm_night_mystery_50s.wav",
  cinematic_build:  "recursos/bgm/bgm_cinematic_build_50s.wav",
  lofi_story:       "recursos/bgm/bgm_lofi_story_50s.wav",
};

const SFX_KEYWORD_RULES = [
  { kws: ["mito", "mentira", "error", "falso", "fallo", "nunca", "mal"], sfx: "error_buzz_hard", vol: 0.42 },
  { kws: ["uno", "dos", "tres", "cuatro", "primero", "segundo", "tercero"], sfx: "check_ok", vol: 0.38 },
  { kws: ["agua", "mar", "río", "playa"], sfx: "water_splash", vol: 0.36 },
  { kws: ["dinero", "euros", "precio", "caro", "millones", "gastas"], sfx: "money_chaching", vol: 0.40 },
  { kws: ["alerta", "peligro", "accidente", "emergencia", "cuidado"], sfx: "alarm_siren", vol: 0.30 },
  { kws: ["reloj", "segundos", "minutos", "horas", "tiempo"], sfx: "clock_tick_tense", vol: 0.35 },
  { kws: ["pero", "espera", "cambia", "peor", "giro"], sfx: "boom_cinematic", vol: 0.44 },
];

const SFX_TRANSITION_POOL = ["swipe_air_fast", "whoosh_heavy", "whoosh_zoom", "pizzicato_pop"];

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

let currentPlan = null;
let currentTimings = null;
let currentSfxEvents = [];
let shotImages = {};
let audioCtx = null;
let voiceBuffer = null;
let bgmCache = {};
let sfxCache = {};
let rafId = null;
let activeSources = [];
let isPlaying = false;

function setStatus(msg, color = "#00f5d4") {
  const el = document.getElementById("status");
  if (el) { el.textContent = msg; el.style.color = color; }
}

function ensureAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

async function loadAudioBuffer(url, cacheObj, key) {
  if (cacheObj[key]) return cacheObj[key];
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await ensureAudioCtx().decodeAudioData(await res.arrayBuffer());
    cacheObj[key] = buf;
    return buf;
  } catch { return null; }
}

function concatAudioBuffers(ac, buffers) {
  const valid = buffers.filter(Boolean);
  if (!valid.length) return null;
  const sr = valid[0].sampleRate;
  const totalLen = valid.reduce((sum, b) => sum + b.length, 0);
  const out = ac.createBuffer(1, totalLen, sr);
  const ch = out.getChannelData(0);
  let off = 0;
  for (const b of valid) {
    ch.set(b.getChannelData(0), off);
    off += b.length;
  }
  return out;
}

function cleanScript(txt) {
  return (txt || "").replace(/[*_#`~]/g, "").replace(/\s+/g, " ").trim();
}

function buildDirectorPrompt(topic, durationSec, styleMode) {
  const shotCount = Math.max(4, Math.min(6, Math.round(durationSec / 6)));
  const targetWords = Math.round(durationSec * 2.35);
  return `Crea el guion y ${shotCount} planos visuales para un vídeo viral vertical sobre: "${topic}".
DURACIÓN: ${durationSec}s (~${targetWords} palabras en español natural, SIN asteriscos ni markdown).
ESTILO: ${styleMode}.

REGLAS ESTRICTAS:
1. Cada plano DEBE ilustrar exactamente lo que se dice en ese momento del guion.
2. En cada plano escribe "image_prompt" en INGLÉS describiendo una escena 2D concreta del tema.
3. La última frase del guion debe enlazar en bucle con la primera (ej. "...y por eso mismo,").
4. Números en LETRAS dentro de "script".

DEVUELVE SOLO ESTE JSON VÁLIDO:
{
  "title": "TITULAR 3 PALABRAS",
  "bgm": "survival_tension|curiosity|docu_epic|synthwave_neon|pizzicato|emotional_piano|night_mystery",
  "subtitle_style": "docu_yellow|neura_pill|top_box",
  "color_grade": "teal_orange|deep_ocean|neon_cyber|noir_docu",
  "frame0": { "tag": "CATEGORIA 2 PALABRAS", "headline": "TITULAR CORTO", "sub": "Subtítulo gancho 4 palabras" },
  "script": "Guion limpio sin asteriscos de ~${targetWords} palabras terminando en puente de bucle,",
  "tiktok_description": "Descripción corta con pregunta",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "pinned_comment": "Pregunta corta para comentarios 👇",
  "shots": [
    {
      "type": "ai_art",
      "image_prompt": "English description of the exact 2D scene matching this part of the script",
      "rig": "dolly_in|dolly_out|orbit_3d|tracking_pan|handheld_docu",
      "transition": "diagonal_slash|shutter_split|whip_pan|zoom_through",
      "palette": "ocean_xray|cyber_cyan|gold_luxury|crimson_alert|emerald_money|noir_docu",
      "headline": "DATO CORTO EN PANTALLA"
    }
  ]
}`;
}

function buildWordTimings(scriptText, totalDur) {
  const raw = cleanScript(scriptText).split(/\s+/).filter(Boolean);
  const wts = raw.map(w => Math.max(2.5, w.length) + (/[.?!]$/.test(w) ? 3.2 : (/,/.test(w) ? 1.3 : 0)));
  const sum = wts.reduce((a, b) => a + b, 0) || 1;
  let cur = 0.06;
  const words = raw.map((word, i) => {
    const d = (wts[i] / sum) * Math.max(1, totalDur - 0.14);
    const it = { word, start: cur, end: cur + d * 0.90 };
    cur += d;
    return it;
  });
  return { duration: totalDur, words };
}

function choreographWebSFX(words, totalDur, shotCount) {
  const events = [{ time: 0.03, sfx: "bass_drop_pro", vol: 0.40 }];
  const used = [0.03];
  const canPlace = (t) => used.every(u => Math.abs(t - u) >= 2.2);

  for (const w of words) {
    const clean = w.word.toLowerCase().replace(/[.,?!¡¿:;«»"']/g, "");
    if (!canPlace(w.start)) continue;
    for (const r of SFX_KEYWORD_RULES) {
      if (r.kws.includes(clean)) {
        events.push({ time: w.start, sfx: r.sfx, vol: r.vol });
        used.push(w.start);
        break;
      }
    }
  }
  const shotDur = totalDur / Math.max(1, shotCount);
  for (let i = 1; i < shotCount; i++) {
    const t = Math.max(0.1, i * shotDur - 0.08);
    if (canPlace(t)) {
      events.push({ time: t, sfx: SFX_TRANSITION_POOL[i % SFX_TRANSITION_POOL.length], vol: 0.30 });
      used.push(t);
    }
  }
  return events.sort((a, b) => a.time - b.time);
}

function wrapText(c, text, cx, cy, maxW, lineH) {
  const words = (text || "").split(/\s+/);
  let line = "", y = cy;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + " " + words[i] : words[i];
    if (c.measureText(test).width > maxW && line) {
      c.fillText(line, cx, y);
      line = words[i];
      y += lineH;
    } else { line = test; }
  }
  if (line) c.fillText(line, cx, y);
}

function renderSingleShot(c, sh, idx, localT, shotDur, globalT) {
  const pal = sh.palette || "noir_docu";
  const img = shotImages[idx];

  if (sh.type === "kinetic_slide") {
    const lines = (Array.isArray(sh.lines) && sh.lines.length) ? sh.lines : [sh.headline || "LA CLAVE REAL"];
    V31.AE.drawFullKineticSlide(c, lines, localT, {
