import { createFileRoute } from "@tanstack/react-router";

type Mode = "cleanup" | "summarize" | "translate";

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
    const o = new URL(origin).origin;
    const host = new URL(request.url).origin;
    return o === host;
  } catch {
    return false;
  }
}

const SYSTEMS: Record<Mode, (lang?: string) => string> = {
  cleanup: () =>
    "You are an expert OCR post-processor for handwritten notes. Fix recognition errors, restore correct spelling, punctuation, casing, and line breaks. Preserve the author's wording, meaning, and language. Do NOT translate. Do NOT summarize. Do NOT add commentary. Return ONLY the corrected text.",
  summarize: () =>
    "You are a precise note summarizer. Produce a clean, well-structured Markdown summary with a one-line TL;DR followed by concise bullet points of key ideas. Return ONLY the summary.",
  translate: (lang) =>
    `You are a professional translator. Translate the user's text into ${lang ?? "English"}. Preserve formatting and line breaks. Return ONLY the translation.`,
};

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!sameOrigin(request)) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return Response.json(
            {
              error:
                "LOVABLE_API_KEY missing. For local dev, copy .dev.vars.example to .dev.vars, paste your key from Lovable → Project Settings → Cloud → Secrets, and restart the dev server.",
            },
            { status: 500 },
          );
        }
        let body: { mode?: Mode; text?: string; targetLanguage?: string };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const { mode, text, targetLanguage } = body;
        if (!mode || !text || !SYSTEMS[mode]) {
          return Response.json({ error: "Missing mode or text" }, { status: 400 });
        }
        if (text.length > 20000) {
          return Response.json({ error: "Text too long (max 20k chars)" }, { status: 400 });
        }
        let safeLang: string | undefined;
        if (mode === "translate") {
          if (!targetLanguage || !ALLOWED_LANGUAGES.has(targetLanguage)) {
            return Response.json({ error: "Invalid targetLanguage" }, { status: 400 });
          }
          safeLang = targetLanguage;
        }

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: SYSTEMS[mode](safeLang) },
              { role: "user", content: text },
            ],
          }),
        });

        if (res.status === 429) {
          return Response.json({ error: "Rate limit reached. Please try again in a moment." }, { status: 429 });
        }
        if (res.status === 402) {
          return Response.json({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }, { status: 402 });
        }
        if (!res.ok) {
          const t = await res.text();
          console.error("AI gateway error", res.status, t);
          return Response.json({ error: "AI request failed" }, { status: 500 });
        }
        const data = await res.json();
        const result = data?.choices?.[0]?.message?.content ?? "";
        return Response.json({ result });
      },
    },
  },
});