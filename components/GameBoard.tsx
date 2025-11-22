
import React from 'react';
import { TileData } from '../types';
import Tile from './Tile';

interface GameBoardProps {
  columns: (TileData | null)[][];
  selectedTileId: string | null;
  onTileClick: (tile: TileData) => void;
  isTileSelectable: (id: string) => boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ columns, selectedTileId, onTileClick, isTileSelectable }) => {
  return (
    <div className="flex-grow flex items-center justify-center overflow-auto p-4">
      <div className="
        inline-flex flex-row flex-nowrap
      ">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col flex-shrink-0">
            {col.map((tile, rowIndex) => {
                if (!tile) {
                    // Empty slot - show transparent background (showing page background)
                    return (
                        <div 
                            key={`empty-${colIndex}-${rowIndex}`}
                            className="
                                w-9 h-12 md:w-10 md:h-14 lg:w-11 lg:h-15 xl:w-12 xl:h-16
                                bg-transparent
                            "
                        />
                    );
                }

                const selectable = isTileSelectable(tile.id);
                return (
                    <Tile 
                        key={tile.id}
                        tile={tile}
                        isSelected={tile.id === selectedTileId}
                        isSelectable={selectable}
                        onClick={() => onTileClick(tile)}
                    />
                );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
