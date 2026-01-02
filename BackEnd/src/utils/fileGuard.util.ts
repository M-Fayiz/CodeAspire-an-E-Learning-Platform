import fs from "fs";
import path from "path";

export function ensureTempDir() {
  const tempDir = path.join(process.cwd(), "temp", "certificates");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  return tempDir;
}
