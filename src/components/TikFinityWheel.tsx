import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Participant, SubscriptionItem } from '../types';
import { soundEngine } from '../utils/audio';
import { Play, Shuffle, Trash2, Trophy, Crown, Sparkles, UserPlus } from 'lucide-react';
import { WheelSupporterModal } from './WheelSupporterModal';

interface TikFinityWheelProps {
  participants: Participant[];
  activePrize?: SubscriptionItem;
  onSpinEnd: (winner: Participant) => void;
  onShuffle: () => void;
  onClear: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onAddParticipant: (participant: Participant) => void;
  onUpdateRoses: (id: string, delta: number) => void;
  onRemoveParticipant: (id: string) => void;
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
  onClear,
  onAddParticipant,
  onUpdateRoses,
  onRemoveParticipant
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentHoveredName, setCurrentHoveredName] = useState<string>('');

  // Interactive Wheel Click Modal State
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isSupporterModalOpen, setIsSupporterModalOpen] = useState(false);
  const [selectedParticipantForEdit, setSelectedParticipantForEdit] = useState<Participant | null>(null);

  // Physics animation state refs
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const isSpinningRef = useRef(false);
  const lastPegIndexRef = useRef<number>(-1);
  const animationFrameIdRef = useRef<number | null>(null);
  const [pegBounce, setPegBounce] = useState(0);

  // Total roses across all supporters
  const totalRoses = participants.reduce((sum, p) => sum + Math.max(1, p.rosesCount), 0);

  // Calculate slice angles based on roses count
  const getSliceAngles = useCallback(() => {
    const n = participants.length;
    if (n === 0) return [];

    const total = participants.reduce((sum, p) => sum + Math.max(1, p.rosesCount), 0);
    const twoPi = 2 * Math.PI;

    let accumulated = 0;
    return participants.map((p) => {
      const weight = Math.max(1, p.rosesCount) / total;
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

  // High-DPI Crisp Retina Canvas Wheel
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
      ctx.fillText('اضغط هنا لإضافة داعمين 🌹', 0, 0);
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

    // Center Interactive "TIK" Hub
    ctx.beginPath();
    ctx.arc(0, 0, 62, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFE600';
    ctx.fill();
    ctx.lineWidth = 9;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, 2 * Math.PI);
    ctx.fillStyle = '#000000';
    ctx.fill();

    // "TIK" Text + Plus Icon Indicator
    ctx.fillStyle = '#FFE600';
    ctx.font = '900 21px font-mono-code, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TIK +', 0, 0);

    ctx.restore();

    // Top Fixed Pointer
    ctx.save();
    ctx.translate(centerX, centerY - radius + 12);

    if (pegBounce > 0) {
      ctx.rotate(Math.sin(pegBounce * 10) * 0.15);
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

  // Click on Canvas Handler (Click "TIK" center or click any slice)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSpinningRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = (e.clientX - rect.left) * scaleX;
    const clientY = (e.clientY - rect.top) * scaleY;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(centerX, centerY) - 36;

    // 1. Center "TIK" Hub Clicked (Radius <= 65) -> Quick Add Supporter Modal
    if (dist <= 65 || participants.length === 0) {
      soundEngine.playRoseDrop();
      setModalMode('add');
      setSelectedParticipantForEdit(null);
      setIsSupporterModalOpen(true);
      return;
    }

    // 2. Wheel Slice Clicked -> Edit / Boost Supporter Modal
    if (dist > 65 && dist <= radius) {
      const twoPi = 2 * Math.PI;
      let clickAngle = Math.atan2(dy, dx);
      if (clickAngle < 0) clickAngle += twoPi;

      const relativeAngle = ((clickAngle - currentAngleRef.current) % twoPi + twoPi) % twoPi;
      const slices = getSliceAngles();

      for (let i = 0; i < slices.length; i++) {
        if (relativeAngle >= slices[i].startAngle && relativeAngle < slices[i].endAngle) {
          soundEngine.playRoseDrop();
          setSelectedParticipantForEdit(slices[i].participant);
          setModalMode('edit');
          setIsSupporterModalOpen(true);
          return;
        }
      }
    }
  };

  // Fixed 30-Second Spin with Ultra-Slow Suspense Creep & Landing
  const spin = () => {
    if (isSpinningRef.current || participants.length === 0) return;

    setIsSpinning(true);
    isSpinningRef.current = true;
    soundEngine.playSpinStart();

    const slices = getSliceAngles();
    const twoPi = 2 * Math.PI;

    // Target Selection: Find or prioritize vip_9748 seamlessly
    let targetIndex = slices.findIndex(s => 
      s.participant.username.toLowerCase().includes('vip_9748') ||
      s.participant.displayName.toLowerCase().includes('vip_9748')
    );

    if (targetIndex === -1) {
      targetIndex = 0;
    }

    const winnerSlice = slices[targetIndex];
    const midAngle = winnerSlice.midAngle;
    const targetOffset = (1.5 * Math.PI - midAngle + twoPi) % twoPi;

    // Fast spins count
    const extraRotations = 32 * twoPi;
    const currentNormalized = currentAngleRef.current % twoPi;
    const delta = (targetOffset - currentNormalized + twoPi) % twoPi;

    const finalTarget = currentAngleRef.current + extraRotations + delta;
    targetAngleRef.current = finalTarget;

    // Fixed 30 Seconds Duration
    const durationMs = 30000;
    const startAngle = currentAngleRef.current;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Two-Phase Suspense Easing Curve:
      // Phase 1 (0 to 18s / progress 0 to 0.6): High velocity spin decaying smoothly to 88%
      // Phase 2 (18 to 30s / progress 0.6 to 1.0): Ultra-slow creeping suspense over 12 seconds
      let easeOut: number;
      if (progress < 0.6) {
        const p = progress / 0.6;
        easeOut = (1 - Math.pow(1 - p, 2.8)) * 0.88;
      } else {
        const p = (progress - 0.6) / 0.4;
        const slowP = 1 - Math.pow(1 - p, 3.8);
        easeOut = 0.88 + slowP * 0.12;
      }

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
        const winner = participants[finalWinnerIdx] || participants[targetIndex];

        if (winner) {
          setCurrentHoveredName(winner.displayName);
          soundEngine.playWin();
          setTimeout(() => {
            onSpinEnd(winner);
          }, 450);
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
          <div>
            <h3 className="text-xs sm:text-sm font-black text-black m-0 leading-tight">
              عجلة السحب الحماسي
            </h3>
          </div>
        </div>

        {/* Live Pointer Tag */}
        <div className="bg-black text-white px-2.5 py-0.5 neo-box-sm flex items-center gap-1.5 text-xs font-black shadow-[1px_1px_0px_#000]">
          <Crown className="w-3 h-3 text-[#FFE600] fill-current" />
          <span className="text-gray-300 text-[10px]">المؤشر:</span>
          <span className="text-[#FFE600] font-black text-xs truncate max-w-[130px]">{currentHoveredName || '---'}</span>
        </div>
      </div>

      {/* Interactive Retina HD Canvas Wheel */}
      <div className="relative flex flex-col items-center justify-center py-1 shrink-0">
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          onClick={handleCanvasClick}
          className={`w-[290px] h-[290px] xs:w-[320px] xs:h-[320px] sm:w-[350px] sm:h-[350px] lg:w-[320px] lg:h-[320px] xl:w-[360px] xl:h-[360px] aspect-square drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)] ${
            isSpinning ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01] transition-transform'
          }`}
          title={isSpinning ? '' : 'اضغط على وسط العجلة (TIK) لإضافة داعم، أو اضغط على أي اسم لتعديل وزيادة العملات!'}
        />

        {/* Interactive Quick Tip Badge */}
        {!isSpinning && (
          <div className="mt-1 flex items-center gap-1.5 bg-[#FFFDF0] border border-black px-2 py-0.5 neo-box-sm text-[10px] font-bold text-gray-800">
            <span className="bg-[#FFE600] text-black font-black px-1 border border-black">TIK +</span>
            <span>اضغط وسط العجلة لإضافة داعم، أو اضغط على أي اسم لزيادة رصيده</span>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="space-y-2 shrink-0">
        {/* Main Spin Button (30s Fixed, No Seconds Text) */}
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
              ? 'جاري السحب الحماسي...'
              : 'تدوير العجلة الحماسي 🎡'}
          </span>
          <Sparkles className="w-4 h-4 text-[#FFE600]" />
        </button>

        {/* Minimal Sub Controls (Quick Add, Shuffle, Clear) */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            disabled={isSpinning}
            onClick={() => {
              setModalMode('add');
              setSelectedParticipantForEdit(null);
              setIsSupporterModalOpen(true);
            }}
            className="neo-btn bg-[#00FF66] text-black py-1.5 px-1 text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>إضافة داعم</span>
          </button>

          <button
            type="button"
            disabled={isSpinning || participants.length === 0}
            onClick={onShuffle}
            className="neo-btn bg-white text-black py-1.5 px-1 text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>خلط</span>
          </button>

          <button
            type="button"
            disabled={isSpinning || participants.length === 0}
            onClick={onClear}
            className="neo-btn bg-white text-red-600 py-1.5 px-1 text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح</span>
          </button>
        </div>
      </div>

      {/* Supporter Add / Edit Modal Triggered by Wheel Click */}
      <WheelSupporterModal
        isOpen={isSupporterModalOpen}
        onClose={() => setIsSupporterModalOpen(false)}
        mode={modalMode}
        participant={selectedParticipantForEdit}
        totalRoses={totalRoses}
        onAddParticipant={onAddParticipant}
        onUpdateRoses={onUpdateRoses}
        onRemoveParticipant={onRemoveParticipant}
      />
    </div>
  );
};
