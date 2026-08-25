import React, { useState } from 'react';
import type { SubscriptionItem, SubscriptionCategory } from '../types';
import { Check, Plus, Search, CheckCircle2 } from 'lucide-react';

interface SubscriptionSelectorProps {
  subscriptions: SubscriptionItem[];
  selectedPrize: SubscriptionItem;
  onSelectPrize: (prize: SubscriptionItem) => void;
  onOpenCustomModal: () => void;
}

const CATEGORIES: { id: SubscriptionCategory; labelAr: string; icon: string }[] = [
  { id: 'all', labelAr: 'جميع الاشتراكات والجوائز', icon: '🌟' },
  { id: 'ai', labelAr: 'ذكاء اصطناعي (AI)', icon: '🧠' },
  { id: 'streaming', labelAr: 'أفلام وموسيقى وبث', icon: '🎬' },
  { id: 'gaming', labelAr: 'ألعاب وجيمنج', icon: '🎮' },
  { id: 'productivity', labelAr: 'إنتاجية ومطورين', icon: '💻' },
  { id: 'custom', labelAr: 'مخصص', icon: '✨' },
];

export const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  subscriptions,
  selectedPrize,
  onSelectPrize,
  onOpenCustomModal
}) => {
  const [activeCategory, setActiveCategory] = useState<SubscriptionCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesCategory = activeCategory === 'all' || sub.category === activeCategory;
    const matchesSearch =
      sub.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full neo-box p-4 sm:p-6 bg-white space-y-5">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-3 border-black pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <h3 className="text-xl sm:text-2xl font-black text-black m-0">
              قائمة الاشتراكات والهدايا القوية
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-bold text-gray-700 m-0">
            اختر الاشتراك الذي تريد وضعه في السحب الآن، أو أضف اشتراكاً جديداً
          </p>
        </div>

        <button
          onClick={onOpenCustomModal}
          className="neo-btn bg-[#00FF66] text-black px-4 py-2 text-xs sm:text-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء اشتراك مخصص</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const count = cat.id === 'all' ? subscriptions.length : subscriptions.filter(s => s.category === cat.id).length;
            if (cat.id !== 'all' && count === 0) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`neo-btn px-3 py-1.5 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-transform ${
                  activeCategory === cat.id
                    ? 'bg-[#FFE600] text-black font-black scale-105 shadow-[4px_4px_0px_#000]'
                    : 'bg-[#FFFDF0] text-gray-800 hover:bg-gray-100 font-bold'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.labelAr}</span>
                <span className="bg-black text-white px-1.5 py-0.2 rounded-xs text-xs font-mono-code font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] sm:min-w-[260px]">
          <Search className="w-4 h-4 text-black absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن اشتراك (جيمناي، نيتفليكس...)"
            className="w-full neo-input pr-9 pl-3 py-1.5 text-xs sm:text-sm font-bold bg-[#FFFDF0]"
          />
        </div>
      </div>

      {/* Grid of Subscription Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSubscriptions.map((sub) => {
          const isSelected = selectedPrize.id === sub.id;
          return (
            <div
              key={sub.id}
              onClick={() => onSelectPrize(sub)}
              className={`neo-box p-4 cursor-pointer relative flex flex-col justify-between transition-all duration-150 group hover:-translate-y-1 ${
                isSelected
                  ? 'ring-4 ring-black shadow-[7px_7px_0px_#000] scale-[1.02]'
                  : 'hover:shadow-[6px_6px_0px_#000]'
              }`}
              style={{ backgroundColor: sub.color }}
            >
              {/* Top Row: Icon, Badge, Selected Pill */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-12 h-12 bg-white border-2 border-black neo-box-sm flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                    {sub.icon}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {isSelected && (
                      <span className="bg-black text-[#FFE600] border-2 border-black text-[11px] font-black px-2 py-0.5 flex items-center gap-1 shadow-[2px_2px_0px_#FFE600] animate-bounce">
                        <Check className="w-3.5 h-3.5" />
                        المحدد للسحب
                      </span>
                    )}
                    <span className="bg-white text-black border-2 border-black text-[10px] font-black px-1.5 py-0.5">
                      {sub.badge}
                    </span>
                  </div>
                </div>

                {/* Name & Duration */}
                <h4 className="text-base sm:text-lg font-black text-black m-0 leading-tight mb-1">
                  {sub.nameAr}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-black text-white px-2 py-0.5 text-xs font-mono-code font-black">
                    {sub.durationAr}
                  </span>
                  <span className="bg-white border border-black px-1.5 py-0.5 text-xs font-bold font-mono-code">
                    {sub.value}
                  </span>
                </div>

                <p className="text-xs font-bold text-gray-900 line-clamp-2 mb-3 leading-snug">
                  {sub.descriptionAr}
                </p>

                {/* Features Highlights */}
                <ul className="space-y-1 text-[11px] font-bold text-gray-800 border-t-2 border-black/30 pt-2 mb-3 list-none p-0">
                  {sub.features.slice(0, 2).map((f, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-black shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selection Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPrize(sub);
                }}
                className={`w-full neo-btn py-2 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-black text-white hover:bg-gray-900'
                    : 'bg-white text-black hover:bg-yellow-100'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4 text-[#FFE600]" />
                    <span>جاهز على عجلة السحب</span>
                  </>
                ) : (
                  <>
                    <span>اختيار هذا الاشتراك للسحب</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
