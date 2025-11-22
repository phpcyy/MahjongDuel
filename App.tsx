
import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, X, Info, Maximize, Minimize } from 'lucide-react';
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
  const [showRules, setShowRules] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Initialize Game
  useEffect(() => {
    startNewGame();
    
    // Listen for fullscreen change events (e.g., user presses ESC)
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
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
      
      {/* Minimalist Header - Responsive Layout */}
      {/* Reduced height from h-14 to h-11 for mobile landscape optimization */}
      <header className="flex-none w-full h-11 md:h-16 bg-white/40 backdrop-blur-md flex items-center justify-between px-2 md:px-8 z-20 border-b border-white/30 shadow-sm">
         {/* Left: Title & Msg */}
         <div className="flex items-center gap-2 md:gap-4 w-1/4">
             {/* Hide title on LG screens (hide on phone landscape) to save space */}
             <h1 className="hidden lg:block text-lg font-bold text-slate-800 tracking-wide whitespace-nowrap">麻将棋</h1>
             <div className="text-xs text-slate-600 font-mono px-2 py-1 bg-white/60 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] md:max-w-none">
                 {msg}
             </div>
         </div>
           
         {/* Center: Scores */}
         <div className="flex gap-1 md:gap-4 items-center justify-center flex-1">
             <ScoreCard player={1} score={p1Score} isActive={currentPlayer === 1 && !gameOver} />
             <span className="text-slate-400 text-xs md:text-sm font-light">vs</span>
             <ScoreCard player={2} score={p2Score} isActive={currentPlayer === 2 && !gameOver} />
         </div>

         {/* Right: Actions */}
         <div className="flex items-center justify-end gap-0.5 md:gap-1 w-1/4">
            <button
                onClick={toggleFullScreen}
                className="
                    w-8 h-8 md:w-9 md:h-9 flex items-center justify-center
                    text-slate-600 hover:text-slate-900
                    rounded-full hover:bg-black/5
                    transition-colors
                    hidden sm:flex 
                "
                title={isFullScreen ? "退出全屏" : "全屏模式"}
            >
                {isFullScreen ? <Minimize size={18} strokeWidth={2} /> : <Maximize size={18} strokeWidth={2} />}
            </button>
            <button
                onClick={() => setShowRules(true)}
                className="
                    w-8 h-8 md:w-9 md:h-9 flex items-center justify-center
                    text-slate-600 hover:text-slate-900
                    rounded-full hover:bg-black/5
                    transition-colors
                "
                title="规则说明"
            >
                <Info size={18} strokeWidth={2} />
            </button>
            <button
                onClick={startNewGame}
                className="
                    w-8 h-8 md:w-9 md:h-9 flex items-center justify-center
                    text-slate-600 hover:text-slate-900
                    rounded-full hover:bg-black/5
                    transition-colors
                "
                title="重置游戏"
            >
                <RotateCcw size={18} strokeWidth={2} /> 
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

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowRules(false)}>
            <div className="bg-white/95 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">游戏规则</h2>
                    <button onClick={() => setShowRules(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                        <X size={22} />
                    </button>
                </div>
                <ul className="space-y-3 md:space-y-4 text-sm text-slate-600 leading-relaxed">
                    <li className="flex gap-3">
                        <span className="font-bold text-slate-800 whitespace-nowrap">1. 取牌：</span>
                        <span>只能选取每列<span className="font-bold text-amber-700">最上方</span>或<span className="font-bold text-amber-700">最下方</span>的牌。</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold text-slate-800 whitespace-nowrap">2. 连击：</span>
                        <span>当一张牌被选中后，露出的新牌也可以立即参与匹配。</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold text-slate-800 whitespace-nowrap">3. 消除：</span>
                        <span>选中两张花色与点数相同的牌即可消除。</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold text-slate-800 whitespace-nowrap">4. 计分：</span>
                        <span>数字牌按数字计分，字牌（风、箭）每张10分。</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold text-slate-800 whitespace-nowrap">5. 胜负：</span>
                        <span>牌面清空后，总得分高者获胜。</span>
                    </li>
                </ul>
                <div className="mt-6 md:mt-8 text-center">
                    <button 
                        onClick={() => setShowRules(false)}
                        className="px-8 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                        开始游戏
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4">
                <Trophy className="text-amber-500 mx-auto mb-4" size={48} strokeWidth={1.5} />
                
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
                        font-bold py-3 px-6 rounded-lg text-sm tracking-widest uppercase
                        transition-all shadow-lg hover:shadow-xl
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
