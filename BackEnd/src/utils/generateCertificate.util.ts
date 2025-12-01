import fs from "fs";

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
  const templatePath = "../BackEnd/src/template/certificate.template.html";

  let html = fs.readFileSync(templatePath, "utf8");

  html = html
    .replace(/{{STUDENT_NAME}}/g, studentName)
    .replace(/{{COURSE_NAME}}/g, courseName)
    .replace(/{{CERT_ID}}/g, certId)
    .replace(/{{ISSUED_DATE}}/g, issuedDate);
  // .replace(/{{VERIFY_URL}}/g, verifyUrl)
  // .replace(/{{BG_PATH}}/g, .replace("{{BG_PATH}}", bgPath));

  return html;
}

export default generateCertificateHtml;
