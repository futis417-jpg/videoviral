# 🎮 LEYES DE JUGABILIDAD REAL v21 (PROHIBIDO HACER JUEGOS INJUGABLES)

Si haces un vídeo interactivo de pruebas/retos mentales, **el espectador TIENE QUE PODER JUGAR DE VERDAD**.
Estos 4 fallos destruyen la jugabilidad y están **TERMINANTEMENTE PROHIBIDOS**:

---

## 1. PRUEBA DE PASES / CONTEO (EJ. "CUENTA LOS PASES")
- **❌ FALLO INJUGABLE:** Decir *"¿Listo? 3, 2, 1... Fueron cuatro"* mientras el objeto se queda quieto, desaparece durante la cuenta atrás o solo hace 1 pase.
- **✅ REGLA OBLIGATORIA:**
  1. Primero anuncia la regla (*"Cuenta los pases"*).
  2. Solo **DESPUÉS** de decir *"¿Listo?"* empieza la ventana de juego real (ej. `4.5s` a `6.0s`).
  3. Durante esa ventana, el objeto DEBE ejecutar **exactamente `N` arcos parabólicos completos y visibles** (`N = 4` → 4 lanzamientos claros de jugador a jugador con SFX `pop_ui.wav` en cada pase).
  4. El elemento distractor (ej. naranja/gorila cruzando detrás) cruza **mientras ocurren los pases**, nunca antes ni después.
  5. Al revelar (*"Fueron cuatro"*), el número `4` debe coincidir matemáticamente con los `4` arcos animados.

## 2. PRUEBA DE MEMORIA (EJ. "¿DE QUÉ COLOR ERA SU GORRA?")
- **❌ FALLO INJUGABLE:** Enseñar la foto del ladrón **sin gorra** en pantalla mientras haces la pregunta y corre el `3, 2, 1` (el espectador no usa su memoria porque lo está viendo!). Y decir *"cabeza descubierta"* al principio.
- **✅ REGLA OBLIGATORIA:**
  1. Al inicio, muestra al personaje 3–4 segundos sin hacer spoiler verbal de la trampa.
  2. Cuando llegue la pregunta final (*"¿De qué color era su gorra?"*), **OCULTA LA FOTO** (muestra una Polaroid oscura con un `?` gigante o silueta negra) durante todo el `3, 2, 1`.
  3. **SOLO cuando termina el `3, 2, 1`** voltea/revela la foto real con el sello rojo `✕` (*"¡Trampa! No llevaba gorra"*).

## 3. PRUEBA STROOP (COLOR DE LA TINTA, NO LA PALABRA)
- **❌ FALLO INJUGABLE:** Resaltar ya la opción correcta (`B · NARANJA`) con borde naranja antes de que el usuario elija, o dejar 18 segundos congelados con una sola palabra.
- **✅ REGLA OBLIGATORIA:**
  1. Mientras corre el tiempo, todas las opciones (`A` y `B`) tienen el **mismo color neutro** (nunca chives la respuesta con el color del borde!).
  2. Haz **ronda rápida de 3 palabras** (ej. `AZUL` en rojo → `VERDE` en amarillo → `ROJO` en azul, `1.8s` cada una) para que el cerebro del espectador falle de verdad.

## 4. ILUSIÓN ÓPTICA (MÜLLER-LYER / TAMAÑOS IGUALES)
- **❌ FALLO INJUGABLE:** Dejar las dos líneas quietas y solo poner un cartel `MIDEN LO MISMO`.
- **✅ REGLA OBLIGATORIA:**
  1. Durante la pregunta (`3, 2, 1`), muestra A y B con flechas.
  2. Al revelar (*"Son iguales"*), **ANIMA físicamente** las flechas desvaneciéndose (`alpha: 1 -> 0`) y la línea B **subiendo hasta superponerse exactamente encima de la línea A** para que el ojo del espectador vea la prueba real.
