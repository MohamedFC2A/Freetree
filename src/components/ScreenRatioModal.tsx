import React from 'react';
import type { ScreenRatioMode } from '../types';
import { X, Check, Monitor, Smartphone, Square, Tv, Sidebar, Sparkles } from 'lucide-react';

interface ScreenRatioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: ScreenRatioMode;
  onSelectMode: (mode: ScreenRatioMode) => void;
}

interface RatioItem {
  id: ScreenRatioMode;
  titleAr: string;
  badge: string;
  dimensions: string;
  descAr: string;
  icon: React.ReactNode;
}

const RATIOS: RatioItem[] = [
  {
    id: 'full',
    titleAr: 'لوحة تحكم كاملة (عرض ذكي بدون سكرول)',
    badge: 'موصى به للكمبيوتر',
    dimensions: 'Fit Screen (100%)',
    descAr: 'يملأ الشاشة بالكامل بدون أي سكرول، وموزع يميناً ويساراً بتوازن تام.',
    icon: <Monitor className="w-5 h-5 text-black" />
  },
  {
    id: '9:16',
    titleAr: 'عمودي تيك توك لايف (TikTok LIVE Studio)',
    badge: 'الأشهر للبث',
    dimensions: '9:16 (1080×1920)',
    descAr: 'تصميم رأسي مخصص لشاشات الهواتف ومناسب لوضعه داخل استوديو تيك توك.',
    icon: <Smartphone className="w-5 h-5 text-[#FF2E63]" />
  },
  {
    id: '1:1',
    titleAr: 'مربع ستوديو (Square Box)',
    badge: '1:1 متناسق',
    dimensions: '1:1 (800×800)',
    descAr: 'شاشة مربعة متناسقة ومثالية لوضعها كأوفربلاي عائم داخل OBS أو Live Studio.',
    icon: <Square className="w-5 h-5 text-[#00F0FF]" />
  },
  {
    id: '16:9',
    titleAr: 'عرض سينمائي عريض (Widescreen)',
    badge: '16:9',
    dimensions: '16:9 (1920×1080)',
    descAr: 'أبعاد أفقية سينمائية تناسب شاشات البث الكبيرة ويوتيوب وتويتش.',
    icon: <Tv className="w-5 h-5 text-[#00FF66]" />
  },
  {
    id: '4:3',
    titleAr: 'شاشة أفقية قياسية (Standard 4:3)',
    badge: '4:3',
    dimensions: '4:3 (1024×768)',
    descAr: 'عرض مدمج متوازن للشاشات المتوسطة والأجهزة اللوحية.',
    icon: <Tv className="w-5 h-5 text-[#FFE600]" />
  },
  {
    id: 'dock',
    titleAr: 'شريط جانبي للبث (OBS / Dock Sidebar)',
    badge: 'شريط جانبي',
    dimensions: '9:20 (360×800)',
    descAr: 'شريط جانبي نحيف يمكن تثبيته كلوحة فرعية بجانب الكاميرا أو الشات.',
    icon: <Sidebar className="w-5 h-5 text-[#B185FF]" />
  }
];

export const ScreenRatioModal: React.FC<ScreenRatioModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="neo-box-lg max-w-lg w-full bg-[#FFE600] p-4 sm:p-5 relative text-right border-3 sm:border-4 border-black shadow-[8px_8px_0px_#000]">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 left-3 neo-btn bg-white text-black p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-black text-[#FFE600] border-2 border-black neo-box-sm flex items-center justify-center">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-black m-0 leading-tight">
              اختيار مقاس الشاشة وطريقة العرض
            </h3>
            <p className="text-xs font-bold text-gray-800 m-0">
              اختر الأبعاد المناسبة لبثك المباشر أو شاشة جهازك
            </p>
          </div>
        </div>

        {/* List of Aspect Ratios */}
        <div className="space-y-2 bg-white border-2 sm:border-3 border-black p-3 neo-box-sm max-h-[460px] overflow-y-auto">
          {RATIOS.map((item) => {
            const isSelected = currentMode === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  onSelectMode(item.id);
                  onClose();
                }}
                className={`w-full text-right p-2.5 neo-box-sm flex items-center justify-between gap-2.5 transition-all border-2 border-black cursor-pointer ${
                  isSelected
                    ? 'bg-[#00FF66] shadow-[3px_3px_0px_#000] ring-2 ring-black'
                    : 'bg-[#FFFDF0] hover:bg-[#FFF9C4] hover:shadow-[2px_2px_0px_#000]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 bg-white border-2 border-black neo-box-sm flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-black">
                        {item.titleAr}
                      </span>
                      <span className="bg-black text-white text-[9px] font-mono-code font-black px-1.5 py-0.2 neo-badge">
                        {item.dimensions}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-700 m-0 mt-0.5 leading-snug">
                      {item.descAr}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <div className="w-6 h-6 bg-black text-[#00FF66] border border-black flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-gray-500">
                      تطبيق
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="mt-2.5 flex items-center gap-1 text-[11px] font-black text-black">
          <Sparkles className="w-3.5 h-3.5 text-[#FF2E63]" />
          <span>يتم حفظ مقاس الشاشة المختار تلقائياً في المتصفح.</span>
        </div>
      </div>
    </div>
  );
};
