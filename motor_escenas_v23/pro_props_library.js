/**
 * =========================================================================
 * V23 STUDIO MASTERPIECE — PRO PROPS LIBRARY (1080x1920, 30fps)
 * Props vectoriales limpios y reconocibles al instante (CERO óvalos vagos,
 * CERO brazos-salchicha, CERO cerebros deformes).
 * =========================================================================
 */
(function (global) {
  const INK = "#16161E";

  const V23 = {
    Props: {
      // 1. Cerebro anatómico limpio con 2 hemisferios, pliegues y pulso neuronal
      drawRealBrain(ctx, cx, cy, sc = 1.0, t = 0) {
        const pulse = 1 + Math.sin(t * 4.5) * 0.025;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(sc * pulse, sc * pulse);
        ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";

        // Sombra suave detrás
        ctx.fillStyle = "rgba(244, 114, 182, 0.22)";
        ctx.beginPath(); ctx.ellipse(0, 0, 155, 118, 0, 0, Math.PI * 2); ctx.fill();

        // Hemisferio izquierdo y derecho bien formados
        [-1, 1].forEach((dir) => {
          ctx.save(); ctx.scale(dir, 1);
          ctx.fillStyle = dir === -1 ? "#F9A8D4" : "#F472B6";
          ctx.beginPath();
          ctx.moveTo(0, -82);
          ctx.bezierCurveTo(-55, -108, -125, -75, -122, -18);
          ctx.bezierCurveTo(-136, 32, -98, 86, -42, 82);
          ctx.bezierCurveTo(-18, 88, -6, 76, 0, 62);
          ctx.closePath();
          ctx.fill(); ctx.stroke();

          // Pliegues internos ordenados (nada de garabatos!)
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.arc(-58, -32, 26, 0.2 * Math.PI, 1.3 * Math.PI); ctx.stroke();
          ctx.beginPath(); ctx.arc(-68, 22, 24, -0.3 * Math.PI, 0.9 * Math.PI); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-24, -46); ctx.quadraticCurveTo(-40, -10, -22, 28); ctx.stroke();
          ctx.restore();
        });

        // Chispas neuronales animadas
        for (let i = 0; i < 4; i++) {
          const a = t * 2 + i * 1.57;
          const sx = Math.cos(a) * 145, sy = Math.sin(a) * 95;
          ctx.fillStyle = i % 2 === 0 ? "#FACC15" : "#38BDF8";
          ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      },

      // 2. Mano limpia y proporcionada (para close-ups de toques/señalar)
      drawCleanHand(ctx, cx, cy, sc = 1.0, angle = 0, skin = "#F3C6A5") {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.scale(sc, sc);
        ctx.fillStyle = skin; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineJoin = "round";
        // Palma
        ctx.beginPath(); ctx.roundRect(-36, -10, 72, 68, 22); ctx.fill(); ctx.stroke();
        // 4 Dedos arriba + pulgar lateral
        [-26, -9, 8, 24].forEach((fx, i) => {
          const fh = i === 1 || i === 2 ? 48 : 40;
          ctx.beginPath(); ctx.roundRect(fx - 7, -10 - fh + 10, 14, fh, 7); ctx.fill(); ctx.stroke();
        });
        ctx.beginPath(); ctx.roundRect(-54, 12, 24, 16, 8); ctx.fill(); ctx.stroke();
        ctx.restore();
      },

      // 3. Regla de medición limpia (para ilusiones ópticas / comparaciones)
      drawRuler(ctx, cx, cy, w = 520, h = 68) {
        ctx.save();
        ctx.translate(cx - w / 2, cy - h / 2);
        ctx.fillStyle = "#FEF3C7"; ctx.strokeStyle = INK; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.roundRect(0, 0, w, h, 14); ctx.fill(); ctx.stroke();
        ctx.lineWidth = 3;
        for (let x = 24; x <= w - 24; x += 20) {
          const th = ((x - 24) % 100 === 0) ? 28 : 16;
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, th); ctx.stroke();
        }
        ctx.restore();
      },

      // 4. Taza humeante limpia
      drawSteamingMug(ctx, cx, cy, sc = 1.0, t = 0, color = "#FFFFFF") {
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(sc, sc);
        ctx.strokeStyle = INK; ctx.lineWidth = 6;
        // Asa
        ctx.beginPath(); ctx.arc(38, 0, 18, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        // Cuerpo
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.roundRect(-38, -36, 76, 72, 14); ctx.fill(); ctx.stroke();
        // Vapor animado
        ctx.strokeStyle = "rgba(255,255,255,0.65)"; ctx.lineWidth = 4; ctx.lineCap = "round";
        [-14, 0, 14].forEach((vx, i) => {
          const dy = (t * 24 + i * 12) % 28;
          ctx.beginPath();
          ctx.moveTo(vx, -46 - dy * 0.5);
          ctx.quadraticCurveTo(vx + Math.sin(t * 4 + i) * 6, -60 - dy * 0.5, vx, -74 - dy * 0.5);
          ctx.stroke();
        });
        ctx.restore();
      }
    }
  };

  global.V23 = V23;
})(window);
