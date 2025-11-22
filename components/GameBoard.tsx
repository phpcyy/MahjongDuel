
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
    <div className="flex-grow flex flex-col overflow-hidden relative w-full">
      {/* Scroll Container */}
      <div className="
        flex-grow 
        overflow-auto 
        flex 
        items-start md:items-center 
        justify-start md:justify-center 
        px-2 py-2 md:px-4 md:py-4
        no-scrollbar
      "
      style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="
          inline-flex flex-row flex-nowrap 
          mx-auto md:mx-0
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
    </div>
  );
};

export default GameBoard;
