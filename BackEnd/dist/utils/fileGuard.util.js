"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureTempDir = ensureTempDir;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function ensureTempDir() {
    const tempDir = path_1.default.join(process.cwd(), "temp", "certificates");
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    }
    return tempDir;
}
