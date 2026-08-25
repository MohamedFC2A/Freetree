import React, { useState } from 'react';
import type { Participant } from '../types';
import { UserPlus, Plus, Minus, Trash2, Users, ClipboardList, Sparkles, RotateCcw, Crown } from 'lucide-react';
import { RoseIcon } from './RoseIcon';

interface CleanSupportersManagerProps {
  participants: Participant[];
  onAddParticipant: (participant: Participant) => void;
  onRemoveParticipant: (id: string) => void;
  onUpdateRoses: (id: string, delta: number) => void;
  onBulkAdd: (names: string[]) => void;
  onClearAll: () => void;
  onResetDefaults: () => void;
}

const QUICK_ROSES = [1, 5, 10, 20, 50];

export const CleanSupportersManager: React.FC<CleanSupportersManagerProps> = ({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onUpdateRoses,
  onBulkAdd,
  onClearAll,
  onResetDefaults
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [rosesInput, setRosesInput] = useState(1);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const totalRoses = participants.reduce((sum, p) => sum + p.rosesCount, 0);

  // Sorted list for rank calculation
  const sortedByRoses = [...participants].sort((a, b) => b.rosesCount - a.rosesCount);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    const cleanName = usernameInput.trim();
    const newParticipant: Participant = {
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      username: cleanName.replace(/\s+/g, '_').toLowerCase(),
      displayName: cleanName,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
      rosesCount: Math.max(1, rosesInput),
      joinedAt: Date.now(),
      isVip: rosesInput >= 10,
      streak: 1
    };

    onAddParticipant(newParticipant);
    setUsernameInput('');
    setRosesInput(1);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length > 0) {
      onBulkAdd(lines);
      setBulkText('');
      setIsBulkOpen(false);
    }
  };

  return (
    <div className="w-full h-full neo-box p-3 bg-white flex flex-col justify-between gap-2 select-none border-2 sm:border-3 border-black shadow-[3px_3px_0px_#000] overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 bg-[#00FF66] border-2 border-black neo-box-sm flex items-center justify-center shadow-[1px_1px_0px_#000]">
            <Users className="w-3.5 h-3.5 text-black" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-black m-0 leading-tight">
              ترتيب الداعمين ونسبة الفوز
            </h3>
            <p className="text-[10px] font-bold text-gray-700 m-0">
              {participants.length} داعم • {totalRoses} وردة 🌹
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsBulkOpen(!isBulkOpen)}
            className="neo-btn bg-[#FFE600] text-black px-2 py-1 text-[11px] font-black flex items-center gap-1 cursor-pointer"
            title="لصق عدة أسماء دفعة واحدة"
          >
            <ClipboardList className="w-3 h-3" />
            <span>لصق</span>
          </button>

          <button
            type="button"
            onClick={onResetDefaults}
            className="neo-btn bg-white text-black p-1 cursor-pointer"
            title="إعادة تعيين افتراضي"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="neo-btn bg-white text-red-600 p-1 cursor-pointer"
            title="مسح الكل"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bulk Add Textarea Collapsible */}
      {isBulkOpen && (
        <form onSubmit={handleBulkSubmit} className="bg-[#FFFDF0] p-2 border-2 border-black neo-box-sm space-y-1.5 shrink-0 animate-in fade-in duration-150">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="اكتب أو الصق الأسماء (اسم في كل سطر)..."
            rows={2}
            className="w-full text-xs font-bold p-1.5 border-2 border-black bg-white outline-none resize-none"
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsBulkOpen(false)}
              className="neo-btn bg-white text-black px-2 py-0.5 text-[10px] font-black cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="neo-btn bg-[#00FF66] text-black px-2.5 py-0.5 text-[10px] font-black cursor-pointer"
            >
              إضافة الكل
            </button>
          </div>
        </form>
      )}

      {/* Single Add Input Bar */}
      <form onSubmit={handleAdd} className="space-y-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="اسم الداعم أو حسابه..."
              className="w-full bg-[#FFFDF0] border-2 border-black px-2.5 py-1.5 text-xs font-black text-black placeholder-gray-500 outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center bg-[#FFFDF0] border-2 border-black px-2 py-1.5 gap-1 shrink-0">
            <RoseIcon className="w-3.5 h-3.5 text-[#FF5376]" />
            <input
              type="number"
              min="1"
              max="999"
              value={rosesInput}
              onChange={(e) => setRosesInput(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-8 text-center font-mono-code font-black text-xs bg-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            className="neo-btn bg-[#00FF66] text-black px-3 py-1.5 text-xs font-black flex items-center gap-1 cursor-pointer shrink-0 border-2 border-black shadow-[2px_2px_0px_#000]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>تسجيل</span>
          </button>
        </div>

        {/* Quick Roses Presets Strip */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-black text-gray-700">ورود سريعة:</span>
          <div className="flex items-center gap-1">
            {QUICK_ROSES.map(num => (
              <button
                type="button"
                key={num}
                onClick={() => setRosesInput(num)}
                className={`px-1.5 py-0.5 text-[10px] font-mono-code font-black border border-black cursor-pointer neo-box-sm transition-all ${
                  rosesInput === num
                    ? 'bg-[#FFE600] text-black shadow-[1px_1px_0px_#000]'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                +{num} 🌹
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Supporters List (Internal Scroll with Rank Badges) */}
      <div className="flex-1 min-h-0 bg-[#FFFDF0] border-2 border-black p-1.5 neo-box-sm overflow-y-auto space-y-1">
        {participants.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <Sparkles className="w-6 h-6 text-gray-400 mb-1" />
            <p className="text-xs font-black text-gray-600 m-0">
              لا يوجد داعمين حالياً. أضف أسماء أو ابدأ البث!
            </p>
          </div>
        ) : (
          participants.map((p) => {
            const chance = totalRoses > 0 ? ((p.rosesCount / totalRoses) * 100).toFixed(1) : '0';
            const rankIndex = sortedByRoses.findIndex(item => item.id === p.id);
            const isTop1 = rankIndex === 0;
            const isTop2 = rankIndex === 1;
            const isTop3 = rankIndex === 2;

            return (
              <div
                key={p.id}
                className={`border border-black p-1.5 neo-box-sm flex items-center justify-between gap-1.5 transition-all ${
                  isTop1
                    ? 'bg-[#FFF9C4] border-2 shadow-[2px_2px_0px_#000]'
                    : 'bg-white hover:shadow-[1px_1px_0px_#000]'
                }`}
              >
                {/* User Info & Rank */}
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {isTop1 ? (
                      <span className="text-sm font-black" title="المركز الأول">🥇</span>
                    ) : isTop2 ? (
                      <span className="text-sm font-black" title="المركز الثاني">🥈</span>
                    ) : isTop3 ? (
                      <span className="text-sm font-black" title="المركز الثالث">🥉</span>
                    ) : (
                      <span className="text-[10px] font-mono-code font-black text-gray-400">
                        #{rankIndex + 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 truncate">
                        <span className="text-xs font-black text-black truncate">
                          {p.displayName}
                        </span>
                        {isTop1 && <Crown className="w-3 h-3 text-[#FF9900] shrink-0 fill-current" />}
                      </div>
                      <span className="text-[10px] font-mono-code font-black text-[#FF2E63] shrink-0">
                        {chance}%
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-gray-200 h-1 border border-black/30 mt-0.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isTop1 ? 'bg-[#FF9900]' : 'bg-[#00FF66]'
                        }`}
                        style={{ width: `${Math.max(2, parseFloat(chance))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Roses & Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex items-center bg-[#FFFDF0] border border-black px-1 py-0.5 gap-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateRoses(p.id, -1)}
                      className="w-4 h-4 bg-white border border-black text-black flex items-center justify-center text-[10px] font-black cursor-pointer hover:bg-gray-100"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="font-mono-code font-black text-[11px] text-black px-1">
                      {p.rosesCount} 🌹
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateRoses(p.id, 1)}
                      className="w-4 h-4 bg-white border border-black text-black flex items-center justify-center text-[10px] font-black cursor-pointer hover:bg-gray-100"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveParticipant(p.id)}
                    className="w-5 h-5 text-gray-400 hover:text-red-600 flex items-center justify-center cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
