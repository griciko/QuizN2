
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Question, Feedback } from "../types";

// Always use a named parameter for apiKey and source it from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (category: Category): Promise<Question[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 10 multiple-choice questions for a quiz about ${category}. 
    Each question should have 4 options and a detailed explanation of the correct answer. 
    Ensure a mix of difficulty levels.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    // Access response.text as a property, not a method.
    const questions = JSON.parse(response.text || '[]');
    return questions.map((q: any) => ({ ...q, category }));
  } catch (error) {
    console.error("Failed to parse questions", error);
    return [];
  }
};

export const generateFeedback = async (
  category: Category, 
  score: number, 
  total: number, 
  results: {question: string, correct: boolean}[]
): Promise<Feedback> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze my quiz performance in ${category}. 
    I scored ${score}/${total}. 
    Here are the results: ${JSON.stringify(results)}. 
    Provide a professional summary and 3 specific study recommendations.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          total: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["score", "total", "summary", "recommendations"]
      }
    }
  });

  // Access response.text as a property.
  return JSON.parse(response.text || '{}');
};
