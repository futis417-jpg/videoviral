/**
 * =========================================================================
 * V30 GODMODE STUDIO — MEGA PROPS & CHARACTERS LIBRARY (1080x1920, 30fps)
 * Para que la IA NUNCA improvise dibujos raros ni deformes:
 * - V30.Cast (6 Personajes Completos con accesorios y emociones):
 *   drawDetective, drawScientist, drawThief, drawGamer, drawPilot, drawClient
 * - V30.Props (15 Objetos Pro Listos para Usar):
 *   drawSmartphone, drawCarSide, drawAirplane, drawAnalogClock, drawMoneyStack,
 *   drawHeartECG, drawLightbulb, drawPadlock, drawSpeechBubblePro, drawAlarmBell,
 *   drawTrophy, drawLaptop, drawWarningSign, drawKey, drawShield
 * =========================================================================
 */
(function (global) {
  const INK = "#16161E";

  function baseChar(ctx, x, groundY, sc, t, opts, drawAccessoryFn) {
    if (global.V28Anim && global.V28Anim.drawExpressiveCharacter) {
      global.V28Anim.drawExpressiveCharacter(ctx, x, groundY, sc, t, opts);
    }
    if (drawAccessoryFn) {
      ctx.save();
      ctx.translate(x, groundY);
      ctx.scale(sc, sc);
      drawAccessoryFn(ctx, t);
      ctx.restore();
    }
  }

  const V30 = {
    Cast: {
      // 1. Detective (gabardina beige + sombrero fedora + lupa)
      drawDetective(ctx, x, groundY, sc, t, opts = {}) {
        baseChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#C2A378", pants: "#3E342B", hair: "#2B2118", emotion: "thinking", gesture: "chin_think" }, opts), (c) => {
          c.strokeStyle = INK; c.lineWidth = 6;
          // Sombrero Fedora
          c.fillStyle = "#5C4033";
          c.beginPath(); c.ellipse(0, -402, 86, 16, 0, 0, Math.PI * 2); c.fill(); c.stroke();
          c.beginPath(); c.roundRect(-52, -456, 104, 56, 18); c.fill(); c.stroke();
          c.fillStyle = "#1E1B18"; c.fillRect(-50, -416, 100, 12);
        });
      },

      // 2. Científico / Doctor (bata blanca + gafas redondas + tubo de ensayo)
      drawScientist(ctx, x, groundY, sc, t, opts = {}) {
        baseChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#F8FAFC", pants: "#334155", hair: "#94A3B8", emotion: "happy", gesture: "point_up" }, opts), (c) => {
          c.strokeStyle = INK; c.lineWidth = 5;
          // Gafas redondas
          c.fillStyle = "rgba(186, 230, 253, 0.35)";
          c.beginPath(); c.arc(-24, -346, 20, 0, Math.PI * 2); c.fill(); c.stroke();
          c.beginPath(); c.arc(24, -346, 20, 0, Math.PI * 2); c.fill(); c.stroke();
          c.beginPath(); c.moveTo(-4, -346); c.lineTo(4, -346); c.stroke();
          // Corbata azul
          c.fillStyle = "#2563EB";
          c.beginPath(); c.moveTo(0, -256); c.lineTo(-12, -200); c.lineTo(0, -182); c.lineTo(12, -200); c.closePath(); c.fill(); c.stroke();
        });
      },

      // 3. Ladrón (sudadera negra + antifaz + gorro OPCIONAL para retos de memoria!)
      drawThief(ctx, x, groundY, sc, t, opts = {}) {
        const hasHat = opts.hasHat ?? false;
        baseChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#1E293B", pants: "#0F172A", hair: "#111827", emotion: "smug", gesture: "idle" }, opts), (c) => {
          c.strokeStyle = INK; c.lineWidth = 5;
          // Antifaz negro limpio
          c.fillStyle = "#0F172A";
          c.beginPath(); c.roundRect(-54, -364, 108, 34, 14); c.fill(); c.stroke();
          // Huecos ojos blancos
          c.fillStyle = "#FFFFFF";
          c.beginPath(); c.arc(-24, -346, 11, 0, Math.PI * 2); c.arc(24, -346, 11, 0, Math.PI * 2); c.fill();
          c.fillStyle = INK;
          c.beginPath(); c.arc(-24, -346, 5, 0, Math.PI * 2); c.arc(24, -346, 5, 0, Math.PI * 2); c.fill();
          if (hasHat) {
            c.fillStyle = "#DC2626";
            c.beginPath(); c.arc(0, -396, 66, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
          }
        });
      },

      // 4. Gamer / Streamer (cascos neón con LED cian + sudadera morada)
      drawGamer(ctx, x, groundY, sc, t, opts = {}) {
        baseChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#7C3AED", pants: "#1E1B4B", hair: "#1F2937", emotion: "happy", gesture: "hands_up" }, opts), (c) => {
          c.strokeStyle = INK; c.lineWidth = 7;
          // Diadema cascos
          c.beginPath(); c.arc(0, -352, 74, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
          // Auriculares con LED neón
          c.fillStyle = "#0F172A";
          c.beginPath(); c.roundRect(-84, -372, 24, 54, 12); c.fill(); c.stroke();
          c.beginPath(); c.roundRect(60, -372, 24, 54, 12); c.fill(); c.stroke();
          c.fillStyle = "#00F5D4";
          c.fillRect(-76, -360, 8, 30); c.fillRect(68, -360, 8, 30);
        });
      },

      // 5. Piloto / Aventurero (chaqueta aviador + gafas aviador en frente)
      drawPilot(ctx, x, groundY, sc, t, opts = {}) {
        baseChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#78350F", pants: "#1E293B", hair: "#451A03", emotion: "neutral", gesture: "point_right" }, opts), (c) => {
          c.strokeStyle = INK; c.lineWidth = 5;
          c.fillStyle = "#38BDF8";
          c.beginPath(); c.roundRect(-48, -402, 40, 24, 10); c.fill(); c.stroke();
          c.beginPath(); c.roundRect(8, -402, 40, 24, 10); c.fill(); c.stroke();
          c.fillStyle = "#FEF3C7"; // Cuello borreguito
          c.beginPath(); c.roundRect(-52, -264, 104, 24, 12); c.fill(); c.stroke();
        });
      },

      // 6. Cliente / Oficina (traje azul marino + corbata roja)
      drawClient(ctx, x, groundY, sc, t, opts = {}) {
        baseChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#1E3A8A", pants: "#0F172A", hair: "#1F2937", emotion: "worried", gesture: "idle" }, opts), (c) => {
          c.strokeStyle = INK; c.lineWidth = 5;
          c.fillStyle = "#FFFFFF";
          c.beginPath(); c.moveTo(-22, -262); c.lineTo(0, -198); c.lineTo(22, -262); c.closePath(); c.fill(); c.stroke();
          c.fillStyle = "#EF4444";
          c.beginPath(); c.moveTo(0, -256); c.lineTo(-9, -206); c.lineTo(0, -190); c.lineTo(9, -206); c.closePath(); c.fill(); c.stroke();
        });
      }
    },

    Props: {
      // 1. Smartphone Pro con pantalla clip() + notificación animada
      drawSmartphone(ctx, cx, cy, w = 290, h = 540, notifTitle = "MENSAJE NUEVO", notifBody = "Tienes que ver esto...", t = 0) {
        ctx.save();
        ctx.translate(cx - w / 2, cy - h / 2);
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 10;
        ctx.beginPath(); ctx.roundRect(0, 0, w, h, 42); ctx.fill(); ctx.stroke();
        // Pantalla interior con clip
        ctx.save();
        ctx.beginPath(); ctx.roundRect(14, 14, w - 28, h - 28, 32); ctx.clip();
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, "#1E293B"); bg.addColorStop(1, "#0B1120");
        ctx.fillStyle = bg; ctx.fillRect(14, 14, w - 28, h - 28);
        // Notch superior
        ctx.fillStyle = "#020617"; ctx.beginPath(); ctx.roundRect(w / 2 - 48, 22, 96, 22, 11); ctx.fill();
        // Hora
        ctx.fillStyle = "#FFFFFF"; ctx.font = "800 48px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("12:00", w / 2, 118);
        // Notificación con rebote
        const dy = Math.sin(t * 4) * 3;
        ctx.fillStyle = "rgba(30, 41, 59, 0.96)"; ctx.strokeStyle = "#38BDF8"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(26, 170 + dy, w - 52, 118, 20); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#38BDF8"; ctx.font = "800 20px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left";
        ctx.fillText("🔔 " + notifTitle, 44, 208 + dy);
        ctx.fillStyle = "#E2E8F0"; ctx.font = "600 20px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(notifBody, 44, 246 + dy, w - 88);
        if (global.V29 && global.V29.Detail) global.V29.Detail.drawGlassReflection(ctx, 14, 14, w - 28, h - 28, 0.14);
        ctx.restore();
        ctx.restore();
      },

      // 2. Coche lateral detallado (con ventanilla que baja y faros)
      drawCarSide(ctx, cx, cy, sc = 1.0, t = 0, opts = {}) {
        const { color = "#EF4444", windowOpen = 0.0, tilt = 0, headlights = true } = opts;
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(tilt); ctx.scale(sc, sc);
        ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = "round";
        // Haz de faro
        if (headlights) {
          const hg = ctx.createLinearGradient(230, 0, 480, 30);
          hg.addColorStop(0, "rgba(254, 240, 138, 0.45)"); hg.addColorStop(1, "rgba(254, 240, 138, 0)");
          ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(225, -18); ctx.lineTo(480, -85); ctx.lineTo(480, 95); ctx.lineTo(225, 18); ctx.closePath(); ctx.fill();
        }
        // Carrocería
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-225, 35); ctx.lineTo(-225, -25); ctx.lineTo(-140, -35);
        ctx.lineTo(-75, -110); ctx.lineTo(95, -110); ctx.lineTo(155, -30);
        ctx.lineTo(230, -18); ctx.lineTo(230, 35); ctx.closePath();
        ctx.fill(); ctx.stroke();
        // Ventanilla (baja según windowOpen in [0, 1])
        ctx.fillStyle = "#0F172A";
        ctx.beginPath(); ctx.roundRect(-62, -96, 146, 66, 12); ctx.fill(); ctx.stroke();
        const glassH = 66 * (1 - Math.min(1, Math.max(0, windowOpen)));
        if (glassH > 2) {
          ctx.fillStyle = "rgba(125, 211, 252, 0.65)";
          ctx.fillRect(-58, -96 + (66 - glassH), 138, glassH);
        }
        // Ruedas girando
        [-135, 135].forEach((wx) => {
          ctx.fillStyle = "#1E293B"; ctx.beginPath(); ctx.arc(wx, 42, 46, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#CBD5E1"; ctx.beginPath(); ctx.arc(wx, 42, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
        ctx.restore();
      },

      // 3. Avión Comercial detallado
      drawAirplane(ctx, cx, cy, sc = 1.0, angle = 0) {
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(angle); ctx.scale(sc, sc);
        ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineJoin = "round";
        // Cola + Fuselaje
        ctx.fillStyle = "#F8FAFC";
        ctx.beginPath(); ctx.moveTo(-180, -10); ctx.lineTo(-220, -85); ctx.lineTo(-165, -85); ctx.lineTo(-125, -22); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, 0, 210, 42, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Ventanillas
        ctx.fillStyle = "#38BDF8";
        for (let vx = -110; vx <= 110; vx += 28) { ctx.beginPath(); ctx.arc(vx, -6, 6.5, 0, Math.PI * 2); ctx.fill(); }
        // Ala principal
        ctx.fillStyle = "#CBD5E1";
        ctx.beginPath(); ctx.moveTo(-20, 12); ctx.lineTo(-75, 88); ctx.lineTo(-20, 88); ctx.lineTo(55, 12); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      },

      // 4. Reloj Analógico con manecillas giratorias (ideal para timelapses)
      drawAnalogClock(ctx, cx, cy, r = 95, t = 0, speed = 1.0) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          ctx.beginPath(); ctx.moveTo(Math.cos(a) * (r - 18), Math.sin(a) * (r - 18)); ctx.lineTo(Math.cos(a) * (r - 6), Math.sin(a) * (r - 6)); ctx.stroke();
        }
        const mAng = t * speed * 2.4 - Math.PI / 2;
        const hAng = t * speed * 0.2 - Math.PI / 2;
        ctx.lineWidth = 7; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(hAng) * (r * 0.48), Math.sin(hAng) * (r * 0.48)); ctx.stroke();
        ctx.strokeStyle = "#EF4444"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(mAng) * (r * 0.72), Math.sin(mAng) * (r * 0.72)); ctx.stroke();
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      },

      // 5. Fajo de Billetes detallado
      drawMoneyStack(ctx, cx, cy, sc = 1.0) {
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(sc, sc);
        ctx.strokeStyle = INK; ctx.lineWidth = 6;
        for (let i = 2; i >= 0; i--) {
          ctx.fillStyle = i === 0 ? "#22C55E" : "#15803D";
          ctx.beginPath(); ctx.roundRect(-110, -45 + i * 14, 220, 90, 12); ctx.fill(); ctx.stroke();
        }
        ctx.fillStyle = "#FACC15"; ctx.fillRect(-26, -45, 52, 90); ctx.strokeRect(-26, -45, 52, 90);
        ctx.fillStyle = "#0F172A"; ctx.font = "900 44px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("€", 0, 2);
        ctx.restore();
      },

      // 6. Bombilla de Idea (encendida con halo volumétrico)
      drawLightbulb(ctx, cx, cy, sc = 1.0, on = true, t = 0) {
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(sc, sc);
        if (on) {
          const r = 115 + Math.sin(t * 6) * 10;
          const g = ctx.createRadialGradient(0, -15, 10, 0, -15, r);
          g.addColorStop(0, "rgba(250, 204, 21, 0.75)"); g.addColorStop(1, "rgba(250, 204, 21, 0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -15, r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = INK; ctx.lineWidth = 6;
        ctx.fillStyle = on ? "#FEF08A" : "#94A3B8";
        ctx.beginPath(); ctx.arc(0, -20, 52, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#475569";
        ctx.beginPath(); ctx.roundRect(-24, 28, 48, 34, 8); ctx.fill(); ctx.stroke();
        ctx.restore();
      },

      // 7. Candado Metálico (abierto o cerrado)
      drawPadlock(ctx, cx, cy, sc = 1.0, unlocked = false) {
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(sc, sc);
        ctx.strokeStyle = "#CBD5E1"; ctx.lineWidth = 14; ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(unlocked ? 14 : 0, -34, 34, Math.PI, unlocked ? -0.35 : 0);
        ctx.stroke();
        ctx.fillStyle = "#FACC15"; ctx.strokeStyle = INK; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.roundRect(-56, -24, 112, 92, 18); ctx.fill(); ctx.stroke();
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 14, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-5, 18, 10, 22);
        ctx.restore();
      },

      // 8. Corazón latiendo + pulso
      drawHeartECG(ctx, cx, cy, sc = 1.0, t = 0) {
        const beat = 1 + Math.pow(Math.max(0, Math.sin(t * 7)), 6) * 0.16;
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(sc * beat, sc * beat);
        ctx.fillStyle = "#EF4444"; ctx.strokeStyle = INK; ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(0, 58);
        ctx.bezierCurveTo(-90, 5, -90, -75, -42, -75);
        ctx.bezierCurveTo(-15, -75, 0, -52, 0, -36);
        ctx.bezierCurveTo(0, -52, 15, -75, 42, -75);
        ctx.bezierCurveTo(90, -75, 90, 5, 0, 58);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      },

      // 9. Señal de Peligro Triangular
      drawWarningSign(ctx, cx, cy, sc = 1.0, t = 0) {
        const pulse = 1 + Math.sin(t * 8) * 0.04;
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(sc * pulse, sc * pulse);
        ctx.fillStyle = "#FACC15"; ctx.strokeStyle = "#DC2626"; ctx.lineWidth = 12; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(0, -78); ctx.lineTo(84, 66); ctx.lineTo(-84, 66); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = INK; ctx.font = "900 84px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("!", 0, 14);
        ctx.restore();
      },

      // 10. Trofeo Dorado con destello
      drawTrophy(ctx, cx, cy, sc = 1.0) {
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(sc, sc);
        ctx.fillStyle = "#FACC15"; ctx.strokeStyle = INK; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.roundRect(-48, -72, 96, 84, 24); ctx.fill(); ctx.stroke();
        ctx.fillRect(-14, 12, 28, 36); ctx.strokeRect(-14, 12, 28, 36);
        ctx.fillStyle = "#78350F";
        ctx.beginPath(); ctx.roundRect(-52, 48, 104, 26, 8); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }
  };

  global.V30 = Object.assign(global.V30 || {}, V30);
})(window);
