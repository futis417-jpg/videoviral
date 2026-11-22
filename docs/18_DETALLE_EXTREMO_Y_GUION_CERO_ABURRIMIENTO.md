# 🎨 DETALLE EXTREMO + GUION CERO ABURRIMIENTO v22 ULTRA-DETAIL

## 1. REGLA DE DENSIDAD VISUAL (PROHIBIDO ESCENAS VACÍAS O SIMPLES)
Un vídeo viral de +10M de vistas se nota en el primer fotograma por la **riqueza de detalles**. En CADA escena nueva que programes:
1. **Mínimo 4 capas de profundidad reales:**
   - **Fondo (0.2x parallax):** Cielo degradado, estrellas/nubes, horizonte o pared con textura/rayas/ladrillos.
   - **Entorno arquitectónico (0.6x):** Ventanas con luz interior/exterior (`ctx.clip()`), cuadros, estanterías, edificios, árboles, lámparas colgantes.
   - **Plano Principal (1.0x):** Suelo con línea `GROUND_Y`, sombra de contacto debajo de cada objeto/personaje, mobiliario detallado y **personajes articulados con expresiones vivas**.
   - **Primer Plano / Atmósfera (1.2x):** Haz de luz volumétrica (`V14.volumetricBeam`), partículas flotantes (polvo, burbujas, chispas, lluvia), viñeta suave y micro-movimiento de cámara.
2. **Mínimo 5 Props / Detalles Contextuales por Escena:**
   - Si es una habitación: ventana + lámpara + reloj + póster/cuadro + mueble/cama con almohada.
   - Si es una calle: skyline + farola con halo de luz + tienda/casa anclada + acera + estrellas/nubes.
   - Si es un estudio/reto: fondo con luz radial + mascota expresiva + HUD limpio + animación real del reto + partículas.
3. **Micro-Animación Constante (Regla de los 1.2s):**
   - Cada **1.2 a 2.0 segundos** DEBE pasar algo nuevo en pantalla (cambio de plano, zoom-to-detail, objeto entrando con `spring`, cambio de expresión, dato gigante, subrayado rojo, check verde o transición).

---

## 2. REGLA ANTI-ABURRIMIENTO EN EL GUION (CERO RELLENO)
El 80% de los vídeos mueren entre el segundo 4 y el segundo 14 porque el guion se vuelve lento o explicativo.
- **PROHIBIDO** explicar lo obvio o dar rodeos antes de entrar al grano.
- **OBLIGATORIO — Ritmo de Montaña Rusa:**
  1. **0–2.5s (Golpe seco):** Frase de choque / reto / paradoja sin saludar.
  2. **2.5–8s (Escalada rápida):** Dato concreto que sorprende + promesa de lo que viene (*"Pero espera a ver el último..."*).
  3. **Cada 6–8s (Re-Hook obligatorio):** Corta la monotonía con una pregunta directa (*"¿A que ya has caído?"*), una contradicción (*"Pues es justo al revés."*) o un cambio brusco de escenario + SFX.
  4. **Cierre Imposible de Ignorar:** Giro real + tarjeta/pregunta de comentarios o bucle perfecto al segundo 0.
