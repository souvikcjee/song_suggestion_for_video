import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VideoAnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the key events, visual style, and actions in the video.",
    },
    songs: {
      type: Type.ARRAY,
      description: "A list of 3 song suggestions that fit the video's mood.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The title of the song." },
          artist: { type: Type.STRING, description: "The artist of the song." },
          reason: { type: Type.STRING, description: "Why this song fits the video's visual mood, pacing, or content." },
        },
        required: ["title", "artist", "reason"],
      },
    },
  },
  required: ["summary", "songs"],
};

export const analyzeVideoContent = async (
  base64Data: string,
  mimeType: string
): Promise<VideoAnalysisResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Using the requested model for complex video understanding
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "Analyze this video. Provide a concise summary of what happens and the visual style. Then, suggest 3 specific songs that would perfectly match the mood and pacing of this video as a background track.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more consistent structured data
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const result = JSON.parse(text) as VideoAnalysisResult;
    return result;

  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error;
  }
};
