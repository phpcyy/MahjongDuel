import { GoogleGenAI, Type, Schema } from '@google/genai';
import { TileData, AIHintResponse } from '../types';
import { getBoardStateString } from './gameLogic';

// Updated to accept (TileData | null)[][]
export const getBestMove = async (columns: (TileData | null)[][]): Promise<AIHintResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const boardString = getBoardStateString(columns);

  const prompt = `
    You are a Mahjong Match master.
    Here is the current board state where tiles are arranged in a fixed 17x8 grid.
    A player can ONLY select tiles that are at the very TOP (first non-empty) or very BOTTOM (last non-empty) of a column.
    
    ${boardString}

    Task: Find the BEST available matching pair to maximize score.
    Scoring rules: 
    - Flowers: 10 points.
    - Winds/Dragons: 10 points.
    - Numbers: Face value (1-9) points.
    
    Return the IDs of the two tiles to match. If multiple pairs exist, pick the highest value one.
    Return JSON.
    
    IMPORTANT: The 'reasoning' field MUST be written in CHINESE (Simplified).
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      tile1Id: {
        type: Type.STRING,
        description: "ID of the first tile"
      },
      tile2Id: {
        type: Type.STRING,
        description: "ID of the second tile"
      },
      reasoning: {
        type: Type.STRING,
        description: "Explanation of the choice in Chinese (e.g., '匹配了两张9条，获得9分')"
      }
    },
    required: ['tile1Id', 'tile2Id', 'reasoning']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIHintResponse;
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};