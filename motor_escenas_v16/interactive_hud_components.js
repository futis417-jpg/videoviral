/**
 * =========================================================================
 * V16 PRO — INTERACTIVE GAMIFIED HUD & MOTION COMPONENTS (1080x1920, 30fps)
 * Complementa a `V14` (scene_graph_engine.js) con los componentes exactos
 * de vídeos virales gamificados (estilo @neurapsicoo).
 * =========================================================================
 */
(function (global) {
  const INK = "#16161E";

  const V16 = {
    HUD: {
      // 1. Barra superior gamificada: FALLO | X | 3 | 2 | 1
      drawTopTracker(ctx, total = 4, activeLevel = 4, failedLevels = []) {
        const w = 520, h = 58, x = (1080 - w) / 2, y = 96;
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
        ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 29); ctx.fill(); ctx.stroke();

        ctx.fillStyle = "#FACC15";
        ctx.font = "800 22px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText("FALLO", x + 28, y + h / 2 + 1);

        const startX = x + 138;
        const step = (w - 160) / total;
        for (let i = 0; i < total; i++) {
          const num = total - i;
          const bx = startX + i * step;
          const bw = step - 12, bh = 36, by = y + (h - bh) / 2;
          const isFailed = failedLevels.includes(num);
          const isActive = (num === activeLevel) && !isFailed;

          ctx.fillStyle = isFailed ? "#DC2626" : (isActive ? "#FACC15" : "rgba(51, 65, 85, 0.75)");
          ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 18); ctx.fill();

          ctx.fillStyle = isActive ? "#0F172A" : "#FFFFFF";
          ctx.font = "800 22px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(isFailed ? "✕" : String(num), bx + bw / 2, by + bh / 2 + 1);
        }
        ctx.restore();
      },

      // 2. Barra de cuenta atrás interactiva: ⏳ ELIGE [======---]
      drawCountdownBar(ctx, label = "ELIGE", progress = 0.65, y = 1690) {
        const w = 580, h = 76, x = (1080 - w) / 2;
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
        ctx.strokeStyle = "#FACC15";
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 38); ctx.fill(); ctx.stroke();

        ctx.fillStyle = "#FACC15";
        ctx.font = "800 28px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText("⏳  " + label, x + 32, y + h / 2 + 1);

        const barX = x + 230, barW = w - 266, barH = 18, barY = y + (h - barH) / 2;
        ctx.fillStyle = "#334155";
        ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 9); ctx.fill();
        ctx.fillStyle = progress < 0.25 ? "#EF4444" : "#FACC15";
        ctx.beginPath(); ctx.roundRect(barX, barY, Math.max(12, barW * Math.max(0, Math.min(1, progress))), barH, 9); ctx.fill();
        ctx.restore();
      },

      // 3. Monitor CCTV de Seguridad (con REC parpadeando y clip interior)
      drawCCTVMonitor(ctx, t, camLabel, timestamp, drawInsideFn) {
        const x = 90, y = 480, w = 900, h = 620;
        ctx.save();
        ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#0F172A"; ctx.lineWidth = 10;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 34); ctx.fill(); ctx.stroke();
        // Pantalla interior con clip
        const sx = x + 26, sy = y + 26, sw = w - 52, sh = h - 90;
        ctx.save();
        ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 18); ctx.clip();
        ctx.fillStyle = "#111827"; ctx.fillRect(sx, sy, sw, sh);
        if (drawInsideFn) drawInsideFn(ctx, sx, sy, sw, sh, t);
        // Scanlines sutiles CCTV
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        for (let ly = sy; ly < sy + sh; ly += 8) ctx.fillRect(sx, ly, sw, 3);
        // Overlay CAM + REC + Timestamp
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.font = "700 22px monospace"; ctx.textAlign = "left";
        ctx.fillText(camLabel || "CAM 01 · COCINA", sx + 22, sy + 38);
        ctx.fillText(timestamp || "14/11/2026 03:12:09", sx + 22, sy + sh - 22);
        if (Math.floor(t * 2) % 2 === 0) {
          ctx.fillStyle = "#EF4444"; ctx.beginPath(); ctx.arc(sx + sw - 82, sy + 30, 8, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = "#FFF"; ctx.textAlign = "right";
        ctx.fillText("REC", sx + sw - 22, sy + 38);
        ctx.restore();
        // Etiqueta inferior monitor
        ctx.fillStyle = "#94A3B8"; ctx.font = "700 20px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("SEGURIDAD", x + w / 2, y + h - 26);
        ctx.restore();
      },

      // 4. Divisor vertical ANTES | AHORA (Before/After Split)
      drawBeforeAfterSplit(ctx, splitX, drawBeforeFn, drawAfterFn, labelL = "ANTES", labelR = "AHORA") {
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, splitX, 1920); ctx.clip();
        drawBeforeFn(ctx);
        ctx.restore();

        ctx.save();
        ctx.beginPath(); ctx.rect(splitX, 0, 1080 - splitX, 1920); ctx.clip();
        drawAfterFn(ctx);
        ctx.restore();

        // Línea divisora brillante
        ctx.save();
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6;
        ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.moveTo(splitX, 0); ctx.lineTo(splitX, 1920); ctx.stroke();
        ctx.shadowBlur = 0;
        // Píldoras ANTES / AHORA
        [[splitX * 0.5, labelL, "#38BDF8"], [splitX + (1080 - splitX) * 0.5, labelR, "#F472B6"]].forEach(([px, txt, col]) => {
          ctx.fillStyle = "rgba(15,23,42,0.85)"; ctx.strokeStyle = col; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.roundRect(px - 80, 480, 160, 48, 24); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#FFF"; ctx.font = "800 22px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(txt, px, 505);
        });
        ctx.restore();
      },

      // 5. Tarjeta Pictograma Estadística (ej: 7 DE CADA 10 NO VIERON EL CAMBIO)
      drawPictogramCard(ctx, title, subtitle, redCount = 7, greenCount = 3, footer = "Y ESO QUE LO BUSCABAN") {
        const x = 95, y = 630, w = 890, h = 680;
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.94)"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 36); ctx.fill(); ctx.stroke();

        ctx.fillStyle = "#FFFFFF"; ctx.font = "800 54px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
        ctx.fillText(title, 540, y + 88);
        ctx.fillStyle = "#CBD5E1"; ctx.font = "700 30px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(subtitle, 540, y + 142);

        const total = redCount + greenCount;
        for (let i = 0; i < total; i++) {
          const row = Math.floor(i / 5), col = i % 5;
          const px = x + 135 + col * 155, py = y + 255 + row * 145;
          const isRed = i < redCount;
          ctx.fillStyle = isRed ? "#EF4444" : "#22C55E";
          ctx.beginPath(); ctx.arc(px, py, 24, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.roundRect(px - 32, py + 30, 64, 52, 22); ctx.fill();
          ctx.fillStyle = "#FFF"; ctx.font = "800 26px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(isRed ? "?" : "!", px + 36, py - 10);
        }

        if (footer) {
          ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#FACC15"; ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.roundRect(240, y + h - 98, 600, 64, 32); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#FACC15"; ctx.font = "800 26px 'Plus Jakarta Sans', sans-serif"; ctx.textBaseline = "middle";
          ctx.fillText(footer, 540, y + h - 65);
        }
        ctx.restore();
      },

      // 6. Espectrograma / Ondas Neón de Audio
      drawSpectrogram(ctx, t, label = "SONIDO MISTERIOSO", revealVoice = false) {
        const x = 90, y = 580, w = 900, h = 420;
        ctx.save();
        ctx.fillStyle = "#090D16"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 26); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.roundRect(x + 4, y + 4, w - 8, h - 8, 22); ctx.clip();
        // Rejilla
        ctx.strokeStyle = "rgba(148,163,184,0.12)"; ctx.lineWidth = 2;
        for (let gx = x; gx < x + w; gx += 75) { ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke(); }
        for (let gy = y; gy < y + h; gy += 70) { ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke(); }
        // Fondo espectrograma morado si revealVoice
        if (revealVoice) {
          for (let bx = x + 15; bx < x + w - 15; bx += 18) {
            const bh = 60 + Math.abs(Math.sin(bx * 0.04 + t * 4)) * 240;
            ctx.fillStyle = "rgba(192, 38, 211, 0.32)";
            ctx.fillRect(bx, y + h - bh, 12, bh);
          }
        }
        // 3 Formantes de onda neón
        [["#FACC15", 130, 0.02], ["#4ADE80", 220, 0.015], ["#38BDF8", 320, 0.012]].forEach(([col, baseY, freq], idx) => {
          ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.beginPath();
          for (let px = x + 20; px < x + w - 20; px += 12) {
            const py = y + baseY + Math.sin(px * freq + t * 5 + idx * 2) * 34;
            if (px === x + 20) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        });
        ctx.restore();
        ctx.fillStyle = "#94A3B8"; ctx.font = "800 24px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left";
        ctx.fillText(label, x + 8, y - 18);
      },

      // 7. Polaroid en Foco de Luz (Spotlight Interrogation)
      drawPolaroidSpotlight(ctx, t, caption = "TU RECUERDO", drawPhotoFn) {
        ctx.save();
        ctx.fillStyle = "#080A12"; ctx.fillRect(0, 0, 1080, 1920);
        // Cono de foco desde arriba
        const g = ctx.createLinearGradient(540, 0, 540, 1650);
        g.addColorStop(0, "rgba(255,255,255,0.22)"); g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(460, 0); ctx.lineTo(620, 0); ctx.lineTo(960, 1750); ctx.lineTo(120, 1750); ctx.closePath(); ctx.fill();
        // Polaroid inclinada
        ctx.translate(540, 920); ctx.rotate(Math.sin(t * 1.5) * 0.02 - 0.04);
        ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.roundRect(-240, -280, 480, 560, 16); ctx.fill(); ctx.stroke();
        ctx.save(); ctx.beginPath(); ctx.rect(-210, -250, 420, 390); ctx.clip();
        ctx.fillStyle = "#1E293B"; ctx.fillRect(-210, -250, 420, 390);
        if (drawPhotoFn) drawPhotoFn(ctx);
        ctx.restore();
        ctx.fillStyle = INK; ctx.font = "800 38px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
        ctx.fillText(caption, 0, 220);
        ctx.restore();
      },

      // 8. Tarjeta de Puntuación Final (Comment Bait)
      drawFinalScoreCard(ctx, total = 4, question = "¿CUÁNTAS VECES TE HA PILLADO? ↓") {
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.94)"; ctx.strokeStyle = "#FACC15"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.roundRect(220, 1460, 640, 140, 42); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#94A3B8"; ctx.font = "700 22px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left";
        ctx.fillText("TE HA PILLADO", 280, 1506);
        ctx.fillStyle = "#FACC15"; ctx.font = "800 62px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(`? / ${total}`, 280, 1572);
        // 4 X rojas a la derecha
        for (let i = 0; i < total; i++) {
          const r = Math.floor(i / 2), c = i % 2;
          const cx = 695 + c * 62, cy = 1502 + r * 58;
          ctx.fillStyle = "#DC2626"; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#FFF"; ctx.font = "800 24px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("✕", cx, cy + 1);
        }
        // Píldora CTA blanca abajo
        ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.roundRect(140, 1645, 800, 76, 38); ctx.fill();
        ctx.fillStyle = "#0F172A"; ctx.font = "800 28px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(question, 540, 1684);
        ctx.restore();
      },

      // 9. Mascota / Host con Cúpula Cerebral de Cristal (opcional)
      drawMascotHost(ctx, x, y, sc, t, opts = {}) {
        const { hoodie="#FACC15", brainDome=true, talking=false, eyesClosed=false } = opts;
        const bob = Math.sin(t * 3.2) * 5;
        const blink = eyesClosed || ((Math.floor(t * 30) % 105) > 100);
        ctx.save(); ctx.translate(x, y + bob); ctx.scale(sc, sc);
        ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
        // Sudadera amarilla con cordones
        ctx.fillStyle = hoodie; ctx.beginPath(); ctx.roundRect(-145, 70, 290, 290, 75); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#FFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-26, 110); ctx.lineTo(-26, 200); ctx.moveTo(26, 110); ctx.lineTo(26, 200); ctx.stroke();
        // Cuello + Cabeza
        ctx.strokeStyle = INK; ctx.lineWidth = 7;
        ctx.fillStyle = "#F3C6A5"; ctx.beginPath(); ctx.roundRect(-34, 32, 68, 60, 20); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, -45, 115, 118, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Pelo castaño
        ctx.fillStyle = "#4A2E24";
        ctx.beginPath(); ctx.arc(0, -68, 120, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Cúpula cerebral de cristal (si brainDome=true)
        if (brainDome) {
          ctx.fillStyle = "rgba(186, 230, 253, 0.45)";
          ctx.beginPath(); ctx.arc(0, -108, 92, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#F4A4B8";
          ctx.beginPath(); ctx.ellipse(-28, -125, 36, 26, 0, 0, Math.PI * 2); ctx.ellipse(28, -125, 36, 26, 0, 0, Math.PI * 2); ctx.fill();
        }
        // 2 Ojos grandes expresivos + rubor
        ctx.fillStyle = "rgba(244,114,182,0.35)";
        ctx.beginPath(); ctx.ellipse(-58, -10, 22, 12, 0, 0, Math.PI * 2); ctx.ellipse(58, -10, 22, 12, 0, 0, Math.PI * 2); ctx.fill();
        [[-44, -44], [44, -44]].forEach(([ex, ey]) => {
          if (blink) { ctx.beginPath(); ctx.arc(ex, ey, 22, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke(); }
          else {
            ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.ellipse(ex, ey, 26, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#3E2723"; ctx.beginPath(); ctx.arc(ex, ey, 18, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(ex - 7, ey - 9, 7, 0, Math.PI * 2); ctx.fill();
          }
        });
        // Boca
        if (talking) { ctx.fillStyle = "#881337"; ctx.beginPath(); ctx.ellipse(0, 14, 22, 8 + Math.abs(Math.sin(t * 14)) * 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        else { ctx.beginPath(); ctx.arc(0, 8, 22, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
        ctx.restore();
      }
    }
  };

  global.V16 = V16;
})(window);
