/**
 * =========================================================================
 * V32 INSTANT-HOOK UNIVERSE — FRAME 0 CLARITY & HOOK ENGINE (1080x1920)
 * Garantiza que en t = 0.00s (incluso SIN SONIDO) el espectador entienda
 * al instante de qué trata el vídeo y por qué NO puede hacer scroll:
 * - V32.Frame0.drawInstantTopicColdOpen() -> Badge de tema + Titular 3 palabras + Gancho ya visible en t=0.0s!
 * - V32.Frame0.drawVsSplitHook()          -> Pantalla partida A vs B con rayo central en t=0.0s
 * - V32.Frame0.drawSecretFileHook()       -> Carpeta clasificada "TOP SECRET" abriéndose en t=0.0s
 * - V32.Frame0.drawCountdownDangerHook()  -> Alerta + reloj en rojo corriendo desde t=0.0s
 * =========================================================================
 */
(function (global) {
  const Frame0 = {
    // 1. Cold Open Universal (visible desde t = 0.00s, sin fade-in desde negro!)
    drawInstantTopicColdOpen(ctx, topicTag, bigHookLine, subLine, t, endT = 2.6) {
      if (t < 0 || t > endT) return;
      const outA = t > (endT - 0.22) ? Math.max(0, (endT - t) / 0.22) : 1.0;
      const pop = t < 0.14 ? (1.18 - (t / 0.14) * 0.18) : 1.0; // YA visible y grande en t=0.00s!
      ctx.save();
      ctx.globalAlpha = outA;
      ctx.translate(540, 250);
      ctx.scale(pop, pop);

      // Píldora superior de TEMA claro (ej: "SUPERVIVENCIA REAL" / "PSICOLOGÍA" / "HISTORIA")
      ctx.fillStyle = "#00F5D4";
      ctx.beginPath(); ctx.roundRect(-210, -104, 420, 46, 23); ctx.fill();
      ctx.fillStyle = "#050811"; ctx.font = "900 22px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("🎯 " + topicTag.toUpperCase(), 0, -81);

      // Caja principal de impacto (legible en 0.2s en móvil)
      ctx.fillStyle = "rgba(6, 10, 22, 0.92)";
      ctx.strokeStyle = "#FACC15"; ctx.lineWidth = 5;
      ctx.shadowColor = "rgba(250, 204, 21, 0.35)"; ctx.shadowBlur = 22;
      ctx.beginPath(); ctx.roundRect(-470, -46, 940, 142, 26); ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#FFFFFF"; ctx.font = "900 54px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(bigHookLine.toUpperCase(), 0, 10, 880);
      if (subLine) {
        ctx.fillStyle = "#FACC15"; ctx.font = "800 28px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(subLine, 0, 62, 860);
      }
      ctx.restore();
    },

    // 2. Hook VS Split (ej: "LO QUE CREES" vs "LA REALIDAD") desde t=0.0s
    drawVsSplitHook(ctx, leftLabel, rightLabel, t, endT = 2.6) {
      if (t < 0 || t > endT) return;
      const outA = t > (endT - 0.22) ? Math.max(0, (endT - t) / 0.22) : 1.0;
      ctx.save();
      ctx.globalAlpha = outA;
      // Dos etiquetas claras arriba
      ctx.fillStyle = "rgba(220, 38, 38, 0.92)";
      ctx.beginPath(); ctx.roundRect(60, 180, 420, 74, 18); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.font = "900 32px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("❌ " + leftLabel, 270, 218, 380);

      ctx.fillStyle = "rgba(16, 185, 129, 0.92)";
      ctx.beginPath(); ctx.roundRect(600, 180, 420, 74, 18); ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("✅ " + rightLabel, 810, 218, 380);

      // Medallón VS en el centro
      const s = 1 + Math.sin(t * 14) * 0.06;
      ctx.translate(540, 218); ctx.scale(s, s);
      ctx.fillStyle = "#FACC15"; ctx.strokeStyle = "#0A0F1C"; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(0, 0, 44, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#0A0F1C"; ctx.font = "900 34px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("VS", 0, 2);
      ctx.restore();
    },

    // 3. Hook Carpeta Clasificada ("ARCHIVO SECRETO")
    drawSecretFileHook(ctx, caseNumber, title, t, endT = 2.8) {
      if (t < 0 || t > endT) return;
      const outA = t > (endT - 0.22) ? Math.max(0, (endT - t) / 0.22) : 1.0;
      ctx.save();
      ctx.globalAlpha = outA;
      ctx.translate(540, 240); ctx.rotate(-0.02);
      ctx.fillStyle = "#E7D5B4"; ctx.strokeStyle = "#1C1B19"; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.roundRect(-430, -80, 860, 160, 16); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#DC2626"; ctx.font = "900 28px monospace"; ctx.textAlign = "left";
      ctx.fillText("CONFIDENCIAL // " + caseNumber, -390, -34);
      ctx.fillStyle = "#1C1B19"; ctx.font = "900 46px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(title.toUpperCase(), -390, 26, 780);
      ctx.restore();
    }
  };

  global.V32 = Object.assign(global.V32 || {}, { Frame0 });
})(window);
