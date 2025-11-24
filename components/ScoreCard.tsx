
import React from 'react';

interface ScoreCardProps {
  player: 1 | 2;
  score: number;
  isActive: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ player, score, isActive }) => {
  return (
    <div className={`
        flex flex-col md:flex-row items-center gap-0 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-md transition-all duration-300
        ${isActive 
            ? 'bg-slate-800 text-white shadow-md transform scale-105' 
            : 'bg-slate-900/5 text-slate-600'}
    `}>
      <span className={`text-[9px] md:text-xs uppercase tracking-wider ${isActive ? 'opacity-80' : 'opacity-60'}`}>
        {player === 1 ? '先手' : '后手'}
      </span>
      <span className="text-base md:text-xl font-mono font-bold leading-none">
        {score}
      </span>
    </div>
  );
};

export default ScoreCard;
