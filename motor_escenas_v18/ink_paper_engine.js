/**
 * =========================================================================
 * V18 OMNI — INK & PAPER EDITORIAL ENGINE + SPEED RAMP (1080x1920, 30fps)
 * Replica el estilo viral de Ilustración a Tinta y Acuarela sobre Papel
 * Crema (line boil a 10fps, subrayado rojo a pincel, pluma animada,
 * tipografía serif editorial, subtítulos con doble marco y ■ rojo).
 * =========================================================================
 */
(function (global) {
  const INK = "#1C1B19";
  const RED_INK = "#C62828";
  const PAPER_BG = "#F3EEE3";

  // Pre-generar textura de papel crema orgánica una sola vez
  let paperCanvas = null;
  function getPaperTexture() {
    if (paperCanvas) return paperCanvas;
    paperCanvas = document.createElement("canvas");
    paperCanvas.width = 540; paperCanvas.height = 960;
    const pCtx = paperCanvas.getContext("2d");
    pCtx.fillStyle = PAPER_BG;
    pCtx.fillRect(0, 0, 540, 960);
    // Manchas sutiles de papel antiguo + fibras
    for (let i = 0; i < 60; i++) {
      const x = (i * 97) % 540, y = (i * 151) % 960, r = 40 + (i % 5) * 28;
      const g = pCtx.createRadialGradient(x, y, 2, x, y, r);
      g.addColorStop(0, "rgba(180, 165, 138, 0.09)");
      g.addColorStop(1, "rgba(180, 165, 138, 0)");
      pCtx.fillStyle = g; pCtx.beginPath(); pCtx.arc(x, y, r, 0, Math.PI * 2); pCtx.fill();
    }
    pCtx.strokeStyle = "rgba(120, 108, 88, 0.08)"; pCtx.lineWidth = 1;
    for (let i = 0; i < 90; i++) {
      const x = (i * 67) % 540, y = (i * 113) % 960;
      pCtx.beginPath(); pCtx.moveTo(x, y); pCtx.lineTo(x + 14, y + ((i % 3) - 1) * 8); pCtx.stroke();
    }
    return paperCanvas;
  }

  // Ruido determinista para Line Boil (temblor orgánico a 10fps de dibujo a mano)
  function boil(t, seed, amp = 2.6) {
    const step = Math.floor(t * 10);
    const v = Math.sin(step * 12.9898 + seed * 78.233) * 43758.5453;
    return ((v - Math.floor(v)) * 2 - 1) * amp;
  }

  const V18 = {
    PAPER_BG,
    INK,
    RED_INK,

    // Speed Ramp Helper ("velocidad cuando toca"): acelera en momentos rápidos y frena en énfasis
    timeRamp(localT, dur, profile = "normal") {
      const p = Math.min(1, Math.max(0, localT / Math.max(0.05, dur)));
      if (profile === "fast_burst") return Math.pow(p, 0.55);      // Arranca súper rápido
      if (profile === "slow_emphasis") return Math.pow(p, 1.75);   // Frena para dar peso
      if (profile === "snap_overshoot") {
        const c = 1.7, x = p - 1;
        return 1 + (c + 1) * x * x * x + c * x * x;
      }
      return p;
    },

    Ink: {
      drawPaperBg(ctx) {
        ctx.drawImage(getPaperTexture(), 0, 0, 1080, 1920);
        // Viñeta cálida súper suave en esquinas
        const v = ctx.createRadialGradient(540, 960, 420, 540, 960, 1180);
        v.addColorStop(0, "rgba(0,0,0,0)");
        v.addColorStop(1, "rgba(130, 112, 84, 0.22)");
        ctx.fillStyle = v; ctx.fillRect(0, 0, 1080, 1920);
      },

      // Trazo orgánico con line-boil a mano alzada
      wobblyLine(ctx, x1, y1, x2, y2, t, seed = 1, w = 5, col = INK) {
        ctx.save();
        ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
        const mx = (x1 + x2) / 2 + boil(t, seed, 4);
        const my = (y1 + y2) / 2 + boil(t, seed + 1, 4);
        ctx.beginPath();
        ctx.moveTo(x1 + boil(t, seed + 2, 2), y1 + boil(t, seed + 3, 2));
        ctx.quadraticCurveTo(mx, my, x2 + boil(t, seed + 4, 2), y2 + boil(t, seed + 5, 2));
        ctx.stroke();
        ctx.restore();
      },

      // Subrayado rojo a pincel animado (exacto a video_1.mp4!)
      drawRedUnderline(ctx, cx, y, width, progress, t) {
        const p = Math.min(1, Math.max(0, progress));
        if (p <= 0.01) return;
        const x0 = cx - width / 2, x1 = x0 + width * p;
        ctx.save();
        ctx.strokeStyle = RED_INK; ctx.lineWidth = 10; ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x0, y + 4);
        ctx.quadraticCurveTo((x0 + x1) / 2, y - 6 + boil(t, 9, 2), x1, y + 2 + boil(t, 10, 2));
        ctx.stroke();
        ctx.restore();
      },

      // Cruz roja pintada a mano (2 trazos con pincel)
      drawRedCross(ctx, cx, cy, size, progress, t) {
        const p = Math.min(1, Math.max(0, progress));
        if (p <= 0.01) return;
        const p1 = Math.min(1, p * 2), p2 = Math.max(0, (p - 0.5) * 2);
        const r = size / 2;
        this.wobblyLine(ctx, cx - r, cy - r, cx - r + size * p1, cy - r + size * p1, t, 21, 14, RED_INK);
        if (p2 > 0) this.wobblyLine(ctx, cx + r, cy - r, cx + r - size * p2, cy - r + size * p2, t, 31, 14, RED_INK);
      },

      // Pluma / Rotulador animado siguiendo el texto
      drawPenTip(ctx, x, y, t) {
        ctx.save();
        ctx.translate(x + boil(t, 41, 3), y + boil(t, 42, 3));
        ctx.rotate(-0.55 + Math.sin(t * 28) * 0.08);
        ctx.fillStyle = INK;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(28, -12); ctx.lineTo(135, -16); ctx.lineTo(140, 14); ctx.lineTo(28, 10); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#EAE4D3"; ctx.fillRect(42, -11, 14, 22);
        ctx.restore();
      },

      // Bocadillo dibujado a tinta con line-boil
      drawHandSpeechBubble(ctx, cx, cy, w, h, t) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = INK; ctx.lineWidth = 11; ctx.lineJoin = "round"; ctx.lineCap = "round";
        ctx.fillStyle = "rgba(255, 252, 245, 0.72)";
        const bx = boil(t, 50, 3), by = boil(t, 51, 3);
        ctx.beginPath();
        ctx.moveTo(-w/2 + 40 + bx, -h/2 + by);
        ctx.quadraticCurveTo(0, -h/2 - 14, w/2 - 35, -h/2 + 6);
        ctx.quadraticCurveTo(w/2 + 12, 0, w/2 - 30, h/2 - 8);
        ctx.quadraticCurveTo(0, h/2 + 10, -w/2 + 130, h/2 + 4);
        ctx.lineTo(-w/2 + 65, h/2 + 68);
        ctx.lineTo(-w/2 + 72, h/2 - 6);
        ctx.quadraticCurveTo(-w/2 - 12, 0, -w/2 + 40 + bx, -h/2 + by);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      },

      // Caja de Subtítulos Editorial Exacta (doble borde fino + ■ rojo a la izquierda!)
      drawEditorialSubBox(ctx, words, t, y = 1280) {
        const chunks = []; for (let i = 0; i < words.length; i += 4) chunks.push(words.slice(i, i + 4));
        const active = chunks.find(c => t >= c[0].start - 0.04 && t <= c[c.length - 1].end + 0.16);
        if (!active) return;

        // Mostrar palabras progresivamente conforme se dicen (efecto escritura limpio)
        const visible = active.filter(w => t >= w.start - 0.05);
        const text = (visible.length ? visible : [active[0]]).map(w => w.word).join(" ");

        ctx.save();
        ctx.font = "600 44px Georgia, 'Times New Roman', serif";
        const tw = Math.min(720, Math.max(340, ctx.measureText(text).width + 110));
        const th = 104, x = (1080 - tw) / 2;

        // Doble marco editorial fino (exacto a video_1.mp4)
        ctx.fillStyle = "rgba(248, 244, 234, 0.94)";
        ctx.fillRect(x, y, tw, th);
        ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(x, y, tw, th);
        ctx.lineWidth = 1.5; ctx.strokeRect(x + 7, y + 7, tw - 14, th - 14);

        // Cuadradito rojo ■ indicador
        ctx.fillStyle = RED_INK;
        ctx.fillRect(x + 26, y + th / 2 - 8, 16, 16);

        // Texto serif limpio con espaciado verificado
        ctx.fillStyle = INK; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(text, x + 58, y + th / 2 + 2, tw - 82);
        ctx.restore();
      },

      // Sello cuadrado rojo de hora/fecha (ej: "12:00")
      drawRedStamp(ctx, cx, cy, text, t) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(boil(t, 66, 0.015));
        ctx.fillStyle = RED_INK;
        ctx.fillRect(-135, -135, 270, 270);
        ctx.fillStyle = "#FAF6EC";
        ctx.font = "700 84px Georgia, serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(text, 0, 6);
        ctx.restore();
      },

      // Personaje/Animal estilo acuarela-tinta (ejemplo Vaca de video_1.mp4 con line-boil!)
      drawWatercolorCow(ctx, cx, cy, sc, t, drinking = false) {
        ctx.save();
        ctx.translate(cx, cy + boil(t, 70, 3));
        ctx.scale(sc, sc);
        ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
        // Cuerpo acuarela gris suave
        ctx.fillStyle = "rgba(182, 178, 168, 0.85)";
        ctx.beginPath(); ctx.ellipse(-40, 0, 210, 95, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Manchas orgánicas
        ctx.fillStyle = "rgba(95, 92, 86, 0.72)";
        ctx.beginPath(); ctx.ellipse(-110, -15, 58, 48, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(40, 20, 48, 36, -0.2, 0, Math.PI * 2); ctx.fill();
        // 4 Patas
        [[-180, 75], [-130, 82], [75, 82], [118, 75]].forEach(([lx, ly], i) => {
          this.wobblyLine(ctx, lx, ly, lx + boil(t, 80 + i, 2), ly + 95, t, 85 + i, 11, INK);
        });
        // Cola moviéndose
        this.wobblyLine(ctx, -245, -10, -275, 78 + Math.sin(t * 5) * 14, t, 91, 6, INK);
        // Cabeza + cuernos (se inclina si drinking=true)
        ctx.save();
        ctx.translate(155, -25);
        ctx.rotate(drinking ? 0.55 : Math.sin(t * 2.5) * 0.06);
        ctx.fillStyle = "rgba(90, 88, 84, 0.88)";
        ctx.beginPath(); ctx.ellipse(65, 22, 86, 42, 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Cuernos
        this.wobblyLine(ctx, 25, -22, 55, -72, t, 95, 7, INK);
        this.wobblyLine(ctx, 68, -12, 105, -54, t, 96, 7, INK);
        ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(65, 6, 7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        ctx.restore();
      }
    }
  };

  global.V18 = V18;
})(window);
