
import { TileData } from '../types';
import { FULL_DECK, COLUMNS_COUNT } from '../constants';

export const shuffleDeck = (deck: TileData[]): TileData[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const distributeTiles = (): (TileData | null)[][] => {
  // Clone and assign new IDs
  const deck = JSON.parse(JSON.stringify(FULL_DECK)).map((t: any) => ({...t, id: Math.random().toString(36).substr(2,9)}));
  const shuffled = shuffleDeck(deck);
  
  // Create exactly COLUMNS_COUNT columns (17)
  const columns: (TileData | null)[][] = Array.from({ length: COLUMNS_COUNT }, () => []);
  
  // Fill exactly 8 rows per column
  let deckIdx = 0;
  for (let col = 0; col < COLUMNS_COUNT; col++) {
    for (let row = 0; row < 8; row++) {
      if (deckIdx < shuffled.length) {
        columns[col].push(shuffled[deckIdx]);
        deckIdx++;
      } else {
        columns[col].push(null);
      }
    }
  }

  return columns;
};

export const isTileSelectable = (columns: (TileData | null)[][], tileId: string, selectedTileId?: string | null): boolean => {
  // Find where the selected tile is, if any
  let selectedCol = -1;
  let selectedRow = -1;
  if (selectedTileId) {
    for(let c=0; c<columns.length; c++) {
      const r = columns[c].findIndex(t => t && t.id === selectedTileId);
      if (r !== -1) {
        selectedCol = c;
        selectedRow = r;
        break;
      }
    }
  }

  for (let c = 0; c < columns.length; c++) {
    const col = columns[c];
    
    // Find actual bounds
    let topIndex = col.findIndex(t => t !== null);
    let bottomIndex = -1;
    for (let r = col.length - 1; r >= 0; r--) {
      if (col[r] !== null) {
        bottomIndex = r;
        break;
      }
    }

    // If column empty, skip
    if (topIndex === -1) continue;

    // Virtual removal of selected tile for availability check (Sequential Selection Rule)
    if (c === selectedCol) {
        // If selected was top, next is new top
        if (selectedRow === topIndex) {
            let newTop = -1;
            for (let r = topIndex + 1; r < col.length; r++) {
                if (col[r] !== null) {
                    newTop = r;
                    break;
                }
            }
            topIndex = newTop;
        }
        // If selected was bottom, prev is new bottom
        if (selectedRow === bottomIndex) {
             let newBottom = -1;
             for (let r = bottomIndex - 1; r >= 0; r--) {
                 if (col[r] !== null) {
                     newBottom = r;
                     break;
                 }
             }
             bottomIndex = newBottom;
        }
    }

    if (topIndex !== -1 && col[topIndex]?.id === tileId) return true;
    if (bottomIndex !== -1 && col[bottomIndex]?.id === tileId) return true;
  }
  return false;
};

export const checkMatch = (t1: TileData, t2: TileData): boolean => {
  if (t1.type === 'FLOWER' && t2.type === 'FLOWER') return true;
  return t1.type === t2.type && t1.value === t2.value;
};

export const hasMovesRemaining = (columns: (TileData | null)[][]): boolean => {
    // Get all currently selectable tiles (Layer 1)
    const layer1: TileData[] = [];
    
    // Map positions for easy lookup
    const positions = new Map<string, {c: number, r: number}>();

    columns.forEach((col, c) => {
        const topIdx = col.findIndex(t => t !== null);
        if (topIdx !== -1) {
            const t = col[topIdx]!;
            layer1.push(t);
            positions.set(t.id, {c, r: topIdx});
        }
        
        let botIdx = -1;
        for(let r=col.length-1; r>=0; r--) {
            if (col[r] !== null) {
                botIdx = r;
                break;
            }
        }
        if (botIdx !== -1 && botIdx !== topIdx) {
            const t = col[botIdx]!;
            layer1.push(t);
            positions.set(t.id, {c, r: botIdx});
        }
    });

    // For each available tile, check matches against other available tiles AND newly exposed tiles
    for (const t1 of layer1) {
        // 1. Check matches with other currently available tiles
        for (const t2 of layer1) {
            if (t1.id === t2.id) continue;
            if (checkMatch(t1, t2)) return true;
        }
        
        // 2. Check matches with tiles that would be exposed if t1 is picked
        const pos = positions.get(t1.id)!;
        const col = columns[pos.c];
        
        // If t1 is Top, check the one below it
        if (pos.r === col.findIndex(t => t !== null)) {
             for(let r=pos.r+1; r<col.length; r++) {
                 if (col[r] !== null) {
                     // This tile (col[r]) becomes available if t1 is picked
                     if (checkMatch(t1, col[r]!)) return true;
                     break; 
                 }
             }
        }
        
        // If t1 is Bottom, check the one above it
        // Recalculate bottom index to be safe
        let realBot = -1;
        for(let r=col.length-1; r>=0; r--) {
            if(col[r] !== null) { realBot = r; break; }
        }
        
        if (pos.r === realBot) {
            for(let r=pos.r-1; r>=0; r--) {
                if (col[r] !== null) {
                    if (checkMatch(t1, col[r]!)) return true;
                    break;
                }
            }
        }
    }
    
    return false;
};

export const findTileInColumns = (columns: (TileData | null)[][], id: string): { colIndex: number, rowIndex: number } | null => {
  for (let c = 0; c < columns.length; c++) {
    const r = columns[c].findIndex(t => t && t.id === id);
    if (r !== -1) return { colIndex: c, rowIndex: r };
  }
  return null;
};

export const getBoardStateString = (columns: (TileData | null)[][]): string => {
  let output = "Current Board State (Fixed 17x8 Grid):\n";
  columns.forEach((col, idx) => {
    const top = col.find(t => t !== null);
    let bottom = null;
    for (let i = col.length - 1; i >= 0; i--) {
        if (col[i] !== null) {
            bottom = col[i];
            break;
        }
    }
    
    if (!top) {
      output += `Col ${idx}: [Empty]\n`;
    } else {
      output += `Col ${idx}: Top=[${top.label} (${top.type} ${top.value})], Bottom=[${bottom?.label} (${bottom?.type} ${bottom?.value})]\n`;
    }
  });
  return output;
};
