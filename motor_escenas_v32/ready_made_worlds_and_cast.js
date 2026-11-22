/**
 * =========================================================================
 * V32 INSTANT-HOOK UNIVERSE — READY-MADE WORLDS, MORE CAST & MOVES
 * Más cosas YA HECHAS de calidad de estudio para que la IA solo las llame:
 * - V32.Worlds (6 Escenas Completas Full-Bleed):
 *   drawClassroomWorld, drawSpaceOrbitWorld, drawHospitalLabWorld,
 *   drawSupermarketWorld, drawCourtroomWorld, drawCityRooftopWorld
 * - V32.MoreCast (6 Personajes Nuevos — total 12 personajes con V30.Cast!):
 *   drawDoctor, drawAstronaut, drawChef, drawStudent, drawPolice, drawRobotAI
 * - V32.Moves (6 Coreografías de Movimiento Reales):
 *   runAcross, popFromBottom, floatOrbit, shakePanic, slideInLeft, zoomPulse
 * =========================================================================
 */
(function (global) {
  const INK = "#16161E";

  function withChar(ctx, x, groundY, sc, t, opts, accFn) {
    if (global.V28Anim && global.V28Anim.drawExpressiveCharacter) {
      global.V28Anim.drawExpressiveCharacter(ctx, x, groundY, sc, t, opts);
    }
    if (accFn) {
      ctx.save(); ctx.translate(x, groundY); ctx.scale(sc, sc); accFn(ctx, t); ctx.restore();
    }
  }

  const Worlds = {
    // 1. AULA / PIZARRA (para educación, datos, psicología, matemáticas)
    drawClassroomWorld(ctx, t, boardText = "EL DATO REAL") {
      ctx.fillStyle = "#E8DEC8"; ctx.fillRect(0, 0, 1080, 1340);
      if (global.V29 && global.V29.Detail) global.V29.Detail.drawWoodTexture(ctx, 0, 1340, 1080, 580, "#8B5A2B");
      else { ctx.fillStyle = "#8B5A2B"; ctx.fillRect(0, 1340, 1080, 580); }
      // Pizarra verde con marco de madera
      ctx.fillStyle = "#14532D"; ctx.strokeStyle = "#78350F"; ctx.lineWidth = 16;
      ctx.beginPath(); ctx.roundRect(110, 390, 860, 490, 18); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.font = "800 54px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center"; ctx.fillText(boardText, 540, 640, 780);
      // Reloj de pared arriba derecha
      if (global.V30 && global.V30.Props) global.V30.Props.drawAnalogClock(ctx, 910, 240, 64, t, 1.2);
    },

    // 2. ESPACIO PROFUNDO / ÓRBITA (para ciencia, astronomía, paradojas)
    drawSpaceOrbitWorld(ctx, t) {
      const g = ctx.createRadialGradient(540, 720, 80, 540, 960, 1280);
      g.addColorStop(0, "#1E1B4B"); g.addColorStop(0.55, "#0B1026"); g.addColorStop(1, "#02040A");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
      // Estrellas titilando
      for (let i = 0; i < 65; i++) {
        const sx = (i * 173 + 29) % 1080, sy = (i * 227 + 41) % 1920;
        ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * Math.abs(Math.sin(t * 2 + i))})`;
        ctx.beginPath(); ctx.arc(sx, sy, (i % 3) + 1.2, 0, Math.PI * 2); ctx.fill();
      }
      // Planeta con anillo girando suave
      ctx.save();
      ctx.translate(780, 660 + Math.sin(t * 1.2) * 14);
      const pg = ctx.createRadialGradient(-40, -40, 20, 0, 0, 190);
      pg.addColorStop(0, "#38BDF8"); pg.addColorStop(1, "#1D4ED8");
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, 175, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(250, 204, 21, 0.75)"; ctx.lineWidth = 14;
      ctx.beginPath(); ctx.ellipse(0, 0, 280, 52, -0.25, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    },

    // 3. LABORATORIO / HOSPITAL CON MONITOR ECG VIVO
    drawHospitalLabWorld(ctx, t) {
      ctx.fillStyle = "#0F1E2E"; ctx.fillRect(0, 0, 1080, 1340);
      ctx.fillStyle = "#1E293B"; ctx.fillRect(0, 1340, 1080, 580);
      // Monitor ECG animado
      ctx.fillStyle = "#050A12"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.roundRect(140, 420, 800, 340, 26); ctx.fill(); ctx.stroke();
      ctx.save();
      ctx.beginPath(); ctx.roundRect(150, 430, 780, 320, 20); ctx.clip();
      ctx.strokeStyle = "#22C55E"; ctx.lineWidth = 6; ctx.shadowColor = "#22C55E"; ctx.shadowBlur = 14;
      ctx.beginPath();
      for (let x = 150; x <= 930; x += 12) {
        const phase = ((x - 150 + t * 240) % 240) / 240;
        let dy = 0;
        if (phase > 0.42 && phase < 0.47) dy = -110;
        else if (phase >= 0.47 && phase < 0.52) dy = 65;
        else dy = Math.sin(x * 0.08) * 6;
        const y = 590 + dy;
        if (x === 150) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    },

    // 4. PASILLO DE SUPERMERCADO (para psicología de precios, marketing, consumo)
    drawSupermarketWorld(ctx, t) {
      ctx.fillStyle = "#1E293B"; ctx.fillRect(0, 0, 1080, 1340);
      ctx.fillStyle = "#334155"; ctx.fillRect(0, 1340, 1080, 580);
      // Estanterías izquierda y derecha con productos de colores + etiquetas 9,99€
      [80, 680].forEach((sx) => {
        ctx.fillStyle = "#475569"; ctx.strokeStyle = INK; ctx.lineWidth = 6;
        ctx.fillRect(sx, 420, 320, 920); ctx.strokeRect(sx, 420, 320, 920);
        const colors = ["#EF4444", "#FACC15", "#38BDF8", "#22C55E", "#F472B6"];
        for (let row = 0; row < 4; row++) {
          const ry = 480 + row * 210;
          ctx.fillStyle = "#94A3B8"; ctx.fillRect(sx, ry + 95, 320, 16);
          for (let c = 0; c < 4; c++) {
            ctx.fillStyle = colors[(row + c) % colors.length];
            ctx.beginPath(); ctx.roundRect(sx + 20 + c * 72, ry + 15, 56, 80, 10); ctx.fill(); ctx.stroke();
          }
          // Etiqueta amarilla de precio
          ctx.fillStyle = "#FACC15"; ctx.fillRect(sx + 110, ry + 96, 98, 30);
          ctx.fillStyle = "#0F172A"; ctx.font = "900 20px sans-serif"; ctx.textAlign = "center";
          ctx.fillText("9,99€", sx + 159, ry + 118);
        }
      });
    },

    // 5. SALA DE JUICIO / TRIBUNAL (para debates, mitos vs realidad, casos reales)
    drawCourtroomWorld(ctx, t) {
      if (global.V29 && global.V29.Detail) global.V29.Detail.drawWoodTexture(ctx, 0, 0, 1080, 1920, "#4A2C18");
      else { ctx.fillStyle = "#4A2C18"; ctx.fillRect(0, 0, 1080, 1920); }
      // Estrado del juez en el centro
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = INK; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.roundRect(160, 860, 760, 480, 22); ctx.fill(); ctx.stroke();
      // Placa dorada
      ctx.fillStyle = "#FACC15"; ctx.beginPath(); ctx.roundRect(360, 960, 360, 74, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#0F172A"; ctx.font = "900 32px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("VEREDICTO", 540, 1008);
    },

    // 6. AZOTEA NOCTURNA CON SKYLINE Y LUNA (para storytime, reflexiones, gaming)
    drawCityRooftopWorld(ctx, t) {
      const sky = ctx.createLinearGradient(0, 0, 0, 1340);
      sky.addColorStop(0, "#0A1026"); sky.addColorStop(1, "#2A1F4D");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, 1080, 1340);
      // Luna brillante
      ctx.fillStyle = "#FEF3C7"; ctx.shadowColor = "#FEF3C7"; ctx.shadowBlur = 45;
      ctx.beginPath(); ctx.arc(820, 360, 88, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      // Edificios skyline anclados
      if (global.V14 && global.V14.drawAnchoredBuilding) {
        global.V14.drawAnchoredBuilding(ctx, 160, 1340, 220, 680, "#1A1533", "#FACC15");
        global.V14.drawAnchoredBuilding(ctx, 440, 1340, 260, 520, "#211B40", "#38BDF8");
        global.V14.drawAnchoredBuilding(ctx, 840, 1340, 280, 620, "#16112B", "#F472B6");
      }
      // Suelo azotea + barandilla
      ctx.fillStyle = "#1E293B"; ctx.fillRect(0, 1340, 1080, 580);
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(0, 1260); ctx.lineTo(1080, 1260); ctx.stroke();
    }
  };

  const MoreCast = {
    // 1. Doctor (bata blanca + fonendoscopio)
    drawDoctor(ctx, x, groundY, sc, t, opts = {}) {
      withChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#FFFFFF", pants: "#0284C7", hair: "#1E293B", emotion: "neutral", gesture: "point_up" }, opts), (c) => {
        c.strokeStyle = "#0F172A"; c.lineWidth = 7;
        c.beginPath(); c.arc(0, -245, 36, 0.1 * Math.PI, 0.9 * Math.PI); c.stroke();
        c.fillStyle = "#94A3B8"; c.beginPath(); c.arc(0, -206, 12, 0, Math.PI * 2); c.fill(); c.stroke();
      });
    },
    // 2. Astronauta (traje blanco + visor espacial azul brillante)
    drawAstronaut(ctx, x, groundY, sc, t, opts = {}) {
      withChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#F1F5F9", pants: "#E2E8F0", hair: "#F1F5F9", emotion: "happy" }, opts), (c) => {
        c.fillStyle = "rgba(56, 189, 248, 0.55)"; c.strokeStyle = INK; c.lineWidth = 7;
        c.beginPath(); c.arc(0, -344, 78, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = "#EF4444"; c.fillRect(-24, -220, 48, 28);
      });
    },
    // 3. Chef (gorro blanco alto + delantal)
    drawChef(ctx, x, groundY, sc, t, opts = {}) {
      withChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#FFFFFF", pants: "#1E293B", emotion: "happy" }, opts), (c) => {
        c.fillStyle = "#FFFFFF"; c.strokeStyle = INK; c.lineWidth = 6;
        c.beginPath(); c.roundRect(-48, -468, 96, 68, 22); ctx.fill(); ctx.stroke();
        c.beginPath(); c.arc(-28, -468, 26, 0, Math.PI * 2); c.arc(0, -478, 30, 0, Math.PI * 2); c.arc(28, -468, 26, 0, Math.PI * 2); c.fill(); c.stroke();
      });
    },
    // 4. Estudiante (sudadera juvenil + gorra hacia atrás)
    drawStudent(ctx, x, groundY, sc, t, opts = {}) {
      withChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#3B82F6", pants: "#1E293B", emotion: "shocked" }, opts), (c) => {
        c.fillStyle = "#EF4444"; c.strokeStyle = INK; c.lineWidth = 6;
        c.beginPath(); c.arc(0, -396, 66, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
        c.fillRect(-92, -404, 42, 14); c.strokeRect(-92, -404, 42, 14);
      });
    },
    // 5. Policía (uniforme azul + gorra con placa dorada)
    drawPolice(ctx, x, groundY, sc, t, opts = {}) {
      withChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#1E3A8A", pants: "#0F172A", emotion: "angry" }, opts), (c) => {
        c.fillStyle = "#1E3A8A"; c.strokeStyle = INK; c.lineWidth = 6;
        c.beginPath(); c.roundRect(-62, -448, 124, 48, 12); c.fill(); c.stroke();
        c.fillStyle = "#FACC15"; c.beginPath(); c.arc(0, -424, 12, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.arc(32, -214, 14, 0, Math.PI * 2); c.fill();
      });
    },
    // 6. Robot IA (androide moderno con visor LED cian brillante)
    drawRobotAI(ctx, x, groundY, sc, t, opts = {}) {
      withChar(ctx, x, groundY, sc, t, Object.assign({ hoodie: "#334155", pants: "#1E293B", skin: "#CBD5E1", hair: "#475569" }, opts), (c) => {
        c.fillStyle = "#0F172A"; c.strokeStyle = "#00F5D4"; c.lineWidth = 5;
        c.beginPath(); c.roundRect(-52, -366, 104, 38, 14); c.fill(); c.stroke();
        c.fillStyle = "#00F5D4";
        c.beginPath(); c.arc(-22, -347, 9, 0, Math.PI * 2); c.arc(22, -347, 9, 0, Math.PI * 2); c.fill();
        // Antena con luz pulsante
        c.strokeStyle = INK; c.lineWidth = 6; c.beginPath(); c.moveTo(0, -412); c.lineTo(0, -455); c.stroke();
        c.fillStyle = "#00F5D4"; c.beginPath(); c.arc(0, -460, 10 + Math.sin(t * 8) * 2, 0, Math.PI * 2); c.fill();
      });
    }
  };

  // 6 Coreografías de Movimiento Reales listas para envolver cualquier personaje/prop
  const Moves = {
    runAcross: (localT, dur, x0 = -160, x1 = 1240) => x0 + (x1 - x0) * Math.min(1, Math.max(0, localT / Math.max(0.1, dur))),
    popFromBottom: (localT, baseY = 1480) => baseY + (1 - Math.min(1, Math.max(0, localT / 0.35))) * 360,
    floatOrbit: (t, amp = 18, freq = 2.4) => Math.sin(t * freq) * amp,
    shakePanic: (t, amp = 9) => ({ dx: Math.sin(t * 55) * amp, dy: Math.cos(t * 62) * (amp * 0.6) }),
    slideInLeft: (localT, targetX = 540) => targetX - Math.pow(1 - Math.min(1, Math.max(0, localT / 0.32)), 3) * 650,
    zoomPulse: (t, base = 1.0, amp = 0.05) => base + Math.sin(t * 5.2) * amp
  };

  global.V32 = Object.assign(global.V32 || {}, { Worlds, MoreCast, Moves });
})(window);
