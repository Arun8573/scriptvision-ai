import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export function exportTxt(text: string, filename = "ink2text.txt") {
  saveAs(new Blob([text], { type: "text/plain;charset=utf-8" }), filename);
}

export function exportPdf(text: string, filename = "ink2text.pdf") {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 56;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(text || "", maxWidth);
  let y = margin;
  for (const line of lines) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 16;
  }
  doc.save(filename);
}

export async function exportDocx(text: string, filename = "ink2text.docx") {
  const paragraphs = (text || "").split(/\r?\n/).map(
    (line) => new Paragraph({ children: [new TextRun(line)] }),
  );
  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs.length ? paragraphs : [new Paragraph("")] }],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}