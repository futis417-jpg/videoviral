/**
 * =========================================================================
 * V25 OMEGA — TIMELINE DIRECTOR & HYBRID PLATE RENDERER (1080x1920, 30fps)
 * Permite definir escenas limpias en un array (sin spaghetti `if/else`)
 * con:
 * - Transiciones automáticas entre escenas (flash / whip / iris)
 * - Animación Ken Burns / Zoom-to-Detail sobre láminas AI-Art (0€ Flux)
 * - Micro-respiración continua garantizada (CERO escenas congeladas!)
 * =========================================================================
 */
(function (global) {
  const V25Director = {
    // Dibuja una lámina ilustrada 1080x1920 con movimiento Ken Burns fluido
    drawArtPlate(ctx, img, localT, dur, cfg = {}) {
      if (!img || !img.complete || img.naturalWidth === 0) return false;
      const p = Math.min(1, Math.max(0, localT / Math.max(0.1, dur)));
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const z0 = cfg.z0 ?? 1.03, z1 = cfg.z1 ?? 1.14;
      const dx0 = cfg.dx0 ?? 0, dx1 = cfg.dx1 ?? -22;
      const dy0 = cfg.dy0 ?? 0, dy1 = cfg.dy1 ?? -18;
      const z = z0 + (z1 - z0) * e;
      const dx = dx0 + (dx1 - dx0) * e;
      const dy = dy0 + (dy1 - dy0) * e;

      ctx.save();
      ctx.translate(540 + dx, 960 + dy);
      ctx.scale(z, z);
      ctx.drawImage(img, -540, -960, 1080, 1920);
      ctx.restore();
      return true;
    },

    // Ejecuta una línea de tiempo declarativa de escenas [{start, end, transition, render(ctx, localT, dur, globalT)}]
    renderTimeline(ctx, scenes, t) {
      if (!scenes || !scenes.length) return;
      let active = scenes[scenes.length - 1];
      for (const sc of scenes) {
        if (t >= sc.start && t < sc.end) { active = sc; break; }
      }
      const dur = Math.max(0.1, active.end - active.start);
      const localT = Math.max(0, t - active.start);

      ctx.save();
      active.render(ctx, localT, dur, t);
      ctx.restore();

      // Transición automática limpia de 0.24s al entrar en cada escena nueva
      if (active.transition && localT < 0.24 && active.start > 0.05 && global.V25FX) {
        global.V25FX.drawTransitionOverlay(ctx, localT / 0.24, active.transition);
      }
    }
  };

  global.V25Director = V25Director;
})(window);
