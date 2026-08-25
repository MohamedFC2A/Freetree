import React, { useState, useRef, useEffect } from 'react';
import type { SubscriptionItem, SubscriptionCategory } from '../types';
import { ChevronDown, ChevronUp, Plus, Sparkles, Check, Gift } from 'lucide-react';

interface SmartPrizeDropdownProps {
  subscriptions: SubscriptionItem[];
  selectedPrize: SubscriptionItem;
  onSelectPrize: (prize: SubscriptionItem) => void;
  onOpenCustomModal: () => void;
}

const CATEGORIES: { id: SubscriptionCategory; labelAr: string }[] = [
  { id: 'all', labelAr: 'الكل' },
  { id: 'ai', labelAr: 'الذكاء الاصطناعي' },
  { id: 'streaming', labelAr: 'ترفيه وأفلام' },
  { id: 'productivity', labelAr: 'تصميم وإنتاجية' },
  { id: 'gaming', labelAr: 'ألعاب وبثوث' },
  { id: 'custom', labelAr: 'مخصص' }
];

export const SmartPrizeDropdown: React.FC<SmartPrizeDropdownProps> = ({
  subscriptions,
  selectedPrize,
  onSelectPrize,
  onOpenCustomModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SubscriptionCategory>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (activeCategory === 'all') return true;
    return sub.category === activeCategory;
  });

  return (
    <div ref={dropdownRef} className="w-full relative select-none">
      {/* Clean Active Prize Showcase Card */}
      <div className="neo-box p-2.5 bg-[#FFE600] border-2 sm:border-3 border-black shadow-[3px_3px_0px_#000]">
        <div className="flex items-center justify-between gap-2">
          {/* Right: Verified Logo + Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white border-2 border-black neo-box-sm flex items-center justify-center p-1.5 shrink-0 shadow-[2px_2px_0px_#000]">
              {selectedPrize.imagePng ? (
                <img
                  src={selectedPrize.imagePng}
                  alt={selectedPrize.nameAr}
                  className="w-full h-full object-contain"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div className={`w-full h-full items-center justify-center font-black text-sm text-black ${selectedPrize.imagePng ? 'hidden' : 'flex'}`}>
                <Gift className="w-6 h-6 text-black" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-black text-[#FFE600] text-[9px] font-black px-1.5 py-0.2 neo-badge flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  الجائزة الحالية
                </span>
                <span className="bg-white text-black text-[9px] font-black px-1.5 py-0.2 neo-badge border border-black">
                  {selectedPrize.durationAr}
                </span>
                <span className="bg-[#00FF66] text-black text-[9px] font-mono-code font-black px-1.5 py-0.2 neo-badge border border-black">
                  {selectedPrize.value}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-black text-black m-0 mt-0.5 truncate leading-tight">
                {selectedPrize.nameAr}
              </h2>
            </div>
          </div>

          {/* Left: Change Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="neo-btn bg-white hover:bg-gray-100 text-black px-2.5 py-1.5 text-xs font-black flex items-center gap-1 cursor-pointer shrink-0 border-2 border-black shadow-[2px_2px_0px_#000]"
          >
            <span>تغيير الجائزة</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Clean Minimal Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 left-0 mt-1.5 bg-[#FFFDF0] border-2 sm:border-3 border-black p-2.5 neo-box-lg z-50 shadow-[6px_6px_0px_#000] animate-in fade-in zoom-in-95 duration-150 max-h-[420px] flex flex-col">
          {/* Categories Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 border-b border-black shrink-0">
            {CATEGORIES.map(cat => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2 py-1 text-[11px] font-black whitespace-nowrap neo-box-sm transition-all border border-black cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-black text-[#FFE600]'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {cat.labelAr}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCustomModal();
              }}
              className="mr-auto neo-btn bg-[#00FF66] text-black px-2 py-1 text-[11px] font-black flex items-center gap-0.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>إضافة مخصص</span>
            </button>
          </div>

          {/* Clean Grid of Subscriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0">
            {filteredSubscriptions.map(item => {
              const isSelected = selectedPrize.id === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    onSelectPrize(item);
                    setIsOpen(false);
                  }}
                  className={`text-right p-2 neo-box-sm flex items-center justify-between gap-2 transition-all border-2 border-black cursor-pointer ${
                    isSelected
                      ? 'bg-[#00FF66] shadow-[2px_2px_0px_#000]'
                      : 'bg-white hover:bg-[#FFF9C4] hover:shadow-[1px_1px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 bg-white border border-black neo-box-sm flex items-center justify-center p-1 shrink-0">
                      {item.imagePng ? (
                        <img
                          src={item.imagePng}
                          alt={item.nameAr}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Gift className="w-4 h-4 text-black" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-black truncate">
                        {item.nameAr}
                      </div>
                      <div className="text-[10px] font-bold text-gray-700 flex items-center gap-1">
                        <span>{item.durationAr}</span>
                        <span>•</span>
                        <span className="font-mono-code font-black text-black">{item.value}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 bg-black text-[#00FF66] border border-black flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
