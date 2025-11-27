import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const streamGeminiResponse = async (
  message: string, 
  onChunk: (text: string) => void,
  systemInstruction?: string
) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction || "You are the KERNEL AI of FluxOS, a secure, text-based hacker operating system. Output raw text. Do not use markdown bold/italic unless necessary for emphasis. Be concise, technical, and slightly cryptic. Refer to the user as 'Admin' or 'Root'.",
      }
    });

    const result = await chat.sendMessageStream({ message });

    for await (const chunk of result) {
        if (chunk.text) {
            onChunk(chunk.text);
        }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    onChunk("\n[KERNEL_PANIC: Connection to neural net failed. Check API_KEY.]");
  }
};