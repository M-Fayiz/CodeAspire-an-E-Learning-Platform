"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificatePdf = generateCertificatePdf;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function generateCertificatePdf(data, pdfPath, previewPath) {
    return new Promise((resolve) => {
        const doc = new pdfkit_1.default({
            size: [1123, 794], // EXACT same as your HTML
            margin: 0,
        });
        const pdfStream = fs_1.default.createWriteStream(pdfPath);
        doc.pipe(pdfStream);
        // ---------- BACKGROUND ----------
        const bgImage = path_1.default.join(process.cwd(), "public", "assets", "certificateModel.png");
        doc.image(bgImage, 0, 0, {
            width: 1123,
            height: 794,
        });
        const fontRegular = path_1.default.resolve(process.cwd(), "public", "fonts", "PlayfairDisplay-Regular.ttf");
        const fontBold = path_1.default.resolve(process.cwd(), "public", "fonts", "PlayfairDisplay-Bold.ttf");
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
        doc
            .font("Regular")
            .fontSize(36)
            .text(data.courseName, 130, 500, {
            width: 860,
            align: "center",
        });
        doc
            .fontSize(20)
            .text(`Issued Date: ${data.issuedDate}`, 820, 680);
        doc
            .fontSize(20)
            .text(`Certificate ID: ${data.certId}`, 820, 710);
        doc.end();
        pdfStream.on("finish", () => {
            fs_1.default.copyFileSync(bgImage, previewPath);
            resolve();
        });
    });
}
