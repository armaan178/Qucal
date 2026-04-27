import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function solveAndExplain(expression: string, context?: string) {
  const prompt = `
    You are a highly capable AI assistant specializing in Mathematics and Physics.
    Solve the following expression or problem: "${expression}"
    
    ${context ? `Additional context from user notes: "${context}"` : ""}
    
    Please provide:
    1. The final result (clearly highlighted).
    2. A step-by-step logical explanation.
    3. If it's a physics problem, mention the units and constants used.
    4. If there's ambiguous notation, explain your assumption.

    Format the response in a clean, scannable way. Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Could not solve the problem. Please check your connection or expression.";
  }
}
