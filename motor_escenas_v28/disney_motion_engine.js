/**
 * =========================================================================
 * V28 DIRECTOR PRO — DISNEY MOTION & INTENT-DRIVEN ANIMATION ENGINE (30fps)
 * Sube el nivel de animación de "muñeco rígido" a animación 2D real:
 * - V28Anim.spring(t, stiffness, damping)  -> Física de resorte real (no lineal)
 * - V28Anim.squashStretch(vy)              -> Aplastamiento/estiramiento en saltos/impactos
 * - V28Anim.anticipationJump(localT, dur)  -> Se agacha antes de saltar + rebote al caer
 * - V28Anim.drawExpressiveCharacter()      -> 7 emociones, pupilas lookAt(x,y), gestos de mano
 * - V28Anim.drawCurvedArrow()              -> Flecha curva dibujándose progresivamente
 * - V28Anim.drawCircleHighlight()          -> Círculo rojo/amarillo rodeando un detalle en vivo
 * - V28Anim.drawSpotlightFocus()           -> Oscurece el resto y enfoca exactamente lo que dice la voz
 * - V28Anim.drawAnimatedBarChart()         -> Gráfica de barras con física spring y datos claros
 * =========================================================================
 */
(function (global) {
  const INK = "#16161E";

  const V28Anim = {
    // 1. Física de resorte real amortiguado (stiffness=180, damping=14 -> rebote natural tipo After Effects)
    spring(t, stiffness = 180, damping = 14) {
      if (t <= 0) return 0;
      if (t > 1.2) return 1;
      const w0 = Math.sqrt(stiffness);
      const zeta = damping / (2 * w0);
      if (zeta < 1) {
        const wd = w0 * Math.sqrt(1 - zeta * zeta);
        return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + (zeta * w0 / wd) * Math.sin(wd * t));
      }
      return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
    },

    // 2. Squash & Stretch físico basado en velocidad vertical o impacto
    squashStretch(velocityNorm) {
      const v = Math.max(-1, Math.min(1, velocityNorm));
      const sy = 1 + Math.abs(v) * 0.18;
      const sx = 1 / Math.sqrt(sy);
      return { sx, sy };
    },

    // 3. Salto con Anticipación (0-20% agacha, 20-75% arco en el aire, 75-100% aterriza con squash)
    anticipationJump(localT, dur = 0.75, height = 110) {
      const p = Math.min(1, Math.max(0, localT / Math.max(0.1, dur)));
      if (p < 0.20) {
        const a = p / 0.20;
        return { dy: 0, sx: 1 + 0.14 * Math.sin(a * Math.PI), sy: 1 - 0.14 * Math.sin(a * Math.PI) };
      } else if (p < 0.78) {
        const j = (p - 0.20) / 0.58;
        const dy = -Math.sin(j * Math.PI) * height;
        const stretch = Math.abs(Math.cos(j * Math.PI)) * 0.12;
        return { dy, sx: 1 - stretch * 0.6, sy: 1 + stretch };
      } else {
        const l = (p - 0.78) / 0.22;
        const sq = Math.sin(l * Math.PI) * 0.16;
        return { dy: 0, sx: 1 + sq, sy: 1 - sq };
      }
    },

    // 4. Foco de Cámara Razonable: oscurece todo EXCEPTO el punto exacto que explica el narrador
    drawSpotlightFocus(ctx, targetX, targetY, radius, alpha = 0.62) {
      if (alpha <= 0.01) return;
      ctx.save();
      const g = ctx.createRadialGradient(targetX, targetY, radius * 0.55, targetX, targetY, radius * 1.45);
      g.addColorStop(0, "rgba(4, 8, 18, 0)");
      g.addColorStop(1, `rgba(4, 8, 18, ${alpha})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1080, 1920);
      ctx.restore();
    },

    // 5. Flecha curva dibujándose en tiempo real hacia un detalle clave
    drawCurvedArrow(ctx, x1, y1, cx, cy, x2, y2, progress, color = "#FACC15", width = 10) {
      const p = Math.min(1, Math.max(0, progress));
      if (p <= 0.02) return;
      ctx.save();
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = "round";
      ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = 10;
      ctx.beginPath();
      const steps = 28;
      const maxS = Math.max(2, Math.floor(steps * p));
      let lx = x1, ly = y1, px = x1, py = y1;
      for (let i = 0; i <= maxS; i++) {
        const u = i / steps;
        const inv = 1 - u;
        const x = inv * inv * x1 + 2 * inv * u * cx + u * u * x2;
        const y = inv * inv * y1 + 2 * inv * u * cy + u * u * y2;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        px = lx; py = ly; lx = x; ly = y;
      }
      ctx.stroke();
      // Punta de flecha orientada según tangente real
      if (p > 0.25) {
        const ang = Math.atan2(ly - py, lx - px);
        const hs = 28;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx - hs * Math.cos(ang - 0.48), ly - hs * Math.sin(ang - 0.48));
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx - hs * Math.cos(ang + 0.48), ly - hs * Math.sin(ang + 0.48));
        ctx.stroke();
      }
      ctx.restore();
    },

    // 6. Círculo dibujado a mano rodeando un detalle importante (progresivo 0 -> 1)
    drawCircleHighlight(ctx, cx, cy, rx, ry, progress, color = "#EF4444", width = 10) {
      const p = Math.min(1, Math.max(0, progress));
      if (p <= 0.02) return;
      ctx.save();
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = "round";
      ctx.shadowColor = color; ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, -0.08, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2.08 * p);
      ctx.stroke();
      ctx.restore();
    },

    // 7. Gráfica de Barras Animada con Física Spring (para datos/comparativas)
    drawAnimatedBarChart(ctx, x, y, w, h, items, localT) {
      ctx.save();
      ctx.fillStyle = "rgba(10, 16, 30, 0.90)"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 28); ctx.fill(); ctx.stroke();

      const maxVal = Math.max(...items.map(it => it.value), 1);
      const padX = 56, padBottom = 86, padTop = 70;
      const usableW = w - padX * 2, usableH = h - padBottom - padTop;
      const colW = usableW / items.length;

      items.forEach((it, idx) => {
        const sp = this.spring(Math.max(0, localT - idx * 0.14), 160, 14);
        const bh = Math.max(8, (it.value / maxVal) * usableH * sp);
        const bx = x + padX + idx * colW + colW * 0.16;
        const bw = colW * 0.68;
        const by = y + h - padBottom - bh;

        ctx.fillStyle = it.color || "#38BDF8";
        ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 14); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
        ctx.fillText(it.display || String(Math.round(it.value * sp)), bx + bw / 2, by - 16);
        ctx.fillStyle = "#CBD5E1"; ctx.font = "700 24px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(it.label, bx + bw / 2, y + h - 38);
      });
      ctx.restore();
    },

    // 8. PERSONAJE EXPRESIVO PRO (7 emociones, mirada dirigida lookAt, gestos reales, squash/stretch)
    drawExpressiveCharacter(ctx, x, groundY, sc, t, opts = {}) {
      const {
        hoodie = "#FACC15",
        pants = "#1E293B",
        hair = "#3E2723",
        skin = "#F3C6A5",
        emotion = "neutral", // neutral | happy | shocked | thinking | angry | smug | worried
        gesture = "idle",    // idle | point_up | point_right | hands_up | chin_think
        talking = false,
        lookAtX = x,
        lookAtY = groundY - 260,
        jumpT = -1,
      } = opts;

      const jump = jumpT >= 0 ? this.anticipationJump(jumpT, 0.72, 95) : { dy: 0, sx: 1, sy: 1 };
      const breath = Math.sin(t * 3.1) * 3.5;
      const blink = (Math.floor(t * 30) % 98) > 94;

      // Sombra de contacto se encoge cuando salta
      const shadowScale = Math.max(0.45, 1 + jump.dy / 180);
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.30)";
      ctx.beginPath(); ctx.ellipse(x, groundY, 76 * sc * shadowScale, 16 * sc * shadowScale, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(x, groundY + jump.dy);
      ctx.scale(sc * jump.sx, sc * jump.sy);
      ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";

      // Piernas + zapatillas limpias ancladas a y=0
      ctx.fillStyle = pants;
      ctx.beginPath(); ctx.roundRect(-42, -130, 34, 122, 16); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(8, -130, 34, 122, 16); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath(); ctx.ellipse(-26, -8, 30, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(26, -8, 30, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Torso / Sudadera con respiración real
      ctx.fillStyle = hoodie;
      ctx.beginPath(); ctx.roundRect(-64, -262 + breath * 0.4, 128, 140, 36); ctx.fill(); ctx.stroke();
      // Cordones sudadera
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-16, -242); ctx.lineTo(-16, -190); ctx.moveTo(16, -242); ctx.lineTo(16, -190); ctx.stroke();
      ctx.strokeStyle = INK; ctx.lineWidth = 7;

      // Brazos desde los HOMBROS (jamás cintura!) según gesto narrativo
      const armWave = talking ? Math.sin(t * 7) * 0.12 : Math.sin(t * 2) * 0.04;
      // Brazo izquierdo
      ctx.save(); ctx.translate(-62, -236 + breath * 0.4);
      ctx.rotate(gesture === "hands_up" ? 2.45 : (gesture === "chin_think" ? -0.45 : 0.18 + armWave));
      ctx.fillStyle = hoodie; ctx.beginPath(); ctx.roundRect(-14, 0, 28, 86, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, 92, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();

      // Brazo derecho
      ctx.save(); ctx.translate(62, -236 + breath * 0.4);
      const rRot = gesture === "point_up" ? -2.65 : (gesture === "point_right" ? -1.45 : (gesture === "hands_up" ? -2.45 : -0.18 - armWave));
      ctx.rotate(rRot);
      ctx.fillStyle = hoodie; ctx.beginPath(); ctx.roundRect(-14, 0, 28, 86, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, 92, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();

      // Cuello + Cabeza con ligera inclinación emocional
      const headTilt = emotion === "thinking" ? 0.08 : (emotion === "shocked" ? -0.05 : Math.sin(t * 2.2) * 0.025);
      ctx.save();
      ctx.translate(0, -276 + breath * 0.6);
      ctx.rotate(headTilt);

      ctx.fillStyle = skin;
      ctx.beginPath(); ctx.roundRect(-18, -14, 36, 30, 12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -68, 66, 70, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // Pelo
      ctx.fillStyle = hair;
      ctx.beginPath(); ctx.arc(0, -82, 68, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fill(); ctx.stroke();

      // Pupilas mirando hacia lookAtX, lookAtY
      const dxLook = Math.max(-5, Math.min(5, (lookAtX - x) / 60));
      const dyLook = Math.max(-4, Math.min(4, (lookAtY - (groundY - 340 * sc)) / 60));

      [[-24, -70], [24, -70]].forEach(([ex, ey], idx) => {
        if (blink && emotion !== "shocked") {
          ctx.beginPath(); ctx.moveTo(ex - 13, ey); ctx.lineTo(ex + 13, ey); ctx.stroke();
        } else {
          const er = emotion === "shocked" ? 17 : 14;
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = INK;
          ctx.beginPath(); ctx.arc(ex + dxLook, ey + dyLook, emotion === "shocked" ? 5.5 : 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath(); ctx.arc(ex + dxLook - 2.5, ey + dyLook - 2.5, 2.6, 0, Math.PI * 2); ctx.fill();
        }
        // Cejas expresivas según emoción
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        if (emotion === "angry") {
          ctx.moveTo(ex - 14, ey - 24 + (idx === 0 ? 0 : 8)); ctx.lineTo(ex + 14, ey - 24 + (idx === 0 ? 8 : 0));
        } else if (emotion === "worried" || emotion === "shocked") {
          ctx.moveTo(ex - 14, ey - 26 + (idx === 0 ? 6 : 0)); ctx.lineTo(ex + 14, ey - 26 + (idx === 0 ? 0 : 6));
        } else if (emotion === "thinking" || emotion === "smug") {
          ctx.moveTo(ex - 14, ey - (idx === 1 ? 30 : 22)); ctx.lineTo(ex + 14, ey - (idx === 1 ? 26 : 22));
        } else {
          ctx.moveTo(ex - 13, ey - 24); ctx.lineTo(ex + 13, ey - 24);
        }
        ctx.stroke();
      });

      // Boca + Lip-Sync + Emociones
      ctx.lineWidth = 5;
      if (talking) {
        const open = 6 + Math.abs(Math.sin(t * 15)) * 13;
        ctx.fillStyle = "#881337";
        ctx.beginPath(); ctx.ellipse(0, -32, 16, open, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      } else if (emotion === "shocked") {
        ctx.fillStyle = "#881337";
        ctx.beginPath(); ctx.ellipse(0, -30, 14, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      } else if (emotion === "happy") {
        ctx.fillStyle = "#881337";
        ctx.beginPath(); ctx.arc(0, -38, 20, 0.1 * Math.PI, 0.9 * Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else if (emotion === "worried" || emotion === "angry") {
        ctx.beginPath(); ctx.arc(0, -22, 15, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else if (emotion === "thinking") {
        ctx.beginPath(); ctx.moveTo(-12, -32); ctx.lineTo(12, -35); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(0, -38, 15, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      }
      ctx.restore();
      ctx.restore();
    }
  };

  global.V28Anim = V28Anim;
})(window);
