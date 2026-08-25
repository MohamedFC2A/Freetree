import React, { useEffect, useState, useRef } from 'react';
import type { Participant, SubscriptionItem, WinnerRecord } from '../types';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Copy, Check, Trash2, RotateCcw, X, Gift, Sparkles, Crown, Trophy, Timer } from 'lucide-react';
import { RoseIcon } from './RoseIcon';

interface WinnerModalProps {
  isOpen: boolean;
  winner: Participant | null;
  prize: SubscriptionItem;
  onClose: () => void;
  onRemoveWinnerFromWheel: (winnerId: string) => void;
  onReSpin: () => void;
  onSaveWinner: (record: WinnerRecord) => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  winner,
  prize,
  onClose,
  onRemoveWinnerFromWheel,
  onReSpin,
  onSaveWinner
}) => {
  const [copied, setCopied] = useState(false);
  const [claimCode, setClaimCode] = useState('');
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen && winner) {
      soundEngine.playWin();

      const generatedCode = `TIK-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setClaimCode(generatedCode);
      setCountdown(10);

      // Lightweight, high-performance confetti burst (No infinite frame loop that freezes mobile!)
      try {
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#FF5376', '#00F0FF', '#00FF66', '#B185FF'],
          disableForReducedMotion: true
        });

        // Optional gentle second burst after 1.2s
        setTimeout(() => {
          confetti({
            particleCount: 25,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#FFE600', '#FF5376', '#00F0FF', '#00FF66', '#B185FF'],
            disableForReducedMotion: true
          });
        }, 1200);
      } catch {}

      const record: WinnerRecord = {
        id: `w-${Date.now()}`,
        participant: winner,
        prize: prize,
        timestamp: Date.now(),
        claimCode: generatedCode
      };
      onSaveWinner(record);

      // Clean 10-Second Auto-Close Countdown Timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, winner, prize, onSaveWinner, onClose]);

  if (!isOpen || !winner) return null;

  const handleCopyInfo = () => {
    const text = `الفائز بالسحب: ${winner.displayName} (@${winner.username})\nالجائزة: ${prize.nameAr} (${prize.durationAr})\nعدد الورود الداعمة: ${winner.rosesCount}\nكود الاستلام: ${claimCode}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleRemoveAndClose = () => {
    onRemoveWinnerFromWheel(winner.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="neo-box-lg max-w-md w-full bg-[#FFE600] p-4 sm:p-5 relative text-center overflow-hidden border-3 sm:border-4 border-black shadow-[8px_8px_0px_#000]">
        {/* Top Countdown Progress Bar (10 Seconds) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/20 overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 10) * 100}%` }}
          />
        </div>

        {/* Close Button + Countdown Badge */}
        <div className="flex items-center justify-between mb-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="neo-btn bg-white text-black p-1 cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="bg-black text-[#FFE600] px-2 py-0.5 text-[11px] font-mono-code font-black neo-badge flex items-center gap-1">
            <Timer className="w-3 h-3 text-[#FF5376] animate-pulse" />
            <span>إغلاق تلقائي ({countdown}ث)</span>
          </div>
        </div>

        {/* Top Celebration Ribbon */}
        <div className="inline-flex items-center gap-1.5 bg-black text-white px-3.5 py-1 border-2 border-black font-black text-xs sm:text-sm neo-badge mb-2 uppercase tracking-wider transform -rotate-1 shadow-[2px_2px_0px_#000]">
          <Trophy className="w-4 h-4 text-[#FFE600]" />
          <span>مبروك! تم اختيار الفائز النهائي بالسحب</span>
          <Sparkles className="w-4 h-4 text-[#00F0FF]" />
        </div>

        {/* Winner Hero Card */}
        <div className="bg-white border-2 sm:border-3 border-black p-3.5 neo-box-sm relative my-2 space-y-2">
          {/* Winner Avatar with Crown Vector */}
          <div className="relative inline-block">
            <div className="w-16 h-16 sm:w-18 sm:h-18 bg-[#FFE600] border-3 border-black neo-box-sm mx-auto overflow-hidden">
              <img
                src={winner.avatarUrl}
                alt={winner.displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${winner.username}`;
                }}
              />
            </div>
            <div className="absolute -top-2.5 -right-2 bg-black text-[#FFE600] p-1 border-2 border-black rounded-xs shadow-[2px_2px_0px_#000]">
              <Crown className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Winner Name & TikTok Handle */}
          <div>
            <h3 className="text-lg sm:text-xl font-black text-black m-0 leading-tight">
              {winner.displayName}
            </h3>
            <span className="text-xs font-mono-code font-bold text-gray-700 block">
              @{winner.username}
            </span>
          </div>

          {/* Rose Contribution Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#FF5376] text-white border-2 border-black px-2.5 py-0.5 neo-badge text-xs shadow-[2px_2px_0px_#000]">
            <RoseIcon className="w-3.5 h-3.5 text-white" />
            <span>دعم بـ:</span>
            <span className="font-mono-code font-black text-sm">{winner.rosesCount} وردة</span>
          </div>

          {/* Won Prize Details Box */}
          <div 
            className="border-2 border-black p-2 neo-box-sm text-right space-y-1 shadow-[2px_2px_0px_#000]"
            style={{ backgroundColor: prize.color || '#FFE600' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-black flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-black" />
                الجائزة التي فاز بها:
              </span>
              <span className="bg-black text-[#FFE600] text-[10px] font-mono-code font-bold px-1.5 py-0.2">
                {prize.value}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <div className="w-9 h-9 bg-white border-2 border-black p-1 neo-box-sm flex items-center justify-center shrink-0">
                {prize.imagePng ? (
                  <img
                    src={prize.imagePng}
                    alt={prize.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Gift className="w-5 h-5 text-black" />
                )}
              </div>

              <div>
                <div className="text-xs sm:text-sm font-black text-black leading-tight">
                  {prize.nameAr}
                </div>
                <div className="text-[10px] font-bold text-gray-800">
                  {prize.durationAr}
                </div>
              </div>
            </div>
          </div>

          {/* Claim Code Box */}
          <div className="bg-[#FDFBF7] border-2 border-dashed border-black p-2 flex items-center justify-between">
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-600">كود التحقق والاستلام:</div>
              <div className="font-mono-code font-black text-xs sm:text-sm text-black tracking-wider">{claimCode}</div>
            </div>
            <button
              type="button"
              onClick={handleCopyInfo}
              className="neo-btn bg-[#00F0FF] text-black px-2 py-1 text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ البيانات'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            type="button"
            onClick={handleRemoveAndClose}
            className="neo-btn bg-[#FF5376] text-white py-2 px-2 text-xs font-black flex items-center justify-center gap-1 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف الفائز</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              setTimeout(() => onReSpin(), 200);
            }}
            className="neo-btn bg-[#00FF66] text-black py-2 px-2 text-xs font-black flex items-center justify-center gap-1 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة السحب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
