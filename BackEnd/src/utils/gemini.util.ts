
import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.config";


const genAI  = new GoogleGenAI({});


export const askGemini = async (prompt:string) => {

    const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
    return response.text
 
}; 
 
