import React from 'react';
import { Radio, ShieldCheck } from 'lucide-react';
import { RoseIcon } from './RoseIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFE600] border-t-4 border-black py-3 px-3 sm:px-6 select-none mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right">
        {/* Brand info */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white border-2 border-black neo-box-sm flex items-center justify-center">
            <Radio className="w-4 h-4 text-[#FF2E63]" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-black">
              TIKFINITY LIVE WHEEL • سحوبات تيك توك المباشرة
            </div>
            <div className="text-[11px] font-bold text-gray-800">
              نظام نيوبروتاليزم ذكي متوافق 100% مع TikTok LIVE Studio و OBS Studio
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 neo-badge flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#00FF66]" />
            سحب عادل 100%
          </span>
          <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 neo-badge flex items-center gap-1">
            <RoseIcon className="w-3 h-3 text-[#FF2E63]" />
            حجم قطاع ديناميكي حسب الورود
          </span>
        </div>
      </div>
    </footer>
  );
};
