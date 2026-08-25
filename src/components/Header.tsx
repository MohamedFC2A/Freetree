import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, History, Radio, Users, SlidersHorizontal, Download, ArrowLeft } from 'lucide-react';
import { RoseIcon } from './RoseIcon';
import type { ScreenRatioMode } from '../types';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenObsMode: () => void;
  onOpenWinnersHistory: () => void;
  onOpenScreenRatioModal: () => void;
  currentScreenRatio: ScreenRatioMode;
  participantsCount: number;
  totalRosesCount: number;
  winnersCount: number;
}

const RATIO_LABELS: Record<ScreenRatioMode, string> = {
  full: 'شاشة كاملة',
  '9:16': '9:16 تيك توك',
  '1:1': '1:1 مربع',
  '16:9': '16:9 عريض',
  '4:3': '4:3 قياسي',
  dock: 'شريط جانبي'
};

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenObsMode,
  onOpenWinnersHistory,
  onOpenScreenRatioModal,
  currentScreenRatio,
  participantsCount,
  totalRosesCount,
  winnersCount
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert('لتثبيت الموقع كتطبيق على Google Chrome:\nاضغط على أيقونة التثبيت (Install) الموجودة في شريط عنوان المتصفح بالأعلى ⬆️ أو من القائمة ⠇ ثم "تثبيت التطبيق".');
    }
  };

  return (
    <header className="w-full bg-[#FFE600] border-b-2 sm:border-b-3 border-black select-none sticky top-0 z-30 shadow-[0_2px_0px_#000]">
      {/* Visual 1-2-3 Stream Hook Strip (فهم فكرة البث في ثانية واحدة) */}
      <div className="bg-black text-white py-1 px-3 border-b border-black overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs font-black">
          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            {/* Step 1 */}
            <div className="flex items-center gap-1 text-[#FFE600]">
              <span className="w-4 h-4 bg-[#FFE600] text-black font-black text-[10px] rounded-full flex items-center justify-center shrink-0">1</span>
              <span>أرسل وردة 🌹</span>
            </div>

            <ArrowLeft className="w-3 h-3 text-gray-500 hidden xs:inline" />

            {/* Step 2 */}
            <div className="flex items-center gap-1 text-[#00FF66]">
              <span className="w-4 h-4 bg-[#00FF66] text-black font-black text-[10px] rounded-full flex items-center justify-center shrink-0">2</span>
              <span>اسمك يكبر بالعجلة 🎡</span>
            </div>

            <ArrowLeft className="w-3 h-3 text-gray-500 hidden sm:inline" />

            {/* Step 3 */}
            <div className="hidden sm:flex items-center gap-1 text-[#00F0FF]">
              <span className="w-4 h-4 bg-[#00F0FF] text-black font-black text-[10px] rounded-full flex items-center justify-center shrink-0">3</span>
              <span>السهم يختار الفائز 🎁</span>
            </div>
          </div>

          <div className="text-[10px] font-mono-code font-black text-[#FF5376] bg-white/10 px-2 py-0.2 rounded-xs">
            سحب عادل 100%
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="w-full px-2.5 sm:px-3 py-1.5 flex items-center justify-between gap-1.5">
        {/* Brand */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white border-2 border-black neo-box-sm flex items-center justify-center shadow-[1px_1px_0px_#000]">
            <Radio className="w-3.5 h-3.5 text-[#FF2E63] animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm font-black tracking-tight text-black font-mono-code">
            TIKFINITY
          </span>
          <span className="bg-[#FF2E63] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 neo-badge">
            LIVE
          </span>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="bg-white border-2 border-black px-2 py-0.5 neo-box-sm flex items-center gap-1 shadow-[1px_1px_0px_#000]" title="الداعمين">
            <Users className="w-3 h-3 text-black" />
            <span className="font-mono-code font-black text-xs text-black">{participantsCount}</span>
            <span className="text-[10px] font-bold text-gray-600 hidden xs:inline">داعم</span>
          </div>

          <div className="bg-[#FF5376] text-white border-2 border-black px-2 py-0.5 neo-box-sm flex items-center gap-1 shadow-[1px_1px_0px_#000]" title="إجمالي الورود">
            <RoseIcon className="w-3 h-3 text-white" />
            <span className="font-mono-code font-black text-xs">{totalRosesCount}</span>
            <span className="text-[10px] font-bold text-white/90 hidden xs:inline">وردة</span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleInstallApp}
            className="neo-btn bg-[#00FF66] text-black px-2 py-1 text-[10px] sm:text-[11px] font-black flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_#000]"
            title="تثبيت التطبيق على جهازك"
          >
            <Download className="w-3 h-3 text-black" />
            <span className="hidden sm:inline">تثبيت التطبيق</span>
            <span className="sm:hidden">تثبيت</span>
          </button>

          <button
            type="button"
            onClick={onOpenScreenRatioModal}
            className="neo-btn bg-[#00F0FF] text-black px-2 py-1 text-[10px] sm:text-[11px] font-black flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_#000]"
            title="تغيير مقاس الشاشة"
          >
            <SlidersHorizontal className="w-3 h-3 text-black" />
            <span className="hidden md:inline">المقاس:</span>
            <span className="bg-black text-[#FFE600] px-1 py-0.2 text-[9px] font-mono-code rounded-xs">
              {RATIO_LABELS[currentScreenRatio] || 'كامل'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenWinnersHistory}
            className="neo-btn bg-white text-black px-2 py-1 text-[10px] sm:text-[11px] font-black flex items-center gap-1 cursor-pointer"
            title="سجل الفائزين"
          >
            <History className="w-3 h-3 text-black" />
            <span className="hidden md:inline">السجل</span>
            {winnersCount > 0 && (
              <span className="bg-black text-[#FFE600] px-1 text-[8px] font-mono-code rounded-xs">
                {winnersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenObsMode}
            className="neo-btn bg-white text-black px-1.5 py-1 text-[10px] sm:text-[11px] font-black flex items-center gap-0.5 cursor-pointer"
            title="الربط مع الاستوديو"
          >
            <Radio className="w-3 h-3" />
            <span className="hidden md:inline">الاستوديو</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="neo-btn bg-white text-black p-1 cursor-pointer"
            title={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-black" />}
          </button>
        </div>
      </div>
    </header>
  );
};
