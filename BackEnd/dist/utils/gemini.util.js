"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askGemini = void 0;
const genai_1 = require("@google/genai");
const genAI = new genai_1.GoogleGenAI({});
const askGemini = async (contents) => {
    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
    });
    return response.text;
};
exports.askGemini = askGemini;
