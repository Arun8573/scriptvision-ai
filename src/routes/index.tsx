import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Workflow } from "@/components/site/Workflow";
import { Features } from "@/components/site/Features";
import { Testimonials } from "@/components/site/Testimonials";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ink2Text AI — Handwriting to digital text, instantly" },
      {
        name: "description",
        content:
          "Convert handwritten notes, PDFs, and whiteboard photos into editable digital text with 99%+ accuracy. AI summarization, multi-language OCR, and one-click export.",
      },
      { property: "og:title", content: "Ink2Text AI — Handwriting to digital text" },
      { property: "og:description", content: "The crystallization engine for handwriting." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Workflow />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
