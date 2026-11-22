/**
 * =========================================================================
 * V29 HYPER-EDIT & ULTRA-DETAIL ENGINE (1080x1920, 30fps)
 * 1. V29.Detail: Texturas reales de materiales (madera, ladrillo, reflejo
 *    de cristal, oclusión ambiental) para que NADA parezca plano ni cutre.
 * 2. V29.Edit: Herramientas de edición nivel After Effects / Premiere Pro:
 *    - magnifyingLoupe()      -> Lupa circular con zoom real 1.8x y brillo
 *    - freezeFrameCallout()   -> Freeze-frame documental con línea líder
 *    - kineticLowerThird()    -> Rótulo inferior estilo Netflix/Docu
 *    - splitScreenReveal()    -> Comparativa animada con borde luminoso
 *    - drawChapterBar()       -> Barra de capítulos profesional arriba
 * =========================================================================
 */
(function (global) {
  const V29 = {
    Detail: {
      // 1. Textura de madera realista con vetas suaves (para suelos, mesas, puertas)
      drawWoodTexture(ctx, x, y, w, h, baseColor = "#6B4226", grainColor = "rgba(38, 20, 10, 0.22)") {
        ctx.save();
        ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
        ctx.fillStyle = baseColor; ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = grainColor; ctx.lineWidth = 3;
        for (let gy = y + 10; gy < y + h; gy += 18) {
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.bezierCurveTo(x + w * 0.33, gy + Math.sin(gy * 0.1) * 7, x + w * 0.66, gy - Math.cos(gy * 0.1) * 7, x + w, gy);
          ctx.stroke();
        }
        // Brillo superior sutil
        const g = ctx.createLinearGradient(x, y, x, y + h);
        g.addColorStop(0, "rgba(255,255,255,0.10)");
        g.addColorStop(1, "rgba(0,0,0,0.22)");
        ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
        ctx.restore();
      },

      // 2. Pared de ladrillos detallada con mortero y variación tonal
      drawBrickWall(ctx, x, y, w, h, brickColor = "#7C2D12", mortarColor = "rgba(20, 14, 12, 0.45)") {
        ctx.save();
        ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
        ctx.fillStyle = mortarColor; ctx.fillRect(x, y, w, h);
        const bw = 78, bh = 34, gap = 5;
        let row = 0;
        for (let by = y; by < y + h; by += bh + gap) {
          const offset = (row % 2) * (bw / 2);
          for (let bx = x - offset; bx < x + w; bx += bw + gap) {
            ctx.fillStyle = brickColor;
            ctx.fillRect(bx, by, bw, bh);
            ctx.fillStyle = ((row * 7 + Math.floor(bx)) % 3 === 0) ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.06)";
            ctx.fillRect(bx, by, bw, bh);
          }
          row++;
        }
        ctx.restore();
      },

      // 3. Reflejo diagonal realista sobre cristal / pantallas / ventanas / agua
      drawGlassReflection(ctx, x, y, w, h, alpha = 0.22) {
        ctx.save();
        ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.15, y);
        ctx.lineTo(x + w * 0.36, y);
        ctx.lineTo(x + w * 0.08, y + h);
        ctx.lineTo(x - w * 0.10, y + h);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.55})`;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.44, y);
        ctx.lineTo(x + w * 0.52, y);
        ctx.lineTo(x + w * 0.24, y + h);
        ctx.lineTo(x + w * 0.16, y + h);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      },

      // 4. Oclusión ambiental (sombra suave en bordes y esquinas de habitaciones)
      drawAmbientOcclusion(ctx, x, y, w, h, strength = 0.32) {
        ctx.save();
        const topG = ctx.createLinearGradient(0, y, 0, y + 90);
        topG.addColorStop(0, `rgba(0,0,0,${strength})`); topG.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = topG; ctx.fillRect(x, y, w, 90);
        const botG = ctx.createLinearGradient(0, y + h - 100, 0, y + h);
        botG.addColorStop(0, "rgba(0,0,0,0)"); botG.addColorStop(1, `rgba(0,0,0,${strength * 1.15})`);
        ctx.fillStyle = botG; ctx.fillRect(x, y + h - 100, w, 100);
        ctx.restore();
      }
    },

    Edit: {
      // 1. LUPA CIRCULAR CON AUMENTO REAL (1.8x) PARA SEÑALAR UN MICRO-DETALLE!
      magnifyingLoupe(ctx, cx, cy, radius, zoom, drawTargetSceneFn, localT = 1.0) {
        const sc = localT < 0.25 ? Math.max(0.01, localT / 0.25) : 1.0;
        const r = radius * sc;
        ctx.save();
        // Sombra exterior de la lupa
        ctx.shadowColor = "rgba(0,0,0,0.65)"; ctx.shadowBlur = 28;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = "#0B1220"; ctx.fill();
        ctx.shadowBlur = 0;

        // Contenido ampliado dentro del cristal
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r - 6, 0, Math.PI * 2); ctx.clip();
        ctx.translate(cx, cy);
        ctx.scale(zoom, zoom);
        ctx.translate(-cx, -cy);
        if (drawTargetSceneFn) drawTargetSceneFn(ctx);
        ctx.restore();

        // Reflejo de cristal + aro metálico brillante
        V29.Detail.drawGlassReflection(ctx, cx - r, cy - r, r * 2, r * 2, 0.20);
        ctx.strokeStyle = "#FACC15"; ctx.lineWidth = 10;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, r - 8, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      },

      // 2. FREEZE-FRAME CALLOUT (estilo documental viral: oscurece + línea líder + ficha técnica)
      freezeFrameCallout(ctx, targetX, targetY, boxX, boxY, title, subtitle, localT) {
        const p = Math.min(1, Math.max(0, localT / 0.28));
        ctx.save();
        // Punto pulsante en el objetivo
        ctx.fillStyle = "#FACC15";
        ctx.beginPath(); ctx.arc(targetX, targetY, 12, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(250, 204, 21, 0.55)"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(targetX, targetY, 18 + Math.sin(localT * 10) * 6, 0, Math.PI * 2); ctx.stroke();

        // Línea líder animada
        const lx = targetX + (boxX - targetX) * p;
        const ly = targetY + (boxY - targetY) * p;
        ctx.strokeStyle = "#FACC15"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(targetX, targetY); ctx.lineTo(lx, ly); ctx.stroke();

        // Ficha técnica limpia
        if (p > 0.45) {
          const a = Math.min(1, (p - 0.45) / 0.55);
          ctx.globalAlpha = a;
          ctx.fillStyle = "rgba(10, 16, 30, 0.94)"; ctx.strokeStyle = "#FACC15"; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.roundRect(boxX - 210, boxY - 56, 420, 112, 18); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#FACC15"; ctx.font = "800 30px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
          ctx.fillText(title, boxX, boxY - 10);
          ctx.fillStyle = "#E2E8F0"; ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(subtitle, boxX, boxY + 28);
        }
        ctx.restore();
      },

      // 3. KINETIC LOWER THIRD (rótulo inferior animado estilo Netflix / Documental Pro)
      kineticLowerThird(ctx, title, subtitle, localT, y = 1520) {
        const p = Math.min(1, Math.max(0, localT / 0.32));
        const e = 1 - Math.pow(1 - p, 3);
        const x = 68 - (1 - e) * 140;
        ctx.save();
        ctx.globalAlpha = e;
        ctx.fillStyle = "rgba(8, 13, 26, 0.90)";
        ctx.beginPath(); ctx.roundRect(x, y, 680, 114, 16); ctx.fill();
        // Barra vertical de acento brillante
        ctx.fillStyle = "#00F5D4";
        ctx.beginPath(); ctx.roundRect(x, y, 14, 114, 7); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; ctx.font = "800 34px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "left";
        ctx.fillText(title, x + 36, y + 48);
        ctx.fillStyle = "#94A3B8"; ctx.font = "700 22px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(subtitle, x + 36, y + 86);
        ctx.restore();
      },

      // 4. BARRA DE CAPÍTULOS PROFESIONAL (ej: ["HOOK", "EL MITO", "SOLUCIÓN"])
      drawChapterBar(ctx, chapters = ["EL RETO", "LA TRAMPA", "LA PRUEBA"], activeIdx = 0) {
        const totalW = 920, gap = 14, y = 44, h = 10;
        const segW = (totalW - gap * (chapters.length - 1)) / chapters.length;
        const startX = (1080 - totalW) / 2;
        ctx.save();
        chapters.forEach((lbl, i) => {
          const sx = startX + i * (segW + gap);
          ctx.fillStyle = i <= activeIdx ? "#00F5D4" : "rgba(255,255,255,0.20)";
          ctx.beginPath(); ctx.roundRect(sx, y, segW, h, 5); ctx.fill();
          ctx.fillStyle = i === activeIdx ? "#FFFFFF" : "rgba(255,255,255,0.48)";
          ctx.font = "800 18px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
          ctx.fillText(lbl, sx + segW / 2, y + 32);
        });
        ctx.restore();
      }
    }
  };

  global.V29 = V29;
})(window);
