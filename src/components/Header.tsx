import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, History, Radio, Users, Sparkles, SlidersHorizontal, Download } from 'lucide-react';
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
  // PWA install prompt handler

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
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        
      }
      setDeferredPrompt(null);
    } else {
      alert('لتثبيت الموقع كتطبيق على Google Chrome:\nاضغط على أيقونة التثبيت (Install) الموجودة في شريط عنوان المتصفح بالأعلى ⬆️ أو من القائمة ⠇ ثم "تثبيت التطبيق".');
    }
  };

  return (
    <header className="w-full bg-[#FFE600] border-b-2 sm:border-b-3 border-black select-none sticky top-0 z-30 shadow-[0_2px_0px_#000]">
      {/* Sleek Minimal Ticker */}
      <div className="bg-black text-white py-0.5 px-3 overflow-hidden border-b border-black">
        <div className="flex items-center justify-between text-[11px] font-black font-mono-code">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[#FFE600]">
              <Sparkles className="w-3 h-3 text-[#FFE600]" />
              سحوبات تيك توك لايف الرسمية لداعمين الورود 🌹
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-gray-300">
            <span>كل وردة = زيادة مساحة الاسم في العجلة</span>
            <span className="text-[#00FF66]">• سحب عادل 100%</span>
          </div>
        </div>
      </div>

      {/* Main Clean Header Bar */}
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

        {/* Live Clean Counters */}
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

        {/* Action Header Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* PWA Install Button */}
          <button
            type="button"
            onClick={handleInstallApp}
            className="neo-btn bg-[#00FF66] text-black px-2 py-1 text-[10px] sm:text-[11px] font-black flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_#000]"
            title="تثبيت الموقع كتطبيق على سطح المكتب أو الهاتف"
          >
            <Download className="w-3 h-3 text-black" />
            <span className="hidden sm:inline">تثبيت التطبيق</span>
            <span className="sm:hidden">تثبيت</span>
          </button>

          {/* Screen Size Selector Button */}
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

          {/* Winners History Button */}
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

          {/* LIVE Studio Guide */}
          <button
            type="button"
            onClick={onOpenObsMode}
            className="neo-btn bg-white text-black px-1.5 py-1 text-[10px] sm:text-[11px] font-black flex items-center gap-0.5 cursor-pointer"
            title="الربط مع الاستوديو"
          >
            <Radio className="w-3 h-3" />
            <span className="hidden md:inline">الاستوديو</span>
          </button>

          {/* Mute Button */}
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

