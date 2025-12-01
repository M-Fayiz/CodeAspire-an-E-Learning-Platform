import crypto from "crypto";

export function generateCertificateId() {
  const year = new Date().getFullYear();

  const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `CA-${year}-${randomHex}`;
}
