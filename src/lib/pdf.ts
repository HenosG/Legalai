import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateDocumentPdf(title: string, details: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText(title, {
    x: 50,
    y: 720,
    size: 24,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(details, {
    x: 50,
    y: 670,
    size: 12,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3),
    lineHeight: 18,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}