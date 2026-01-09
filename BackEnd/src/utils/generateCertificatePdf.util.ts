import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

interface CertificatePdfData {
  studentName: string;
  courseName: string;
  certId: string;
  issuedDate: string;
}

export async function generateCertificatePdf(
  data: CertificatePdfData,
  pdfPath: string,
  previewPath: string,
) {
  return new Promise<void>((resolve) => {
    const doc = new PDFDocument({
      size: [1123, 794], // EXACT same as your HTML
      margin: 0,
    });

    const pdfStream = fs.createWriteStream(pdfPath);
    doc.pipe(pdfStream);

    // ---------- BACKGROUND ----------
    const bgImage = path.join(
      process.cwd(),
      "public",
      "assets",
      "certificateModel.png",
    );

    doc.image(bgImage, 0, 0, {
      width: 1123,
      height: 794,
    });

    const fontRegular = path.resolve(
      process.cwd(),
      "public",
      "fonts",
      "PlayfairDisplay-Regular.ttf",
    );

    const fontBold = path.resolve(
      process.cwd(),
      "public",
      "fonts",
      "PlayfairDisplay-Bold.ttf",
    );

    doc.registerFont("Bold", fontBold);
    doc.registerFont("Regular", fontRegular);

    doc
      .font("Bold")
      .fontSize(50)
      .fillColor("#000")
      .text(data.studentName, 130, 330, {
        width: 860,
        align: "center",
      });

    doc.font("Regular").fontSize(36).text(data.courseName, 130, 500, {
      width: 860,
      align: "center",
    });

    doc.fontSize(20).text(`Issued Date: ${data.issuedDate}`, 820, 680);

    doc.fontSize(20).text(`Certificate ID: ${data.certId}`, 820, 710);

    doc.end();

    pdfStream.on("finish", () => {
      fs.copyFileSync(bgImage, previewPath);
      resolve();
    });
  });
}
