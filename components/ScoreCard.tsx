
import React from 'react';

interface ScoreCardProps {
  player: 1 | 2;
  score: number;
  isActive: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ player, score, isActive }) => {
  return (
    <div className={`
        flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-300
        ${isActive ? 'bg-slate-800 text-white shadow-md transform scale-105' : 'text-slate-600 bg-transparent'}
    `}>
      <span className="text-xs uppercase tracking-wider opacity-80">
        {player === 1 ? '先手' : '后手'}
      </span>
      <span className="text-xl font-mono font-bold">
        {score}
      </span>
    </div>
  );
};

export default ScoreCard;