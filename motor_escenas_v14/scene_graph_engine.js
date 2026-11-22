/**
 * =========================================================================
 * V14 GOD ENGINE — SCENE GRAPH & ANCHORED PREFABS (1080x1920, 30fps)
 * Garantiza CERO ventanas en el cielo, CERO puertas flotando y animación real.
 * =========================================================================
 */
(function (global) {
  const INK = "#16161E";
  const GROUND_Y = 1320;

  const V14 = {
    W: 1080,
    H: 1920,
    GROUND_Y,
    INK,

    // --- Easing & Physics ---
    easeOutCubic: (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3),
    easeInOutCubic: (x) => { const t = Math.min(1, Math.max(0, x)); return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; },
    easeOutExpo: (x) => (x >= 1 ? 1 : (x <= 0 ? 0 : 1 - Math.pow(2, -10 * x))),
    spring: (t) => (t <= 0 ? 0.01 : (t > 0.36 ? 1 : Math.max(0.01, 1 - Math.exp(-13 * t) * Math.cos(19 * t)))),

    // --- Keyframe Camera ---
    applyCamera(ctx, localT, dur, cfg = {}) {
      const p = Math.min(1, Math.max(0, localT / Math.max(0.1, dur)));
      const e = this.easeInOutCubic(p);
      const z = (cfg.z0 ?? 1.0) + ((cfg.z1 ?? 1.06) - (cfg.z0 ?? 1.0)) * e;
      const fx = (cfg.x0 ?? 540) + ((cfg.x1 ?? 540) - (cfg.x0 ?? 540)) * e;
      const fy = (cfg.y0 ?? 960) + ((cfg.y1 ?? 960) - (cfg.y0 ?? 960)) * e;
      let dx = 0, dy = 0;
      if (cfg.shake && localT < 0.24) {
        dx = Math.sin(localT * 95) * cfg.shake * Math.exp(-11 * localT);
        dy = Math.cos(localT * 110) * cfg.shake * Math.exp(-11 * localT);
      }
      ctx.translate(540 + dx, 960 + dy);
      ctx.scale(z, z);
      if (cfg.tilt) ctx.rotate(cfg.tilt * e);
      ctx.translate(-fx, -fy);
    },

    // --- Cel-Shaded Primitives ---
    celRect(ctx, x, y, w, h, r, fill, ink = INK, sw = 6) {
      ctx.save();
      ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
      ctx.fillStyle = fill; ctx.fill();
      ctx.clip();
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.fillRect(x, y + h - Math.max(12, h * 0.15), w, Math.max(12, h * 0.15));
      ctx.fillStyle = "rgba(255,255,255,0.20)";
      ctx.fillRect(x, y, w, Math.max(8, h * 0.08));
      ctx.restore();
      ctx.lineWidth = sw; ctx.strokeStyle = ink;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke();
    },

    contactShadow(ctx, cx, groundY, rx = 70, ry = 16) {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath(); ctx.ellipse(cx, groundY, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    },

    volumetricBeam(ctx, x1, y1, x2, y2, spread, color = "rgba(254,240,138,0.22)") {
      ctx.save();
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, color); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x1 - spread * 0.22, y1); ctx.lineTo(x1 + spread * 0.22, y1);
      ctx.lineTo(x2 + spread, y2); ctx.lineTo(x2 - spread, y2);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    },

    // --- ANCHORED HOUSE (IMPOSIBLE QUE LAS VENTANAS SALGAN EN EL CIELO O LA PUERTA FUERA!) ---
    drawAnchoredHouse(ctx, baseX, groundY, w, h, opts = {}) {
      const { wall="#E2C29B", roof="#991B1B", door="#78350F", winLit=true } = opts;
      ctx.save();
      ctx.translate(baseX, groundY); // (0,0) es el centro de la base en el suelo!
      // Pared principal: x in [-w/2, +w/2], y in [-h, 0]
      this.celRect(ctx, -w / 2, -h, w, h, 8, wall, INK, 7);
      // Tejado anclado exactamente a y = -h
      ctx.fillStyle = roof; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(-w * 0.58, -h + 8);
      ctx.lineTo(0, -h - h * 0.42);
      ctx.lineTo(w * 0.58, -h + 8);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Puerta SIEMPRE apoyada en y = 0 dentro de la pared
      const dw = w * 0.24, dh = h * 0.44;
      this.celRect(ctx, -dw / 2, -dh, dw, dh, 8, door, INK, 6);
      ctx.fillStyle = "#FACC15"; ctx.beginPath(); ctx.arc(dw * 0.28, -dh * 0.48, 6, 0, Math.PI * 2); ctx.fill();
      // Ventanas SIEMPRE dentro de la pared (izq y der arriba)
      const ww = w * 0.22, wh = h * 0.24, wy = -h * 0.78;
      [-w * 0.28, w * 0.28].forEach((wx) => {
        ctx.fillStyle = winLit ? "#FEF08A" : "#1E293B";
        ctx.strokeStyle = INK; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.roundRect(wx - ww / 2, wy, ww, wh, 6); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, wy + wh); ctx.moveTo(wx - ww / 2, wy + wh / 2); ctx.lineTo(wx + ww / 2, wy + wh / 2); ctx.stroke();
      });
      ctx.restore();
    },

    // --- ANCHORED BUILDING (SKYLINE CON VENTANAS CONTENIDAS CON CLIP) ---
    drawAnchoredBuilding(ctx, baseX, groundY, w, h, fill = "#241E3D", litColor = "#FBBF24") {
      ctx.save();
      ctx.translate(baseX, groundY);
      ctx.fillStyle = fill; ctx.strokeStyle = INK; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.rect(-w / 2, -h, w, h); ctx.fill(); ctx.stroke();
      ctx.clip(); // Garantiza que ninguna ventana pueda salirse JAMÁS del edificio!
      const cols = Math.max(2, Math.floor((w - 40) / 68));
      const rows = Math.max(2, Math.floor((h - 60) / 82));
      const startX = -((cols - 1) * 68) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lit = ((r * 7 + c * 3 + Math.floor(baseX)) % 3) !== 0;
          ctx.fillStyle = lit ? litColor : "rgba(15,23,42,0.7)";
          ctx.fillRect(startX + c * 68 - 18, -h + 44 + r * 82, 36, 46);
        }
      }
      ctx.restore();
    },

    // --- ARTICULATED HUMAN ANCHORED AT GROUND_Y (PIES SIEMPRE TOCANDO EL SUELO!) ---
    drawHumanAtGround(ctx, x, groundY, sc, t, opts = {}) {
      const { shirt="#2563EB", pants="#1E293B", hair="#1F2937", skin="#F3C6A5", expr="neutral", talking=false, walking=false, flip=false, style="short" } = opts;
      const step = walking ? Math.sin(t * 10) * 26 : 0;
      const bob = walking ? Math.abs(Math.sin(t * 10)) * 10 : Math.sin(t * 3.0) * 3;
      const blink = (Math.floor(t * 30) % 108) > 103;

      this.contactShadow(ctx, x, groundY, 64 * sc, 14 * sc);
      ctx.save();
      // Origen (0,0) = pies exactos en groundY! Altura total aprox 360px * sc
      ctx.translate(x, groundY - bob);
      ctx.scale(flip ? -sc : sc, sc);
      ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.lineJoin = "round";

      // Piernas apoyadas en y = 0
      ctx.fillStyle = pants;
      ctx.beginPath(); ctx.roundRect(-34 + step * 0.45, -135, 30, 128, 14); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(4 - step * 0.45, -135, 30, 128, 14); ctx.fill(); ctx.stroke();
      // Zapatillas exactas en y = -6
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath(); ctx.ellipse(-18 + step * 0.45, -8, 28, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(22 - step * 0.45, -8, 28, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Torso (y = -245 a -125)
      this.celRect(ctx, -50, -245, 100, 122, 28, shirt, INK, 6);

      // Brazos articulados
      const arm = walking ? -step : (talking ? Math.sin(t * 7.5) * 18 : Math.sin(t * 2) * 4);
      ctx.fillStyle = skin;
      ctx.beginPath(); ctx.roundRect(-70, -225 + arm * 0.35, 22, 86, 11); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(48, -225 - arm * 0.35, 22, 86, 11); ctx.fill(); ctx.stroke();

      // Cuello + Cabeza (centro en y = -312)
      ctx.fillStyle = skin;
      ctx.beginPath(); ctx.roundRect(-16, -264, 32, 28, 10); ctx.fill(); ctx.stroke();
      if (style === "ponytail") {
        ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(-56, -304, 24, 38, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = skin;
      ctx.beginPath(); ctx.ellipse(0, -314, 52, 58, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // Pelo anclado a la cabeza
      ctx.fillStyle = hair;
      ctx.beginPath(); ctx.arc(0, -324, 54, Math.PI * 1.04, Math.PI * 1.96); ctx.closePath(); ctx.fill(); ctx.stroke();

      // 2 Ojos simétricos + cejas + lip-sync
      [[-18, -316], [18, -316]].forEach(([ex, ey]) => {
        if (blink) { ctx.beginPath(); ctx.moveTo(ex - 10, ey); ctx.lineTo(ex + 10, ey); ctx.stroke(); }
        else {
          ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(ex, ey, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + 2, ey, 4.8, 0, Math.PI * 2); ctx.fill();
        }
      });
      ctx.lineWidth = 4.5;
      if (talking) {
        ctx.fillStyle = "#881337";
        ctx.beginPath(); ctx.ellipse(0, -286, 13, 6 + Math.abs(Math.sin(t * 15)) * 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      } else if (expr === "sad") {
        ctx.beginPath(); ctx.arc(0, -278, 12, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(0, -290, 12, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      }
      ctx.restore();
    },

    // --- OVERLAYS PRO (CALLOUT, TIMER, CHECKLIST, MITO, REBOBINANDO, SUBTÍTULOS) ---
    drawCallout(ctx, x, y, tx, ty, text, col = "#38BDF8") {
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(x, y + 36); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.fillStyle = "rgba(15,23,42,0.92)"; ctx.beginPath(); ctx.roundRect(x - 250, y - 36, 500, 72, 36); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FFF"; ctx.font = "700 28px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, x, y); ctx.restore();
    },

    drawTimer(ctx, sec) {
      const c = sec <= 10 ? "#FF3B30" : (sec <= 30 ? "#F59E0B" : "#FFFFFF");
      ctx.save(); ctx.fillStyle = "rgba(10,15,28,0.92)"; ctx.strokeStyle = c; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(330, 1490, 420, 125, 22); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#94A3B8"; ctx.font = "700 22px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left"; ctx.fillText("TIEMPO", 435, 1532);
      ctx.fillStyle = c; ctx.font = "800 62px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "right";
      ctx.fillText(`0:${String(Math.max(0, Math.floor(sec))).padStart(2, "0")}`, 710, 1588); ctx.restore();
    },

    drawChecklist(ctx, items, doneCount) {
      items.forEach((txt, i) => {
        const col = i % 2, row = Math.floor(i / 2), bx = 120 + col * 430, by = 1260 + row * 95, ok = i < doneCount;
        ctx.save(); ctx.fillStyle = ok ? "rgba(16,185,129,0.22)" : "rgba(15,23,42,0.88)";
        ctx.strokeStyle = ok ? "#10B981" : "#475569"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.roundRect(bx, by, 410, 74, 37); ctx.fill(); ctx.stroke();
        ctx.fillStyle = ok ? "#10B981" : "#94A3B8"; ctx.font = "800 27px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left";
        ctx.fillText((ok ? "✓  " : "") + txt, bx + 30, by + 47); ctx.restore();
      });
    },

    drawMythStamp(ctx, label = "MITO") {
      ctx.save(); ctx.strokeStyle = "#FF3B30"; ctx.shadowColor = "#FF3B30"; ctx.shadowBlur = 30; ctx.lineWidth = 34; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(350, 720); ctx.lineTo(730, 1120); ctx.moveTo(730, 720); ctx.lineTo(350, 1120); ctx.stroke();
      ctx.translate(540, 1080); ctx.rotate(-0.12);
      ctx.fillStyle = "#1E293B"; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-145, -45, 290, 90, 16); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FF3B30"; ctx.font = "800 54px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center"; ctx.fillText(label, 0, 18); ctx.restore();
    },

    drawRewind(ctx) {
      ctx.save(); ctx.fillStyle = "rgba(0,245,212,0.12)"; ctx.fillRect(0, 0, 1080, 1920);
      ctx.fillStyle = "rgba(15,23,42,0.92)"; ctx.strokeStyle = "#00F5D4"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(110, 580, 390, 84, 42); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FFF"; ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center"; ctx.fillText("⏪ REBOBINANDO", 305, 634); ctx.restore();
    },

    drawSubtitles(ctx, words, t, style = "top_box") {
      const chunks = []; for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(i, i + 3));
      const active = chunks.find(c => t >= c[0].start - 0.04 && t <= c[c.length - 1].end + 0.14); if (!active) return;
      ctx.save(); ctx.font = "800 52px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      const sp = Math.max(18, ctx.measureText(" ").width * 1.25);
      const ws = active.map(w => ctx.measureText(w.word).width);
      const tot = ws.reduce((a, b) => a + b, 0) + sp * (active.length - 1);
      let cx = (1080 - tot) / 2, y = style === "bottom_pill" ? 1405 : 300;
      if (style === "bottom_pill") { ctx.fillStyle = "rgba(0,0,0,0.70)"; ctx.beginPath(); ctx.roundRect(cx - 24, y - 40, tot + 48, 80, 20); ctx.fill(); }
      active.forEach((w, i) => {
        const isNow = t >= w.start && t <= w.end + 0.05;
        if (style === "top_box" && isNow && i === active.length - 1) {
          const bx = cx - 10, by = y - 34, bw = ws[i] + 20, bh = 68;
          ctx.strokeStyle = "#38BDF8"; ctx.lineWidth = 3.5; ctx.strokeRect(bx, by, bw, bh);
          ctx.fillStyle = "#38BDF8"; [[bx,by],[bx+bw,by],[bx,by+bh],[bx+bw,by+bh]].forEach(([px,py]) => { ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill(); });
        }
        if (style === "top_box") { ctx.lineWidth = 9; ctx.strokeStyle = "rgba(8,12,24,0.92)"; ctx.strokeText(w.word, cx, y); }
        ctx.fillStyle = isNow ? "#FFFFFF" : "rgba(255,255,255,0.68)";
        ctx.fillText(w.word, cx, y); cx += ws[i] + sp;
      });
      ctx.restore();
    }
  };

  global.V14 = V14;
})(window);
