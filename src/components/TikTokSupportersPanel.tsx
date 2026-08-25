import React, { useState } from 'react';
import type { Participant } from '../types';
import { soundEngine } from '../utils/audio';
import { 
  UserPlus, 
  Trash2, 
  Search, 
  Plus, 
  Minus, 
  Upload, 
  Zap, 
  FileText
} from 'lucide-react';

interface TikTokSupportersPanelProps {
  participants: Participant[];
  onAddParticipant: (participant: Participant) => void;
  onRemoveParticipant: (id: string) => void;
  onUpdateRoses: (id: string, delta: number) => void;
  onBulkAdd: (names: string[]) => void;
  onSimulateRoseGift: (rosesCount: number, customName?: string) => void;
}

export const TikTokSupportersPanel: React.FC<TikTokSupportersPanelProps> = ({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onUpdateRoses,
  onBulkAdd,
  onSimulateRoseGift
}) => {
  const [singleName, setSingleName] = useState('');
  const [singleRoses, setSingleRoses] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [sortBy, setSortBy] = useState<'roses' | 'recent'>('roses');

  // Handle Manual Single Supporter Add
  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim()) return;

    const trimmed = singleName.trim();
    // Check if user already exists
    const existing = participants.find(
      p => p.username.toLowerCase() === trimmed.toLowerCase() || p.displayName.toLowerCase() === trimmed.toLowerCase()
    );

    if (existing) {
      onUpdateRoses(existing.id, singleRoses);
      soundEngine.playRoseDrop();
    } else {
      const newParticipant: Participant = {
        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        username: trimmed.replace(/\s+/g, '_').toLowerCase(),
        displayName: trimmed,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmed)}`,
        rosesCount: singleRoses,
        joinedAt: Date.now(),
        isVip: singleRoses >= 10,
        streak: singleRoses >= 5 ? 2 : 1
      };
      onAddParticipant(newParticipant);
      soundEngine.playRoseDrop();
    }

    setSingleName('');
    setSingleRoses(1);
  };

  // Handle Bulk Add
  const handleBulkSubmit = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split(/[\r\n,]+/).map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      onBulkAdd(lines);
      setBulkText('');
      setIsBulkOpen(false);
      soundEngine.playCombo();
    }
  };

  // Filter and Sort Participants
  const filteredParticipants = participants
    .filter(p => 
      p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'roses') return b.rosesCount - a.rosesCount;
      return b.joinedAt - a.joinedAt;
    });

  const totalRoses = participants.reduce((sum, p) => sum + p.rosesCount, 0);

  return (
    <div className="w-full neo-box p-4 sm:p-6 bg-white space-y-5">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-3 border-black pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#FF5376] text-white border-2 border-black neo-box-sm flex items-center justify-center text-xl">
            🌹
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-black m-0 leading-tight">
              تكامل ورود تيك توك والداعمين (TikTok Live)
            </h3>
            <p className="text-xs font-bold text-gray-700 m-0">
              تسجيل تلقائي وذكي لكل من يرسل وردة 🌹 في البث المباشر
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsBulkOpen(!isBulkOpen)}
          className="neo-btn bg-[#FFE600] text-black px-3 py-1.5 text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>لصق أسماء جماعية (Bulk)</span>
        </button>
      </div>

      {/* Live Gift Buttons Simulator */}
      <div className="bg-[#FFFDF0] border-3 border-black p-3.5 neo-box-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-black">
            <Zap className="w-4 h-4 text-[#FF5376]" />
            <span>محاكي هدايا البث المباشر (TikTok Live Gifts Test):</span>
          </div>
          <span className="text-[11px] font-bold text-gray-600">اضغط لاختبار إضافة الداعمين بالورود فورياً</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* 1 Rose */}
          <button
            onClick={() => onSimulateRoseGift(1)}
            className="neo-btn bg-white hover:bg-rose-50 text-black py-2 px-2.5 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🌹</span>
            <span>+1 وردة</span>
          </button>

          {/* 5 Roses Combo */}
          <button
            onClick={() => onSimulateRoseGift(5)}
            className="neo-btn bg-[#FFE600] hover:bg-yellow-300 text-black py-2 px-2.5 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🌹x5</span>
            <span>كومبو ورود</span>
          </button>

          {/* 10 Roses Stream */}
          <button
            onClick={() => onSimulateRoseGift(10)}
            className="neo-btn bg-[#00F0FF] hover:bg-cyan-300 text-black py-2 px-2.5 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🌹x10</span>
            <span>سيل ورود VIP</span>
          </button>

          {/* 50 Roses Galaxy Storm */}
          <button
            onClick={() => onSimulateRoseGift(50)}
            className="neo-btn bg-[#FF5376] text-white py-2 px-2.5 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#000]"
          >
            <span>🌹x50</span>
            <span>عاصفة هدايا 🔥</span>
          </button>
        </div>
      </div>

      {/* Bulk Import Drawer */}
      {isBulkOpen && (
        <div className="bg-[#FFE600]/20 border-3 border-black p-4 neo-box-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-black m-0 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              لصق قائمة أسماء الداعمين دفعة واحدة
            </h4>
            <span className="text-xs font-bold text-gray-700">سطر لكل اسم</span>
          </div>

          <textarea
            rows={4}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="اكتب أو الصق الأسماء هنا...&#10;أحمد_الشهري&#10;سارة_تيك_توك&#10;فيصل: 5&#10;nour_99"
            className="w-full neo-input p-2.5 text-xs sm:text-sm font-bold bg-white"
          />

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setIsBulkOpen(false)}
              className="neo-btn bg-white text-black px-3 py-1.5 text-xs font-black cursor-pointer"
            >
              إغلاق
            </button>
            <button
              onClick={handleBulkSubmit}
              className="neo-btn bg-[#00FF66] text-black px-4 py-1.5 text-xs font-black cursor-pointer"
            >
              إضافة جميع الأسماء إلى العجلة
            </button>
          </div>
        </div>
      )}

      {/* Manual Add Single Supporter */}
      <form onSubmit={handleAddSingle} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-7">
          <input
            type="text"
            required
            value={singleName}
            onChange={(e) => setSingleName(e.target.value)}
            placeholder="اسم الداعم أو يوزر تيك توك..."
            className="w-full neo-input p-2.5 text-xs sm:text-sm font-bold bg-[#FFFDF0]"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center bg-[#FFFDF0] border-3 border-black neo-box-sm px-2 py-1.5 h-full">
            <span className="text-xs font-black text-black ml-1">🌹</span>
            <input
              type="number"
              min={1}
              max={999}
              value={singleRoses}
              onChange={(e) => setSingleRoses(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-transparent font-mono-code font-black text-xs sm:text-sm outline-none text-center"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <button
            type="submit"
            className="w-full h-full neo-btn bg-[#00FF66] text-black py-2 px-3 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة للعجلة</span>
          </button>
        </div>
      </form>

      {/* List Header & Search Filter */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-black">
              قائمة الداعمين الحالية ({participants.length}):
            </span>
            <span className="bg-black text-[#FFE600] text-xs font-mono-code font-black px-2 py-0.5 neo-badge">
              المجموع: {totalRoses} 🌹
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Toggle */}
            <div className="flex items-center bg-white border-2 border-black text-xs font-bold">
              <button
                type="button"
                onClick={() => setSortBy('roses')}
                className={`px-2 py-1 cursor-pointer ${
                  sortBy === 'roses' ? 'bg-[#FFE600] font-black' : 'text-gray-700'
                }`}
              >
                الأعلى وروداً 👑
              </button>
              <button
                type="button"
                onClick={() => setSortBy('recent')}
                className={`px-2 py-1 cursor-pointer ${
                  sortBy === 'recent' ? 'bg-[#FFE600] font-black' : 'text-gray-700'
                }`}
              >
                الأحدث ⏱️
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-black absolute right-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن داعم..."
                className="neo-input pr-8 pl-2 py-1 text-xs font-bold bg-[#FFFDF0] w-32 sm:w-36"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Participants List */}
        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
          {filteredParticipants.length === 0 ? (
            <div className="p-6 text-center bg-[#FFFDF0] border-2 border-dashed border-black">
              <p className="text-xs sm:text-sm font-bold text-gray-600 m-0">
                لا توجد أسماء مطابقة في القائمة حالياً
              </p>
            </div>
          ) : (
            filteredParticipants.map((p, index) => (
              <div
                key={p.id}
                className="neo-box-sm p-2.5 bg-white flex items-center justify-between gap-3 hover:bg-yellow-50/50 transition-colors"
              >
                {/* Left: Rank, Avatar, Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 text-center text-xs font-mono-code font-black text-gray-500">
                    #{index + 1}
                  </span>

                  <img
                    src={p.avatarUrl}
                    alt={p.displayName}
                    className="w-9 h-9 rounded-none border-2 border-black bg-[#FFE600] object-cover shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${p.username}`;
                    }}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-black text-black truncate">
                        {p.displayName}
                      </span>
                      {p.isVip && (
                        <span className="bg-[#FFE600] text-black border border-black text-[10px] font-black px-1 py-0.2">
                          VIP 👑
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono-code font-bold text-gray-500 block truncate">
                      @{p.username}
                    </span>
                  </div>
                </div>

                {/* Right: Rose Counter Controls & Remove */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-[#FFFDF0] border-2 border-black">
                    <button
                      onClick={() => onUpdateRoses(p.id, -1)}
                      className="p-1 hover:bg-gray-200 cursor-pointer text-black"
                      title="إنقاص وردة"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-mono-code font-black text-black">
                      {p.rosesCount} 🌹
                    </span>
                    <button
                      onClick={() => {
                        onUpdateRoses(p.id, 1);
                        soundEngine.playRoseDrop();
                      }}
                      className="p-1 hover:bg-gray-200 cursor-pointer text-black"
                      title="زيادة وردة"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveParticipant(p.id)}
                    className="neo-btn bg-white hover:bg-red-100 text-[#FF2E63] p-1.5 cursor-pointer"
                    title="حذف من العجلة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
