import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tesseract from "tesseract.js";
import { Nav } from "@/components/site/Nav";
import { exportTxt, exportPdf, exportDocx } from "@/lib/exporters";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — Ink2Text AI" },
      { name: "description", content: "Upload a handwritten note and convert it to digital text in seconds." },
    ],
  }),
  component: Workspace,
});

type Status = "idle" | "loading" | "done" | "error";
type Engine = "ai" | "tesseract";

const OCR_LANGS: { code: string; label: string }[] = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "ita", label: "Italian" },
  { code: "por", label: "Portuguese" },
  { code: "nld", label: "Dutch" },
  { code: "rus", label: "Russian" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "jpn", label: "Japanese" },
  { code: "kor", label: "Korean" },
  { code: "ara", label: "Arabic" },
  { code: "hin", label: "Hindi" },
];

const TRANSLATE_TARGETS = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Dutch", "Russian", "Chinese", "Japanese", "Korean", "Arabic", "Hindi",
];

type AiAction = "cleanup" | "summarize" | "translate";

function Workspace() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [aiOutput, setAiOutput] = useState<string>("");
  const [aiBusy, setAiBusy] = useState<AiAction | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [lang, setLang] = useState<string>("eng");
  const [target, setTarget] = useState<string>("English");
  const [autoEnhance, setAutoEnhance] = useState(true);
  const [engine, setEngine] = useState<Engine>("ai");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });

  const langLabel = OCR_LANGS.find((l) => l.code === lang)?.label;

  const runOcr = useCallback(async (file: File) => {
    setStatus("loading");
    setProgress(0);
    setText("");
    setAiOutput("");
    setAiError(null);
    setConfidence(null);
    setErrorMsg(null);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    try {
      if (engine === "ai") {
        setProgress(20);
        const dataUrl = await fileToDataUrl(file);
        setProgress(45);
        const res = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageDataUrl: dataUrl, language: langLabel }),
        });
        setProgress(85);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "AI OCR failed");
        setText((data.text ?? "").trim());
        setConfidence(null);
        setProgress(100);
        setStatus("done");
      } else {
        const result = await Tesseract.recognize(file, lang, {
          logger: (m) => {
            if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
          },
        });
        const raw = result.data.text.trim();
        setText(raw);
        setConfidence(Math.round(result.data.confidence));
        setStatus("done");
        if (autoEnhance && raw.length > 0) {
          void runAi("cleanup", raw, true);
        }
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Recognition failed");
      setStatus("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, autoEnhance, engine, langLabel]);

  const runAi = async (action: AiAction, input?: string, replaceMain = false) => {
    const source = input ?? text;
    if (!source.trim()) return;
    setAiBusy(action);
    setAiError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: action,
          text: source,
          targetLanguage: action === "translate" ? target : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "AI request failed");
      if (action === "cleanup" && replaceMain) {
        setText(data.result);
      } else {
        setAiOutput(data.result);
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "AI failed");
    } finally {
      setAiBusy(null);
    }
  };

  const onFile = (f?: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (JPG, PNG, WEBP).");
      setStatus("error");
      return;
    }
    void runOcr(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    onFile(e.dataTransfer.files?.[0]);
  };

  const reset = () => {
    setImageUrl(null);
    setText("");
    setAiOutput("");
    setAiError(null);
    setStatus("idle");
    setProgress(0);
    setConfidence(null);
    setErrorMsg(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  const speak = () => {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] font-mono text-accent-blue uppercase tracking-wider mb-2">
              Workspace
            </div>
            <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight">
              Convert handwriting to text
            </h1>
            <p className="text-zinc-400 mt-2 text-sm max-w-lg">
              AI Vision reads handwriting directly with a multimodal model (highest accuracy). Tesseract runs offline in your browser.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 uppercase">
              <span>Engine</span>
              <select
                value={engine}
                onChange={(e) => setEngine(e.target.value as Engine)}
                disabled={status === "loading"}
                className="bg-zinc-900 ring-1 ring-white/10 rounded-md px-2 py-1.5 text-xs text-zinc-200 font-sans"
              >
                <option value="ai">AI Vision (best)</option>
                <option value="tesseract">Tesseract (offline)</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 uppercase">
              <span>Lang</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                disabled={status === "loading"}
                className="bg-zinc-900 ring-1 ring-white/10 rounded-md px-2 py-1.5 text-xs text-zinc-200 font-sans"
              >
                {OCR_LANGS.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </label>
            {engine === "tesseract" && (
            <label className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 uppercase cursor-pointer">
              <input
                type="checkbox"
                checked={autoEnhance}
                onChange={(e) => setAutoEnhance(e.target.checked)}
                className="accent-accent-blue"
              />
              AI enhance
            </label>
            )}
            {status === "done" && (
              <button
                onClick={reset}
                className="px-4 py-2 text-sm rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                New scan
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* INPUT */}
          <div className="glass-card ring-1 ring-white/10 rounded-2xl p-4 md:p-6 min-h-[480px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Input · Source</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                {imageUrl ? "Loaded" : "Awaiting capture"}
              </span>
            </div>

            {!imageUrl ? (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`flex-1 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-8 cursor-pointer transition-all ${
                  dragOver
                    ? "border-accent-blue bg-accent-blue/5"
                    : "border-white/10 hover:border-white/20 bg-ink-900/50"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
                <div className="size-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple ring-1 ring-white/10 mb-6" />
                <p className="text-zinc-200 font-medium mb-2">Drop an image, or click to upload</p>
                <p className="text-xs text-zinc-500 max-w-[40ch]">
                  JPG, PNG, WEBP up to 20MB. On mobile you'll be prompted to open your camera.
                </p>
              </label>
            ) : (
              <div className="flex-1 rounded-xl bg-ink-900 ring-1 ring-white/5 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={imageUrl}
                  alt="Uploaded source"
                  className="max-w-full max-h-[400px] object-contain rounded-md"
                />
              </div>
            )}
          </div>

          {/* OUTPUT */}
          <div className="glass-card ring-1 ring-white/10 rounded-2xl p-4 md:p-6 min-h-[480px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-accent-blue uppercase">Output · Digital</span>
              {confidence !== null && (
                <span className="text-[10px] font-mono text-emerald-400 uppercase">
                  {confidence}% confidence
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 rounded-xl bg-ink-800/50 ring-1 ring-white/5 p-6 flex items-center justify-center"
                >
                  <p className="text-sm text-zinc-600 font-mono text-center max-w-xs">
                    Extracted text will crystallize here after you upload an image.
                  </p>
                </motion.div>
              )}

              {status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 rounded-xl bg-ink-800/50 ring-1 ring-white/5 p-6 flex flex-col justify-center"
                >
                  <div className="space-y-3 mb-8">
                    <div className="h-3 w-3/4 bg-zinc-700/40 rounded animate-pulse" />
                    <div className="h-3 w-full bg-zinc-700/40 rounded animate-pulse" />
                    <div className="h-3 w-5/6 bg-zinc-700/40 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-zinc-700/40 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
                      <span>Neural synthesis</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-blue to-accent-purple"
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut", duration: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {status === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col"
                >
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 w-full rounded-xl bg-ink-800/50 ring-1 ring-white/5 p-6 font-mono text-sm leading-relaxed text-zinc-200 resize-none focus:outline-none focus:ring-accent-blue/40"
                  />
                  {aiBusy === "cleanup" && (
                    <div className="mt-3 text-[10px] font-mono text-accent-blue uppercase animate-pulse">
                      AI enhancing text…
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={copyText} className="px-3 py-2 text-xs rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700">Copy</button>
                    <button onClick={() => exportTxt(text)} className="px-3 py-2 text-xs rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700">.txt</button>
                    <button onClick={() => exportPdf(text)} className="px-3 py-2 text-xs rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700">.pdf</button>
                    <button onClick={() => void exportDocx(text)} className="px-3 py-2 text-xs rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700">.docx</button>
                    <button onClick={speak} className="px-3 py-2 text-xs rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700">Read aloud</button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => void runAi("cleanup", text, true)}
                      disabled={aiBusy !== null}
                      className="px-3 py-2 text-xs rounded-md bg-accent-blue/20 text-accent-blue ring-1 ring-accent-blue/30 hover:bg-accent-blue/30 disabled:opacity-50"
                    >
                      {aiBusy === "cleanup" ? "Enhancing…" : "AI enhance"}
                    </button>
                    <button
                      onClick={() => void runAi("summarize", text)}
                      disabled={aiBusy !== null}
                      className="px-3 py-2 text-xs rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
                    >
                      {aiBusy === "summarize" ? "Summarizing…" : "Summarize"}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => void runAi("translate", text)}
                        disabled={aiBusy !== null}
                        className="px-3 py-2 text-xs rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
                      >
                        {aiBusy === "translate" ? "Translating…" : "Translate →"}
                      </button>
                      <select
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="bg-zinc-900 ring-1 ring-white/10 rounded-md px-2 py-2 text-xs text-zinc-200"
                      >
                        {TRANSLATE_TARGETS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  {aiError && (
                    <p className="mt-3 text-xs text-red-400">{aiError}</p>
                  )}
                  {aiOutput && (
                    <div className="mt-4 rounded-xl bg-ink-900/70 ring-1 ring-white/5 p-4 max-h-64 overflow-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-accent-blue uppercase">AI output</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(aiOutput)}
                          className="text-[10px] font-mono text-zinc-400 hover:text-zinc-200 uppercase"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm text-zinc-200 font-sans leading-relaxed">{aiOutput}</pre>
                    </div>
                  )}
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 rounded-xl bg-red-500/5 ring-1 ring-red-500/20 p-6 flex flex-col items-center justify-center text-center"
                >
                  <p className="text-sm text-red-300 mb-4">{errorMsg ?? "Something went wrong."}</p>
                  <button
                    onClick={reset}
                    className="px-4 py-2 text-sm rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  >
                    Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}