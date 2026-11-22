/**
 * =========================================================================
 * V31 AFTER-EFFECTS PRO — B-ROLL & VISUAL CUTAWAYS LIBRARY (1080x1920)
 * 10 planos B-Roll completos y auto-animados para intercalar CADA 2.5–4s
 * (acaba para siempre con "un solo personaje moviéndose arriba y abajo"):
 * 1. drawNeuralNetworkBroll()   -> Red neuronal brillante disparando impulsos
 * 2. drawLiveChatFeedBroll()    -> Chat tipo WhatsApp con burbujas + escribiendo...
 * 3. drawAnimatedMapRouteBroll()-> Mapa topográfico oscuro con ruta animada A -> B
 * 4. drawDangerGaugeBroll()     -> Velocímetro/medidor entrando en zona roja
 * 5. drawTimelineZoomBroll()    -> Línea temporal documental deslizando años
 * 6. drawRadarScanBroll()       -> Radar táctico barriendo y detectando objetivos
 * 7. drawSocialViralExplosion() -> Feed viral con likes/vistas explotando
 * 8. drawStormWeatherBroll()    -> Tormenta con lluvia diagonal y relámpagos
 * 9. drawBlueprintScanBroll()   -> Plano técnico X-Ray con láser de escaneo
 * 10. drawGearsMechanismBroll() -> Engranajes mecánicos sincronizados (causa-efecto)
 * =========================================================================
 */
(function (global) {
  const BRoll = {
    // 1. RED NEURONAL / CEREBRO DISPARANDO IMPULSOS LUMINOSOS
    drawNeuralNetworkBroll(ctx, t, title = "CONEXIÓN NEURONAL") {
      const bg = ctx.createRadialGradient(540, 960, 60, 540, 960, 1180);
      bg.addColorStop(0, "#19133C"); bg.addColorStop(1, "#060814");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1920);
      const nodes = [];
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2 + i * 0.4;
        const r = 140 + (i % 4) * 115;
        nodes.push({
          x: 540 + Math.cos(a + t * 0.15) * r,
          y: 920 + Math.sin(a * 1.1 - t * 0.12) * (r * 1.18),
        });
      }
      ctx.save();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 340) {
            ctx.strokeStyle = "rgba(56, 189, 248, 0.25)"; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
            // Pulso eléctrico viajando por la sinapsis
            const pulse = (t * 0.9 + (i * 0.17 + j * 0.11)) % 1;
            const px = nodes[i].x + (nodes[j].x - nodes[i].x) * pulse;
            const py = nodes[i].y + (nodes[j].y - nodes[i].y) * pulse;
            ctx.fillStyle = "#FACC15"; ctx.shadowColor = "#FACC15"; ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
      nodes.forEach((n, idx) => {
        ctx.fillStyle = idx % 3 === 0 ? "#F472B6" : "#00F5D4";
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.arc(n.x, n.y, 11 + Math.sin(t * 4 + idx) * 2.5, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0;
      if (title) {
        ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center"; ctx.fillText(title, 540, 1480);
      }
      ctx.restore();
    },

    // 2. CHAT EN VIVO TIPO WHATSAPP / iMESSAGE (mensajes apareciendo + escribiendo...)
    drawLiveChatFeedBroll(ctx, localT, messages = [
      { me: false, text: "Oye, ¿has visto lo que pasó?" },
      { me: true, text: "Ni idea, dime rápido" },
      { me: false, text: "El 90% cae en esto hoy..." }
    ]) {
      ctx.fillStyle = "#0B141A"; ctx.fillRect(0, 0, 1080, 1920);
      // Cabecera app
      ctx.fillStyle = "#1F2C34"; ctx.fillRect(0, 0, 1080, 210);
      ctx.fillStyle = "#22C55E"; ctx.beginPath(); ctx.arc(110, 130, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.font = "800 34px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Chat en directo", 168, 126);
      ctx.fillStyle = "#22C55E"; ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("en línea", 168, 162);

      let curY = 330;
      messages.forEach((m, idx) => {
        const dt = localT - idx * 0.75;
        if (dt < 0) return;
        const sc = Math.min(1, dt / 0.22);
        const bw = 680, bh = 128;
        const bx = m.me ? (1020 - bw) : 60;
        ctx.save();
        ctx.globalAlpha = sc;
        ctx.translate(bx, curY + (1 - sc) * 35);
        ctx.fillStyle = m.me ? "#005C4B" : "#202C33";
        ctx.beginPath(); ctx.roundRect(0, 0, bw, bh, 26); ctx.fill();
        ctx.fillStyle = "#E9EDEF"; ctx.font = "700 34px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left";
        ctx.fillText(m.text, 34, 72, bw - 80);
        if (m.me) {
          ctx.fillStyle = "#38BDF8"; ctx.font = "800 22px sans-serif"; ctx.textAlign = "right";
          ctx.fillText("✓✓", bw - 26, bh - 20);
        }
        ctx.restore();
        curY += 168;
      });
    },

    // 3. MAPA TOPOGRÁFICO OSCURO CON RUTA ANIMADA A -> B Y RADAR PULSANTE
    drawAnimatedMapRouteBroll(ctx, localT, dur = 4.0, fromLabel = "ORIGEN", toLabel = "DESTINO") {
      ctx.fillStyle = "#081421"; ctx.fillRect(0, 0, 1080, 1920);
      // Curvas topográficas
      ctx.save();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.14)"; ctx.lineWidth = 3;
      for (let i = 0; i < 9; i++) {
        ctx.beginPath(); ctx.ellipse(540 + (i % 3 - 1) * 180, 920 + (i % 2) * 140, 180 + i * 70, 120 + i * 55, 0.25, 0, Math.PI * 2); ctx.stroke();
      }
      // Ruta punteada animada
      const p = Math.min(1, Math.max(0, localT / Math.max(0.5, dur * 0.75)));
      const x1 = 220, y1 = 1280, cx = 560, cy = 860, x2 = 850, y2 = 540;
      ctx.strokeStyle = "#FACC15"; ctx.lineWidth = 9; ctx.setLineDash([22, 16]);
      ctx.beginPath();
      const steps = 32;
      let px = x1, py = y1;
      for (let i = 0; i <= Math.floor(steps * p); i++) {
        const u = i / steps, inv = 1 - u;
        px = inv * inv * x1 + 2 * inv * u * cx + u * u * x2;
        py = inv * inv * y1 + 2 * inv * u * cy + u * u * y2;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke(); ctx.setLineDash([]);
      // Pings origen y cabeza móvil
      [[x1, y1, "#38BDF8", fromLabel], [px, py, "#EF4444", p > 0.85 ? toLabel : ""]].forEach(([mx, my, col, lbl]) => {
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(mx, my, 16, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(mx, my, 26 + ((localT * 45) % 40), 0, Math.PI * 2); ctx.stroke();
        if (lbl) {
          ctx.fillStyle = "rgba(8,14,26,0.9)"; ctx.beginPath(); ctx.roundRect(mx - 110, my - 78, 220, 48, 14); ctx.fill();
          ctx.fillStyle = "#FFFFFF"; ctx.font = "800 24px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
          ctx.fillText(lbl, mx, my - 46);
        }
      });
      ctx.restore();
    },

    // 4. VELOCÍMETRO / MEDIDOR DE PELIGRO SUBIENDO A ZONA ROJA
    drawDangerGaugeBroll(ctx, valuePct = 0.82, label = "NIVEL DE RIESGO", t = 0) {
      ctx.fillStyle = "#090E1A"; ctx.fillRect(0, 0, 1080, 1920);
      const cx = 540, cy = 980, r = 340;
      ctx.save();
      ctx.lineWidth = 46; ctx.lineCap = "round";
      ctx.strokeStyle = "#1E293B"; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.stroke();
      const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
      grad.addColorStop(0, "#22C55E"); grad.addColorStop(0.55, "#FACC15"); grad.addColorStop(1, "#EF4444");
      ctx.strokeStyle = grad;
      const pct = Math.min(1, Math.max(0, valuePct + Math.sin(t * 9) * 0.02));
      ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * pct); ctx.stroke();
      // Aguja
      const ang = Math.PI + Math.PI * pct;
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 14;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * (r - 55), cy + Math.sin(ang) * (r - 55)); ctx.stroke();
      ctx.fillStyle = "#EF4444"; ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.font = "900 102px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`${Math.round(pct * 100)}%`, cx, cy + 140);
      ctx.fillStyle = "#94A3B8"; ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(label, cx, cy + 205);
      ctx.restore();
    },

    // 5. RADAR TÁCTICO BARRIENDO EN TIEMPO REAL
    drawRadarScanBroll(ctx, t, title = "ESCANEO ACTIVO") {
      ctx.fillStyle = "#041118"; ctx.fillRect(0, 0, 1080, 1920);
      const cx = 540, cy = 940;
      ctx.save();
      ctx.strokeStyle = "rgba(0, 245, 212, 0.28)"; ctx.lineWidth = 3;
      [140, 270, 400].forEach(r => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(cx - 420, cy); ctx.lineTo(cx + 420, cy); ctx.moveTo(cx, cy - 420); ctx.lineTo(cx, cy + 420); ctx.stroke();
      const ang = t * 2.6;
      const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 400);
      g.addColorStop(0, "rgba(0, 245, 212, 0.42)"); g.addColorStop(1, "rgba(0, 245, 212, 0.02)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, 400, ang - 0.65, ang); ctx.closePath(); ctx.fill();
      // Blips detectados
      [[150, -120], [-210, 90], [80, 240]].forEach(([bx, by], i) => {
        const a = 0.4 + 0.6 * Math.abs(Math.sin(t * 4 + i));
        ctx.fillStyle = `rgba(239, 68, 68, ${a})`;
        ctx.beginPath(); ctx.arc(cx + bx, cy + by, 14, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = "#00F5D4"; ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
      ctx.fillText(title, cx, 1460);
      ctx.restore();
    },

    // 6. PLANO TÉCNICO BLUEPRINT CON LÁSER DE ESCANEO
    drawBlueprintScanBroll(ctx, t, title = "ANÁLISIS TÉCNICO", drawCenterPropFn = null) {
      ctx.fillStyle = "#081C38"; ctx.fillRect(0, 0, 1080, 1920);
      ctx.save();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.16)"; ctx.lineWidth = 2;
      for (let x = 0; x < 1080; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1920); ctx.stroke(); }
      for (let y = 0; y < 1920; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); }
      if (drawCenterPropFn) drawCenterPropFn(ctx, t);
      // Láser horizontal escaneando arriba/abajo
      const ly = 420 + (Math.sin(t * 2.4) * 0.5 + 0.5) * 980;
      ctx.strokeStyle = "#00F5D4"; ctx.lineWidth = 6; ctx.shadowColor = "#00F5D4"; ctx.shadowBlur = 22;
      ctx.beginPath(); ctx.moveTo(60, ly); ctx.lineTo(1020, ly); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#38BDF8"; ctx.font = "800 30px monospace"; ctx.textAlign = "center";
      ctx.fillText(title, 540, 1520);
      ctx.restore();
    },

    // 7. ENGRANAJES MECÁNICOS SINCRONIZADOS (metáfora causa -> efecto)
    drawGearsMechanismBroll(ctx, t, label = "CÓMO FUNCIONA POR DENTRO") {
      ctx.fillStyle = "#0D1322"; ctx.fillRect(0, 0, 1080, 1920);
      function gear(cx, cy, r, teeth, rot, color) {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.fillStyle = color; ctx.strokeStyle = "#0A0F1C"; ctx.lineWidth = 6;
        ctx.beginPath();
        for (let i = 0; i < teeth * 2; i++) {
          const rad = i % 2 === 0 ? r + 22 : r - 6;
          const a = (i / (teeth * 2)) * Math.PI * 2;
          if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
          else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0D1322"; ctx.beginPath(); ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      gear(390, 820, 155, 12, t * 1.1, "#38BDF8");
      gear(695, 975, 125, 10, -t * 1.32 + 0.25, "#FACC15");
      gear(430, 1170, 105, 8, t * 1.65, "#F472B6");
      ctx.fillStyle = "#E2E8F0"; ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
      ctx.fillText(label, 540, 1460);
    },

    // 8. TORMENTA CINEMATOGRÁFICA (lluvia diagonal + relámpagos)
    drawStormWeatherBroll(ctx, t) {
      const flash = Math.pow(Math.max(0, Math.sin(t * 3.7) * Math.sin(t * 11.3)), 14);
      const bg = ctx.createLinearGradient(0, 0, 0, 1920);
      bg.addColorStop(0, flash > 0.4 ? "#475569" : "#09111F");
      bg.addColorStop(1, "#132238");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1920);
      // Lluvia diagonal rápida
      ctx.save();
      ctx.strokeStyle = "rgba(186, 230, 253, 0.35)"; ctx.lineWidth = 3;
      for (let i = 0; i < 65; i++) {
        const rx = ((i * 83 - t * 280) % 1280 + 1280) % 1280 - 100;
        const ry = ((i * 137 + t * 920) % 2100) - 100;
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 18, ry + 58); ctx.stroke();
      }
      ctx.restore();
    }
  };

  global.V31 = Object.assign(global.V31 || {}, { BRoll });
})(window);
