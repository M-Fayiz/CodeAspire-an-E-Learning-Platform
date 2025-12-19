"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function generateCertificateHtml({ studentName, courseName, certId, issuedDate, verifyUrl, }) {
    const templatePath = path_1.default.join(process.cwd(), "src", "template", "certificate.template.html");
    const imagePath = path_1.default.join(process.cwd(), "src", "assets", "certificateModel.png");
    const imageBase64 = fs_1.default.readFileSync(imagePath, "base64");
    const BG_PATH = `data:image/png;base64,${imageBase64}`;
    let html = fs_1.default.readFileSync(templatePath, "utf8");
    html = html
        .replace(/{{STUDENT_NAME}}/g, studentName)
        .replace(/{{COURSE_NAME}}/g, courseName)
        .replace(/{{CERT_ID}}/g, certId)
        .replace(/{{ISSUED_DATE}}/g, issuedDate)
        .replace(/{{BG_PATH}}/g, BG_PATH)
        .replace(/{{VERIFY_URL}}/g, verifyUrl ?? "");
    return html;
}
exports.default = generateCertificateHtml;
