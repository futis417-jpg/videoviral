/**
 * =========================================================================
 * WEB VIRAL STUDIO v34 PRO MAX — DIRECTOR INTELIGENTE (FIX DEFINITIVO)
 * - Conecta con Cloudflare Worker (Llama 3.3 70B + Voz MeloTTS/HeyGen + Flux 2D Art)
 * - CERO coches random, CERO cajas vacías, CERO asteriscos en subtítulos,
 *   CERO solapamientos de texto, y CERO vídeos mudos sin avisar!
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

function cleanScript(txt) {
  return (txt || "").replace(/[*_#`~]/g, "").replace(/\s+/g, " ").trim();
}

// =========================================================================
// 1. PROMPT ESTRICTO ANTI-RANDOM PARA LLAMA 3.3 70B (CLOUDFLARE AI)
// =========================================================================
function buildDirectorPrompt(topic, durationSec, styleMode) {
  const shotCount = Math.max(5, Math.min(8, Math.round(durationSec / 4.5)));
  const targetWords = Math.round(durationSec * 2.45);
  return `Crea el guion y los ${shotCount} planos visuales para un vídeo viral vertical sobre: "${topic}".
DURACIÓN: ${durationSec}s (~${targetWords} palabras en español natural, SIN asteriscos ni markdown).
ESTILO: ${styleMode}.

REGLAS ESTRICTAS (PROHIBIDO PONER COSAS ALEATORIAS):
1. Cada plano DEBE ilustrar exactamente lo que se dice en ese momento del guion.
2. En cada plano escribe "image_prompt" en INGLÉS describiendo una escena 2D concreta y visual del tema (ej: "orange aircraft flight recorder black box glowing inside a plane tail cutaway").
3. Solo usa "split_compare" si rellenas "left_title", "left_body", "right_title", "right_body" con datos reales del tema.
4. La última frase del guion debe enlazar en bucle con la primera (ej. "...y por eso mismo,").
5. Números en LETRAS dentro de "script".

DEVUELVE SOLO ESTE JSON VÁLIDO:
{
  "title": "TITULAR 3 PALABRAS",
  "bgm": "survival_tension|curiosity|docu_epic|synthwave_neon|pizzicato|emotional_piano|night_mystery",
  "subtitle_style": "neura_pill|docu_yellow|top_box",
  "color_grade": "teal_orange|deep_ocean|neon_cyber|noir_docu",
  "frame0": { "tag": "CATEGORIA 2 PALABRAS", "headline": "TITULAR CORTO", "sub": "Subtítulo gancho 4 palabras" },
  "script": "Guion limpio sin asteriscos de ~${targetWords} palabras terminando en puente de bucle,",
  "tiktok_description": "Descripción corta con pregunta",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "pinned_comment": "Pregunta corta para comentarios 👇",
  "shots": [
    {
      "type": "ai_art|kinetic_slide|split_compare|widget_stat",
      "image_prompt": "English description of the exact 2D scene matching this part of the script",
      "rig": "dolly_in|dolly_out|orbit_3d|tracking_pan|handheld_docu",
      "transition": "diagonal_slash|shutter_split|whip_pan|zoom_through",
      "palette": "ocean_xray|cyber_cyan|gold_luxury|crimson_alert|emerald_money|noir_docu",
      "headline": "DATO CORTO EN PANTALLA (MAX 4 PALABRAS)",
      "lines": ["FRASE 1", "FRASE 2", "IMPACTO"],
      "stat_pct": 95,
      "left_title": "MITO",
      "left_body": "Lo que todos creen",
      "right_title": "REALIDAD",
      "right_body": "Lo que pasa de verdad"
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

// =========================================================================
// 2. RENDERIZADOR LIMPIO (DIBUJOS 100% COHERENTES CON EL TEMA + CERO BUGS!)
// =========================================================================
function wrapText(c, text, cx, cy, maxW, lineH) {
  const words = (text || "").split(/\s+/);
  let line = "", y = cy;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + " " + words[i] : words[i];
    if (c.measureText(test).width > maxW && line) {
      c.fillText(line, cx, y);
      line = words[i];
      y += lineH;
    } else {
      line = test;
    }
  }
  if (line) c.fillText(line, cx, y);
}

function renderSingleShot(c, sh, idx, localT, shotDur, globalT) {
  const type = sh.type || "ai_art";
  const pal = sh.palette || "noir_docu";
  const img = shotImages[idx];

  if (type === "kinetic_slide") {
    const lines = (Array.isArray(sh.lines) && sh.lines.length) ? sh.lines : [sh.headline || "LA CLAVE REAL"];
    V31.AE.drawFullKineticSlide(c, lines, localT, { accent: "#FACC15" });
  } else if (type === "split_compare") {
    V34.Factory.drawWorldCombo(c, globalT, { palette: pal, floor: "dark_slate", weather: "dust" });
    V30.Editor.drawSplitComparison(c, sh.left_title || "MITO", sh.right_title || "REALIDAD", Math.min(1, localT / 0.55), 450, 620);
    // Rellenar SIEMPRE el texto dentro de las dos cajas (jamás vacías!)
    c.save();
    c.fillStyle = "#F8FAFC"; c.font = "700 34px 'Plus Jakarta Sans', sans-serif"; c.textAlign = "center";
    wrapText(c, sh.left_body || "Lo que cree la mayoría", 289, 640, 400, 46);
    c.globalAlpha = Math.min(1, localT / 0.55);
    wrapText(c, sh.right_body || "Lo que ocurre realmente", 791, 640, 400, 46);
    c.restore();
  } else if (type === "widget_stat") {
    V34.Factory.drawWorldCombo(c, globalT, { palette: pal, floor: "neon_grid", weather: "sparkle" });
    V34.Factory.drawAnimatedWidget(c, "progress_ring", 540, 820, localT, {
      targetPct: Math.min(100, Math.max(10, sh.stat_pct || 92)) / 100,
      label: (sh.headline || "DATO REAL").slice(0, 26)
    });
  } else {
    // AI ART 2D ILUSTRADO EXACTO AL TEMA (Ken Burns suave + viñeta + tarjeta dato arriba)
    if (img && img.complete && img.naturalWidth > 0) {
      V25Director.drawArtPlate(c, img, localT, shotDur, { z0: 1.04, z1: 1.14, dx0: -12, dx1: 12 });
      // Oscurecer ligeramente zona inferior para que los subtítulos siempre se lean al 100%
      const g = c.createLinearGradient(0, 1180, 0, 1920);
      g.addColorStop(0, "rgba(5,8,17,0)"); g.addColorStop(1, "rgba(5,8,17,0.88)");
      c.fillStyle = g; c.fillRect(0, 1180, 1080, 740);
    } else {
      V34.Factory.drawWorldCombo(c, globalT, { palette: pal, floor: "dark_slate", weather: "god_rays" });
      V31.AE.drawGlassCard3D(c, 540, 860, 840, 320, localT, (cc) => {
        cc.fillStyle = "#FACC15"; cc.font = "900 54px 'Plus Jakarta Sans', sans-serif"; cc.textAlign = "center";
        wrapText(cc, (sh.headline || currentPlan?.title || "DATO CLAVE").toUpperCase(), 0, -20, 740, 68);
      });
    }
    if (sh.headline && idx > 0) {
      V29.Edit.kineticLowerThird(c, sh.headline.toUpperCase(), currentPlan?.title || "", localT, 1140);
    }
  }
}

window.renderAt = function (t) {
  if (!currentPlan || !currentTimings) return;
  const dur = currentTimings.duration;
  const shots = currentPlan.shots;
  const shotDur = dur / Math.max(1, shots.length);
  const idx = Math.min(shots.length - 1, Math.floor(t / shotDur));
  const localT = t - idx * shotDur;
  const sh = shots[idx];

  const drawFrame0 = (c, lT) => {
    renderSingleShot(c, shots[0], 0, lT, shotDur, lT);
    if (currentPlan.frame0) {
      V32.Frame0.drawInstantTopicColdOpen(c, currentPlan.frame0.tag, currentPlan.frame0.headline, currentPlan.frame0.sub, lT, 2.7);
    }
  };

  ctx.save();
  V34.Camera.applyRig(ctx, t, localT, shotDur, {
    rig: sh.rig || "dolly_in",
    easing: "expoOut",
    shake: "handheld",
    intensity: 0.75
  });

  if (idx > 0 && localT < 0.28) {
    const p = localT / 0.28;
    const prevSh = shots[idx - 1];
    const drawPrev = (c) => renderSingleShot(c, prevSh, idx - 1, shotDur - 0.05, shotDur, t);
    const drawNext = (c) => renderSingleShot(c, sh, idx, localT, shotDur, t);
    if (sh.transition === "shutter_split") V31.AE.shutterSplitTransition(ctx, p, drawPrev, drawNext);
    else if (sh.transition === "whip_pan") V27Edit.whipPanTransition(ctx, p, "left", drawPrev, drawNext);
    else if (sh.transition === "zoom_through") V27Edit.zoomThroughTransition(ctx, p, drawPrev, drawNext);
    else V31.AE.diagonalSlashTransition(ctx, p, drawPrev, drawNext);
  } else {
    renderSingleShot(ctx, sh, idx, localT, shotDur, t);
  }
  ctx.restore();

  V34.Camera.applyLensPostFX(ctx, t, localT, "anamorphic_flare");
  V27Edit.colorGrade(ctx, currentPlan.color_grade || "teal_orange");
  V25FX.drawCinemaFinish(ctx, t, 0.28);

  if (currentPlan.frame0 && t <= 2.75) {
    V32.Frame0.drawInstantTopicColdOpen(ctx, currentPlan.frame0.tag, currentPlan.frame0.headline, currentPlan.frame0.sub, t, 2.7);
  }
  V29.Edit.drawChapterBar(ctx, ["GANCHO", "HISTORIA", "DATO", "CIERRE"], Math.min(3, Math.floor((t / Math.max(1, dur)) * 4)));
  V27Edit.drawRetentionBar(ctx, t / Math.max(1, dur));

  // Subtítulos limpios en zona segura inferior (sin chocarse con nada!)
  const subSt = currentPlan.subtitle_style || "docu_yellow";
  if (subSt === "top_box") V14.drawSubtitles(ctx, currentTimings.words, t, "top_box");
  else if (subSt === "neura_pill") V26.NeuraPsico.drawDarkPillSubs(ctx, currentTimings.words, t, 1460);
  else V26.Docu25D.drawDocuSubs(ctx, currentTimings.words, t, 1480);

  V33.Loop.applySeamlessLoopEnd(ctx, t, dur, drawFrame0);
};

// =========================================================================
// 3. GENERACIÓN COMPLETA CON CLOUDFLARE AI (GUION + ILUSTRACIONES 2D + VOZ!)
// =========================================================================
async function loadImageFromBlob(blob) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(blob);
  });
}

async function generateFullVideoFromTopic() {
  const topic = document.getElementById("topicInput").value.trim();
  if (!topic) { setStatus("❌ Escribe un tema primero, bro.", "#f43f5e"); return; }

  const durationSec = parseInt(document.getElementById("durSel").value, 10) || 35;
  const styleMode = document.getElementById("styleSel").value || "AUTO";
  const workerUrl = document.getElementById("workerUrl").value.trim().replace(/\/+$/, "");

  if (workerUrl) localStorage.setItem("v34_worker_url", workerUrl);

  setStatus("🧠 1/3 — Creando guion y escenas exactas al tema con Cloudflare AI (Llama 3.3)...", "#fbbf24");
  let rawPlan = null;

  if (workerUrl) {
    try {
      const r = await fetch(`${workerUrl}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildDirectorPrompt(topic, durationSec, styleMode) })
      });
      if (r.ok) rawPlan = await r.json();
    } catch (e) { console.warn("Worker /api/plan error:", e); }
  }

  if (!rawPlan || !rawPlan.script) {
    try {
      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Devuelve SOLO un JSON válido sin markdown." },
            { role: "user", content: buildDirectorPrompt(topic, durationSec, styleMode) }
          ],
          model: "openai",
          jsonMode: true
        })
      });
      if (res.ok) {
        const match = (await res.text()).match(/\{[\s\S]*\}/);
        if (match) rawPlan = JSON.parse(match[0]);
      }
    } catch (e) { console.warn("Pollinations fallback error:", e); }
  }

  if (!rawPlan || !rawPlan.script) {
    setStatus("❌ No se pudo conectar con la IA. Pega la URL de tu Cloudflare Worker abajo.", "#f43f5e");
    return;
  }

  rawPlan.script = cleanScript(rawPlan.script);
  currentPlan = rawPlan;
  shotImages = {};

  // 2/3: Generar ilustraciones 2D REALES del tema para cada plano `ai_art`!
  if (workerUrl) {
    setStatus("🎨 2/3 — Dibujando escenas 2D exactas al tema con Cloudflare Flux AI...", "#fbbf24");
    await Promise.all(
      (currentPlan.shots || []).map(async (sh, idx) => {
        if (sh.type !== "ai_art" || !sh.image_prompt) return;
        try {
          const ir = await fetch(`${workerUrl}/api/image`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: sh.image_prompt })
          });
          if (ir.ok) {
            const img = await loadImageFromBlob(await ir.blob());
            if (img) shotImages[idx] = img;
          }
        } catch (e) { console.warn("Image gen error shot", idx, e); }
      })
    );
  }

  // 3/3: Generar VOZ REAL EN ESPAÑOL (Cloudflare MeloTTS / HeyGen)
  voiceBuffer = null;
  if (workerUrl) {
    setStatus("🎙️ 3/3 — Generando VOZ REAL en español con Cloudflare AI...", "#fbbf24");
    try {
      const tr = await fetch(`${workerUrl}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentPlan.script })
      });
      if (tr.ok) {
        const arr = await tr.arrayBuffer();
        if (arr.byteLength > 1500) {
          voiceBuffer = await ensureAudioCtx().decodeAudioData(arr);
        }
      }
    } catch (e) { console.warn("TTS error:", e); }
  }

  const finalDur = voiceBuffer ? voiceBuffer.duration : durationSec;
  currentTimings = buildWordTimings(currentPlan.script, finalDur);
  currentSfxEvents = choreographWebSFX(currentTimings.words, finalDur, currentPlan.shots.length);

  document.getElementById("scriptOut").value = currentPlan.script;
  document.getElementById("scoreBadge").textContent =
    `🏆 v34 PRO MAX · ${currentPlan.shots.length} Escenas · ${Object.keys(shotImages).length} Ilustraciones IA · ${voiceBuffer ? "🎙️ VOZ IA LISTA" : "⚠️ SIN VOZ (Conecta Worker)"}`;
  document.getElementById("pkgBox").innerHTML =
    `<b>📱 Descripción:</b> ${currentPlan.tiktok_description || ""}<br>` +
    `<b>🏷️ Hashtags:</b> ${(currentPlan.hashtags || []).join(" ")}<br>` +
    `<b>📌 Comentario fijado:</b> ${currentPlan.pinned_comment || ""}`;

  window.renderAt(0.0);
  if (voiceBuffer) {
    setStatus(`✅ ¡VÍDEO + DIBUJOS IA + VOZ LISTOS (${finalDur.toFixed(1)}s)! Dale a Preview o Descargar.`, "#00f5d4");
  } else {
    setStatus(`⚠️ Guion listo, pero SIN VOZ ni dibujos IA porque falta tu URL de Cloudflare Worker abajo.`, "#facc15");
  }
}

function stopPlayback() {
  if (rafId) cancelAnimationFrame(rafId);
  activeSources.forEach(s => { try { s.stop(); } catch (_) {} });
  activeSources = [];
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  isPlaying = false;
}

async function playOrExportVideo(record = false) {
  if (!currentPlan || !currentTimings) {
    setStatus("❌ Primero escribe un tema y pulsa '1. GENERAR VÍDEO VIRAL CON IA'.", "#f43f5e");
    return;
  }
  if (record && !voiceBuffer) {
    const ok = confirm("⚠️ Todavía no hay pista de VOZ conectada (falta la URL de Cloudflare Worker o subir un MP3). Si grabas ahora saldrá solo con música y SFX. ¿Quieres grabar igual?");
    if (!ok) return;
  }

  stopPlayback();
  const ac = ensureAudioCtx();
  const dur = currentTimings.duration;

  const bgmUrl = BGM_FILES[currentPlan.bgm] || BGM_FILES.curiosity;
  const bgmBuf = await loadAudioBuffer(bgmUrl, bgmCache, currentPlan.bgm);
  const sfxBuffers = await Promise.all(
    currentSfxEvents.map(ev => loadAudioBuffer(`recursos/sfx/${ev.sfx}.wav`, sfxCache, ev.sfx))
  );

  const masterGain = ac.createGain();
  masterGain.gain.value = 0.95;
  let recorder = null;
  const chunks = [];

  if (record) {
    const streamDest = ac.createMediaStreamDestination();
    masterGain.connect(streamDest);
    masterGain.connect(ac.destination);
    const tracks = [...canvas.captureStream(30).getVideoTracks(), ...streamDest.stream.getAudioTracks()];
    const mime = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")
      ? "video/mp4;codecs=avc1"
      : (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : "video/webm");
    recorder = new MediaRecorder(new MediaStream(tracks), { mimeType: mime, videoBitsPerSecond: 6_500_000 });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const ext = mime.includes("mp4") ? "mp4" : "webm";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(chunks, { type: mime }));
      a.download = `viral_v34_${Date.now()}.${ext}`;
      a.click();
      setStatus(`✅ ¡Vídeo v34 descargado (.${ext}) con voz, dibujos y subtítulos!`, "#00f5d4");
    };
    recorder.start();
    setStatus("🔴 Grabando vídeo 1080×1920...", "#f43f5e");
  } else {
    masterGain.connect(ac.destination);
    setStatus("▶️ Reproduciendo Preview...", "#00f5d4");
  }

  const now = ac.currentTime + 0.05;
  if (voiceBuffer) {
    const vs = ac.createBufferSource();
    vs.buffer = voiceBuffer;
    vs.connect(masterGain);
    vs.start(now);
    activeSources.push(vs);
  }
  if (bgmBuf) {
    const bs = ac.createBufferSource();
    bs.buffer = bgmBuf;
    bs.loop = true;
    const bgGain = ac.createGain();
    bgGain.gain.value = voiceBuffer ? 0.14 : 0.22;
    bs.connect(bgGain);
    bgGain.connect(masterGain);
    bs.start(now);
    bs.stop(now + dur + 0.1);
    activeSources.push(bs);
  }
  currentSfxEvents.forEach((ev, i) => {
    const sb = sfxBuffers[i];
    if (!sb) return;
    const ss = ac.createBufferSource();
    ss.buffer = sb;
    const sg = ac.createGain();
    sg.gain.value = ev.vol || 0.35;
    ss.connect(sg);
    sg.connect(masterGain);
    ss.start(now + ev.time);
    activeSources.push(ss);
  });

  isPlaying = true;
  const t0 = performance.now();
  function frame(ts) {
    if (!isPlaying) return;
    const t = (ts - t0) / 1000;
    window.renderAt(Math.min(t, dur));
    if (t < dur) rafId = requestAnimationFrame(frame);
    else {
      isPlaying = false;
      if (recorder && recorder.state === "recording") recorder.stop();
      else setStatus("✅ Preview terminado.", "#00f5d4");
    }
  }
  rafId = requestAnimationFrame(frame);
}

document.getElementById("voiceFileInput").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  voiceBuffer = await ensureAudioCtx().decodeAudioData(await f.arrayBuffer());
  if (currentPlan) {
    currentTimings = buildWordTimings(currentPlan.script, voiceBuffer.duration);
    currentSfxEvents = choreographWebSFX(currentTimings.words, voiceBuffer.duration, currentPlan.shots.length);
  }
  setStatus(`✅ Voz MP3 cargada (${voiceBuffer.duration.toFixed(1)}s).`, "#00f5d4");
});

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("v34_worker_url");
  if (saved && document.getElementById("workerUrl")) document.getElementById("workerUrl").value = saved;
});
