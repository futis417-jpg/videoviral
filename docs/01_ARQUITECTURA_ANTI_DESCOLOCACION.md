# 📐 ARQUITECTURA ANTI-DESCOLOCACIÓN v14 (CERO VENTANAS EN EL CIELO)

## 1. POR QUÉ LAS IAs DESCOLOCAN DIBUJOS EN CANVAS
Cuando una IA dibuja usando coordenadas absolutas sueltas (`fillRect(420, 310, 80, 90)` para una ventana y `fillRect(300, 700, 400, 500)` para la casa), pierde la cuenta y acaba poniendo la ventana flotando en el cielo o la puerta 200px fuera de la pared.

## 2. LAS 5 REGLAS DE ORO DEL SCENE GRAPH v14 (OBLIGATORIAS)
1. **Línea de Suelo Universal (`GROUND_Y`):**
   - En toda escena exterior o interior, define UNA sola constante `const GROUND_Y = 1320;` (o `1340`).
   - Todo edificio se dibuja con su base en `GROUND_Y`: `drawHouse(ctx, x, GROUND_Y, w, h)`.
   - Todo personaje de pie se dibuja con los **pies exactos en `GROUND_Y`**: `V14.drawHumanAtGround(ctx, x, GROUND_Y, scale, t, opts)`.
   - Todo árbol, farola, mesa, cama o coche se apoya en `GROUND_Y` con una **sombra de contacto elíptica** (`rgba(0,0,0,0.28)`) justo en `y = GROUND_Y`.
2. **Coordenadas Locales Relativas para Hijos (Contenedor Padre):**
   - Para dibujar una casa, NUNCA uses coordenadas globales para sus ventanas/puerta/tejado:
     ```js
     ctx.save();
     ctx.translate(baseX, groundY); // Origen (0,0) = centro-base de la casa
     // Cuerpo de la casa: de x=-w/2 a +w/2, de y=-h a 0
     // Tejado: exactamente encima de y=-h
     // Puerta: SIEMPRE apoyada en y=0 -> y = -doorH, height = doorH, x = -doorW/2
     // Ventanas: SIEMPRE dentro de x in [-w*0.4, +w*0.4] e y in [-h*0.8, -h*0.45]
     ctx.restore();
     ```
   - Así es **matemáticamente imposible** que una ventana salga en el cielo o una puerta flote fuera de la casa.
3. **Zonas Sagradas del Lienzo `1080×1920` (Sin Solapamientos):**
   - `y: 0–160`: Margen superior (barra de progreso fina en `y=44`).
   - `y: 220–390`: Subtítulos superiores (si el motor usa subtítulos arriba).
   - `y: 430–1340`: **Escenario Principal + Personajes + Acción** (zona 100% limpia y protagonista).
   - `y: 1360–1580`: Subtítulos inferiores (si el motor usa cápsula abajo) o Cronómetro/Checklist.
   - `y: 1620–1920` y `x: 945–1080`: **Zona muerta de botones de TikTok/Reels** (nunca pongas texto vital ahí).
4. **Clip de Interiores (`ctx.clip()`):**
   - Cuando dibujes una ventana con paisaje dentro, un móvil con chat dentro o un monitor con ECG dentro, haz SIEMPRE `ctx.save(); ctx.beginPath(); ctx.roundRect(...); ctx.clip(); /* dibuja contenido */ ctx.restore();` para que NADA se salga del marco.
5. **Proporciones Humanas Verificadas:**
   - Usa siempre `V14.drawHumanAtGround` (cabeza = 1 unidad, torso = 1.9 unidades, piernas = 2.1 unidades, 2 ojos simétricos a `±0.32 * headR`, cejas, cuello y hombros reales).
