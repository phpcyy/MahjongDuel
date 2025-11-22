
import React from 'react';
import { TileData } from '../types';

interface TileProps {
  tile: TileData;
  isSelected: boolean;
  isSelectable: boolean;
  onClick: () => void;
}

// Reference Image Colors
const C_RED = "#d62b2b";   // Rich Red
const C_GREEN = "#007d45"; // Deep Jade Green
const C_BLUE = "#1a4499";  // Royal Blue
const C_BLACK = "#1a1a1a";

// Helper for Dots
interface DotProps {
  cx: number;
  cy: number;
  color: string;
  type?: 'solid' | 'ring' | 'spiral';
}

const Dot: React.FC<DotProps> = ({ cx, cy, color, type = 'solid' }) => {
    if (type === 'spiral') {
      return (
          <g>
              <circle cx={cx} cy={cy} r={26} stroke={C_BLUE} strokeWidth={2} fill="none" />
              <circle cx={cx} cy={cy} r={20} stroke={C_GREEN} strokeWidth={3} fill="none" />
              <circle cx={cx} cy={cy} r={14} stroke={C_RED} strokeWidth={3} fill="none" />
              <circle cx={cx} cy={cy} r={6} fill={C_RED} />
          </g>
      )
    }
    return (
      <g>
          <circle cx={cx} cy={cy} r={8} fill="white" stroke={color} strokeWidth={0} />
          <circle cx={cx} cy={cy} r={7} fill="none" stroke={color} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={4} fill={color} />
      </g>
    );
}

const Tile: React.FC<TileProps> = ({ tile, isSelected, isSelectable, onClick }) => {

  // Render Dots (Pin) matching the reference image
  const renderDots = (value: number) => {
    const coords: {x: number, y: number, c: string}[] = [];

    switch (value) {
      case 1:
        return (
          <svg viewBox="0 0 64 80" className="w-full h-full p-1">
             <Dot cx={32} cy={40} color={C_RED} type="spiral" />
          </svg>
        );
      case 2:
        // Top Blue, Bottom Green
        coords.push({ x: 32, y: 20, c: C_BLUE });
        coords.push({ x: 32, y: 60, c: C_GREEN });
        break;
      case 3:
        // Diag: TopLeft Blue, Mid Red, BotRight Green
        coords.push({ x: 16, y: 16, c: C_BLUE });
        coords.push({ x: 32, y: 40, c: C_RED });
        coords.push({ x: 48, y: 64, c: C_GREEN });
        break;
      case 4:
        // Top Row Blue, Bottom Row Green
        coords.push({ x: 20, y: 20, c: C_BLUE });
        coords.push({ x: 44, y: 20, c: C_BLUE });
        coords.push({ x: 20, y: 60, c: C_GREEN });
        coords.push({ x: 44, y: 60, c: C_GREEN });
        break;
      case 5:
        // Corners Blue, Center Red
        coords.push({ x: 16, y: 16, c: C_BLUE });
        coords.push({ x: 48, y: 16, c: C_BLUE });
        coords.push({ x: 32, y: 40, c: C_RED });
        coords.push({ x: 16, y: 64, c: C_BLUE });
        coords.push({ x: 48, y: 64, c: C_BLUE });
        break;
      case 6:
        // Top Green, Bottom Red
        coords.push({ x: 20, y: 20, c: C_GREEN });
        coords.push({ x: 44, y: 20, c: C_GREEN });
        
        coords.push({ x: 20, y: 45, c: C_RED });
        coords.push({ x: 44, y: 45, c: C_RED });
        coords.push({ x: 20, y: 65, c: C_RED });
        coords.push({ x: 44, y: 65, c: C_RED });
        break;
      case 7:
        // Top Slant Green, Bottom Square Red
        coords.push({ x: 14, y: 18, c: C_GREEN });
        coords.push({ x: 32, y: 28, c: C_GREEN });
        coords.push({ x: 50, y: 38, c: C_GREEN });
        
        coords.push({ x: 20, y: 55, c: C_RED });
        coords.push({ x: 44, y: 55, c: C_RED });
        coords.push({ x: 20, y: 72, c: C_RED });
        coords.push({ x: 44, y: 72, c: C_RED });
        break;
      case 8:
        // All Blue
        [20, 44].forEach(x => {
            [20, 38, 58, 76].forEach(y => {
                coords.push({x, y, c: C_BLUE});
            })
        });
        break;
      case 9:
        // Top Blue, Mid Red, Bot Green
        [16, 32, 48].forEach(x => coords.push({ x, y: 20, c: C_BLUE }));
        [16, 32, 48].forEach(x => coords.push({ x, y: 40, c: C_RED }));
        [16, 32, 48].forEach(x => coords.push({ x, y: 60, c: C_GREEN }));
        break;
    }

    return (
      <svg viewBox="0 0 64 85" className="w-full h-full">
        {coords.map((dot, i) => (
          <Dot key={i} cx={dot.x} cy={dot.y} color={dot.c} />
        ))}
      </svg>
    );
  };

  // Render Bamboo (Sou) matching reference
  const renderBamboo = (value: number) => {
    const Stick = ({ x, y, color, rotate = 0 }: { x: number, y: number, color: string, rotate?: number }) => (
       <g transform={`rotate(${rotate} ${x} ${y})`}>
          <rect x={x - 2.5} y={y - 9} width={5} height={18} rx={2} fill={color} />
          <rect x={x - 0.5} y={y - 7} width={1} height={14} rx={0.5} fill="white" fillOpacity={0.3} />
       </g>
    );

    switch (value) {
      case 1:
        // Peacock
        return (
          <svg viewBox="0 0 64 80" className="w-full h-full p-1">
             <g transform="translate(32, 45) scale(1.1)">
               {/* Tail */}
               <path d="M0 12 Q-8 0 -12 -15" stroke={C_RED} strokeWidth={2} fill="none" />
               <path d="M0 12 Q0 -5 0 -20" stroke={C_RED} strokeWidth={2} fill="none" />
               <path d="M0 12 Q8 0 12 -15" stroke={C_RED} strokeWidth={2} fill="none" />
               {/* Body */}
               <path d="M-6 5 C-6 15 6 15 6 5 C6 -5 -6 -5 -6 5" fill={C_GREEN} />
               <circle cx={0} cy={-8} r={5} fill={C_BLUE} /> {/* Blue Head */}
               <circle cx={-2} cy={-9} r={1} fill="white" />
               <path d="M-4 -8 L-8 -6 L-4 -4 Z" fill={C_BLACK} />
               {/* Feet */}
               <path d="M-3 12 L-5 16" stroke="black" strokeWidth={1.5} />
               <path d="M3 12 L5 16" stroke="black" strokeWidth={1.5} />
             </g>
          </svg>
        );
      case 2:
        return (
          <svg viewBox="0 0 64 80" className="w-full h-full">
            <Stick x={32} y={25} color={C_BLUE} />
            <Stick x={32} y={55} color={C_GREEN} />
          </svg>
        );
      case 3:
        return (
          <svg viewBox="0 0 64 80" className="w-full h-full">
            <Stick x={32} y={20} color={C_GREEN} />
            <Stick x={20} y={55} color={C_GREEN} />
            <Stick x={44} y={55} color={C_GREEN} />
          </svg>
        );
      case 4:
        return (
          <svg viewBox="0 0 64 80" className="w-full h-full">
            <Stick x={20} y={25} color={C_GREEN} />
            <Stick x={44} y={25} color={C_GREEN} />
            <Stick x={20} y={55} color={C_GREEN} />
            <Stick x={44} y={55} color={C_GREEN} />
          </svg>
        );
      case 5:
        return (
          <svg viewBox="0 0 64 80" className="w-full h-full">
            <Stick x={16} y={25} color={C_GREEN} />
            <Stick x={48} y={25} color={C_GREEN} />
            <Stick x={32} y={40} color={C_RED} rotate={0} />
            <Stick x={16} y={55} color={C_GREEN} />
            <Stick x={48} y={55} color={C_GREEN} />
          </svg>
        );
      case 6:
        return (
          <svg viewBox="0 0 64 80" className="w-full h-full">
            <Stick x={20} y={25} color={C_GREEN} />
            <Stick x={32} y={25} color={C_GREEN} />
            <Stick x={44} y={25} color={C_GREEN} />
            <Stick x={20} y={55} color={C_GREEN} />
            <Stick x={32} y={55} color={C_GREEN} />
            <Stick x={44} y={55} color={C_GREEN} />
          </svg>
        );
      case 7:
        return (
          <svg viewBox="0 0 64 80" className="w-full h-full">
            {/* Top Red */}
            <Stick x={32} y={15} color={C_RED} />
            {/* Middle Green */}
            <Stick x={18} y={38} color={C_GREEN} />
            <Stick x={32} y={38} color={C_GREEN} />
            <Stick x={46} y={38} color={C_GREEN} />
            {/* Bottom Green */}
            <Stick x={20} y={62} color={C_GREEN} />
            <Stick x={44} y={62} color={C_GREEN} />
          </svg>
        );
      case 8:
        // M / W shape
        return (
          <svg viewBox="0 0 64 80" className="w-full h-full">
            <Stick x={12} y={25} color={C_GREEN} rotate={18} />
            <Stick x={26} y={25} color={C_GREEN} rotate={-18} />
            <Stick x={38} y={25} color={C_GREEN} rotate={18} />
            <Stick x={52} y={25} color={C_GREEN} rotate={-18} />
            
            <Stick x={12} y={55} color={C_GREEN} rotate={-18} />
            <Stick x={26} y={55} color={C_GREEN} rotate={18} />
            <Stick x={38} y={55} color={C_GREEN} rotate={-18} />
            <Stick x={52} y={55} color={C_GREEN} rotate={18} />
          </svg>
        );
      case 9:
        return (
          <svg viewBox="0 0 64 80" className="w-full h-full">
             <Stick x={16} y={20} color={C_GREEN} />
             <Stick x={32} y={20} color={C_RED} />
             <Stick x={48} y={20} color={C_GREEN} />

             <Stick x={16} y={40} color={C_GREEN} />
             <Stick x={32} y={40} color={C_RED} />
             <Stick x={48} y={40} color={C_GREEN} />

             <Stick x={16} y={60} color={C_GREEN} />
             <Stick x={32} y={60} color={C_RED} />
             <Stick x={48} y={60} color={C_GREEN} />
          </svg>
        );
      default: return null;
    }
  };

  const renderCharacter = () => {
      // Characters (Man) - Split colors: Blue Number, Red 'Wan'
      if (tile.type === 'CHAR') {
          return (
              <div className="flex flex-col items-center justify-center h-full -space-y-1">
                  <span className="text-xl md:text-2xl font-serif font-bold" style={{ color: C_BLUE, fontFamily: 'KaiTi, STKaiti, serif' }}>
                      {tile.label}
                  </span>
                  <span className="text-xl md:text-2xl font-serif font-bold" style={{ color: C_RED, fontFamily: 'KaiTi, STKaiti, serif' }}>
                      萬
                  </span>
              </div>
          )
      }
      
      // Winds - Blue
      if (tile.type === 'WIND') {
          return (
            <div className="flex items-center justify-center h-full">
                <span className="text-3xl md:text-4xl font-serif font-bold" style={{ color: C_BLUE, fontFamily: 'KaiTi, STKaiti, serif' }}>
                    {tile.label}
                </span>
            </div>
          )
      }

      // Dragons
      if (tile.type === 'DRAGON') {
          if (tile.value === 'White') {
             return (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[70%] h-[75%] border-[3px] border-[#1a4499] rounded-sm" />
                </div>
             );
          }
          const color = tile.value === 'Red' ? C_RED : C_GREEN;
          return (
            <div className="flex items-center justify-center h-full">
                <span className="text-3xl md:text-4xl font-serif font-bold" style={{ color: color, fontFamily: 'KaiTi, STKaiti, serif' }}>
                    {tile.label}
                </span>
            </div>
          )
      }
  }

  const renderTileContent = () => {
    if (['CHAR', 'WIND', 'DRAGON'].includes(tile.type)) {
        return renderCharacter();
    }

    const val = typeof tile.value === 'number' ? tile.value : 1;
    if (tile.type === 'DOT') return renderDots(val);
    if (tile.type === 'BAMBOO') return renderBamboo(val);
    
    return <span>{tile.label}</span>;
  };

  return (
    <div
      onClick={() => isSelectable && onClick()}
      className={`
        relative
        w-9 h-12 md:w-10 md:h-14 lg:w-11 lg:h-15 xl:w-12 xl:h-16
        flex items-center justify-center
        bg-white
        border-[0.5px] border-gray-300
        transition-colors duration-150
        ${isSelectable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}
        ${isSelected ? 'bg-amber-50' : ''}
      `}
    >
      <div className="w-full h-full p-[1px]">
        {renderTileContent()}
      </div>

      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 border-[3px] border-amber-500 pointer-events-none z-20"></div>
      )}
      
      {/* Dim Unavailable Tiles - Lighter dim to keep tiles visible but distinct */}
      {!isSelectable && !isSelected && (
        <div className="absolute inset-0 bg-black/10 pointer-events-none z-10"></div>
      )}
    </div>
  );
};

export default Tile;
