import crypto from "crypto";

export function generateSecureToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashSecureToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
