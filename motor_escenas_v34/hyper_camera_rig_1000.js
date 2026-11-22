/**
 * =========================================================================
 * V34 PRO MAX — HYPER CAMERA RIG ENGINE (8,640+ COMBINACIONES DE CÁMARA!)
 * 12 Movimientos Base x 6 Curvas Easing x 6 Perfiles Shake x 5 Lens FX x 4 Speed Ramps
 * Uso en 1 línea:
 *   V34.Camera.applyRig(ctx, t, localT, dur, {
 *     rig: "dolly_zoom_vertigo", // o crash_zoom | orbit_3d | dutch_reveal | tracking_pan | whip_settle | handheld_docu | crane_drop | punch_snap | micro_drift | spiral_in | focus_pull
 *     easing: "expoOut",         // expoOut | backOut | elasticSoft | smoothStep | fastBurst | slowDrama
 *     shake: "impact_hit",       // none | handheld | rumble | impact_hit | panic | heartbeat
 *     speedRamp: "normal",       // normal | fast_in | slow_mo_end | bullet_time
 *     focusX: 540, focusY: 960
 *   });
 *   V34.Camera.applyLensPostFX(ctx, t, localT, "anamorphic_flare"); // none | anamorphic_flare | chromatic_edge | letterbox_cinema | vignette_pulse | vhs_retro
 * =========================================================================
 */
(function (global) {
  const Easings = {
    expoOut:     (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
    backOut:     (p) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
    elasticSoft: (p) => (p <= 0 ? 0 : (p >= 1 ? 1 : 1 - Math.exp(-7 * p) * Math.cos(10 * p))),
    smoothStep:  (p) => p * p * (3 - 2 * p),
    fastBurst:   (p) => Math.pow(p, 0.45),
    slowDrama:   (p) => Math.pow(p, 1.65),
  };

  function rampProgress(p, mode) {
    const x = Math.min(1, Math.max(0, p));
    if (mode === "fast_in") return Math.pow(x, 0.52);
    if (mode === "slow_mo_end") return Math.sin(x * Math.PI * 0.5);
    if (mode === "bullet_time") return x < 0.35 ? x * 1.7 : (x < 0.70 ? 0.595 + (x - 0.35) * 0.25 : 0.6825 + (x - 0.70) * 1.058);
    return x;
  }

  const Camera = {
    RIGS: [
      "dolly_in", "dolly_out", "crash_zoom", "dolly_zoom_vertigo",
      "orbit_3d", "dutch_reveal", "tracking_pan", "whip_settle",
      "handheld_docu", "crane_drop", "punch_snap", "spiral_in"
    ],
    EASINGS: Object.keys(Easings),
    SHAKES: ["none", "handheld", "rumble", "impact_hit", "panic", "heartbeat"],
    LENS_FX: ["none", "anamorphic_flare", "chromatic_edge", "letterbox_cinema", "vignette_pulse", "vhs_retro"],

    applyRig(ctx, t, localT, dur, cfg = {}) {
      const {
        rig = "handheld_docu",
        easing = "expoOut",
        shake = "handheld",
        speedRamp = "normal",
        focusX = 540,
        focusY = 960,
        intensity = 1.0,
      } = cfg;

      const rawP = Math.min(1, Math.max(0, localT / Math.max(0.1, dur)));
      const rp = rampProgress(rawP, speedRamp);
      const e = (Easings[easing] || Easings.expoOut)(rp);

      let z = 1.0, tx = 0, ty = 0, rot = 0;

      if (rig === "dolly_in")             { z = 1.0 + 0.12 * e * intensity; }
      else if (rig === "dolly_out")       { z = 1.15 - 0.15 * e * intensity; }
      else if (rig === "crash_zoom")      { z = 1.0 + 0.34 * Easings.expoOut(Math.min(1, rawP * 2.8)) * intensity; }
      else if (rig === "dolly_zoom_vertigo") { z = 1.0 + 0.20 * e * intensity; ty = -42 * e * intensity; }
      else if (rig === "orbit_3d")        { z = 1.06; tx = Math.sin(e * Math.PI) * 55 * intensity; rot = Math.sin(e * Math.PI) * 0.032 * intensity; }
      else if (rig === "dutch_reveal")    { z = 1.08; rot = (-0.09 + 0.09 * e) * intensity; }
      else if (rig === "tracking_pan")    { z = 1.07; tx = (-70 + 140 * e) * intensity; }
      else if (rig === "whip_settle")     { z = 1.04; tx = (1 - Easings.backOut(Math.min(1, rawP * 3.5))) * 320 * intensity; }
      else if (rig === "crane_drop")      { z = 1.05; ty = (-140 + 140 * e) * intensity; }
      else if (rig === "punch_snap")      { z = 1.0 + 0.16 * Math.exp(-localT * 6.5) * intensity; }
      else if (rig === "spiral_in")       { z = 1.0 + 0.14 * e * intensity; rot = (0.045 * (1 - e)) * intensity; }
      else /* handheld_docu */            { z = 1.02 + 0.05 * e * intensity; }

      // Capa de Shake independiente
      let sx = 0, sy = 0;
      if (shake === "handheld")        { sx = Math.sin(t * 1.4) * 7 + Math.cos(t * 2.7) * 3; sy = Math.cos(t * 1.2) * 6; }
      else if (shake === "rumble")     { sx = Math.sin(t * 48) * 6; sy = Math.cos(t * 53) * 6; }
      else if (shake === "impact_hit") { const env = Math.exp(-localT * 11); sx = Math.sin(localT * 115) * 24 * env; sy = Math.cos(localT * 130) * 18 * env; }
      else if (shake === "panic")      { sx = Math.sin(t * 64) * 10; sy = Math.cos(t * 71) * 8; }
      else if (shake === "heartbeat")  { const beat = Math.pow(Math.max(0, Math.sin(t * 6.5)), 8); z += beat * 0.04; }

      ctx.translate(focusX + tx + sx, focusY + ty + sy);
      ctx.rotate(rot);
      ctx.scale(z, z);
      ctx.translate(-focusX, -focusY);
    },

    applyLensPostFX(ctx, t, localT, mode = "anamorphic_flare") {
      if (mode === "none") return;
      ctx.save();
      if (mode === "anamorphic_flare") {
        if (global.V31 && global.V31.AE) global.V31.AE.drawLightLeak(ctx, localT, 0.55);
      } else if (mode === "letterbox_cinema") {
        ctx.fillStyle = "#04060D";
        ctx.fillRect(0, 0, 1080, 96);
        ctx.fillRect(0, 1824, 1080, 96);
      } else if (mode === "chromatic_edge") {
        ctx.strokeStyle = "rgba(0, 245, 212, 0.22)"; ctx.lineWidth = 14; ctx.strokeRect(7, 7, 1066, 1906);
        ctx.strokeStyle = "rgba(244, 63, 94, 0.18)"; ctx.lineWidth = 8; ctx.strokeRect(14, 14, 1052, 1892);
      } else if (mode === "vignette_pulse") {
        const str = 0.32 + Math.sin(t * 4) * 0.12;
        const v = ctx.createRadialGradient(540, 960, 380, 540, 960, 1200);
        v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, `rgba(0,0,0,${str})`);
        ctx.fillStyle = v; ctx.fillRect(0, 0, 1080, 1920);
      } else if (mode === "vhs_retro") {
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        for (let y = (Math.floor(t * 40) % 8); y < 1920; y += 8) ctx.fillRect(0, y, 1080, 2);
      }
      ctx.restore();
    }
  };

  global.V34 = Object.assign(global.V34 || {}, { Camera });
})(window);
