/**
 * =========================================================================
 * V27 PRO EDITOR SUITE — EDICIÓN NIVEL AFTER EFFECTS / CAPCUT PRO (30fps)
 * Da a los vídeos el RITMO, los CORTES, el MOTION BLUR y los IMPACTO-HITS
 * de los canales virales de +10M de vistas:
 * - V27Edit.applyAutoPunchZoom()   -> Punch-in dinámico en palabras clave!
 * - V27Edit.whipPanTransition()    -> Whip-Pan direccional con motion blur!
 * - V27Edit.zoomThroughTransition()-> Match-Cut Zoom-Through entre escenas!
 * - V27Edit.slamIn()               -> Entrada golpe (1.55x -> 0.96x -> 1.0x + shake)
 * - V27Edit.kineticWordPop()       -> Palabra gigante cinética en el clímax
 * - V27Edit.highlighterSweep()     -> Subrayador fluorescente animado
 * - V27Edit.chromaticImpact()      -> Glitch / RGB Split en impactos y mitos
 * - V27Edit.colorGrade()           -> Etalonaje tipo LUT (teal_orange, noir, warm, ocean, neon)
 * - V27Edit.drawRetentionBar()     -> Barra de retención fina superior
 * =========================================================================
 */
(function (global) {
  const IMPACT_WORDS = new Set([
    "no", "nunca", "jamás", "mito", "mentira", "error", "falso", "fallo",
    "espera", "pero", "peor", "bestia", "imposible", "secreto", "trampa",
    "uno", "dos", "tres", "cuatro", "cinco", "cuidado", "mortal", "sal",
    "agua", "leche", "blanco", "seis", "estrellas", "sobrevivió", "única"
  ]);

  const V27Edit = {
    // Extrae automáticamente los timestamps de impacto desde timings.words
    getAutoBeatTimes(words) {
      const hits = [];
      let last = -2.0;
      for (const w of (words || [])) {
        const clean = (w.word || "").toLowerCase().replace(/[.,?!¡¿:;«»"']/g, "");
        if (IMPACT_WORDS.has(clean) && (w.start - last) >= 1.8) {
          hits.push({ time: w.start, word: w.word });
          last = w.start;
        }
      }
      return hits;
    },

    // 1. PUNCH-IN ZOOM + MICRO-SHAKE AUTOMÁTICO AL RITMO DE LA VOZ!
    //    Hace que la cámara "respire" y golpee exactamente cuando el narrador enfatiza.
    applyAutoPunchZoom(ctx, t, beatTimes = [], maxBoost = 0.10) {
      let boost = 0, sx = 0, sy = 0;
      for (const b of beatTimes) {
        const dt = t - b.time;
        if (dt >= 0 && dt < 0.42) {
          // Ataque instantáneo (0.06s) + decay suave exponencial
          const env = dt < 0.06 ? (dt / 0.06) : Math.exp(-(dt - 0.06) * 7.5);
          boost = Math.max(boost, maxBoost * env);
          if (dt < 0.16) {
            const sEnv = Math.exp(-dt * 18);
            sx += Math.sin(dt * 120) * 11 * sEnv;
            sy += Math.cos(dt * 140) * 9 * sEnv;
          }
        }
      }
      // Micro-breathing continuo (nunca frame 100% congelado)
      const breath = 1.0 + boost + Math.sin(t * 1.4) * 0.008;
      ctx.translate(540 + sx, 960 + sy);
      ctx.scale(breath, breath);
      ctx.translate(-540, -960);
      return boost;
    },

    // 2. WHIP-PAN TRANSITION CON MOTION BLUR DIRECCIONAL REAL (p in [0, 1])
    whipPanTransition(ctx, p, dir = "left", drawPrevFn, drawNextFn) {
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const sign = dir === "left" ? -1 : 1;
      const shiftPrev = sign * e * 1080;
      const shiftNext = shiftPrev - sign * 1080;
      const blurAmt = Math.sin(p * Math.PI); // Pico máximo en el centro de la transición

      // Multi-sample motion blur (3 pasadas con alpha para estela real de cámara)
      const samples = blurAmt > 0.15 ? 3 : 1;
      for (let s = 0; s < samples; s++) {
        const off = (s - (samples - 1) / 2) * 38 * blurAmt * sign;
        ctx.save();
        ctx.globalAlpha = s === 0 ? 1.0 : 0.35;
        ctx.translate(shiftPrev + off, 0);
        if (drawPrevFn) drawPrevFn(ctx);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = s === 0 ? 1.0 : 0.35;
        ctx.translate(shiftNext + off, 0);
        if (drawNextFn) drawNextFn(ctx);
        ctx.restore();
      }
    },

    // 3. ZOOM-THROUGH MATCH CUT TRANSITION (p in [0, 1])
    zoomThroughTransition(ctx, p, drawPrevFn, drawNextFn) {
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      if (p < 0.5) {
        const z = 1.0 + e * 1.35;
        ctx.save();
        ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960);
        if (drawPrevFn) drawPrevFn(ctx);
        ctx.restore();
      } else {
        const z = 0.65 + (e - 0.5) * 0.70;
        ctx.save();
        ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960);
        if (drawNextFn) drawNextFn(ctx);
        ctx.restore();
      }
      // Flash suave en el punto de corte (p = 0.5)
      const flash = Math.max(0, 1 - Math.abs(p - 0.5) * 5.0);
      if (flash > 0.01) {
        ctx.fillStyle = `rgba(255,255,255,${flash * 0.55})`;
        ctx.fillRect(0, 0, 1080, 1920);
      }
    },

    // 4. SLAM-IN CON OVERSHOOT Y REBOTE (para sellos, tarjetas, badges, flechas)
    slamIn(ctx, cx, cy, localT, drawContentFn) {
      if (localT < 0) return;
      let sc = 1.0;
      if (localT < 0.14) {
        sc = 1.65 - (localT / 0.14) * 0.72; // 1.65 -> 0.93
      } else if (localT < 0.26) {
        sc = 0.93 + ((localT - 0.14) / 0.12) * 0.07; // 0.93 -> 1.00
      }
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(sc, sc);
      drawContentFn(ctx);
      ctx.restore();
    },

    // 5. KINETIC WORD POP (palabra gigante en pantalla tipo CapCut/Premiere en momentos clave)
    kineticWordPop(ctx, text, cx, cy, localT, opts = {}) {
      if (localT < 0 || localT > 1.1) return;
      const { color = "#FACC15", stroke = "#0A0F1C", size = 112 } = opts;
      const alpha = localT > 0.85 ? Math.max(0, 1 - (localT - 0.85) / 0.25) : 1.0;
      this.slamIn(ctx, cx, cy, localT, (c) => {
        c.save();
        c.globalAlpha = alpha;
        c.font = `900 ${size}px 'Plus Jakarta Sans', sans-serif`;
        c.textAlign = "center"; c.textBaseline = "middle";
        c.lineWidth = 18; c.strokeStyle = stroke; c.lineJoin = "round";
        c.strokeText(text.toUpperCase(), 0, 0);
        c.fillStyle = color;
        c.fillText(text.toUpperCase(), 0, 0);
        c.restore();
      });
    },

    // 6. HIGHLIGHTER SWEEP (subrayador marcador fluorescente animado detrás de una frase)
    highlighterSweep(ctx, x, y, w, h, progress, color = "rgba(250, 204, 21, 0.42)") {
      const p = Math.min(1, Math.max(0, progress));
      if (p <= 0.01) return;
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, w * p, h, 8);
      ctx.fill();
      ctx.restore();
    },

    // 7. CHROMATIC RGB IMPACT (destello rojo/cian de 0.18s en golpes/mitos/giros)
    chromaticImpact(ctx, localT) {
      if (localT < 0 || localT > 0.20) return;
      const a = (1 - localT / 0.20) * 0.26;
      ctx.save();
      ctx.fillStyle = `rgba(255, 45, 85, ${a})`;
      ctx.fillRect(0, 0, 1080, 1920);
      ctx.fillStyle = `rgba(0, 245, 212, ${a * 0.8})`;
      ctx.fillRect(14, 0, 1080, 1920);
      ctx.restore();
    },

    // 8. COLOR GRADING TIPO LUT (unifica toda la paleta para look de película)
    colorGrade(ctx, preset = "teal_orange") {
      ctx.save();
      if (preset === "teal_orange") {
        const g = ctx.createLinearGradient(0, 0, 1080, 1920);
        g.addColorStop(0, "rgba(14, 116, 144, 0.10)");
        g.addColorStop(1, "rgba(234, 88, 12, 0.08)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
      } else if (preset === "noir_docu") {
        const g = ctx.createLinearGradient(0, 0, 0, 1920);
        g.addColorStop(0, "rgba(15, 23, 42, 0.18)");
        g.addColorStop(1, "rgba(0, 0, 0, 0.24)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
      } else if (preset === "neon_cyber") {
        const g = ctx.createLinearGradient(0, 0, 1080, 1920);
        g.addColorStop(0, "rgba(192, 38, 211, 0.10)");
        g.addColorStop(1, "rgba(6, 182, 212, 0.10)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
      } else if (preset === "deep_ocean") {
        const g = ctx.createLinearGradient(0, 0, 0, 1920);
        g.addColorStop(0, "rgba(6, 78, 105, 0.12)");
        g.addColorStop(1, "rgba(2, 20, 34, 0.22)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
      }
      ctx.restore();
    },

    // 9. BARRA DE RETENCIÓN SUPERIOR LIMPIA (da sensación de avance rápido)
    drawRetentionBar(ctx, progress, color = "#FACC15") {
      const p = Math.min(1, Math.max(0, progress));
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.fillRect(0, 0, 1080, 10);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1080 * p, 10);
      ctx.restore();
    }
  };

  global.V27Edit = V27Edit;
})(window);
