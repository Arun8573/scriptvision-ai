import { createFileRoute } from "@tanstack/react-router";

const ALLOWED_LANGUAGES = new Set([
  "English","Spanish","French","German","Italian","Portuguese","Dutch","Russian",
  "Chinese","Japanese","Korean","Arabic","Hindi","Turkish","Polish","Swedish",
  "Norwegian","Danish","Finnish","Greek","Hebrew","Thai","Vietnamese","Indonesian",
  "Ukrainian","Czech","Romanian","Hungarian",
]);

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin") ?? request.headers.get("referer");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/ocr")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!sameOrigin(request)) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return Response.json({ error: "LOVABLE_API_KEY missing" }, { status: 500 });
        }
        let body: { imageDataUrl?: string; language?: string };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const { imageDataUrl, language } = body;
        if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) {
          return Response.json({ error: "imageDataUrl required (data URL)" }, { status: 400 });
        }
        if (imageDataUrl.length > 12_000_000) {
          return Response.json({ error: "Image too large (max ~9MB)" }, { status: 413 });
        }
        let safeLanguage: string | undefined;
        if (language !== undefined && language !== null && language !== "") {
          if (!ALLOWED_LANGUAGES.has(language)) {
            return Response.json({ error: "Invalid language" }, { status: 400 });
          }
          safeLanguage = language;
        }

        const system =
          "You are a world-class handwriting OCR engine. Transcribe the handwritten text in the image EXACTLY as written. " +
          "Preserve line breaks, punctuation, casing, and the original language. " +
          "Do not translate, summarize, explain, add commentary, or use code fences. " +
          "If something is illegible, write [illegible]. Output ONLY the transcribed text.";

        const userText = safeLanguage
          ? `Transcribe this handwriting. Expected language: ${safeLanguage}.`
          : "Transcribe this handwriting.";

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-pro",
            messages: [
              { role: "system", content: system },
              {
                role: "user",
                content: [
                  { type: "text", text: userText },
                  { type: "image_url", image_url: { url: imageDataUrl } },
                ],
              },
            ],
          }),
        });

        if (res.status === 429) {
          return Response.json({ error: "Rate limit reached. Try again shortly." }, { status: 429 });
        }
        if (res.status === 402) {
          return Response.json({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }, { status: 402 });
        }
        if (!res.ok) {
          const t = await res.text();
          console.error("AI OCR error", res.status, t);
          return Response.json({ error: "AI OCR request failed" }, { status: 500 });
        }
        const data = await res.json();
        const text: string = data?.choices?.[0]?.message?.content ?? "";
        return Response.json({ text });
      },
    },
  },
});