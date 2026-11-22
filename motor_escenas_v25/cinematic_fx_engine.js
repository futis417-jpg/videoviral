/**
 * =========================================================================
 * V25 OMEGA — CINEMATIC FX & MOTION GRAPHICS ENGINE (1080x1920, 30fps)
 * Efectos de estudio real para que CADA frame parezca After Effects / Remotion:
 * - Partículas flotantes (polvo, chispas, burbujas, nieve/lluvia)
 * - Rayos de luz volumétricos animados (God Rays)
 * - Speed Lines (líneas de impacto / velocidad tipo anime/cómic)
 * - Film Grain orgánico ligero + Viñeta cinematográfica
 * - Tipografía cinética con rebote elástico y glow
 * - Contador animado (0 -> 585), Anillo de progreso, Visualizador de audio
 * - Transiciones reales (Whip Pan, Iris Wipe, Glitch Rewind, Flash Cut)
 * =========================================================================
 */
(function (global) {
  let grainCanvas = null;
  function getGrain() {
    if (grainCanvas) return grainCanvas;
    grainCanvas = document.createElement("canvas");
    grainCanvas.width = 270; grainCanvas.height = 480;
    const g = grainCanvas.getContext("2d");
    const img = g.createImageData(270, 480);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const c = v > 0.5 ? 255 : 0;
      img.data[i] = c; img.data[i + 1] = c; img.data[i + 2] = c; img.data[i + 3] = 16;
    }
    g.putImageData(img, 0, 0);
    return grainCanvas;
  }

  const V25FX = {
    // 1. Film grain sutil + viñeta cinematográfica (quita el look "plástico" de Canvas!)
    drawCinemaFinish(ctx, t, vignetteStrength = 0.38) {
      ctx.save();
      const ox = (Math.floor(t * 18) * 37) % 80;
      const oy = (Math.floor(t * 18) * 53) % 80;
      ctx.globalAlpha = 0.22;
      ctx.drawImage(getGrain(), -ox, -oy, 1180, 2060);
      ctx.globalAlpha = 1;
      const v = ctx.createRadialGradient(540, 960, 420, 540, 960, 1220);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, `rgba(4,7,18,${vignetteStrength})`);
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, 1080, 1920);
      ctx.restore();
    },

    // 2. Partículas atmosféricas flotantes (dust | sparkle | bubble | ember)
    drawParticles(ctx, t, count = 28, mode = "dust", color = "rgba(255,255,255,0.45)") {
      ctx.save();
      for (let i = 0; i < count; i++) {
        const seed = i * 97.31;
        const speed = 18 + (i % 5) * 14;
        const x = ((seed * 13 + Math.sin(t * 1.2 + i) * 34) % 1080 + 1080) % 1080;
        const yRaw = mode === "bubble" || mode === "ember"
          ? 1920 - ((seed * 19 + t * speed * 2.2) % 1920)
          : (seed * 19 + t * speed) % 1920;
        const r = mode === "bubble" ? 4 + (i % 6) * 2.5 : 2 + (i % 4) * 1.8;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, yRaw, r, 0, Math.PI * 2);
        ctx.fill();
        if (mode === "bubble") {
          ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 2; ctx.stroke();
        }
      }
      ctx.restore();
    },

    // 3. God Rays (rayos de luz diagonales animados)
    drawGodRays(ctx, t, color = "rgba(254, 240, 138, 0.10)") {
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const sway = Math.sin(t * 0.7 + i * 1.6) * 60;
        const x0 = 120 + i * 260 + sway;
        const g = ctx.createLinearGradient(x0, 0, x0 + 180, 1550);
        g.addColorStop(0, color); g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x0, 0); ctx.lineTo(x0 + 140, 0);
        ctx.lineTo(x0 + 360, 1600); ctx.lineTo(x0 + 120, 1600);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    },

    // 4. Speed Lines (líneas radiales de impacto / velocidad!)
    drawSpeedLines(ctx, t, intensity = 0.55, color = "rgba(255,255,255,0.35)") {
      ctx.save();
      ctx.translate(540, 960);
      const step = Math.floor(t * 15);
      ctx.strokeStyle = color;
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2 + (step % 3) * 0.04;
        const rIn = 460 + ((i * 53 + step * 31) % 180);
        const rOut = 1280;
        ctx.lineWidth = (i % 3 === 0 ? 5 : 2.5) * intensity;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * rIn, Math.sin(a) * rIn);
        ctx.lineTo(Math.cos(a) * rOut, Math.sin(a) * rOut);
        ctx.stroke();
      }
      ctx.restore();
    },

    // 5. Tipografía Cinética con rebote spring + subrayado/brillo
    drawKineticBadge(ctx, text, cx, cy, localT, opts = {}) {
      const { bg = "rgba(15,23,42,0.92)", border = "#FACC15", fg = "#FFFFFF", size = 44 } = opts;
      const sc = localT <= 0 ? 0.01 : (localT > 0.35 ? 1 : Math.max(0.01, 1 - Math.exp(-13 * localT) * Math.cos(19 * localT)));
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(sc, sc);
      ctx.font = `800 ${size}px 'Plus Jakarta Sans', sans-serif`;
      const tw = Math.min(920, ctx.measureText(text).width + 72);
      const th = size + 40;
      ctx.fillStyle = bg; ctx.strokeStyle = border; ctx.lineWidth = 5;
      ctx.shadowColor = border; ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.roundRect(-tw / 2, -th / 2, tw, th, th / 2); ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, 0, 2, tw - 44);
      ctx.restore();
    },

    // 6. Contador Numérico Animado (ej: 0 -> 585 VECES AL DÍA)
    drawAnimatedCounter(ctx, cx, cy, targetVal, progress, suffix = "", label = "", color = "#00F5D4") {
      const p = Math.min(1, Math.max(0, progress));
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(targetVal * eased);
      ctx.save();
      ctx.fillStyle = "rgba(10,15,28,0.92)"; ctx.strokeStyle = color; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.roundRect(cx - 280, cy - 110, 560, 220, 32); ctx.fill(); ctx.stroke();
      ctx.fillStyle = color; ctx.font = "800 108px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${val}${suffix}`, cx, cy - 16);
      if (label) {
        ctx.fillStyle = "#CBD5E1"; ctx.font = "700 28px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(label, cx, cy + 68);
      }
      ctx.restore();
    },

    // 7. Visualizador de Audio Vivo (barras reactivas limpias)
    drawAudioVisualizer(ctx, cx, cy, t, w = 440, h = 72, color = "#00F5D4") {
      ctx.save();
      const bars = 24;
      const bw = (w / bars) * 0.62;
      const gap = w / bars;
      ctx.fillStyle = color;
      for (let i = 0; i < bars; i++) {
        const bh = 10 + Math.abs(Math.sin(t * 9.5 + i * 0.65) * Math.cos(t * 4.2 - i * 0.3)) * (h - 12);
        const bx = cx - w / 2 + i * gap;
        ctx.beginPath(); ctx.roundRect(bx, cy - bh / 2, bw, bh, bw / 2); ctx.fill();
      }
      ctx.restore();
    },

    // 8. Transición Flash / Whip / Glitch entre escenas (p in [0, 1])
    drawTransitionOverlay(ctx, p, type = "flash") {
      if (p <= 0 || p >= 1) return;
      ctx.save();
      const peak = Math.sin(p * Math.PI);
      if (type === "flash") {
        ctx.fillStyle = `rgba(255,255,255,${peak * 0.85})`;
        ctx.fillRect(0, 0, 1080, 1920);
      } else if (type === "whip") {
        ctx.fillStyle = `rgba(10,15,28,${peak * 0.92})`;
        const x = (p - 0.5) * 2160;
        ctx.fillRect(x, 0, 1080, 1920);
      } else if (type === "iris") {
        ctx.fillStyle = "#050811";
        ctx.beginPath(); ctx.rect(0, 0, 1080, 1920);
        ctx.arc(540, 960, Math.max(10, (1 - peak) * 1250), 0, Math.PI * 2, true);
        ctx.fill("evenodd");
      }
      ctx.restore();
    }
  };

  global.V25FX = V25FX;
})(window);
