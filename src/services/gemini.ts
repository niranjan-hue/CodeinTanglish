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
            text: `
Explain this ${language} code in medium-size Tanglish.

Rules:
- Keep answer short and clean
- Explain only important logic
- Avoid line-by-line explanation
- Avoid explaining every keyword
- Maximum 6-8 points only
- Beginner-friendly but concise

Code:
${code}`
          }]
        }],
        config: {
          systemInstruction: `
You are a Tanglish coding tutor.

IMPORTANT RULES:
- Keep explanation medium-length only.
- Do NOT explain every line.
- Do NOT explain basic Java keywords deeply.
- Avoid huge paragraphs.
- Keep response compact and readable.
- Maximum 120-180 words.
- Use short bullet points.
- Focus only on important concepts and workflow.

FORMAT:

# Enna Pannuthu?
2 lines summary.

# Main Logic
Only 3-4 very short bullet points.
Each point maximum 1 sentence.

# Concepts Used
Mention important concepts briefly.

# Small Example
One short example only.
`
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

