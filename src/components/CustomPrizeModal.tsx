import React, { useState } from 'react';
import type { SubscriptionItem } from '../types';
import { X, Plus, Gift } from 'lucide-react';

interface CustomPrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomPrize: (prize: SubscriptionItem) => void;
}

const PRESET_COLORS = ['#FFE600', '#FF5376', '#00F0FF', '#00FF66', '#B185FF', '#FF9900'];

export const CustomPrizeModal: React.FC<CustomPrizeModalProps> = ({
  isOpen,
  onClose,
  onAddCustomPrize
}) => {
  const [nameAr, setNameAr] = useState('');
  const [durationAr, setDurationAr] = useState('سنة كاملة');
  const [value, setValue] = useState('$100');
  const [color, setColor] = useState('#FFE600');
  const [descriptionAr, setDescriptionAr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    const newPrize: SubscriptionItem = {
      id: `custom-${Date.now()}`,
      name: nameAr,
      nameAr: nameAr,
      category: 'custom',
      imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/apple.png',
      fallbackIcon: '🎁',
      color: color,
      badge: 'جائزة مخصصة',
      durationAr: durationAr || 'فوري',
      descriptionAr: descriptionAr || 'جائزة سحب مخصصة من البث المباشر',
      value: value || '$100',
      features: ['تفعيل فوري للفائز', 'مقدمة من صاحب البث']
    };

    onAddCustomPrize(newPrize);
    setNameAr('');
    setDescriptionAr('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="neo-box-lg max-w-md w-full bg-[#00FF66] p-4 sm:p-5 relative text-right overflow-hidden border-4 border-black shadow-[8px_8px_0px_#000]">
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
          <div className="w-8 h-8 bg-black text-[#00FF66] border-2 border-black neo-box-sm flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-black m-0 leading-tight">
              إضافة اشتراك أو جائزة مخصصة
            </h3>
            <p className="text-xs font-bold text-gray-800 m-0">
              أضف أي جائزة ترغب في وضعها على عجلة السحب
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 bg-white border-2 border-black p-3.5 neo-box-sm">
          <div>
            <label className="text-xs font-black text-black block mb-1">اسم الاشتراك أو الجائزة:</label>
            <input
              type="text"
              required
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: اشتراك كانفا برو أو بطاقة أمازون 50$"
              className="w-full neo-input p-2 text-xs font-bold bg-[#FFFDF0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-black text-black block mb-1">المدة:</label>
              <input
                type="text"
                value={durationAr}
                onChange={(e) => setDurationAr(e.target.value)}
                placeholder="مثال: سنة كاملة"
                className="w-full neo-input p-2 text-xs font-bold bg-[#FFFDF0]"
              />
            </div>

            <div>
              <label className="text-xs font-black text-black block mb-1">القيمة التقديرية:</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="مثال: $50"
                className="w-full neo-input p-2 text-xs font-bold bg-[#FFFDF0]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">لون بطاقة الجائزة:</label>
            <div className="flex gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 border-2 border-black cursor-pointer transition-transform ${
                    color === c ? 'scale-115 shadow-[2px_2px_0px_#000]' : 'opacity-80'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full neo-btn bg-[#FFE600] text-black py-2.5 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 cursor-pointer mt-2 shadow-[2px_2px_0px_#000]"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة الجائزة مباشرة للسحب</span>
          </button>
        </form>
      </div>
    </div>
  );
};

