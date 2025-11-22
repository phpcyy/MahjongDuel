
import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import GameBoard from './components/GameBoard';
import ScoreCard from './components/ScoreCard';
import { distributeTiles, isTileSelectable, checkMatch, hasMovesRemaining, shuffleDeck } from './services/gameLogic';
import { TileData } from './types';
import { COLUMNS_COUNT } from './constants';

const App: React.FC = () => {
  const [columns, setColumns] = useState<(TileData | null)[][]>([]);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [msg, setMsg] = useState<string>("开始");

  // Initialize Game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setColumns(distributeTiles());
    setP1Score(0);
    setP2Score(0);
    setCurrentPlayer(1);
    setSelectedTile(null);
    setGameOver(false);
    setMsg("开始");
  };

  const checkGameState = (currentCols: (TileData | null)[][]) => {
    const allEmpty = currentCols.every(col => col.every(t => t === null));
    if (allEmpty) {
        setGameOver(true);
        setMsg("游戏结束");
        return;
    }

    if (!hasMovesRemaining(currentCols)) {
        setMsg("无解，自动洗牌");
        setTimeout(() => {
            let remaining: TileData[] = [];
            currentCols.forEach(col => {
                col.forEach(t => {
                    if (t) remaining.push(t);
                });
            });
            
            remaining = shuffleDeck(remaining);
            
            const newCols: (TileData | null)[][] = Array.from({ length: COLUMNS_COUNT }, () => []);
            let idx = 0;
            for(let c=0; c<COLUMNS_COUNT; c++) {
                for(let r=0; r<8; r++) {
                    if(idx < remaining.length) {
                        newCols[c].push(remaining[idx]);
                        idx++;
                    } else {
                        newCols[c].push(null);
                    }
                }
            }
            
            setColumns(newCols);
        }, 1000);
    }
  };

  const handleTileClick = (tile: TileData) => {
    if (gameOver) return;

    if (selectedTile?.id === tile.id) {
      setSelectedTile(null);
      return;
    }

    if (!selectedTile) {
      setSelectedTile(tile);
      return;
    }

    if (checkMatch(selectedTile, tile)) {
      const points = selectedTile.points;
      const matchMsg = `+${points}`;
      setMsg(matchMsg);

      if (currentPlayer === 1) setP1Score(prev => prev + points);
      else setP2Score(prev => prev + points);

      const newCols = columns.map(col => col.map(t => {
          if (t && (t.id === tile.id || t.id === selectedTile.id)) {
              return null;
          }
          return t;
      }));
      
      setColumns(newCols);
      setSelectedTile(null);
      setCurrentPlayer(prev => prev === 1 ? 2 : 1);
      checkGameState(newCols);

    } else {
      setMsg("不匹配");
      
      // Validation: Check if the new tile is selectable ON ITS OWN.
      // Pass null as the 3rd argument to ignore the 'currently selected tile' helper context.
      // This prevents a covered tile (which was only exposed because of selectedTile) from becoming selected itself.
      const canBeSelectedIndependently = isTileSelectable(columns, tile.id, null);
      
      if (canBeSelectedIndependently) {
        setSelectedTile(tile);
      } else {
        setSelectedTile(null);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      
      {/* Minimalist Header - Light Theme */}
      <header className="flex-none w-full h-12 bg-white/30 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-20 border-b border-white/20 shadow-sm">
         {/* Left: Title */}
         <div className="flex items-center gap-4">
             <h1 className="text-lg font-bold text-slate-800 tracking-wide">麻将棋</h1>
             <div className="text-xs text-slate-600 font-mono px-2 py-0.5 bg-white/50 rounded">
                 {msg}
             </div>
         </div>
           
         {/* Center: Scores */}
         <div className="flex gap-4 items-center absolute left-1/2 transform -translate-x-1/2">
             <ScoreCard player={1} score={p1Score} isActive={currentPlayer === 1 && !gameOver} />
             <span className="text-slate-400 text-sm font-light">vs</span>
             <ScoreCard player={2} score={p2Score} isActive={currentPlayer === 2 && !gameOver} />
         </div>

         {/* Right: Actions */}
         <div>
            <button
                onClick={startNewGame}
                className="
                    text-slate-600 hover:text-slate-900
                    p-2 rounded-full hover:bg-black/5
                    transition-colors
                "
                title="重置游戏"
            >
                <RotateCcw size={18} /> 
            </button>
         </div>
      </header>

      {/* Game Area */}
      <GameBoard 
         columns={columns} 
         selectedTileId={selectedTile?.id || null} 
         onTileClick={handleTileClick}
         isTileSelectable={(id) => isTileSelectable(columns, id, selectedTile?.id)}
      />

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
            <div className="bg-[#fdfdfd] p-8 rounded-lg shadow-2xl text-center max-w-sm w-full border-t-4 border-amber-600">
                <Trophy className="text-amber-600 mx-auto mb-4" size={40} strokeWidth={1.5} />
                
                <h2 className="text-2xl font-bold text-slate-800 mb-2">对局结束</h2>
                <p className="text-slate-500 mb-8">
                    {p1Score > p2Score ? "先手 获胜" : p2Score > p1Score ? "后手 获胜" : "平局"}
                </p>
                
                <div className="flex justify-between mb-8 px-4">
                    <div className="text-center">
                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">先手</div>
                        <div className="text-3xl font-mono text-slate-900">{p1Score}</div>
                    </div>
                    <div className="w-px bg-slate-200"></div>
                    <div className="text-center">
                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">后手</div>
                        <div className="text-3xl font-mono text-slate-900">{p2Score}</div>
                    </div>
                </div>
                
                <button
                    onClick={startNewGame}
                    className="
                        w-full bg-slate-900 hover:bg-slate-800 text-white
                        font-bold py-3 px-6 rounded-md text-sm tracking-widest uppercase
                        transition-colors shadow-lg
                    "
                >
                    再次挑战
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
