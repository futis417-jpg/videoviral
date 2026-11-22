/**
 * =========================================================================
 * V26 CLONE MASTER — 5 VIRAL ARCHETYPES ENGINE (1080x1920, 30fps)
 * Replica con fidelidad de estudio los 5 arquetipos virales analizados:
 * 1. V26.NeuraPsico   (Reto Gamificado 4 Niveles + Orbital BG + Stamps)
 * 2. V26.InkEditorial (Tinta y Acuarela sobre Papel Crema -> usa V18.Ink)
 * 3. V26.NeonGaming   (Carretera 2.5D Neón + 6 Estrellas + Candado + TV Meta)
 * 4. V26.AbismoXRay   (Corte X-Ray Cian + Agua + Presión kg + Targeting + Timer)
 * 5. V26.Docu25D      (Documental 2.5D + Lluvia + Fechas + Bio-Tags + Subs Amarillos)
 * =========================================================================
 */
(function (global) {
  const V26 = {
    // -----------------------------------------------------------------------
    // ARQUETIPO 1: @NEURAPSICOO (RETO GAMIFICADO 4 NIVELES)
    // -----------------------------------------------------------------------
    NeuraPsico: {
      drawOrbitalBg(ctx, t) {
        const g = ctx.createRadialGradient(540, 820, 80, 540, 960, 1180);
        g.addColorStop(0, "#19355C");
        g.addColorStop(0.55, "#0E203C");
        g.addColorStop(1, "#071122");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 1080, 1920);
        // Anillos orbitales sutiles + estrellitas
        ctx.save();
        ctx.strokeStyle = "rgba(148, 197, 255, 0.08)";
        ctx.lineWidth = 2.5;
        [240, 410, 590, 780].forEach((r) => {
          ctx.beginPath(); ctx.arc(540, 880, r, 0, Math.PI * 2); ctx.stroke();
        });
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        for (let i = 0; i < 36; i++) {
          const sx = (i * 197 + 40) % 1080, sy = (i * 263 + 80) % 1800;
          const a = 0.15 + 0.25 * Math.sin(t * 2 + i);
          ctx.globalAlpha = a;
          ctx.beginPath(); ctx.arc(sx, sy, (i % 3) + 1.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      },

      drawTiltedStamp(ctx, text, cx, cy, angle = -0.10, bg = "#DC2626") {
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(angle);
        ctx.font = "800 44px 'Plus Jakarta Sans', sans-serif";
        const tw = ctx.measureText(text).width + 64, th = 78;
        ctx.fillStyle = bg; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6;
        ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.roundRect(-tw / 2, -th / 2, tw, th, 18); ctx.fill(); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(text, 0, 2);
        ctx.restore();
      },

      drawStatPop(ctx, bigText, subText, cx = 540, cy = 660) {
        ctx.save();
        ctx.fillStyle = "#FACC15"; ctx.font = "800 138px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(250,204,21,0.35)"; ctx.shadowBlur = 24;
        ctx.fillText(bigText, cx, cy);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#FFFFFF"; ctx.font = "800 30px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(subText, cx, cy + 92);
        ctx.restore();
      },

      drawDarkPillSubs(ctx, words, t, y = 265) {
        const chunks = []; for (let i = 0; i < words.length; i += 4) chunks.push(words.slice(i, i + 4));
        const active = chunks.find(c => t >= c[0].start - 0.04 && t <= c[c.length - 1].end + 0.14);
        if (!active) return;
        ctx.save(); ctx.font = "800 44px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        const sp = 16;
        const ws = active.map(w => ctx.measureText(w.word).width);
        const tot = ws.reduce((a, b) => a + b, 0) + sp * (active.length - 1);
        const px = (1080 - tot) / 2;
        ctx.fillStyle = "rgba(8, 12, 22, 0.86)";
        ctx.beginPath(); ctx.roundRect(px - 26, y - 38, tot + 52, 76, 18); ctx.fill();
        let cx = px;
        active.forEach((w, i) => {
          const isNow = t >= w.start && t <= w.end + 0.05;
          if (isNow) {
            ctx.fillStyle = "#FACC15";
            ctx.beginPath(); ctx.roundRect(cx - 8, y - 28, ws[i] + 16, 56, 10); ctx.fill();
          }
          ctx.fillStyle = isNow ? "#0F172A" : "#FFFFFF";
          ctx.fillText(w.word, cx, y + 1);
          cx += ws[i] + sp;
        });
        ctx.restore();
      }
    },

    // -----------------------------------------------------------------------
    // ARQUETIPO 3: NEON SYNTHWAVE 2.5D GAMING (ESTILO GTA 6 ESTRELLAS)
    // -----------------------------------------------------------------------
    NeonGaming: {
      drawHighway25D(ctx, t) {
        // Cielo púrpura synthwave + skyline con bordes neón
        const sky = ctx.createLinearGradient(0, 0, 0, 960);
        sky.addColorStop(0, "#1B0B2E"); sky.addColorStop(1, "#4C1D6E");
        ctx.fillStyle = sky; ctx.fillRect(0, 0, 1080, 960);

        // Edificios skyline con bordes neón rosa/cian
        const blds = [
          [70, 520, 140], [220, 420, 120], [360, 620, 145],
          [720, 580, 150], [880, 460, 130], [1010, 560, 140]
        ];
        blds.forEach(([bx, bh, bw], idx) => {
          ctx.fillStyle = "#160C28";
          ctx.strokeStyle = idx % 2 === 0 ? "#E879F9" : "#38BDF8";
          ctx.lineWidth = 3;
          ctx.fillRect(bx - bw / 2, 920 - bh, bw, bh);
          ctx.strokeRect(bx - bw / 2, 920 - bh, bw, bh);
        });

        // Carretera 2.5D perspectiva infinita
        const road = ctx.createLinearGradient(0, 920, 0, 1920);
        road.addColorStop(0, "#1E1B3A"); road.addColorStop(1, "#2A254B");
        ctx.fillStyle = road; ctx.fillRect(0, 920, 1080, 1000);

        // Bordes neón laterales
        ctx.lineWidth = 7;
        ctx.strokeStyle = "#F43F5E";
        ctx.beginPath(); ctx.moveTo(460, 920); ctx.lineTo(-40, 1480); ctx.stroke();
        ctx.strokeStyle = "#38BDF8";
        ctx.beginPath(); ctx.moveTo(620, 920); ctx.lineTo(1120, 1480); ctx.stroke();

        // Rayas centrales animadas hacia el espectador
        ctx.fillStyle = "#FEF08A";
        for (let i = 0; i < 6; i++) {
          const prog = ((t * 1.4 + i / 6) % 1);
          const y = 920 + Math.pow(prog, 2.2) * 980;
          const h = 14 + prog * 70;
          const w = 6 + prog * 18;
          ctx.fillRect(540 - w / 2, y, w, h);
        }
      },

      drawWantedStars(ctx, filled = 5, total = 6, y = 650, locked = false) {
        const startX = 540 - ((total - 1) * 145) / 2;
        ctx.save();
        for (let i = 0; i < total; i++) {
          const cx = startX + i * 145;
          const isLit = i < filled;
          ctx.save(); ctx.translate(cx, y);
          ctx.beginPath();
          for (let p = 0; p < 10; p++) {
            const r = p % 2 === 0 ? 58 : 26;
            const a = (p * Math.PI) / 5 - Math.PI / 2;
            if (p === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fillStyle = isLit ? "#FFFFFF" : "rgba(15,23,42,0.75)";
          ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4;
          if (isLit) { ctx.shadowColor = "#FFFFFF"; ctx.shadowBlur = 18; }
          ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        if (locked) {
          // Candado dorado en la estrella 6
          const lx = startX + (total - 1) * 145;
          ctx.fillStyle = "#FACC15"; ctx.strokeStyle = "#16161E"; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.roundRect(lx - 28, y - 16, 56, 46, 10); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.arc(lx, y - 16, 18, Math.PI, 0); ctx.stroke();
        }
        ctx.restore();
      }
    },

    // -----------------------------------------------------------------------
    // ARQUETIPO 4: @ABISMO2D (X-RAY SUPERVIVENCIA TÉCNICA)
    // -----------------------------------------------------------------------
    AbismoXRay: {
      drawUnderwaterBg(ctx, t, waterY = 820) {
        // Cielo nocturno arriba
        ctx.fillStyle = "#08121E"; ctx.fillRect(0, 0, 1080, waterY);
        // Agua profunda abajo
        const wg = ctx.createLinearGradient(0, waterY, 0, 1920);
        wg.addColorStop(0, "#1A5B73"); wg.addColorStop(0.5, "#0D374A"); wg.addColorStop(1, "#061924");
        ctx.fillStyle = wg; ctx.fillRect(0, waterY, 1080, 1920 - waterY);
        // Onda luminosa de superficie
        ctx.save();
        ctx.strokeStyle = "#5EEAD4"; ctx.lineWidth = 8; ctx.shadowColor = "#00F5D4"; ctx.shadowBlur = 14;
        ctx.beginPath();
        for (let x = 0; x <= 1080; x += 24) {
          const y = waterY + Math.sin(x * 0.015 + t * 3.5) * 10;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      },

      drawTargetingBracket(ctx, x, y, w, h, label = "SALIDA", color = "#22C55E") {
        const c = 38;
        ctx.save();
        ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.shadowColor = color; ctx.shadowBlur = 12;
        [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([px, py, dx, dy]) => {
          ctx.beginPath(); ctx.moveTo(px + dx * c, py); ctx.lineTo(px, py); ctx.lineTo(px, py + dy * c); ctx.stroke();
        });
        if (label) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(10,18,30,0.9)"; ctx.beginPath(); ctx.roundRect(x + w / 2 - 80, y - 52, 160, 42, 12); ctx.fill(); ctx.stroke();
          ctx.fillStyle = color; ctx.font = "800 24px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(label, x + w / 2, y - 30);
        }
        ctx.restore();
      },

      drawPressureGauge(ctx, kg, cx = 540, cy = 1180) {
        ctx.save();
        ctx.fillStyle = "rgba(10, 18, 30, 0.88)"; ctx.strokeStyle = "#38BDF8"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.roundRect(cx - 170, cy - 55, 340, 110, 20); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#94A3B8"; ctx.font = "700 20px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("PRESIÓN DEL AGUA", cx, cy - 22);
        ctx.fillStyle = kg > 150 ? "#EF4444" : "#FFFFFF"; ctx.font = "800 48px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(`${Math.round(kg)} kg`, cx, cy + 28);
        ctx.restore();
      }
    },

    // -----------------------------------------------------------------------
    // ARQUETIPO 5: DOCUMENTAL 2.5D HISTORIA REAL (ESTILO JULIANE 1971)
    // -----------------------------------------------------------------------
    Docu25D: {
      drawDatePlaque(ctx, dateText, placeText, y = 340) {
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
        ctx.beginPath(); ctx.roundRect(140, y, 800, 180, 18); ctx.fill();
        ctx.fillStyle = "#FDE68A"; ctx.font = "800 88px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(dateText, 540, y + 72);
        ctx.fillStyle = "#E2E8F0"; ctx.font = "700 32px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(placeText, 540, y + 142);
        ctx.restore();
      },

      drawBioTag(ctx, name, role, x, y, targetX, targetY) {
        ctx.save();
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x, y + 54); ctx.lineTo(targetX, targetY); ctx.stroke();
        ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
        ctx.beginPath(); ctx.roundRect(x - 210, y - 48, 420, 102, 16); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
        ctx.fillText(name, x, y - 6);
        ctx.fillStyle = "#CBD5E1"; ctx.font = "700 22px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(role, x, y + 32);
        ctx.restore();
      },

      drawDocuSubs(ctx, words, t, y = 1480) {
        const chunks = []; for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(i, i + 3));
        const active = chunks.find(c => t >= c[0].start - 0.04 && t <= c[c.length - 1].end + 0.14);
        if (!active) return;
        ctx.save(); ctx.font = "800 54px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        const sp = 18;
        const ws = active.map(w => ctx.measureText(w.word.toUpperCase()).width);
        const tot = ws.reduce((a, b) => a + b, 0) + sp * (active.length - 1);
        let cx = (1080 - tot) / 2;
        active.forEach((w, i) => {
          const isNow = t >= w.start && t <= w.end + 0.05;
          const txt = w.word.toUpperCase();
          ctx.lineWidth = 10; ctx.strokeStyle = "rgba(0,0,0,0.92)"; ctx.strokeText(txt, cx, y);
          ctx.fillStyle = isNow ? "#FACC15" : "#FFFFFF";
          ctx.fillText(txt, cx, y);
          cx += ws[i] + sp;
        });
        ctx.restore();
      }
    }
  };

  global.V26 = V26;
})(window);
