import React, { useState, useEffect } from 'react';
import type { Participant } from '../types';
import { soundEngine } from '../utils/audio';
import { X, UserPlus, Plus, Minus, Trash2, Crown, Sparkles, Check } from 'lucide-react';

interface WheelSupporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  participant?: Participant | null;
  totalRoses: number;
  onAddParticipant: (participant: Participant) => void;
  onUpdateRoses: (id: string, delta: number) => void;
  onRemoveParticipant: (id: string) => void;
}

const QUICK_AMOUNTS = [1, 5, 10, 20, 50, 100];

export const WheelSupporterModal: React.FC<WheelSupporterModalProps> = ({
  isOpen,
  onClose,
  mode,
  participant,
  totalRoses,
  onAddParticipant,
  onUpdateRoses,
  onRemoveParticipant
}) => {
  const [nameInput, setNameInput] = useState('');
  const [rosesInput, setRosesInput] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && participant) {
        setNameInput(participant.displayName);
        setRosesInput(participant.rosesCount);
      } else {
        setNameInput('');
        setRosesInput(1);
      }
    }
  }, [isOpen, mode, participant]);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const cleanName = nameInput.trim();
    const newParticipant: Participant = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: cleanName.replace(/\s+/g, '_').toLowerCase(),
      displayName: cleanName,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
      rosesCount: Math.max(1, rosesInput),
      joinedAt: Date.now(),
      isVip: rosesInput >= 10,
      streak: 1
    };

    onAddParticipant(newParticipant);
    soundEngine.playCombo();
    onClose();
  };

  const handleSaveEdit = () => {
    if (!participant) return;
    const delta = rosesInput - participant.rosesCount;
    if (delta !== 0) {
      onUpdateRoses(participant.id, delta);
    }
    soundEngine.playRoseDrop();
    onClose();
  };

  const handleQuickBoost = (amount: number) => {
    setRosesInput(prev => prev + amount);
    soundEngine.playRoseDrop();
  };

  const handleDirectIncrement = (delta: number) => {
    setRosesInput(prev => Math.max(1, prev + delta));
    soundEngine.playTick();
  };

  const handleDelete = () => {
    if (participant) {
      onRemoveParticipant(participant.id);
      onClose();
    }
  };

  const currentChance = participant && totalRoses > 0
    ? ((participant.rosesCount / totalRoses) * 100).toFixed(1)
    : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="neo-box-lg max-w-md w-full bg-[#FFE600] p-4 sm:p-5 relative text-right overflow-hidden border-3 sm:border-4 border-black shadow-[8px_8px_0px_#000]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 left-3 neo-btn bg-white text-black p-1 cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-black text-[#FFE600] border-2 border-black neo-box-sm flex items-center justify-center shrink-0">
            {mode === 'add' ? <UserPlus className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-[#00FF66]" />}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-black m-0 leading-tight">
              {mode === 'add' ? 'إضافة داعم جديد للسحب 🌹' : 'تعديل وزيادة عملات الداعم 💎'}
            </h3>
            <p className="text-xs font-bold text-gray-800 m-0">
              {mode === 'add' ? 'أدخل اسم الداعم وحدد عدد الورود / العملات' : 'عدل رصيد الداعم أو ارفع نسبة فوزه في العجلة'}
            </p>
          </div>
        </div>

        {/* Content Body */}
        {mode === 'add' ? (
          <form onSubmit={handleAddSubmit} className="space-y-3 bg-white border-2 border-black p-3.5 neo-box-sm">
            <div>
              <label htmlFor="supporterNameInput" className="text-xs font-black text-black block mb-1">
                اسم الداعم أو يوزر تيك توك:
              </label>
              <input
                type="text"
                id="supporterNameInput"
                name="supporterName"
                required
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="مثال: فيصل العتيبي أو @user123"
                className="w-full neo-input p-2 text-xs sm:text-sm font-black bg-[#FFFDF0]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="rosesCountInput" className="text-xs font-black text-black">
                  عدد الورود / العملات الداعمة:
                </label>
                <span className="font-mono-code font-black text-xs text-[#FF2E63]">
                  {rosesInput} 🌹
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#FFFDF0] border-2 border-black p-1 neo-box-sm flex-1">
                  <button
                    type="button"
                    onClick={() => handleDirectIncrement(-1)}
                    className="w-7 h-7 bg-white border border-black flex items-center justify-center font-black cursor-pointer hover:bg-gray-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    id="rosesCountInput"
                    name="rosesCount"
                    min="1"
                    max="9999"
                    value={rosesInput}
                    onChange={(e) => setRosesInput(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-transparent text-center font-mono-code font-black text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleDirectIncrement(1)}
                    className="w-7 h-7 bg-white border border-black flex items-center justify-center font-black cursor-pointer hover:bg-gray-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Chips */}
            <div>
              <span className="text-[10px] font-black text-gray-700 block mb-1">إضافة سريعة:</span>
              <div className="grid grid-cols-6 gap-1">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setRosesInput(amt)}
                    className={`py-1 text-[11px] font-mono-code font-black border border-black neo-box-sm cursor-pointer transition-all ${
                      rosesInput === amt
                        ? 'bg-[#00FF66] text-black shadow-[2px_2px_0px_#000]'
                        : 'bg-[#FFFDF0] text-black hover:bg-gray-100'
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full neo-btn bg-[#00FF66] hover:bg-[#00e05a] text-black py-2.5 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#000] mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة الداعم للعجلة فوراً 🎡</span>
            </button>
          </form>
        ) : participant ? (
          <div className="space-y-3 bg-white border-2 border-black p-3.5 neo-box-sm">
            {/* Supporter Badge Card */}
            <div className="bg-[#FFFDF0] border-2 border-black p-2.5 neo-box-sm flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-11 h-11 bg-[#FFE600] border-2 border-black neo-box-sm overflow-hidden shrink-0">
                  <img
                    src={participant.avatarUrl}
                    alt={participant.displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${participant.username}`;
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm font-black text-black truncate">
                      {participant.displayName}
                    </span>
                    {participant.isVip && <Crown className="w-3.5 h-3.5 text-[#FF9900] fill-current shrink-0" />}
                  </div>
                  <span className="text-[10px] font-mono-code font-bold text-gray-500 block truncate">
                    @{participant.username}
                  </span>
                </div>
              </div>

              <div className="text-left shrink-0">
                <span className="bg-black text-[#00FF66] text-[10px] font-mono-code font-black px-1.5 py-0.5 neo-badge block">
                  فرصة الفوز: {currentChance}%
                </span>
                <span className="text-[10px] font-mono-code font-bold text-gray-600 mt-0.5 block">
                  الحالي: {participant.rosesCount} 🌹
                </span>
              </div>
            </div>

            {/* Quick Boost Increment Buttons */}
            <div>
              <span className="text-xs font-black text-black block mb-1">
                تزويد الورود / العملات بنقرة واحدة:
              </span>
              <div className="grid grid-cols-6 gap-1">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => handleQuickBoost(amt)}
                    className="neo-btn bg-[#FFFDF0] hover:bg-[#FFE600] text-black py-1.5 text-xs font-mono-code font-black flex items-center justify-center cursor-pointer"
                  >
                    +{amt} 🌹
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <label htmlFor="editRosesInput" className="text-xs font-black text-black block mb-1">
                إجمالي الورود / العملات الجديد:
              </label>
              <div className="flex items-center bg-[#FFFDF0] border-2 border-black p-1 neo-box-sm">
                <button
                  type="button"
                  onClick={() => handleDirectIncrement(-1)}
                  className="w-8 h-8 bg-white border border-black flex items-center justify-center font-black cursor-pointer hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  id="editRosesInput"
                  name="editRoses"
                  min="1"
                  max="9999"
                  value={rosesInput}
                  onChange={(e) => setRosesInput(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-transparent text-center font-mono-code font-black text-base outline-none text-[#FF2E63]"
                />
                <button
                  type="button"
                  onClick={() => handleDirectIncrement(1)}
                  className="w-8 h-8 bg-white border border-black flex items-center justify-center font-black cursor-pointer hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleDelete}
                className="neo-btn bg-white hover:bg-red-50 text-red-600 py-2 px-2 text-xs font-black flex items-center justify-center gap-1 cursor-pointer border-2 border-black"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف من العجلة</span>
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                className="neo-btn bg-[#00FF66] text-black py-2 px-2 text-xs font-black flex items-center justify-center gap-1 cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000]"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>حفظ التعديل</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
