import React from 'react';
import type { WinnerRecord } from '../types';
import { X, Download, Trash2, Trophy, Gift } from 'lucide-react';
import { RoseIcon } from './RoseIcon';

interface WinnersHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  winners: WinnerRecord[];
  onClearHistory: () => void;
}

export const WinnersHistoryModal: React.FC<WinnersHistoryModalProps> = ({
  isOpen,
  onClose,
  winners,
  onClearHistory
}) => {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    if (winners.length === 0) return;

    const headers = ['التاريخ', 'اسم الفائز', 'حساب تيك توك', 'الورود الداعمة', 'الجائزة', 'القيمة', 'كود الاستلام'];
    const rows = winners.map(w => [
      new Date(w.timestamp).toLocaleString('ar-SA'),
      `"${w.participant.displayName}"`,
      `"@${w.participant.username}"`,
      w.participant.rosesCount,
      `"${w.prize.nameAr}"`,
      w.prize.value,
      w.claimCode
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tikfinity-winners-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="neo-box-lg max-w-xl w-full bg-[#00F0FF] p-4 sm:p-5 relative text-right overflow-hidden border-4 border-black shadow-[8px_8px_0px_#000] max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 left-3 neo-btn bg-white text-black p-1 cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-black text-[#FFE600] border-2 border-black neo-box-sm flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-black m-0 leading-tight">
              سجل الفائزين بالسحوبات
            </h3>
            <p className="text-xs font-bold text-gray-800 m-0">
              توثيق الفائزين وأكواد استلام الجوائز
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-2 mb-2">
          <div className="text-xs font-black text-black">
            إجمالي السحوبات: <span className="font-mono-code font-bold bg-white px-1.5 py-0.2 border border-black">{winners.length}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {winners.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="neo-btn bg-[#00FF66] text-black px-2.5 py-1 text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير Excel / CSV</span>
                </button>
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="neo-btn bg-[#FF5376] text-white px-2 py-1 text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>مسح السجل</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {winners.length === 0 ? (
            <div className="text-center py-8 bg-white border-2 border-dashed border-black text-xs font-bold text-gray-500 neo-box-sm">
              لا توجد سحوبات مسجلة بعد. عند انتهاء السحب الأول سيظهر الفائز هنا تلقائياً!
            </div>
          ) : (
            winners.map((record) => (
              <div
                key={record.id}
                className="bg-white border-2 border-black p-2.5 neo-box-sm flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 bg-[#FFE600] border-2 border-black neo-box-sm overflow-hidden shrink-0">
                    <img
                      src={record.participant.avatarUrl}
                      alt={record.participant.displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${record.participant.username}`;
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs sm:text-sm text-black truncate">
                        {record.participant.displayName}
                      </span>
                      <span className="bg-[#FF5376] text-white text-[10px] font-mono-code font-black px-1.5 py-0.2 neo-badge flex items-center gap-0.5">
                        <RoseIcon className="w-2.5 h-2.5 text-white" />
                        {record.participant.rosesCount}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-gray-700 flex items-center gap-1 truncate">
                      <Gift className="w-3 h-3 text-black" />
                      <span>{record.prize.nameAr}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-mono-code text-[10px] text-gray-500">
                        {new Date(record.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <div className="text-[10px] font-mono-code font-black bg-[#FDFBF7] border border-black px-1.5 py-0.5">
                    {record.claimCode}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

