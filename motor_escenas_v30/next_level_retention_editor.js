/**
 * =========================================================================
 * V30 GODMODE STUDIO — NEXT-LEVEL RETENTION & HOOK EDITOR (1080x1920, 30fps)
 * Herramientas exactas para retener al espectador de 0s hasta el final:
 * - V30.Editor.drawHookBanner()      -> Triple Hook visual de los 0–2.8s
 * - V30.Editor.drawOpenLoopBadge()   -> Recordatorio sutil "⏳ ESPERA AL FINAL"
 * - V30.Editor.drawPatternInterrupt()-> Re-Hook visual cada 6–8s
 * - V30.Editor.drawSplitComparison() -> Comparativa animada ❌ ERROR vs ✅ BIEN
 * - V30.Editor.drawPipZoomBox()      -> Recuadro Picture-in-Picture con línea guía
 * - V30.Editor.drawLoopBridgeFade()  -> Puente suave de bucle infinito
 * =========================================================================
 */
(function (global) {
  const Editor = {
    // 1. Triple Hook Banner (0.0s - 2.8s): entra con slam-in y desaparece limpio
    drawHookBanner(ctx, topTag, mainHeadline, t, endT = 2.8) {
      if (t < 0 || t > endT) return;
      const outA = t > (endT - 0.25) ? Math.max(0, (endT - t) / 0.25) : 1.0;
      const sc = t < 0.16 ? (1.45 - (t / 0.16) * 0.45) : 1.0;
      ctx.save();
      ctx.globalAlpha = outA;
      ctx.translate(540, 215);
      ctx.scale(sc, sc);
      // Tag superior rojo/amarillo
      ctx.fillStyle = "#DC2626";
      ctx.beginPath(); ctx.roundRect(-165, -78, 330, 44, 22); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.font = "800 22px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(topTag.toUpperCase(), 0, -56);
      // Titular de choque
      ctx.fillStyle = "rgba(8, 13, 26, 0.92)"; ctx.strokeStyle = "#FACC15"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(-440, -24, 880, 96, 22); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FACC15"; ctx.font = "900 44px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(mainHeadline, 0, 26, 820);
      ctx.restore();
    },

    // 2. Open Loop Badge (mantiene la curiosidad abierta hasta el clímax)
    drawOpenLoopBadge(ctx, text = "⏳ ESPERA AL ÚLTIMO...", t = 0) {
      const pulse = 0.86 + Math.sin(t * 5) * 0.14;
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = "rgba(10, 16, 30, 0.84)"; ctx.strokeStyle = "#00F5D4"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(42, 118, 370, 50, 25); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#00F5D4"; ctx.font = "800 21px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, 227, 144);
      ctx.restore();
    },

    // 3. Pattern Interrupt Banner (para los Re-Hooks cada 6–8s)
    drawPatternInterrupt(ctx, label = "PERO AQUÍ VIENE EL GIRO", localT = 0) {
      if (localT < 0 || localT > 1.3) return;
      const alpha = localT > 1.0 ? Math.max(0, 1 - (localT - 1.0) / 0.3) : 1.0;
      const sc = localT < 0.14 ? (1.5 - (localT / 0.14) * 0.5) : 1.0;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(540, 860); ctx.rotate(-0.04); ctx.scale(sc, sc);
      ctx.fillStyle = "#FACC15"; ctx.strokeStyle = "#0F172A"; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.roundRect(-420, -56, 840, 112, 24); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#0F172A"; ctx.font = "900 44px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label.toUpperCase(), 0, 2, 780);
      ctx.restore();
    },

    // 4. Comparativa Animada ❌ ERROR vs ✅ CORRECTO
    drawSplitComparison(ctx, leftTitle, rightTitle, progress = 1.0, y = 460, h = 640) {
      const p = Math.min(1, Math.max(0, progress));
      ctx.save();
      // Izquierda (ERROR)
      ctx.fillStyle = "rgba(220, 38, 38, 0.22)"; ctx.strokeStyle = "#EF4444"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.roundRect(54, y, 470, h, 28); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#EF4444"; ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("❌ " + leftTitle, 289, y + 54);
      // Derecha (CORRECTO — entra con slide)
      ctx.globalAlpha = p;
      ctx.fillStyle = "rgba(16, 185, 129, 0.22)"; ctx.strokeStyle = "#10B981"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.roundRect(556 + (1 - p) * 120, y, 470, h, 28); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#10B981"; ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("✅ " + rightTitle, 791 + (1 - p) * 120, y + 54);
      ctx.restore();
    },

    // 5. Puente de Bucle Infinito (últimos 0.35s)
    drawLoopBridgeFade(ctx, t, duration) {
      const rem = duration - t;
      if (rem > 0.35 || rem < 0) return;
      const a = (1 - rem / 0.35) * 0.85;
      ctx.save();
      ctx.fillStyle = `rgba(5, 8, 17, ${a})`;
      ctx.fillRect(0, 0, 1080, 1920);
      ctx.restore();
    }
  };

  global.V30 = Object.assign(global.V30 || {}, { Editor });
})(window);
