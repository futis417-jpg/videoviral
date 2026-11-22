# 🧩 CATÁLOGO DE PERSONAJES, OBJETOS Y SISTEMA DE RETENCIÓN v30 GODMODE

**REGLA DE ORO:** Cuando necesites un personaje u objeto común, **USA SIEMPRE `V30.Cast` y `V30.Props`** (nunca improvises dibujos deformes desde cero con 3 círculos).

## 1. CAST DE 6 PERSONAJES PRO (`V30.Cast`)
- `V30.Cast.drawDetective(ctx, x, groundY, sc, t, opts)` — Gabardina + sombrero fedora.
- `V30.Cast.drawScientist(ctx, x, groundY, sc, t, opts)` — Bata blanca + gafas + corbata.
- `V30.Cast.drawThief(ctx, x, groundY, sc, t, { hasHat: false })` — Antifaz + gorro opcional para retos de memoria.
- `V30.Cast.drawGamer(ctx, x, groundY, sc, t, opts)` — Cascos neón con LED cian + sudadera morada.
- `V30.Cast.drawPilot(ctx, x, groundY, sc, t, opts)` — Chaqueta aviador + gafas en frente.
- `V30.Cast.drawClient(ctx, x, groundY, sc, t, opts)` — Traje + camisa + corbata roja.
*(Todos heredan las 7 emociones, 5 gestos, mirada dirigida `lookAtX/Y` y salto `jumpT` de `V28Anim`!)*

## 2. BIBLIOTECA DE OBJETOS DETALLADOS (`V30.Props` + `V23.Props`)
- `V30.Props.drawSmartphone(ctx, cx, cy, w, h, notifTitle, notifBody, t)`
- `V30.Props.drawCarSide(ctx, cx, cy, sc, t, { color, windowOpen, tilt, headlights })`
- `V30.Props.drawAirplane(ctx, cx, cy, sc, angle)`
- `V30.Props.drawAnalogClock(ctx, cx, cy, r, t, speed)`
- `V30.Props.drawMoneyStack(ctx, cx, cy, sc)`
- `V30.Props.drawLightbulb(ctx, cx, cy, sc, on, t)`
- `V30.Props.drawPadlock(ctx, cx, cy, sc, unlocked)`
- `V30.Props.drawHeartECG(ctx, cx, cy, sc, t)`
- `V30.Props.drawWarningSign(ctx, cx, cy, sc, t)`
- `V30.Props.drawTrophy(ctx, cx, cy, sc)`
- Más `V23.Props`: `drawRealBrain`, `drawCleanHand`, `drawRuler`, `drawSteamingMug`.

## 3. SISTEMA DE EDICIÓN Y RETENCIÓN DE OTRO NIVEL (`V30.Editor`)
- **0.0–2.8s (Triple Hook):** `V30.Editor.drawHookBanner(ctx, "ALERTA REAL", "NO HAGAS ESTO", t, 2.8)`
- **Open Loop constante:** `V30.Editor.drawOpenLoopBadge(ctx, "⏳ ESPERA AL FINAL...", t)`
- **Cada 6–8s (Re-Hook / Pattern Interrupt):** `V30.Editor.drawPatternInterrupt(ctx, "PERO AQUÍ VIENE EL GIRO", localT)`
- **Comparativas claras:** `V30.Editor.drawSplitComparison(ctx, "ERROR", "CORRECTO", progress)`
- **Bucle infinito limpio:** `V30.Editor.drawLoopBridgeFade(ctx, t, duration)`
