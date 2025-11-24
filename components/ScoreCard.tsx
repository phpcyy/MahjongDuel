
import React from 'react';

interface ScoreCardProps {
  player: 1 | 2;
  score: number;
  isActive: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ player, score, isActive }) => {
  return (
    <div className={`
        relative
        flex flex-col md:flex-row items-center gap-0 md:gap-2 
        px-3 md:px-5 py-0.5 md:py-2
        rounded-xl transition-all duration-300 ease-out
        border-2
        ${isActive 
            ? 'bg-slate-800 border-slate-800 text-white shadow-xl scale-105 z-10' 
            : 'bg-slate-900/5 border-transparent text-slate-500 scale-95 opacity-60'}
    `}>
      {/* Visual Indicator for Active Turn */}
      {isActive && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 md:h-3.5 md:w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3.5 md:w-3.5 bg-amber-500 border-2 border-white"></span>
        </span>
      )}

      <span className={`text-[10px] md:text-xs uppercase tracking-wider font-bold whitespace-nowrap ${isActive ? 'text-amber-400' : ''}`}>
        {player === 1 ? '先手' : '后手'}
      </span>
      <span className="text-base md:text-2xl font-mono font-bold leading-none">
        {score}
      </span>
    </div>
  );
};

export default ScoreCard;
