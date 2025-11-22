
import { TileData, TileType } from './types';

// Helper to generate a unique ID
const uid = () => Math.random().toString(36).substr(2, 9);

const createTile = (type: TileType, value: number | string, label: string, points: number, color: string): TileData => ({
  id: uid(),
  type,
  value,
  label, // Label is kept for accessibility/debug, but rendering will be custom
  points,
  displayColor: color
});

const GENERATE_DECK = (): TileData[] => {
  const deck: TileData[] = [];

  // 1. Numbers (Dots, Bamboo, Characters) - 1-9, 4 copies each
  // Dots (Pin)
  for(let i=1; i<=9; i++) {
      for(let k=0; k<4; k++) deck.push(createTile('DOT', i, `${i}筒`, i, 'text-blue-600'));
  }

  // Bamboo (Sou)
  for(let i=1; i<=9; i++) {
      for(let k=0; k<4; k++) deck.push(createTile('BAMBOO', i, `${i}条`, i, 'text-green-600'));
  }

  // Characters (Man)
  // Using traditional labels for display logic if needed, but rendering will be custom
  const charLabels = ['一','二','三','四','伍','六','七','八','九'];
  for(let i=1; i<=9; i++) {
      for(let k=0; k<4; k++) deck.push(createTile('CHAR', i, charLabels[i-1], i, 'text-red-600'));
  }

  // 2. Honors (Winds, Dragons) - 4 copies each, 10 points
  const winds = [
    {v: 'East', l: '東'}, {v: 'South', l: '南'}, {v: 'West', l: '西'}, {v: 'North', l: '北'}
  ];
  winds.forEach(w => {
    for(let k=0; k<4; k++) deck.push(createTile('WIND', w.v, w.l, 10, 'text-blue-700')); // Winds are Blue in reference
  });

  const dragons = [
    {v: 'Red', l: '中', c: 'text-red-600'}, 
    {v: 'Green', l: '發', c: 'text-green-700'}, 
    {v: 'White', l: '⬜', c: 'text-blue-800'} // White is blue frame
  ];
  dragons.forEach(d => {
    for(let k=0; k<4; k++) deck.push(createTile('DRAGON', d.v, d.l, 10, d.c));
  });

  return deck;
};

export const FULL_DECK = GENERATE_DECK();
export const COLUMNS_COUNT = 17; 
