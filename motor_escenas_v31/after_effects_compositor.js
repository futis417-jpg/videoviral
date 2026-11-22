/**
 * =========================================================================
 * V31 AFTER-EFFECTS PRO COMPOSITOR (1080x1920, 30fps)
 * Acabado de postproducción real tipo After Effects + CapCut Pro:
 * - V31.AE.expoOut(p)              -> Curva rápida de entrada + frenado sedoso
 * - V31.AE.applyOrganicCamera()    -> Deriva handheld real + zoom suave (CERO estático)
 * - V31.AE.renderParallax3D()      -> Capas fondo (0.25x), medio (0.7x), frente (1.2x)
 * - V31.AE.drawLightLeak()         -> Destello cálido anamórfico en cortes
 * - V31.AE.diagonalSlashTransition()-> Transición diagonal afilada tipo CapCut Pro
 * - V31.AE.shutterSplitTransition()-> Apertura de obturador horizontal/vertical
 * - V31.AE.glitchSliceTransition() -> Corte glitch por bandas horizontales
 * - V31.AE.drawGlassCard3D()       -> Tarjeta cristal 3D con borde especular y sombra
 * - V31.AE.drawFullKineticSlide()  -> Plano de tipografía cinética pura (sin personaje!)
 * =========================================================================
 */
(function (global) {
  const AE = {
    expoOut(p) {
      const x = Math.min(1, Math.max(0, p));
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    },

    backOut(p) {
      const x = Math.min(1, Math.max(0, p));
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },

    // 1. Deriva orgánica de cámara (handheld cinema suave + push-in progresivo)
    applyOrganicCamera(ctx, t, localT, dur, opts = {}) {
      const { z0 = 1.0, z1 = 1.07, drift = 10, tiltAmp = 0.008 } = opts;
      const p = Math.min(1, Math.max(0, localT / Math.max(0.1, dur)));
      const z = z0 + (z1 - z0) * this.expoOut(p);
      const dx = Math.sin(t * 1.15) * drift + Math.cos(t * 2.3) * (drift * 0.35);
      const dy = Math.cos(t * 0.95) * (drift * 0.8) + Math.sin(t * 1.9) * (drift * 0.25);
      const rot = Math.sin(t * 0.85) * tiltAmp;
      ctx.translate(540 + dx, 960 + dy);
      ctx.rotate(rot);
      ctx.scale(z, z);
      ctx.translate(-540, -960);
    },

    // 2. Parallax Multi-Plano 3D real (background 0.25x, midground 0.75x, foreground 1.25x)
    renderParallax3D(ctx, t, panX, panY, drawBgFn, drawMidFn, drawFgFn) {
      ctx.save(); ctx.translate(panX * 0.25, panY * 0.25); if (drawBgFn) drawBgFn(ctx, t); ctx.restore();
      ctx.save(); ctx.translate(panX * 0.75, panY * 0.75); if (drawMidFn) drawMidFn(ctx, t); ctx.restore();
      ctx.save(); ctx.translate(panX * 1.25, panY * 1.25); if (drawFgFn) drawFgFn(ctx, t); ctx.restore();
    },

    // 3. Light Leak / Lens Flare anamórfico cálido (para entradas de plano pro!)
    drawLightLeak(ctx, localT, dur = 0.45, color = "rgba(255, 168, 76, 0.52)") {
      if (localT < 0 || localT > dur) return;
      const p = localT / dur;
      const intensity = Math.sin(p * Math.PI);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const cx = -150 + p * 1450;
      const g = ctx.createRadialGradient(cx, 540, 40, cx, 540, 680);
      g.addColorStop(0, color);
      g.addColorStop(0.5, "rgba(244, 63, 94, 0.24)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = intensity;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1080, 1920);
      // Anamorphic horizontal streak
      const sg = ctx.createLinearGradient(0, 520, 1080, 560);
      sg.addColorStop(0, "rgba(255,255,255,0)");
      sg.addColorStop(0.5, `rgba(255, 240, 200, ${0.42 * intensity})`);
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, 528, 1080, 24);
      ctx.restore();
    },

    // 4. Transición Diagonal Slash Wipe con borde brillante (CapCut Pro / AE)
    diagonalSlashTransition(ctx, p, drawPrevFn, drawNextFn, accent = "#00F5D4") {
      const e = this.expoOut(p);
      if (drawPrevFn) { ctx.save(); drawPrevFn(ctx); ctx.restore(); }
      const cutX = -420 + e * 1950;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(cutX + 360, 0); ctx.lineTo(cutX - 180, 1920); ctx.lineTo(0, 1920);
      ctx.closePath(); ctx.clip();
      if (drawNextFn) drawNextFn(ctx);
      ctx.restore();
      // Haz luminoso en el borde del corte
      if (p > 0.02 && p < 0.98) {
        ctx.save();
        ctx.strokeStyle = accent; ctx.lineWidth = 14; ctx.shadowColor = accent; ctx.shadowBlur = 24;
        ctx.beginPath(); ctx.moveTo(cutX + 360, 0); ctx.lineTo(cutX - 180, 1920); ctx.stroke();
        ctx.restore();
      }
    },

    // 5. Transición Shutter Split (abre desde el centro como obturador cinematográfico)
    shutterSplitTransition(ctx, p, drawPrevFn, drawNextFn) {
      const e = this.expoOut(p);
      if (drawNextFn) { ctx.save(); drawNextFn(ctx); ctx.restore(); }
      const half = 960 * (1 - e);
      if (half > 2) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1080, half); ctx.clip();
        if (drawPrevFn) drawPrevFn(ctx); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.rect(0, 1920 - half, 1080, half); ctx.clip();
        if (drawPrevFn) drawPrevFn(ctx); ctx.restore();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, half - 4, 1080, 8);
        ctx.fillRect(0, 1920 - half - 4, 1080, 8);
      }
    },

    // 6. Transición Glitch Slice (bandas horizontales desplazadas)
    glitchSliceTransition(ctx, p, drawNextFn) {
      if (drawNextFn) { ctx.save(); drawNextFn(ctx); ctx.restore(); }
      if (p <= 0.02 || p >= 0.95) return;
      const intensity = Math.sin(p * Math.PI);
      ctx.save();
      for (let i = 0; i < 7; i++) {
        const y = ((i * 277 + Math.floor(p * 40) * 91) % 1800);
        const h = 24 + (i % 4) * 32;
        const dx = ((i % 2 === 0 ? 1 : -1) * 42 * intensity);
        ctx.fillStyle = i % 2 === 0 ? `rgba(0, 245, 212, ${0.28 * intensity})` : `rgba(244, 63, 94, ${0.28 * intensity})`;
        ctx.fillRect(dx, y, 1080, h);
      }
      ctx.restore();
    },

    // 7. Tarjeta Glassmorphism 3D profesional con brillo de borde
    drawGlassCard3D(ctx, cx, cy, w, h, localT, drawContentFn, opts = {}) {
      const { tilt = -0.025, border = "rgba(255,255,255,0.32)", glow = "#38BDF8" } = opts;
      const sc = this.backOut(Math.min(1, localT / 0.34));
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);
      ctx.scale(sc, sc);
      ctx.shadowColor = "rgba(0,0,0,0.58)"; ctx.shadowBlur = 36; ctx.shadowOffsetY = 18;
      const bg = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      bg.addColorStop(0, "rgba(22, 34, 62, 0.92)");
      bg.addColorStop(1, "rgba(10, 16, 32, 0.96)");
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 32); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      ctx.strokeStyle = border; ctx.lineWidth = 3.5;
      ctx.stroke();
      // Brillo superior especular
      const rim = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, -h / 2);
      rim.addColorStop(0, "rgba(255,255,255,0)");
      rim.addColorStop(0.5, glow);
      rim.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = rim; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-w / 2 + 40, -h / 2); ctx.lineTo(w / 2 - 40, -h / 2); ctx.stroke();
      if (drawContentFn) drawContentFn(ctx);
      ctx.restore();
    },

    // 8. Plano de Tipografía Cinética Full-Screen (rompe monotonía de personajes!)
    drawFullKineticSlide(ctx, lines, localT, opts = {}) {
      const { bg1 = "#0A0F1F", bg2 = "#1B1238", accent = "#FACC15" } = opts;
      const bg = ctx.createRadialGradient(540, 960, 80, 540, 960, 1250);
      bg.addColorStop(0, bg2); bg.addColorStop(1, bg1);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1920);
      // Grid sutil animado de fondo
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 2;
      const off = (localT * 40) % 90;
      for (let x = -90 + off; x < 1170; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1920); ctx.stroke(); }
      for (let y = -90 + off; y < 2010; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); }
      ctx.restore();

      const startY = 960 - ((lines.length - 1) * 124) / 2;
      lines.forEach((line, idx) => {
        const dt = localT - idx * 0.14;
        if (dt < 0) return;
        const p = this.backOut(Math.min(1, dt / 0.28));
        ctx.save();
        ctx.translate(540, startY + idx * 124 + (1 - p) * 55);
        ctx.scale(0.85 + 0.15 * p, 0.85 + 0.15 * p);
        ctx.globalAlpha = Math.min(1, dt / 0.16);
        const isHi = idx === lines.length - 1;
        ctx.font = `900 ${isHi ? 104 : 78}px 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (isHi) { ctx.shadowColor = accent; ctx.shadowBlur = 28; }
        ctx.fillStyle = isHi ? accent : "#FFFFFF";
        ctx.fillText(line.toUpperCase(), 0, 0, 960);
        ctx.restore();
      });
    }
  };

  global.V31 = Object.assign(global.V31 || {}, { AE });
})(window);
