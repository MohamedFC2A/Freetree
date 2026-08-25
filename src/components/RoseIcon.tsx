import React from 'react';

interface RoseIconProps {
  className?: string;
  size?: number;
}

export const RoseIcon: React.FC<RoseIconProps> = ({ className = 'w-4 h-4 text-[#FF2E63]', size }) => {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block ${className}`}
    >
      {/* Rose Petals & Bloom */}
      <path
        d="M12 4c-1.5-1.5-4-1-5 1s0 4 2 5c-2 0-4 1.5-4 3.5s2 3.5 4 3.5c-1 2 0 4 2 4 2.5 0 4.5-2 5-4.5.5 2.5 2.5 4.5 5 4.5 2 0 3-2 2-4 2 0 4-1.5 4-3.5S21 10 19 10c2-1 3-3 2-5s-3.5-2.5-5-1c-1-1.5-3-1.5-4 0z"
        fill="#FF2E63"
        stroke="#000000"
      />
      {/* Rose Inner Swirl */}
      <path
        d="M12 7.5c-1 0-1.8.8-1.8 1.8 0 1.2 1.3 1.8 2.2 1.2.8-.5.8-1.5.2-2.2-.4-.5-1.2-.5-1.6 0"
        stroke="#FFFFFF"
        strokeWidth="1.8"
      />
      {/* Stem & Leaf */}
      <path d="M12 18v4" stroke="#000000" strokeWidth="2.5" />
      <path d="M12 19c-2 .5-3.5 2-3.5 2" stroke="#00FF66" strokeWidth="2.5" />
    </svg>
  );
};
