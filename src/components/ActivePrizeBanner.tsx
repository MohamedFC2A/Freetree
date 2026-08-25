import React from 'react';
import type { SubscriptionItem } from '../types';
import { Sparkles, CheckCircle2, ChevronDown, Award } from 'lucide-react';

interface ActivePrizeBannerProps {
  activePrize: SubscriptionItem;
  onChangePrizeClick: () => void;
}

export const ActivePrizeBanner: React.FC<ActivePrizeBannerProps> = ({
  activePrize,
  onChangePrizeClick
}) => {
  return (
    <section className="w-full">
      <div 
        className="neo-box-lg p-4 sm:p-6 relative overflow-hidden transition-all duration-200"
        style={{ backgroundColor: activePrize.color }}
      >
        {/* Top Decorative Floating Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-3 py-1 text-xs md:text-sm font-black tracking-wide neo-badge flex items-center gap-1.5 uppercase">
              <Award className="w-4 h-4 text-[#FFE600]" />
              جائزة السحب الحالية على العجلة
            </span>
            <span className="bg-white text-black px-2.5 py-1 text-xs font-black neo-badge">
              {activePrize.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-black text-[#FFE600] px-3 py-1 font-mono-code font-black text-sm md:text-base neo-badge">
              القيمة: {activePrize.value}
            </span>
            <button
              onClick={onChangePrizeClick}
              className="neo-btn bg-white text-black px-3 py-1 text-xs md:text-sm flex items-center gap-1 hover:bg-[#FFFDF0] cursor-pointer"
            >
              <span>تغيير الجائزة</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prize Main Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Prize Icon & Name */}
          <div className="md:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-4 border-black neo-box-sm flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-[4px_4px_0px_#000]">
              {activePrize.icon}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-black m-0 leading-tight">
                  {activePrize.nameAr}
                </h2>
                <span className="bg-white border-2 border-black text-xs font-black px-2 py-0.5 shadow-[2px_2px_0px_#000]">
                  {activePrize.durationAr}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-relaxed">
                {activePrize.descriptionAr}
              </p>
            </div>
          </div>

          {/* Features Chips */}
          <div className="md:col-span-4 bg-white/90 border-3 border-black p-3 neo-box-sm">
            <div className="text-xs font-black text-black mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              أبرز مميزات هذا الاشتراك:
            </div>
            <ul className="space-y-1 text-xs font-bold text-gray-800 list-none p-0 m-0">
              {activePrize.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
