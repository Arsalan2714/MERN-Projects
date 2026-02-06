import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = {
    role: "system",
    content: "Behave like a programming teacher and your answers should be simple and concise "
}

const createMessageString = (messages) => {
  return messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");
} 

export async function generateContent(prompt, model = "gemini-3-flash-preview", messages = []) {
    const newPrompt =   {
        role: "user",
        content: prompt
    } 
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: createMessageString([SYSTEM_PROMPT,...messages, newPrompt]),
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw error; // let controller handle response
  }
}
