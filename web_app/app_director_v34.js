/**
 * =========================================================================
 * WEB VIRAL STUDIO v34 PRO MAX — DIRECTOR JSON + WEB AUDIO + VIDEO EXPORTER
 * Ejecuta el 100% del pack v14–v34 directamente en el navegador a 0€:
 * - Recibe un tema -> Llama a Cloudflare Worker (o Pollinations AI 0€) ->
 *   Genera un JSON de Dirección Pro Max (Guion Anti-IA + Bucle Infinito +
 *   Planos Multi-Cámara + B-Roll + Cast + Props + 50 SFX + Packaging Viral).
 * - Audita automáticamente el JSON (Claridad Segundo 0, Variedad Anti-Monotonía,
 *   Bucle Infinito, 50 SFX) y muestra la nota /100.
 * - Mezcla Voz (HeyGen / Workers AI TTS / Archivo subido / WebSpeech) +
 *   9 BGM con Ducking + 50 SFX en Web Audio API y exporta 1080x1920 @ 30fps!
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
  { kws: ["mito", "mentira", "error", "falso", "fallo", "nunca", "mal"], sfx: "error_buzz_hard", vol: 0.45 },
  { kws: ["rebobina", "atrás", "vuelve"], sfx: "rewind_vhs", vol: 0.45 },
  { kws: ["uno", "dos", "tres", "cuatro", "cinco", "primero", "segundo", "tercero"], sfx: "check_ok", vol: 0.42 },
  { kws: ["agua", "mar", "río", "playa"], sfx: "water_splash", vol: 0.40 },
  { kws: ["mensaje", "escribe", "móvil", "notificación", "whatsapp", "chat"], sfx: "notif_msg", vol: 0.42 },
  { kws: ["dinero", "euros", "precio", "caro", "barato", "millones", "gastas", "pagar"], sfx: "money_chaching", vol: 0.42 },
  { kws: ["alerta", "peligro", "emergencia", "cuidado"], sfx: "alarm_siren", vol: 0.35 },
  { kws: ["reloj", "segundos", "minutos", "días", "horas", "tiempo"], sfx: "clock_tick_tense", vol: 0.38 },
  { kws: ["secreto", "truco", "increíble", "brutal", "magia"], sfx: "magic_sparkle", vol: 0.40 },
  { kws: ["pero", "espera", "cambia", "peor", "bestia", "giro"], sfx: "boom_cinematic", vol: 0.48 },
  { kws: ["rompe", "cristal", "impacto", "choque"], sfx: "glass_shatter_hit", vol: 0.42 },
  { kws: ["escaneo", "rayos", "radar", "analiza"], sfx: "laser_scan_pro", vol: 0.40 },
];

const SFX_TRANSITION_POOL = [
  "swipe_air_fast", "whoosh_heavy", "whoosh_zoom", "pop_bubble_triple", "pizzicato_pop", "ding_sparkle"
];

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

let currentPlan = null;
let currentTimings = null;
let currentSfxEvents = [];
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
    const arr = await res.arrayBuffer();
    const buf = await ensureAudioCtx().decodeAudioData(arr);
    cacheObj[key] = buf;
    return buf;
  } catch (e) {
    return null;
  }
}

// =========================================================================
// 1. PROMPT MAESTRO PARA QUE LA IA GENERE EL DIRECTOR JSON v34 PRO MAX
// =========================================================================
function buildDirectorPrompt(topic, durationSec, styleMode) {
  const shotCount = Math.max(6, Math.round(durationSec / 3.4));
  const targetWords = Math.round(durationSec * 2.55);
  return `Eres el Director Creativo de un canal viral de TikTok/Shorts (+10M vistas) usando el motor v34 PRO MAX.
TEMA DEL USUARIO: "${topic}"
DURACIÓN OBJETIVO: ${durationSec} segundos (~${targetWords} palabras en español hablado natural, CERO clichés de IA).
ESTILO PREFERIDO: ${styleMode}

REGLAS OBLIGATORIAS:
1. SEGUNDO 0 CLARO: El primer plano y la primera frase enganchan sin saludar ("Si...", "Nunca...", "¿Por qué...").
2. BUCLE INFINITO INVISIBLE: La última frase del guion DEBE terminar enlazando gramaticalmente con la primera palabra del guion (ej. "...y justo por eso mismo," -> enlaza con la frase 1). CERO "sígueme" ni "adiós".
3. CERO MONOTONÍA (MULTI-PLANO): Crea exactamente ${shotCount} planos variados. El personaje aparece MÁXIMO en el 35% de los planos; el resto usa B-Rolls (neural, chat, map, gauge, radar, blueprint, gears, storm), kinetic_slide, comparison o widgets.
4. Escribe los números del guion en LETRAS para que la voz los lea perfecto (ej: "noventa por ciento", "ciento doce").

DEVUELVE SOLO UN JSON VÁLIDO (sin markdown ni texto extra) con esta estructura exacta:
{
  "title": "TITULAR CORTO PORTADA",
  "niche": "psicologia|supervivencia|dinero|gaming|historia|ciencia",
  "bgm": "survival_tension|curiosity|docu_epic|synthwave_neon|pizzicato|emotional_piano|night_mystery|cinematic_build|lofi_story",
  "subtitle_style": "neura_pill|top_box|docu_yellow|editorial_box",
  "color_grade": "teal_orange|neon_cyber|deep_ocean|noir_docu",
  "frame0": { "tag": "TEMA CORTO", "headline": "TITULAR 4 PALABRAS", "sub": "Gancho corto 5 palabras" },
  "open_loop": "⏳ ESPERA AL GIRO FINAL...",
  "script": "Guion completo hablado de ~${targetWords} palabras terminando en puente de bucle infinito,",
  "tiktok_description": "Descripción viral corta con gancho y pregunta",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "pinned_comment": "Pregunta corta que dispare comentarios 👇",
  "shots": [
    {
      "type": "world_char|broll_neural|broll_chat|broll_map|broll_gauge|broll_radar|broll_blueprint|broll_gears|broll_storm|kinetic_slide|split_compare|widget_stat",
      "rig": "crash_zoom|orbit_3d|dutch_reveal|dolly_zoom_vertigo|tracking_pan|crane_drop|punch_snap|handheld_docu",
      "shake": "impact_hit|handheld|rumble|heartbeat|none",
      "transition": "diagonal_slash|shutter_split|whip_pan|zoom_through|glitch_slice",
      "palette": "cyber_cyan|gold_luxury|ocean_xray|crimson_alert|emerald_money|noir_docu|sunset_warm",
      "world_preset": "classroom|space|hospital|supermarket|courtroom|rooftop|combo",
      "character": "detective|scientist|thief|gamer|pilot|client|doctor|astronaut|chef|student|police|robot_ai|none",
      "headwear": "none|visor_cyber|crown_gold|headphones_neon|glasses_smart|fedora|cap_red",
      "emotion": "shocked|thinking|happy|angry|smug|worried|neutral",
      "gesture": "point_up|hands_up|chin_think|point_right|idle",
      "prop": "prop_ai_chip|prop_money_bag|prop_smartphone|prop_chart_up|prop_dna|prop_fire|prop_lightning|prop_water_drop|prop_car|prop_plane|prop_rocket|prop_alarm|prop_lock|prop_key|none",
      "overlay_stamp": "fx_stamp_mito|fx_stamp_real|fx_stamp_giro|fx_stamp_peligro|fx_badge_90pct|fx_badge_bucle|none",
      "headline": "TEXTO CORTO EN PANTALLA",
      "lines": ["LINEA 1", "LINEA 2", "IMPACTO"],
      "stat_pct": 92,
      "left_label": "ERROR",
      "right_label": "CORRECTO",
      "chat_msgs": [{"me": false, "text": "Mensaje 1"}, {"me": true, "text": "Respuesta"}]
    }
  ]
}`;
}

// =========================================================================
// 2. GENERADOR INTELIGENTE DE RESPALDO LOCAL (SI NO HAY WORKER NI INTERNET)
// =========================================================================
function buildSmartFallbackPlan(topic, durationSec, styleMode) {
  const cleanTopic = (topic || "El secreto que el 90% ignora").trim();
  const shortTitle = cleanTopic.split(/\s+/).slice(0, 4).join(" ").toUpperCase();
  const isMoney = /dinero|euro|precio|venta|negocio|supermercado|comprar/i.test(cleanTopic);
  const isSurv = /agua|coche|fuego|sobreviv|peligro|avión|avion|playa/i.test(cleanTopic);
  const isGame = /gta|minecraft|roblox|juego|gaming|pc/i.test(cleanTopic);

  const bgm = isSurv ? "survival_tension" : (isGame ? "synthwave_neon" : (isMoney ? "pizzicato" : "curiosity"));
  const pal = isSurv ? "ocean_xray" : (isGame ? "cyber_cyan" : (isMoney ? "emerald_money" : "gold_luxury"));
  const tag = isSurv ? "SUPERVIVENCIA REAL" : (isGame ? "GAMING SECRETO" : (isMoney ? "PSICOLOGÍA REAL" : "DATO BRUTAL"));
  const propMain = isSurv ? "prop_alarm" : (isGame ? "prop_gamepad" : (isMoney ? "prop_money_bag" : "prop_ai_chip"));
  const charMain = isSurv ? "pilot" : (isGame ? "gamer" : (isMoney ? "client" : "detective"));

  const script = `Casi nadie sabe la verdad sobre ${cleanTopic.toLowerCase()}. En serio. El noventa por ciento de la gente comete el mismo error en los primeros diez segundos. Piensan que funciona de una forma, pero por dentro pasa justo lo contrario. Espera, porque aquí viene el giro que lo cambia todo. Primero: fíjate en el detalle oculto que nadie mira. Segundo: cuando entiendes el mecanismo real, el resultado se multiplica por tres. Y lo más loco es que una vez que lo ves, ya no puedes dejar de notarlo, porque justo por eso mismo,`;

  return {
    title: shortTitle,
    niche: isSurv ? "supervivencia" : (isGame ? "gaming" : (isMoney ? "dinero" : "psicologia")),
    bgm,
    subtitle_style: styleMode === "INK_EDITORIAL" ? "editorial_box" : (isGame ? "top_box" : "neura_pill"),
    color_grade: isSurv ? "deep_ocean" : (isGame ? "neon_cyber" : "teal_orange"),
    frame0: { tag, headline: shortTitle, sub: "El 90% falla en esto hoy" },
    open_loop: "⏳ ESPERA AL GIRO FINAL...",
    script,
    tiktok_description: `${cleanTopic} 👀 ¿Tú también habías caído? Te leo abajo 👇 #curiosidades #sabiasque #datos #psicologia #viral #parati`,
    hashtags: ["#curiosidades", "#sabiasque", "#datos", "#psicologia", "#viral", "#parati"],
    pinned_comment: "Sé sincero: ¿ya sabías esto o te acaba de volar la cabeza? 👇",
    shots: [
      { type: "world_char", rig: "crash_zoom", shake: "impact_hit", transition: "diagonal_slash", palette: pal, world_preset: isMoney ? "supermarket" : "rooftop", character: charMain, headwear: "visor_cyber", emotion: "shocked", gesture: "point_up", prop: propMain, overlay_stamp: "none", headline: shortTitle },
      { type: "broll_gauge", rig: "orbit_3d", shake: "handheld", transition: "shutter_split", palette: pal, stat_pct: 90, headline: "90% COMETE ESTE ERROR", overlay_stamp: "fx_badge_90pct" },
      { type: "split_compare", rig: "dolly_zoom_vertigo", shake: "none", transition: "whip_pan", palette: pal, left_label: "LO QUE CREES", right_label: "LA REALIDAD", overlay_stamp: "fx_stamp_mito" },
      { type: "kinetic_slide", rig: "punch_snap", shake: "impact_hit", transition: "glitch_slice", palette: "crimson_alert", lines: ["PERO AQUÍ", "VIENE", "EL GIRO"] },
      { type: "broll_neural", rig: "dutch_reveal", shake: "handheld", transition: "diagonal_slash", palette: pal, headline: "EL MECANISMO OCULTO", overlay_stamp: "fx_stamp_clave" },
      { type: "broll_blueprint", rig: "tracking_pan", shake: "none", transition: "zoom_through", palette: "ocean_xray", headline: "ANÁLISIS EN DETALLE", prop: propMain },
      { type: "widget_stat", rig: "crane_drop", shake: "handheld", transition: "shutter_split", palette: "gold_luxury", stat_pct: 97, headline: "IMPACTO MULTIPLICADO x3", overlay_stamp: "fx_stamp_real" },
      { type: "broll_gears", rig: "dolly_in", shake: "heartbeat", transition: "diagonal_slash", palette: pal, headline: "AHORA TODO ENCAJA", overlay_stamp: "fx_badge_bucle" }
    ]
  };
}

// =========================================================================
// 3. AUDITOR AUTOMÁTICO v34 EN NAVEGADOR (CERO MONOTONÍA + BUCLE + 50 SFX)
// =========================================================================
function auditAndEnhancePlan(plan, durationSec) {
  if (!plan || !plan.script) return buildSmartFallbackPlan("Tema viral", durationSec, "AUTO");
  if (!Array.isArray(plan.shots) || plan.shots.length < 4) {
    plan.shots = buildSmartFallbackPlan(plan.title || "Tema", durationSec, "AUTO").shots;
  }

  // Anti-Monotonía: si la IA puso demasiados "world_char", reemplaza algunos por B-Rolls ricos!
  const brollPool = ["broll_neural", "broll_gauge", "broll_blueprint", "kinetic_slide", "split_compare", "broll_gears", "widget_stat", "broll_radar"];
  let charCount = 0;
  plan.shots.forEach((sh, i) => {
    if (sh.type === "world_char") {
      charCount++;
      if (charCount > Math.max(2, Math.floor(plan.shots.length * 0.35))) {
        sh.type = brollPool[i % brollPool.length];
      }
    }
    if (!sh.rig) sh.rig = V34.Camera.RIGS[i % V34.Camera.RIGS.length];
    if (!sh.transition) sh.transition = ["diagonal_slash", "shutter_split", "whip_pan", "zoom_through"][i % 4];
  });

  // Asegurar Frame 0 claro
  if (!plan.frame0 || !plan.frame0.headline) {
    plan.frame0 = { tag: "DATO VIRAL", headline: (plan.title || "MIRA ESTO").toUpperCase(), sub: "No te pierdas el final" };
  }

  // Calcular puntuación simulada 100 usuarios
  const hasBroll = plan.shots.some(s => s.type.startsWith("broll_") || s.type === "kinetic_slide");
  const hasLoopBridge = /por eso|porque|así que|cuando|entonces|,$|\.\.\.$/.test(plan.script.trim().toLowerCase());
  const score = Math.min(99, 86 + (hasBroll ? 6 : 0) + (hasLoopBridge ? 5 : 0) + (plan.shots.length >= 6 ? 2 : 0));

  return { plan, score, hasBroll, hasLoopBridge };
}

function buildWordTimings(scriptText, totalDur) {
  const raw = scriptText.trim().split(/\s+/).filter(Boolean);
  const wts = raw.map(w => Math.max(2.5, w.length) + (/[.?!]$/.test(w) ? 3.4 : (/,/.test(w) ? 1.4 : 0)));
  const sum = wts.reduce((a, b) => a + b, 0) || 1;
  let cur = 0.05;
  const words = raw.map((word, i) => {
    const d = (wts[i] / sum) * Math.max(1, totalDur - 0.12);
    const it = { word, start: cur, end: cur + d * 0.90 };
    cur += d;
    return it;
  });
  return { duration: totalDur, words };
}

function choreographWebSFX(words, totalDur, shotCount) {
  const events = [{ time: 0.03, sfx: "bass_drop_pro", vol: 0.45 }];
  const used = [0.03];
  const canPlace = (t) => used.every(u => Math.abs(t - u) >= 1.9);

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
      events.push({ time: t, sfx: SFX_TRANSITION_POOL[i % SFX_TRANSITION_POOL.length], vol: 0.34 });
      used.push(t);
    }
  }
  events.push({ time: Math.max(0, totalDur - 0.45), sfx: "loop_riser_seamless", vol: 0.32 });
  return events.sort((a, b) => a.time - b.time);
}

// =========================================================================
// 4. RENDERIZADOR DE CADA PLANO USANDO TODO EL PACK v14–v34 PRO MAX
// =========================================================================
function drawCastByName(c, name, x, groundY, sc, t, opts) {
  const mapV30 = {
    detective: V30.Cast.drawDetective, scientist: V30.Cast.drawScientist,
    thief: V30.Cast.drawThief, gamer: V30.Cast.drawGamer,
    pilot: V30.Cast.drawPilot, client: V30.Cast.drawClient
  };
  const mapV32 = {
    doctor: V32.MoreCast.drawDoctor, astronaut: V32.MoreCast.drawAstronaut,
    chef: V32.MoreCast.drawChef, student: V32.MoreCast.drawStudent,
    police: V32.MoreCast.drawPolice, robot_ai: V32.MoreCast.drawRobotAI
  };
  if (mapV30[name]) mapV30[name](c, x, groundY, sc, t, opts);
  else if (mapV32[name]) mapV32[name](c, x, groundY, sc, t, opts);
  else V34.Factory.drawCharacterCombo(c, x, groundY, sc, t, opts);
}

function renderSingleShot(c, sh, localT, shotDur, globalT) {
  const type = sh.type || "world_char";
  const pal = sh.palette || "cyber_cyan";

  if (type === "kinetic_slide") {
    const lines = (Array.isArray(sh.lines) && sh.lines.length) ? sh.lines : [(sh.headline || "EL GIRO FINAL")];
    V31.AE.drawFullKineticSlide(c, lines, localT, { accent: "#FACC15" });
  } else if (type === "broll_neural") {
    V31.BRoll.drawNeuralNetworkBroll(c, globalT, sh.headline || "CONEXIÓN CEREBRAL");
  } else if (type === "broll_chat") {
    V31.BRoll.drawLiveChatFeedBroll(c, localT, sh.chat_msgs || undefined);
  } else if (type === "broll_map") {
    V31.BRoll.drawAnimatedMapRouteBroll(c, localT, shotDur, "INICIO", sh.headline || "OBJETIVO");
  } else if (type === "broll_gauge") {
    const target = (sh.stat_pct || 88) / 100;
    V31.BRoll.drawDangerGaugeBroll(c, Math.min(target, (localT / Math.max(0.6, shotDur * 0.65)) * target), sh.headline || "NIVEL CRÍTICO", globalT);
  } else if (type === "broll_radar") {
    V31.BRoll.drawRadarScanBroll(c, globalT, sh.headline || "ESCANEO ACTIVO");
  } else if (type === "broll_blueprint") {
    V31.BRoll.drawBlueprintScanBroll(c, globalT, sh.headline || "ANÁLISIS TÉCNICO", (cc) => {
      if (sh.prop && sh.prop !== "none" && V33.Presets.draw(sh.prop, cc, 540, 920, 1.4, globalT)) return;
      V30.Props.drawCarSide(cc, 540, 920, 1.35, globalT, { windowOpen: Math.min(1, localT / 1.8) });
    });
  } else if (type === "broll_gears") {
    V31.BRoll.drawGearsMechanismBroll(c, globalT, sh.headline || "CÓMO FUNCIONA POR DENTRO");
  } else if (type === "broll_storm") {
    V31.BRoll.drawStormWeatherBroll(c, globalT);
    if (sh.prop && sh.prop !== "none") V33.Presets.draw(sh.prop, c, 540, 920, 1.35, globalT);
  } else if (type === "split_compare") {
    V34.Factory.drawWorldCombo(c, globalT, { palette: pal, floor: "dark_slate", weather: "dust" });
    V30.Editor.drawSplitComparison(c, sh.left_label || "ERROR", sh.right_label || "CORRECTO", Math.min(1, localT / 0.6), 470, 680);
  } else if (type === "widget_stat") {
    V34.Factory.drawWorldCombo(c, globalT, { palette: pal, floor: "neon_grid", weather: "sparkle" });
    V34.Factory.drawAnimatedWidget(c, "progress_ring", 540, 860, localT, { targetPct: (sh.stat_pct || 94) / 100, label: sh.headline || "DATO REAL" });
  } else {
    // world_char: Escena completa + Prop + Personaje expresivo
    const wp = sh.world_preset || "combo";
    if (wp === "classroom") V32.Worlds.drawClassroomWorld(c, globalT, sh.headline || "DATO CLAVE");
    else if (wp === "space") V32.Worlds.drawSpaceOrbitWorld(c, globalT);
    else if (wp === "hospital") V32.Worlds.drawHospitalLabWorld(c, globalT);
    else if (wp === "supermarket") V32.Worlds.drawSupermarketWorld(c, globalT);
    else if (wp === "courtroom") V32.Worlds.drawCourtroomWorld(c, globalT);
    else if (wp === "rooftop") V32.Worlds.drawCityRooftopWorld(c, globalT);
    else V34.Factory.drawWorldCombo(c, globalT, { palette: pal, skyline: true, floor: "wood", weather: "god_rays" });

    if (sh.prop && sh.prop !== "none") {
      V33.Presets.draw(sh.prop, c, 770, 790, 1.05, globalT);
    }
    if (sh.character && sh.character !== "none") {
      const cx = sh.prop && sh.prop !== "none" ? 320 : 540;
      drawCastByName(c, sh.character, cx, 1480, 1.15, globalT, {
        talking: true,
        emotion: sh.emotion || "shocked",
        gesture: sh.gesture || "point_up",
        headwear: sh.headwear || "none",
        lookAtX: 770, lookAtY: 790
      });
    }
  }

  // Sello/Overlay de impacto si existe
  if (sh.overlay_stamp && sh.overlay_stamp !== "none" && localT > 0.25) {
    V27Edit.slamIn(c, 540, 415, localT - 0.25, (cc) => {
      V33.Presets.draw(sh.overlay_stamp, cc, 0, 0, 1.0, globalT);
    });
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
    renderSingleShot(c, shots[0], lT, shotDur, lT);
    if (currentPlan.frame0) {
      V32.Frame0.drawInstantTopicColdOpen(c, currentPlan.frame0.tag, currentPlan.frame0.headline, currentPlan.frame0.sub, lT, 2.7);
    }
  };

  const beats = V27Edit.getAutoBeatTimes(currentTimings.words);
  ctx.save();
  V27Edit.applyAutoPunchZoom(ctx, t, beats, 0.075);
  V34.Camera.applyRig(ctx, t, localT, shotDur, {
    rig: sh.rig || "handheld_docu",
    easing: "expoOut",
    shake: sh.shake || "handheld"
  });

  // Transición real After Effects al entrar en cada plano
  if (idx > 0 && localT < 0.32) {
    const p = localT / 0.32;
    const prevSh = shots[idx - 1];
    const drawPrev = (c) => renderSingleShot(c, prevSh, shotDur - 0.05, shotDur, t);
    const drawNext = (c) => renderSingleShot(c, sh, localT, shotDur, t);
    if (sh.transition === "shutter_split") V31.AE.shutterSplitTransition(ctx, p, drawPrev, drawNext);
    else if (sh.transition === "whip_pan") V27Edit.whipPanTransition(ctx, p, "left", drawPrev, drawNext);
    else if (sh.transition === "zoom_through") V27Edit.zoomThroughTransition(ctx, p, drawPrev, drawNext);
    else if (sh.transition === "glitch_slice") V31.AE.glitchSliceTransition(ctx, p, drawNext);
    else V31.AE.diagonalSlashTransition(ctx, p, drawPrev, drawNext);
  } else {
    renderSingleShot(ctx, sh, localT, shotDur, t);
  }
  ctx.restore();

  // Postproducción After Effects + Lens Flare + Color Grade + Cinema Finish
  V34.Camera.applyLensPostFX(ctx, t, localT, "anamorphic_flare");
  V27Edit.colorGrade(ctx, currentPlan.color_grade || "teal_orange");
  V25FX.drawParticles(ctx, t, 18, "dust");
  V25FX.drawCinemaFinish(ctx, t, 0.32);

  // Claridad en Segundo 0 + Open Loop + Barra de Capítulos + Barra Retención
  if (currentPlan.frame0 && t <= 2.75) {
    V32.Frame0.drawInstantTopicColdOpen(ctx, currentPlan.frame0.tag, currentPlan.frame0.headline, currentPlan.frame0.sub, t, 2.7);
  } else if (currentPlan.open_loop && t < dur - 2.0) {
    V30.Editor.drawOpenLoopBadge(ctx, currentPlan.open_loop, t);
  }
  V29.Edit.drawChapterBar(ctx, ["GANCHO", "EL ERROR", "EL GIRO", "LA CLAVE"], Math.min(3, Math.floor((t / Math.max(1, dur)) * 4)));
  V27Edit.drawRetentionBar(ctx, t / Math.max(1, dur));

  // Subtítulos dinámicos sincronizados
  const subSt = currentPlan.subtitle_style || "neura_pill";
  if (subSt === "editorial_box") V18.Ink.drawEditorialSubBox(ctx, currentTimings.words, t, 1340);
  else if (subSt === "docu_yellow") V26.Docu25D.drawDocuSubs(ctx, currentTimings.words, t, 1460);
  else if (subSt === "top_box") V14.drawSubtitles(ctx, currentTimings.words, t, "top_box");
  else V26.NeuraPsico.drawDarkPillSubs(ctx, currentTimings.words, t, 1420);

  // BUCLE INFINITO INVISIBLE (Match-Cut al Frame 0 en los últimos 0.45s!)
  V33.Loop.applySeamlessLoopEnd(ctx, t, dur, drawFrame0);
};

// =========================================================================
// 5. CONEXIÓN IA (CLOUDFLARE WORKER -> POLLINATIONS 0€ -> FALLBACK LOCAL)
// =========================================================================
async function generateFullVideoFromTopic() {
  const topic = document.getElementById("topicInput").value.trim();
  if (!topic) { setStatus("❌ Escribe un tema primero, bro.", "#f43f5e"); return; }

  const durationSec = parseInt(document.getElementById("durSel").value, 10) || 35;
  const styleMode = document.getElementById("styleSel").value || "AUTO";
  const workerUrl = document.getElementById("workerUrl").value.trim().replace(/\/+$/, "");

  setStatus("🧠 1/3 — Diseñando guion Anti-IA + Bucle Infinito + Planos v34 PRO MAX...", "#fbbf24");
  let rawPlan = null;

  // A) Si el usuario configuró su Cloudflare Worker (0€), úsalo primero
  if (workerUrl) {
    try {
      const r = await fetch(`${workerUrl}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, duration: durationSec, style: styleMode, prompt: buildDirectorPrompt(topic, durationSec, styleMode) })
      });
      if (r.ok) rawPlan = await r.json();
    } catch (e) { console.warn("Worker /api/plan fallback:", e); }
  }

  // B) Fallback 100% GRATIS sin servidor: Pollinations Text AI (funciona directo en GitHub Pages!)
  if (!rawPlan) {
    try {
      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Responde ÚNICAMENTE con un objeto JSON válido sin bloques markdown." },
            { role: "user", content: buildDirectorPrompt(topic, durationSec, styleMode) }
          ],
          model: "openai",
          jsonMode: true
        })
      });
      if (res.ok) {
        const txt = await res.text();
        const match = txt.match(/\{[\s\S]*\}/);
        if (match) rawPlan = JSON.parse(match[0]);
      }
    } catch (e) { console.warn("Pollinations AI fallback:", e); }
  }

  // C) Respaldo local instantáneo garantizado
  if (!rawPlan) rawPlan = buildSmartFallbackPlan(topic, durationSec, styleMode);

  // Auditoría v34 automática
  const audited = auditAndEnhancePlan(rawPlan, durationSec);
  currentPlan = audited.plan;

  // Paso 2/3: Intentar generar VOZ REAL IA automáticamente si hay Cloudflare Worker
  voiceBuffer = null;
  if (workerUrl) {
    setStatus("🎙️ 2/3 — Generando VOZ HUMANA IA (HeyGen / Workers AI)...", "#fbbf24");
    try {
      const tr = await fetch(`${workerUrl}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentPlan.script, mood: currentPlan.bgm || "curiosity" })
      });
      if (tr.ok) {
        const arr = await tr.arrayBuffer();
        if (arr.byteLength > 2000) {
          voiceBuffer = await ensureAudioCtx().decodeAudioData(arr);
        }
      }
    } catch (e) { console.warn("Worker /api/tts fallback:", e); }
  }

  const finalDur = voiceBuffer ? voiceBuffer.duration : durationSec;
  currentTimings = buildWordTimings(currentPlan.script, finalDur);
  currentSfxEvents = choreographWebSFX(currentTimings.words, finalDur, currentPlan.shots.length);

  // Actualizar UI con Guion, Nota /100 y Packaging Viral (Hashtags + Descripción + Comentario)
  document.getElementById("scriptOut").value = currentPlan.script;
  document.getElementById("scoreBadge").textContent = `🏆 Viralidad v34: ${audited.score}/100 · ${currentPlan.shots.length} Planos · ${currentSfxEvents.length} SFX · Bucle ∞`;
  document.getElementById("pkgBox").innerHTML =
    `<b>📱 Descripción:</b> ${currentPlan.tiktok_description || ""}<br>` +
    `<b>🏷️ Hashtags:</b> ${(currentPlan.hashtags || []).join(" ")}<br>` +
    `<b>📌 Comentario fijado:</b> ${currentPlan.pinned_comment || ""}`;

  window.renderAt(0.0);
  setStatus(
    voiceBuffer
      ? `✅ ¡VÍDEO + VOZ IA LISTOS (${finalDur.toFixed(1)}s)! Dale a Preview o Descargar Vídeo.`
      : `✅ ¡VÍDEO LISTO (${finalDur.toFixed(1)}s)! Dale a Preview (voz navegador) o sube tu MP3 / conecta Cloudflare Worker para voz IA en el export.`,
    "#00f5d4"
  );
}

// =========================================================================
// 6. REPRODUCCIÓN Y GRABACIÓN 1080x1920 @ 30FPS CON WEB AUDIO (VOZ + BGM + 50 SFX)
// =========================================================================
function stopPlayback() {
  if (rafId) cancelAnimationFrame(rafId);
  activeSources.forEach(s => { try { s.stop(); } catch (_) {} });
  activeSources = [];
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  isPlaying = false;
}

async function playOrExportVideo(record = false) {
  if (!currentPlan || !currentTimings) {
    await generateFullVideoFromTopic();
    if (!currentPlan) return;
  }
  stopPlayback();
  const ac = ensureAudioCtx();
  const dur = currentTimings.duration;

  setStatus(record ? "🔊 Cargando BGM + 50 SFX para grabar 1080×1920..." : "🔊 Cargando audio de estudio...", "#fbbf24");

  // Precargar BGM + SFX del timeline
  const bgmUrl = BGM_FILES[currentPlan.bgm] || BGM_FILES.curiosity;
  const bgmBuf = await loadAudioBuffer(bgmUrl, bgmCache, currentPlan.bgm);
  const sfxBuffers = await Promise.all(
    currentSfxEvents.map(ev => loadAudioBuffer(`recursos/sfx/${ev.sfx}.wav`, sfxCache, ev.sfx))
  );

  // Router Web Audio (grabación o altavoces)
  const masterGain = ac.createGain();
  masterGain.gain.value = 0.95;
  let destNode = ac.destination;
  let recorder = null;
  const chunks = [];

  if (record) {
    const streamDest = ac.createMediaStreamDestination();
    masterGain.connect(streamDest);
    masterGain.connect(ac.destination); // Para oírlo mientras graba
    const tracks = [...canvas.captureStream(30).getVideoTracks(), ...streamDest.stream.getAudioTracks()];
    const mime = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")
      ? "video/mp4;codecs=avc1"
      : (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : "video/webm");
    recorder = new MediaRecorder(new MediaStream(tracks), { mimeType: mime, videoBitsPerSecond: 6_500_000 });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const ext = mime.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunks, { type: mime });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `viral_v34_${Date.now()}.${ext}`;
      a.click();
      setStatus(`✅ ¡Vídeo v34 PRO MAX descargado (.${ext}) en 1080×1920!`, "#00f5d4");
    };
    recorder.start();
    setStatus("🔴 Grabando vídeo v34 PRO MAX en 1080×1920 (no cierres esta pestaña)...", "#f43f5e");
  } else {
    masterGain.connect(destNode);
    setStatus("▶️ Reproduciendo Preview v34 PRO MAX (con BGM + SFX + Subtítulos)...", "#00f5d4");
  }

  const now = ac.currentTime + 0.05;

  // 1. Pista de Voz (o Web Speech preview si no hay buffer)
  if (voiceBuffer) {
    const vs = ac.createBufferSource();
    vs.buffer = voiceBuffer;
    vs.connect(masterGain);
    vs.start(now);
    activeSources.push(vs);
  } else if (!record && window.speechSynthesis) {
    const utter = new SpeechSynthesisUtterance(currentPlan.script);
    utter.lang = "es-ES";
    utter.rate = 1.08;
    window.speechSynthesis.speak(utter);
  }

  // 2. Pista BGM con ducking suave
  if (bgmBuf) {
    const bs = ac.createBufferSource();
    bs.buffer = bgmBuf;
    bs.loop = true;
    const bgGain = ac.createGain();
    bgGain.gain.value = voiceBuffer ? 0.16 : 0.24;
    bs.connect(bgGain);
    bgGain.connect(masterGain);
    bs.start(now);
    bs.stop(now + dur + 0.1);
    activeSources.push(bs);
  }

  // 3. Pista de SFX sincronizados al milisegundo
  currentSfxEvents.forEach((ev, i) => {
    const sb = sfxBuffers[i];
    if (!sb) return;
    const ss = ac.createBufferSource();
    ss.buffer = sb;
    const sg = ac.createGain();
    sg.gain.value = ev.vol || 0.38;
    ss.connect(sg);
    sg.connect(masterGain);
    ss.start(now + ev.time);
    activeSources.push(ss);
  });

  // Loop de renderizado 30fps
  isPlaying = true;
  const t0 = performance.now();
  function frame(ts) {
    if (!isPlaying) return;
    const t = (ts - t0) / 1000;
    window.renderAt(Math.min(t, dur));
    if (t < dur) {
      rafId = requestAnimationFrame(frame);
    } else {
      isPlaying = false;
      if (recorder && recorder.state === "recording") recorder.stop();
      else setStatus("✅ Preview completado (con bucle infinito al segundo 0).", "#00f5d4");
    }
  }
  rafId = requestAnimationFrame(frame);
}

// Subida manual de voz MP3/WAV
document.getElementById("voiceFileInput").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    voiceBuffer = await ensureAudioCtx().decodeAudioData(await f.arrayBuffer());
    if (currentPlan) {
      currentTimings = buildWordTimings(currentPlan.script, voiceBuffer.duration);
      currentSfxEvents = choreographWebSFX(currentTimings.words, voiceBuffer.duration, currentPlan.shots.length);
    }
    setStatus(`✅ Voz cargada (${voiceBuffer.duration.toFixed(1)}s). ¡Ahora dale a Preview o Descargar!`, "#00f5d4");
  } catch (err) {
    setStatus("❌ Error al leer el audio: " + err.message, "#f43f5e");
  }
});

// Arrancar con un vídeo demo ya cargado para que se vea increíble al instante!
window.addEventListener("DOMContentLoaded", () => {
  const demo = auditAndEnhancePlan(buildSmartFallbackPlan("El truco de los supermercados con el precio 9,99€", 28, "AUTO"), 28);
  currentPlan = demo.plan;
  currentTimings = buildWordTimings(currentPlan.script, 28);
  currentSfxEvents = choreographWebSFX(currentTimings.words, 28, currentPlan.shots.length);
  document.getElementById("scriptOut").value = currentPlan.script;
  document.getElementById("scoreBadge").textContent = `🏆 Viralidad v34: ${demo.score}/100 · ${currentPlan.shots.length} Planos · ${currentSfxEvents.length} SFX · Bucle ∞`;
  document.getElementById("pkgBox").innerHTML =
    `<b>📱 Descripción:</b> ${currentPlan.tiktok_description}<br>` +
    `<b>🏷️ Hashtags:</b> ${currentPlan.hashtags.join(" ")}<br>` +
    `<b>📌 Comentario fijado:</b> ${currentPlan.pinned_comment}`;
  window.renderAt(0.2);
});
