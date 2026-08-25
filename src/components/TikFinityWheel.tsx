import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Participant, SubscriptionItem } from '../types';
import { soundEngine } from '../utils/audio';
import { Play, Shuffle, Trash2, Trophy, Crown, Timer, Sparkles } from 'lucide-react';

interface TikFinityWheelProps {
  participants: Participant[];
  activePrize?: SubscriptionItem;
  onSpinEnd: (winner: Participant) => void;
  onShuffle: () => void;
  onClear: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const NEU_COLORS = [
  '#FFE600', // Neo Lemon
  '#FF5376', // Neo Rose
  '#00F0FF', // Neo Cyan
  '#00FF66', // Neo Green
  '#B185FF', // Neo Purple
  '#FF9900', // Neo Orange
  '#4D96FF', // Neo Blue
  '#FF2E63'  // Neo Crimson
];

export const TikFinityWheel: React.FC<TikFinityWheelProps> = ({
  participants,
  onSpinEnd,
  onShuffle,
  onClear
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinSeconds, setSpinSeconds] = useState<number>(10);
  const [currentHoveredName, setCurrentHoveredName] = useState<string>('');

  // Physics animation state refs
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const isSpinningRef = useRef(false);
  const lastPegIndexRef = useRef<number>(-1);
  const animationFrameIdRef = useRef<number | null>(null);
  const [pegBounce, setPegBounce] = useState(0);

  // Calculate slice angles based on roses count
  const getSliceAngles = useCallback(() => {
    const n = participants.length;
    if (n === 0) return [];

    const totalRoses = participants.reduce((sum, p) => sum + Math.max(1, p.rosesCount), 0);
    const twoPi = 2 * Math.PI;

    let accumulated = 0;
    return participants.map((p) => {
      const weight = Math.max(1, p.rosesCount) / totalRoses;
      const angleSpan = weight * twoPi;
      const startAngle = accumulated;
      const endAngle = accumulated + angleSpan;
      const midAngle = startAngle + angleSpan / 2;
      accumulated = endAngle;

      return {
        participant: p,
        weight,
        angleSpan,
        startAngle,
        endAngle,
        midAngle
      };
    });
  }, [participants]);

  // Find slice under top pointer
  const getSelectedSliceIndex = useCallback((wheelAngle: number) => {
    const slices = getSliceAngles();
    if (slices.length === 0) return -1;

    const twoPi = 2 * Math.PI;
    const normalizedWheel = ((wheelAngle % twoPi) + twoPi) % twoPi;
    const pointerAngle = ((1.5 * Math.PI - normalizedWheel) % twoPi + twoPi) % twoPi;

    for (let i = 0; i < slices.length; i++) {
      if (pointerAngle >= slices[i].startAngle && pointerAngle < slices[i].endAngle) {
        return i;
      }
    }
    return slices.length - 1;
  }, [getSliceAngles]);

  // High-DPI Retina Crisp Draw Function
  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 36;

    ctx.clearRect(0, 0, width, height);

    const slices = getSliceAngles();

    // Empty state
    if (slices.length === 0) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFE600';
      ctx.fill();
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '900 32px "Cairo", "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('أضف داعمين للبدء', 0, 0);
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    // Draw Slices
    slices.forEach((slice, i) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, slice.startAngle, slice.endAngle);
      ctx.closePath();

      ctx.fillStyle = NEU_COLORS[i % NEU_COLORS.length];
      ctx.fill();

      ctx.lineWidth = 8;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Slice text
      ctx.save();
      ctx.rotate(slice.midAngle);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000';

      const fontSize = slice.angleSpan < 0.25 ? 20 : slice.angleSpan < 0.4 ? 24 : 28;
      ctx.font = `900 ${fontSize}px "Cairo", "Plus Jakarta Sans", sans-serif`;

      let label = slice.participant.displayName;
      if (label.length > 13) {
        label = label.substring(0, 11) + '..';
      }

      const rosesInfo = `(${slice.participant.rosesCount} 🌹)`;
      const textToRender = slice.angleSpan > 0.35 ? `${label}  ${rosesInfo}` : label;

      ctx.shadowColor = 'rgba(255,255,255,0.9)';
      ctx.shadowBlur = 4;
      ctx.fillText(textToRender, radius - 48, 0);
      ctx.shadowBlur = 0;

      ctx.restore();
    });

    // Outer Rim
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Pegs
    const totalPegs = Math.max(12, Math.min(24, slices.length * 2));
    for (let p = 0; p < totalPegs; p++) {
      const pegAngle = (p * 2 * Math.PI) / totalPegs;
      const pegX = Math.cos(pegAngle) * (radius - 10);
      const pegY = Math.sin(pegAngle) * (radius - 10);

      ctx.beginPath();
      ctx.arc(pegX, pegY, 7, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    }

    // Center Hub
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFE600';
    ctx.fill();
    ctx.lineWidth = 9;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, 2 * Math.PI);
    ctx.fillStyle = '#000000';
    ctx.fill();

    ctx.fillStyle = '#FFE600';
    ctx.font = '900 20px font-mono-code, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TIK', 0, 0);

    ctx.restore();

    // Pointer
    ctx.save();
    ctx.translate(centerX, centerY - radius + 12);

    if (pegBounce > 0) {
      ctx.rotate((Math.sin(pegBounce * 10) * 0.15));
    }

    ctx.beginPath();
    ctx.moveTo(-28, -46);
    ctx.lineTo(28, -46);
    ctx.lineTo(0, 26);
    ctx.closePath();

    ctx.fillStyle = '#FF2E63';
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -25, 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.restore();
  }, [getSliceAngles, pegBounce]);

  useEffect(() => {
    drawWheel(currentAngleRef.current);
    const idx = getSelectedSliceIndex(currentAngleRef.current);
    if (idx >= 0 && participants[idx]) {
      setCurrentHoveredName(participants[idx].displayName);
    }
  }, [drawWheel, participants, getSelectedSliceIndex]);

  const spin = () => {
    if (isSpinningRef.current || participants.length === 0) return;

    setIsSpinning(true);
    isSpinningRef.current = true;
    soundEngine.playSpinStart();

    const slices = getSliceAngles();
    const totalRoses = participants.reduce((sum, p) => sum + Math.max(1, p.rosesCount), 0);

    let randomWeight = Math.random() * totalRoses;
    let selectedWinnerIndex = 0;

    for (let i = 0; i < participants.length; i++) {
      const pRoses = Math.max(1, participants[i].rosesCount);
      if (randomWeight < pRoses) {
        selectedWinnerIndex = i;
        break;
      }
      randomWeight -= pRoses;
    }

    const winnerSlice = slices[selectedWinnerIndex];
    const twoPi = 2 * Math.PI;

    const midAngle = winnerSlice.midAngle;
    const targetOffset = (1.5 * Math.PI - midAngle + twoPi) % twoPi;

    const baseSpins = spinSeconds === 15 ? 20 : spinSeconds === 10 ? 14 : 7;
    const extraRotations = baseSpins * twoPi;

    const currentNormalized = currentAngleRef.current % twoPi;
    const delta = (targetOffset - currentNormalized + twoPi) % twoPi;

    const finalTarget = currentAngleRef.current + extraRotations + delta;
    targetAngleRef.current = finalTarget;

    const durationMs = spinSeconds * 1000;
    const startAngle = currentAngleRef.current;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      const easeOut = 1 - Math.pow(1 - progress, 4);
      const newAngle = startAngle + (finalTarget - startAngle) * easeOut;
      currentAngleRef.current = newAngle;

      const currentIdx = getSelectedSliceIndex(newAngle);
      if (currentIdx !== lastPegIndexRef.current && currentIdx >= 0) {
        lastPegIndexRef.current = currentIdx;
        soundEngine.playTick();
        setPegBounce(Date.now());
        if (participants[currentIdx]) {
          setCurrentHoveredName(participants[currentIdx].displayName);
        }
      }

      drawWheel(newAngle);

      if (progress < 1) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        currentAngleRef.current = finalTarget;
        drawWheel(finalTarget);
        setIsSpinning(false);
        isSpinningRef.current = false;

        const finalWinnerIdx = getSelectedSliceIndex(finalTarget);
        const winner = participants[finalWinnerIdx] || participants[selectedWinnerIndex];

        if (winner) {
          setCurrentHoveredName(winner.displayName);
          soundEngine.playWin();
          setTimeout(() => {
            onSpinEnd(winner);
          }, 400);
        }
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full neo-box p-3 bg-white flex flex-col justify-between gap-2.5 select-none border-2 sm:border-3 border-black shadow-[3px_3px_0px_#000]">
      {/* High Visibility Header */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 bg-[#FFE600] border-2 border-black neo-box-sm flex items-center justify-center shadow-[1px_1px_0px_#000]">
            <Trophy className="w-3.5 h-3.5 text-black" />
          </div>
          <h3 className="text-xs sm:text-sm font-black text-black m-0 leading-tight">
            عجلة السحب الحماسي
          </h3>
        </div>

        {/* Live Pointer Tag */}
        <div className="bg-black text-white px-2.5 py-0.5 neo-box-sm flex items-center gap-1.5 text-xs font-black shadow-[1px_1px_0px_#000]">
          <Crown className="w-3 h-3 text-[#FFE600] fill-current" />
          <span className="text-gray-300 text-[10px]">المؤشر:</span>
          <span className="text-[#FFE600] font-black text-xs truncate max-w-[130px]">{currentHoveredName || '---'}</span>
        </div>
      </div>

      {/* Retina HD Canvas Wheel (Guaranteed Large & Round Size) */}
      <div className="relative flex items-center justify-center py-2 shrink-0">
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          className="w-[290px] h-[290px] xs:w-[320px] xs:h-[320px] sm:w-[350px] sm:h-[350px] lg:w-[320px] lg:h-[320px] xl:w-[360px] xl:h-[360px] aspect-square drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
        />
      </div>

      {/* Action Controls */}
      <div className="space-y-2 shrink-0">
        {/* Main Spin Button */}
        <button
          type="button"
          disabled={isSpinning || participants.length === 0}
          onClick={spin}
          className={`w-full neo-btn py-3 px-3 text-sm sm:text-base font-black flex items-center justify-center gap-2 cursor-pointer transition-all border-2 sm:border-3 border-black shadow-[3px_3px_0px_#000] ${
            isSpinning
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-[#FF5376] hover:bg-[#ff3b63] text-white animate-pulse'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>
            {isSpinning
              ? `جاري السحب (${spinSeconds} ثواني)...`
              : `تدوير العجلة الآن (${spinSeconds} ثواني)`}
          </span>
          <Sparkles className="w-4 h-4 text-[#FFE600]" />
        </button>

        {/* Minimal Sub Controls */}
        <div className="grid grid-cols-4 gap-1.5">
          <div className="flex border border-black bg-white">
            {[10, 15, 5].map((sec) => (
              <button
                type="button"
                key={sec}
                disabled={isSpinning}
                onClick={() => setSpinSeconds(sec)}
                className={`flex-1 py-1.5 text-[10px] font-mono-code font-black cursor-pointer ${
                  spinSeconds === sec ? 'bg-[#FFE600] text-black shadow-[inset_0_0_0_1px_#000]' : 'hover:bg-gray-100'
                }`}
                title={`${sec} ثواني`}
              >
                {sec}s
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={isSpinning}
            onClick={() => setSpinSeconds(prev => prev === 10 ? 15 : prev === 15 ? 5 : 10)}
            className="neo-btn bg-[#FFFDF0] text-black py-1.5 px-1 text-xs font-black flex items-center justify-center gap-0.5 cursor-pointer"
          >
            <Timer className="w-3 h-3 text-[#FF2E63]" />
            <span>{spinSeconds} ث</span>
          </button>

          <button
            type="button"
            disabled={isSpinning || participants.length === 0}
            onClick={onShuffle}
            className="neo-btn bg-white text-black py-1.5 px-1 text-xs font-black flex items-center justify-center gap-0.5 cursor-pointer"
          >
            <Shuffle className="w-3 h-3" />
            <span>خلط</span>
          </button>

          <button
            type="button"
            disabled={isSpinning || participants.length === 0}
            onClick={onClear}
            className="neo-btn bg-white text-red-600 py-1.5 px-1 text-xs font-black flex items-center justify-center gap-0.5 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>مسح</span>
          </button>
        </div>
      </div>
    </div>
  );
};
