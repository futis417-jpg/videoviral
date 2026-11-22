/**
 * =========================================================================
 * CLOUDFLARE WORKER 0€ — BACKEND PARA WEB VIRAL STUDIO v34 PRO MAX
 * 1. POST /api/plan -> Usa Cloudflare Workers AI (Llama 3.1/3.3 GRATIS) para
 *    generar el JSON de Dirección Pro Max (Guion Anti-IA + Bucle + Planos).
 * 2. POST /api/tts  -> Genera VOZ REAL (WAV/MP3) para incrustar en el vídeo:
 *    - Si pones HEYGEN_API_KEY + HEYGEN_VOICE_ID en Secrets -> Usa HeyGen Solo Voz (cero avatares!)
 *    - Si NO pones nada -> Usa Cloudflare Workers AI `@cf/myshell-ai/melotts` (GRATIS!)
 * =========================================================================
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);

    // --- 1. GENERADOR DE DIRECTOR JSON (GUION + ESCENAS + BUCLE INFINITO) ---
    if (url.pathname === "/api/plan" && request.method === "POST") {
      try {
        const { prompt } = await request.json();
        const aiRes = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [
            { role: "system", content: "Eres un director de vídeos virales. Devuelve ÚNICAMENTE un objeto JSON válido sin markdown." },
            { role: "user", content: prompt }
          ],
          max_tokens: 1800,
          temperature: 0.72
        });
        const text = aiRes.response || JSON.stringify(aiRes);
        const match = text.match(/\{[\s\S]*\}/);
        const parsed = match ? JSON.parse(match[0]) : { error: "JSON inválido" };
        return new Response(JSON.stringify(parsed), {
          headers: { ...CORS, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
      }
    }

    // --- 2. GENERADOR DE VOZ REAL (HEYGEN SOLO VOZ O WORKERS AI TTS 0€) ---
    if (url.pathname === "/api/tts" && request.method === "POST") {
      try {
        const { text } = await request.json();

        // Prioridad 1: HeyGen Solo Voz (si configuraste HEYGEN_API_KEY y HEYGEN_VOICE_ID)
        if (env.HEYGEN_API_KEY && env.HEYGEN_VOICE_ID) {
          const hgRes = await fetch("https://api.heygen.com/v3/models/audio/tts", {
            method: "POST",
            headers: { "X-Api-Key": env.HEYGEN_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: env.HEYGEN_VOICE_MODEL || "heygen-voice-1-turbo-free",
              voice_id: env.HEYGEN_VOICE_ID,
              text: `[excited] ${text}`,
              with_timestamps: false
            })
          });
          if (hgRes.ok) {
            const hgJson = await hgRes.json();
            const audioUrl = (hgJson.data && hgJson.data.audio_url) || hgJson.audio_url;
            if (audioUrl) {
              const wavResp = await fetch(audioUrl);
              return new Response(await wavResp.arrayBuffer(), {
                headers: { ...CORS, "Content-Type": "audio/wav" }
              });
            }
          }
        }

        // Prioridad 2 (0€ sin API keys): Cloudflare Workers AI MeloTTS (español)
        const ttsRes = await env.AI.run("@cf/myshell-ai/melotts", {
          prompt: text,
          lang: "es"
        });
        if (ttsRes && ttsRes.audio) {
          const bin = Uint8Array.from(atob(ttsRes.audio), c => c.charCodeAt(0));
          return new Response(bin, { headers: { ...CORS, "Content-Type": "audio/mpeg" } });
        }
        return new Response("TTS no disponible", { status: 503, headers: CORS });
      } catch (err) {
        return new Response(err.message, { status: 500, headers: CORS });
      }
    }

    return new Response("Viral Studio v34 PRO MAX Worker Activo 🚀", { headers: CORS });
  }
};
