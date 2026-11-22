# 🚀 CÓMO SUBIR TU WEB VIRAL STUDIO v34 PRO MAX EN 5 MINUTOS (0€ DESDE CHROMEBOOK)

Esta carpeta ya trae **LA WEB (`index.html`) + EL PACK COMPLETO `v34 PRO MAX` + EL BACKEND CLOUDFLARE WORKER**.

---

## PASO 1 — SUBIR LA WEB A GITHUB PAGES (2 MINUTOS, 0€)
1. Descomprime `web-viral-studio-v34-pro-max.zip`.
2. Crea un repositorio público nuevo en GitHub (ej. `viral-studio-v34`).
3. Sube todo el contenido de la carpeta (asegúrate de que `index.html`, `web_app/`, `motor_escenas_v14/`...`v34/` y `recursos/` queden en la raíz del repositorio).
4. Ve a **Settings → Pages → Source: Deploy from a branch (`main` / `/root`) → Save**.
5. ¡Listo! En 60 segundos tu web ya funciona en `https://tu-usuario.github.io/viral-studio-v34/` (¡incluso antes de configurar Cloudflare, ya genera guiones con Pollinations AI gratis!).

---

## PASO 2 — ACTIVAR VOZ IA + LLAMA 3 EN CLOUDFLARE WORKERS (3 MINUTOS, 0€)
Para que además genere **voz IA real incrustada en el vídeo descargado** sin gastar nada:
1. Entra en tu panel de **Cloudflare → Workers & Pages → Create Worker** (nombre: `viral-studio-v34-worker`).
2. Dale a **Edit Code**, borra lo que hay y pega TODO el código de `cloudflare-worker/worker.js`. Dale a **Deploy**.
3. En la configuración del Worker ve a **Settings → Bindings → Add Binding → Workers AI** y pon como nombre de variable **`AI`** (exactamente en mayúsculas).
4. *(Opcional — HeyGen Solo Voz):* En **Settings → Variables and Secrets** puedes añadir `HEYGEN_API_KEY` y `HEYGEN_VOICE_ID` para usar tus voces de HeyGen (si no pones nada, usa **Cloudflare Workers AI MeloTTS en español GRATIS**!).
5. Copia la URL de tu Worker (`https://viral-studio-v34-worker.tu-cuenta.workers.dev`) y pégala en la web dentro de **⚙️ Conexión Cloudflare Worker** (o déjala fijada por defecto en `index.html` dentro de `value="..."` del `<input id="workerUrl">`).

¡Y A CREAR VÍDEOS VIRALES ILIMITADOS GRATIS! 🏆🔥
