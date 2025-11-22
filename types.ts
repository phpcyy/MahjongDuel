export type TileType = 'DOT' | 'BAMBOO' | 'CHAR' | 'WIND' | 'DRAGON' | 'FLOWER';

export interface TileData {
  id: string;
  type: TileType;
  value: number | string; // 1-9 for suits, direction for winds, etc.
  label: string; // The unicode character
  points: number;
  displayColor: string; // For UI hints (red, green, blue text)
}

export interface GameState {
  columns: (TileData | null)[][]; // Grid is now columns of tiles, null represents empty space
  p1Score: number;
  p2Score: number;
  currentPlayer: 1 | 2;
  selectedTileId: string | null;
  gameOver: boolean;
  winner: 1 | 2 | 'DRAW' | null;
}

export interface AIHintResponse {
  tile1Id: string;
  tile2Id: string;
  reasoning: string;
}