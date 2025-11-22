
import { TileData, AIHintResponse } from '../types';

// AI Feature is currently disabled in the UI.
// This stub is kept to satisfy type checking if referenced, but functionality is removed.

export const getBestMove = async (columns: (TileData | null)[][]): Promise<AIHintResponse> => {
  console.warn("AI Service is disabled");
  return {
    tile1Id: "",
    tile2Id: "",
    reasoning: "AI功能已禁用"
  };
};
