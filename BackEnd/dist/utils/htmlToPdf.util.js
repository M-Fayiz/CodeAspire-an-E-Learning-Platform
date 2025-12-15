"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToPdf = htmlToPdf;
const puppeteer_1 = __importDefault(require("puppeteer"));
async function htmlToPdf(html, outputPath) {
    const browser = await puppeteer_1.default.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.setViewport({ width: 1600, height: 900 });
    await page.pdf({
        path: outputPath,
        width: "1123px",
        height: " 800px",
        printBackground: true,
    });
    await browser.close();
}
