import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
});

export async function explainCodeInTanglish(code: string, language: string = "auto") {
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying Gemini model: ${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{
          role: "user",
          parts: [{
            text: `Explain the following ${language} code in simple Tanglish (Tamil written in English letters).
Make it beginner-friendly and explain it line-by-line or block-by-block.

Code:
${code}`
          }]
        }],
        config: {
          systemInstruction: "You are a helpful programming tutor who explains code in Tanglish (Tamil English mix). Your explanations are clear, simple, and use common Tanglish terms like 'inga', 'pannuraanga', 'eduthukuraanga', etc.",
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (error: any) {
      lastError = error;
      console.warn(`Model ${modelName} failed:`, error.message);
      // If it's a quota error, we stop and report it immediately (likely same for all flash models)
      if (error.message?.includes('429')) break;
      // Other errors (like 404) will trigger the next model in the list
    }
  }

  // If we reach here, all models failed
  console.error("All Gemini models failed. Last error:", lastError);

  if (lastError?.message?.includes('429')) {
    throw new Error("QUOTA_EXHAUSTED: Free tier limits reach aayiduchi. Konjam neram kazhichu try pannunga (Wait 1 min).");
  }

  if (lastError?.message?.includes('404')) {
    throw new Error(`MODEL_NOT_FOUND: Model list check panni region-a verify pannunga. (Error: ${lastError.message})`);
  }

  throw new Error(lastError?.message || "AI response kudukala. Network check pannunga.");
}

