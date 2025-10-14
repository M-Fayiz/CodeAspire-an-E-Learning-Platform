import crypto from "crypto";

export function generateSecureToken(): string {
  return crypto.randomBytes(64).toString("hex");
}
