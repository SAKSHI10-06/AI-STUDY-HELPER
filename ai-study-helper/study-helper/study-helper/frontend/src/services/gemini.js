import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateStudyMaterial = async (text) => {
  if (!API_KEY) throw new Error("Missing Gemini API Key in .env file");

  const genAI = new GoogleGenerativeAI(API_KEY);

  // Using Gemini 2.5 Flash as requested (Stable model for Dec 2025 context)
  const modelName = "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 1.0,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    }
  });

  const randomSeed = Math.floor(Math.random() * 100000);

  // Limit text to ~300k chars to be safe.
  const safeText = text.substring(0, 300000);

  const prompt = `
    You are an expert tutor. 
    Random Seed: ${randomSeed}.
    
    ANALYZE THIS TEXT:
    "${safeText}" 
    
    TASK:
    Generate a study set in VALID JSON format.
    
    JSON SCHEMA:
    {
      "summary": "Concise summary of key concepts (max 200 words).",
      "deep_insight": "An engaging, 'Deep Dive' explanation using analogies and bullet points.",
      "flashcards": [
        { "front": "Concept/Question", "back": "Definition/Answer" }
      ], 
      "quiz": [
        { "question": "Question text?", "options": ["A", "B", "C", "D"], "answer": 0, "difficulty": "Easy" },
        { "question": "Question text?", "options": ["A", "B", "C", "D"], "answer": 0, "difficulty": "Medium" },
        { "question": "Question text?", "options": ["A", "B", "C", "D"], "answer": 0, "difficulty": "Hard" }
      ],
      "mermaid": "graph TD; A[Concept] --> B[Detail];"
    }
    
    REQUIREMENTS:
    1. Generate EXACTLY 8 Flashcards.
    2. Generate EXACTLY 15 Quiz Questions (5 Easy, 5 Medium, 5 Hard).
    3. 'mermaid' must be a valid Mermaid.js flowchart string (Graph TD).
       - USE ONLY ALPHANUMERIC CHARACTERS in node labels.
       - NO brackets, NO parentheses, NO quotes, NO special symbols in labels.
       - Example: A[Start] --> B[NextStep]
       - Do NOT use "graph TD;" inside the string if it's already implied, just the nodes. (Actually, keep 'graph TD;' but keep nodes simple).
       - STRICT FORMAT: graph TD; A[NodeName] --> B[OtherNode];
    4. Do NOT wrap the output in markdown code blocks. Return raw JSON only.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    // Sanitize: Remove markdown if AI adds it
    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    // Validate structure (Prevent crash)
    if (!parsedData.flashcards) parsedData.flashcards = [];
    if (!parsedData.quiz) parsedData.quiz = [];

    return parsedData;
  } catch (error) {
    console.error("Gemini Error:", error);

    // Handle specific API errors
    if (error.message.includes("404")) {
      throw new Error(`Gemini Model 404: The model '${modelName}' was not found. Please check your API key permissions.`);
    }

    if (error.message.includes("429")) {
      throw new Error("Quota Exceeded (429): You've hit the API rate limit. Please wait a minute before trying again.");
    }

    // Handle JSON parsing errors (common with complex files)
    if (error instanceof SyntaxError) {
      throw new Error("AI Generation Failed: The model returned invalid JSON. Try a shorter or simpler document.");
    }

    // Pass the actual error message for debugging
    throw new Error(`AI Error: ${error.message || "Unknown error occurred"}`);
  }
};

export const askAITutor = async (context, question, history) => {
  if (!API_KEY) throw new Error("Missing Gemini API Key");

  const genAI = new GoogleGenerativeAI(API_KEY);
  // Ensure Tutor also uses the correct model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const historyContext = history.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.text}`).join('\n');

  const prompt = `
    You are a friendly AI Tutor.
    CONTEXT: "${context.substring(0, 100000)}"
    HISTORY: ${historyContext}
    QUESTION: "${question}"
    
    Answer concisely and encourage the student.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Tutor Error:", error);
    if (error.message.includes("429")) {
      return "I'm a bit overwhelmed right now (Rate Limit). Give me a minute to rest! 😴";
    }
    return "I'm having trouble connecting. Please try again.";
  }
};