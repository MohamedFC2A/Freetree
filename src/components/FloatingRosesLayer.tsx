import React from 'react';
import type { FloatingRose } from '../types';
import { RoseIcon } from './RoseIcon';

interface FloatingRosesLayerProps {
  roses: FloatingRose[];
}

export const FloatingRosesLayer: React.FC<FloatingRosesLayerProps> = ({ roses }) => {
  if (roses.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {roses.map((rose) => (
        <div
          key={rose.id}
          className="absolute animate-float-rose flex items-center gap-1 bg-white border-2 border-black px-2 py-0.5 neo-badge shadow-[3px_3px_0px_#000]"
          style={{
            left: `${rose.x}%`,
            top: `${rose.y}%`
          }}
        >
          <RoseIcon className="w-5 h-5 text-[#FF2E63]" />
          <span className="font-mono-code font-black text-xs text-black">
            +{rose.count}
          </span>
          <span className="text-[11px] font-bold text-gray-800 truncate max-w-[90px]">
            {rose.sender}
          </span>
        </div>
      ))}
    </div>
  );
};
