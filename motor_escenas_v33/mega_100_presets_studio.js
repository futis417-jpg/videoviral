/**
 * =========================================================================
 * V33 INFINITE-LOOP APEX — MEGA 100+ PRESETS LIBRARY (1080x1920, 30fps)
 * 104 Presets listos para llamar con `V33.Presets.draw(id, ctx, x, y, sc, t)`:
 * - 36 Objetos/Props (tech, dinero, ciencia, escuela, comida, peligro, gaming)
 * - 24 Personajes/Roles (heredan V28Anim + accesorios/paletas únicos)
 * - 22 Escenas/Mundos Completos (interiores, exteriores, ciencia, neón, docu)
 * - 22 Overlays/FX/HUDs (sellos, alertas, contadores, flechas, tarjetas)
 * =========================================================================
 */
(function (global) {
  const INK = "#16161E";

  // 36 PROPS PARAMÉTRICOS LIMPIOS (badge vector pro + icono detallado)
  const PROP_CATALOG = {
    // Tech & Social (10)
    prop_smartphone:   { bg: "#0F172A", ring: "#38BDF8", icon: "📱", label: "SMARTPHONE" },
    prop_laptop:       { bg: "#1E293B", ring: "#60A5FA", icon: "💻", label: "PORTÁTIL" },
    prop_camera:       { bg: "#18181B", ring: "#F43F5E", icon: "📸", label: "CÁMARA" },
    prop_microphone:   { bg: "#1E1B4B", ring: "#A78BFA", icon: "🎙️", label: "MICRÓFONO" },
    prop_wifi:         { bg: "#0C4A6E", ring: "#00F5D4", icon: "📡", label: "SEÑAL" },
    prop_battery_low:  { bg: "#450A0A", ring: "#EF4444", icon: "🪫", label: "BATERÍA 1%" },
    prop_notification: { bg: "#1E293B", ring: "#FACC15", icon: "🔔", label: "ALERTA" },
    prop_gamepad:      { bg: "#2E1065", ring: "#E879F9", icon: "🎮", label: "GAMING" },
    prop_vr_headset:   { bg: "#0F172A", ring: "#22D3EE", icon: "🥽", label: "REALIDAD VR" },
    prop_ai_chip:      { bg: "#042F2E", ring: "#00F5D4", icon: "🧠", label: "CHIP IA" },
    // Dinero & Negocios (8)
    prop_money_bag:    { bg: "#052E16", ring: "#22C55E", icon: "💰", label: "DINERO" },
    prop_credit_card:  { bg: "#1E3A8A", ring: "#FACC15", icon: "💳", label: "TARJETA" },
    prop_diamond:      { bg: "#083344", ring: "#38BDF8", icon: "💎", label: "VALOR" },
    prop_chart_up:     { bg: "#052E16", ring: "#4ADE80", icon: "📈", label: "SUBIDA" },
    prop_chart_down:   { bg: "#450A0A", ring: "#F87171", icon: "📉", label: "CAÍDA" },
    prop_briefcase:    { bg: "#451A03", ring: "#F59E0B", icon: "💼", label: "NEGOCIO" },
    prop_crown:        { bg: "#422006", ring: "#FACC15", icon: "👑", label: "TOP #1" },
    prop_ticket:       { bg: "#4C0519", ring: "#FB7185", icon: "🎫", label: "ENTRADA" },
    // Ciencia, Salud & Supervivencia (10)
    prop_dna:          { bg: "#172554", ring: "#38BDF8", icon: "🧬", label: "ADN" },
    prop_microscope:   { bg: "#0F172A", ring: "#2DD4BF", icon: "🔬", label: "CIENCIA" },
    prop_pill:         { bg: "#4C0519", ring: "#F43F5E", icon: "💊", label: "MEDICINA" },
    prop_fire:         { bg: "#431407", ring: "#FB923C", icon: "🔥", label: "FUEGO" },
    prop_lightning:    { bg: "#422006", ring: "#FACC15", icon: "⚡", label: "IMPACTO" },
    prop_water_drop:   { bg: "#082F49", ring: "#38BDF8", icon: "💧", label: "AGUA" },
    prop_compass:      { bg: "#1E293B", ring: "#FBBF24", icon: "🧭", label: "RUMBO" },
    prop_hourglass:    { bg: "#292524", ring: "#FACC15", icon: "⏳", label: "TIEMPO" },
    prop_magnifying:   { bg: "#1E293B", ring: "#38BDF8", icon: "🔍", label: "DETALLE" },
    prop_shield:       { bg: "#064E3B", ring: "#34D399", icon: "🛡️", label: "ESCUDO" },
    // Objetos Diarios & Misterio (8)
    prop_key:          { bg: "#422006", ring: "#FACC15", icon: "🔑", label: "CLAVE" },
    prop_lock:         { bg: "#1E293B", ring: "#EF4444", icon: "🔒", label: "BLOQUEADO" },
    prop_book:         { bg: "#3B0764", ring: "#C084FC", icon: "📖", label: "HISTORIA" },
    prop_coffee:       { bg: "#451A03", ring: "#FDBA74", icon: "☕", label: "CAFÉ" },
    prop_car:          { bg: "#450A0A", ring: "#F87171", icon: "🚗", label: "COCHE" },
    prop_plane:        { bg: "#0C4A6E", ring: "#7DD3FC", icon: "✈️", label: "VUELO" },
    prop_rocket:       { bg: "#1E1B4B", ring: "#F472B6", icon: "🚀", label: "DESPEGUE" },
    prop_alarm:        { bg: "#450A0A", ring: "#EF4444", icon: "🚨", label: "EMERGENCIA" },
  };

  // 24 PERSONAJES COMPLETOS (heredan V28Anim.drawExpressiveCharacter con outfits únicos)
  const CHAR_CATALOG = {
    char_host_yellow:    { hoodie: "#FACC15", pants: "#1E293B", hair: "#3E2723", emotion: "happy",    gesture: "point_up" },
    char_detective:      { hoodie: "#C2A378", pants: "#3E342B", hair: "#2B2118", emotion: "thinking", gesture: "chin_think" },
    char_scientist:      { hoodie: "#F8FAFC", pants: "#334155", hair: "#94A3B8", emotion: "happy",    gesture: "point_up" },
    char_thief:          { hoodie: "#1E293B", pants: "#0F172A", hair: "#111827", emotion: "smug",     gesture: "idle" },
    char_gamer:          { hoodie: "#7C3AED", pants: "#1E1B4B", hair: "#1F2937", emotion: "happy",    gesture: "hands_up" },
    char_pilot:          { hoodie: "#78350F", pants: "#1E293B", hair: "#451A03", emotion: "neutral",  gesture: "point_right" },
    char_client:         { hoodie: "#1E3A8A", pants: "#0F172A", hair: "#1F2937", emotion: "worried",  gesture: "idle" },
    char_doctor:         { hoodie: "#FFFFFF", pants: "#0284C7", hair: "#1E293B", emotion: "neutral",  gesture: "point_up" },
    char_astronaut:      { hoodie: "#F1F5F9", pants: "#CBD5E1", hair: "#334155", emotion: "shocked",  gesture: "hands_up" },
    char_chef:           { hoodie: "#FFFFFF", pants: "#1E293B", hair: "#451A03", emotion: "happy",    gesture: "point_right" },
    char_student:        { hoodie: "#3B82F6", pants: "#1E293B", hair: "#27272A", emotion: "thinking", gesture: "chin_think" },
    char_police:         { hoodie: "#1D4ED8", pants: "#0F172A", hair: "#111827", emotion: "angry",    gesture: "point_right" },
    char_robot_ai:       { hoodie: "#334155", pants: "#1E293B", hair: "#00F5D4", emotion: "neutral",  gesture: "point_up" },
    char_ceo_suit:       { hoodie: "#0F172A", pants: "#020617", hair: "#334155", emotion: "smug",     gesture: "point_up" },
    char_athlete:        { hoodie: "#EF4444", pants: "#111827", hair: "#1F2937", emotion: "happy",    gesture: "hands_up" },
    char_teacher:        { hoodie: "#047857", pants: "#1E293B", hair: "#451A03", emotion: "neutral",  gesture: "point_up" },
    char_hacker:         { hoodie: "#064E3B", pants: "#020617", hair: "#0F172A", emotion: "smug",     gesture: "chin_think" },
    char_survivor:       { hoodie: "#B45309", pants: "#292524", hair: "#3F2E21", emotion: "worried",  gesture: "hands_up" },
    char_judge:          { hoodie: "#18181B", pants: "#09090B", hair: "#E2E8F0", emotion: "angry",    gesture: "point_up" },
    char_artist:         { hoodie: "#DB2777", pants: "#1E293B", hair: "#4C1D95", emotion: "happy",    gesture: "point_right" },
    char_firefighter:    { hoodie: "#DC2626", pants: "#1E293B", hair: "#1F2937", emotion: "shocked",  gesture: "point_right" },
    char_explorer:       { hoodie: "#A16207", pants: "#3F3F46", hair: "#451A03", emotion: "happy",    gesture: "point_up" },
    char_skeptic:        { hoodie: "#475569", pants: "#1E293B", hair: "#1F2937", emotion: "thinking", gesture: "chin_think" },
    char_winner:         { hoodie: "#10B981", pants: "#064E3B", hair: "#1E293B", emotion: "happy",    gesture: "hands_up" },
  };

  // 22 ESCENAS/MUNDOS TEMÁTICOS (fondos con atmósfera y profundidad real)
  const WORLD_CATALOG = {
    world_orbital_dark:   ["#19355C", "#071122"],
    world_crimson_alert:  ["#450A0A", "#090204"],
    world_cyber_neon:     ["#3B0764", "#090414"],
    world_deep_ocean:     ["#0E7490", "#041621"],
    world_emerald_money:  ["#065F46", "#021811"],
    world_amber_cinema:   ["#78350F", "#140A04"],
    world_midnight_city:  ["#1E1B4B", "#050714"],
    world_paper_editorial:["#F3EEE3", "#E4DAC6"],
    world_lab_sterile:    ["#1E3A5F", "#0A1422"],
    world_jungle_night:   ["#14532D", "#05140B"],
    world_desert_sunset:  ["#9A3412", "#1C0A05"],
    world_ice_arctic:     ["#0369A1", "#081C2E"],
    world_volcano_magma:  ["#7F1D1D", "#120404"],
    world_gold_luxury:    ["#713F12", "#0D0902"],
    world_matrix_code:    ["#064E3B", "#020B07"],
    world_retro_vhs:      ["#4C1D95", "#0E071B"],
    world_court_wood:     ["#4A2C18", "#1A0E06"],
    world_classroom:      ["#14532D", "#0A2516"],
    world_space_cosmos:   ["#1E1B4B", "#02040A"],
    world_supermarket:    ["#1E293B", "#0B1120"],
    world_hospital_ecg:   ["#0F1E2E", "#050A12"],
    world_rooftop_moon:   ["#2A1F4D", "#0A1026"],
  };

  // 22 OVERLAYS / SELLOS / HUDs LISTOS
  const OVERLAY_CATALOG = {
    fx_stamp_mito:        { text: "MITO",            bg: "#DC2626", fg: "#FFFFFF" },
    fx_stamp_real:        { text: "100% REAL",       bg: "#10B981", fg: "#052E16" },
    fx_stamp_trampa:      { text: "TRAMPA",          bg: "#F59E0B", fg: "#0F172A" },
    fx_stamp_prohibido:   { text: "NO LO HAGAS",     bg: "#EF4444", fg: "#FFFFFF" },
    fx_stamp_secreto:     { text: "SECRETO",         bg: "#7C3AED", fg: "#FFFFFF" },
    fx_stamp_peligro:     { text: "PELIGRO",         bg: "#DC2626", fg: "#FACC15" },
    fx_stamp_verificado:  { text: "VERIFICADO ✓",    bg: "#0EA5E9", fg: "#FFFFFF" },
    fx_stamp_fallo:       { text: "ERROR GRAVE",     bg: "#991B1B", fg: "#FFFFFF" },
    fx_stamp_clave:       { text: "LA CLAVE",        bg: "#FACC15", fg: "#0F172A" },
    fx_stamp_giro:        { text: "GIRO FINAL",      bg: "#00F5D4", fg: "#050811" },
    fx_badge_paso1:       { text: "PASO 1",          bg: "#1E293B", fg: "#38BDF8" },
    fx_badge_paso2:       { text: "PASO 2",          bg: "#1E293B", fg: "#38BDF8" },
    fx_badge_paso3:       { text: "PASO 3",          bg: "#1E293B", fg: "#38BDF8" },
    fx_badge_paso4:       { text: "PASO 4",          bg: "#1E293B", fg: "#22C55E" },
    fx_badge_90pct:       { text: "90% FALLA",       bg: "#DC2626", fg: "#FFFFFF" },
    fx_badge_espera:      { text: "⏳ ESPERA AL FINAL", bg: "#0F172A", fg: "#00F5D4" },
    fx_badge_guarda:      { text: "🔖 GUARDA ESTO",   bg: "#0F172A", fg: "#FACC15" },
    fx_badge_comenta:     { text: "💬 COMENTA",       bg: "#FFFFFF", fg: "#0F172A" },
    fx_badge_comparte:    { text: "🔁 COMPÁRTELO",    bg: "#00F5D4", fg: "#050811" },
    fx_badge_en_vivo:     { text: "🔴 EN DIRECTO",    bg: "#DC2626", fg: "#FFFFFF" },
    fx_badge_dato:        { text: "📊 DATO REAL",     bg: "#1D4ED8", fg: "#FFFFFF" },
    fx_badge_bucle:       { text: "♾️ MIRA OTRA VEZ", bg: "#0F172A", fg: "#FACC15" },
  };

  const Presets = {
    listAll() {
      return [
        ...Object.keys(PROP_CATALOG),
        ...Object.keys(CHAR_CATALOG),
        ...Object.keys(WORLD_CATALOG),
        ...Object.keys(OVERLAY_CATALOG),
      ];
    },

    count() { return this.listAll().length; },

    draw(id, ctx, x = 540, y = 960, sc = 1.0, t = 0, extra = {}) {
      if (PROP_CATALOG[id]) {
        const p = PROP_CATALOG[id];
        const bob = Math.sin(t * 3.5) * 8;
        ctx.save();
        ctx.translate(x, y + bob);
        ctx.scale(sc, sc);
        ctx.shadowColor = p.ring; ctx.shadowBlur = 26;
        ctx.fillStyle = p.bg; ctx.strokeStyle = p.ring; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.roundRect(-125, -125, 250, 250, 48); ctx.fill(); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.font = "110px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(p.icon, 0, -14);
        ctx.fillStyle = "#FFFFFF"; ctx.font = "900 24px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(extra.label || p.label, 0, 86, 220);
        ctx.restore();
        return true;
      }
      if (CHAR_CATALOG[id]) {
        const opts = Object.assign({}, CHAR_CATALOG[id], extra);
        if (global.V28Anim && global.V28Anim.drawExpressiveCharacter) {
          global.V28Anim.drawExpressiveCharacter(ctx, x, y, sc, t, opts);
        }
        return true;
      }
      if (WORLD_CATALOG[id]) {
        const [c1, c2] = WORLD_CATALOG[id];
        const g = ctx.createRadialGradient(540, 760, 80, 540, 960, 1250);
        g.addColorStop(0, c1); g.addColorStop(1, c2);
        ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
        return true;
      }
      if (OVERLAY_CATALOG[id]) {
        const o = OVERLAY_CATALOG[id];
        ctx.save();
        ctx.translate(x, y); ctx.scale(sc, sc);
        ctx.font = "900 40px 'Plus Jakarta Sans', sans-serif";
        const txt = extra.text || o.text;
        const tw = Math.min(860, ctx.measureText(txt).width + 76);
        ctx.fillStyle = o.bg; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.roundRect(-tw / 2, -40, tw, 80, 22); ctx.fill(); ctx.stroke();
        ctx.fillStyle = o.fg; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(txt, 0, 2, tw - 30);
        ctx.restore();
        return true;
      }
      return false;
    }
  };

  // MOTOR DE BUCLE INFINITO INVISIBLE (Visual Match-Cut últimos 0.45s -> Frame 0!)
  const Loop = {
    applySeamlessLoopEnd(ctx, t, duration, drawFrame0Fn) {
      const rem = duration - t;
      if (rem > 0.45 || rem < 0) return;
      const p = 1 - rem / 0.45; // 0 -> 1 en los últimos 0.45s
      const e = p * p * (3 - 2 * p);
      ctx.save();
      ctx.globalAlpha = e;
      const z = 1.12 - 0.12 * e;
      ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960);
      if (drawFrame0Fn) drawFrame0Fn(ctx, 0.0);
      ctx.restore();
    }
  };

  global.V33 = Object.assign(global.V33 || {}, { Presets, Loop });
})(window);
