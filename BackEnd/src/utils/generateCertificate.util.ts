import fs from "fs";
import path from "path";

export interface generateCertificateHTML {
  studentName: string;
  courseName: string;
  certId: string;
  issuedDate: string;
  verifyUrl?: string;
}

function generateCertificateHtml({
  studentName,
  courseName,
  certId,
  issuedDate,
  verifyUrl,
}: generateCertificateHTML) {
  const templatePath = path.join(
  process.cwd(),
  "src",
  "template",
  "certificate.template.html"
);

const imagePath = path.join(
  process.cwd(),
  "src",
  "assets",
  "certificateModel.png"
);

const imageBase64 = fs.readFileSync(imagePath, "base64");

const BG_PATH = `data:image/png;base64,${imageBase64}`;


  let html = fs.readFileSync(templatePath, "utf8");

 html = html
  .replace(/{{STUDENT_NAME}}/g, studentName)
  .replace(/{{COURSE_NAME}}/g, courseName)
  .replace(/{{CERT_ID}}/g, certId)
  .replace(/{{ISSUED_DATE}}/g, issuedDate)
  .replace(/{{BG_PATH}}/g, BG_PATH)
  .replace(/{{VERIFY_URL}}/g, verifyUrl ?? "");

  return html;
}

export default generateCertificateHtml;
