import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tesseract from "tesseract.js";
import { Nav } from "@/components/site/Nav";

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

function Workspace() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const runOcr = useCallback(async (file: File) => {
    setStatus("loading");
    setProgress(0);
    setText("");
    setConfidence(null);
    setErrorMsg(null);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      setText(result.data.text.trim());
      setConfidence(Math.round(result.data.confidence));
      setStatus("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Recognition failed");
      setStatus("error");
    }
  }, []);

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

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ink2text.txt";
    a.click();
    URL.revokeObjectURL(url);
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
              Runs entirely in your browser. Your image never leaves your device.
            </p>
          </div>
          {status === "done" && (
            <button
              onClick={reset}
              className="self-start md:self-auto px-4 py-2 text-sm rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              New scan
            </button>
          )}
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
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={copyText}
                      className="px-4 py-2 text-sm rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
                    >
                      Copy text
                    </button>
                    <button
                      onClick={downloadText}
                      className="px-4 py-2 text-sm rounded-md bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors ring-2 ring-accent-blue/20"
                    >
                      Download .txt
                    </button>
                  </div>
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