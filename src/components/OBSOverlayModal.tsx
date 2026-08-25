import React, { useState } from 'react';
import { X, Copy, Check, Radio, ShieldCheck } from 'lucide-react';

interface OBSOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OBSOverlayModal: React.FC<OBSOverlayModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const currentUrl = window.location.href;

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="neo-box-lg max-w-xl w-full bg-[#00F0FF] p-4 sm:p-6 relative text-right overflow-hidden border-4 border-black shadow-[8px_8px_0px_#000] max-h-[90vh] overflow-y-auto">
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
          <div className="w-9 h-9 bg-black text-[#00F0FF] border-2 border-black neo-box-sm flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-black m-0 leading-tight">
              طريقة ربط العجلة في TikTok LIVE Studio
            </h3>
            <p className="text-xs font-bold text-gray-800 m-0">
              خطوات عرض السحب والورود مباشرة على شاشة البث في تيك توك لايف استوديو
            </p>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="bg-white border-3 border-black p-3 neo-box-sm space-y-2 mb-4">
          <label className="text-xs font-black text-black block">
            رابط الصفحة للعرض المباشر (Browser Link):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 neo-input p-2 text-xs font-mono-code font-bold bg-[#FDFBF7]"
            />
            <button
              type="button"
              onClick={handleCopyUrl}
              className="neo-btn bg-[#00FF66] text-black px-3 py-2 text-xs font-black flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'تم النسخ!' : 'نسخ الرابط'}</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Instructions for TikTok LIVE Studio */}
        <div className="space-y-2.5">
          <div className="bg-white border-2 border-black p-2.5 neo-box-sm flex items-start gap-2.5">
            <div className="w-6 h-6 bg-black text-white font-mono-code font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <div className="text-xs font-black text-black">
                في برنامج TikTok LIVE Studio:
              </div>
              <div className="text-[11px] font-bold text-gray-700">
                اضغط على زر <strong className="text-black bg-[#FFE600] px-1">Add source</strong> في القائمة اليسرى (كما في شاشتك).
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-2.5 neo-box-sm flex items-start gap-2.5">
            <div className="w-6 h-6 bg-black text-white font-mono-code font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <div className="text-xs font-black text-black">
                اختر نوع المصدر (Source Type):
              </div>
              <div className="text-[11px] font-bold text-gray-700">
                اختر <strong className="text-black bg-[#FFE600] px-1">Window Capture</strong> وحدد نافذة متصفح كروم (أو اختر <strong>Link / Web Source</strong> وضع الرابط).
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-2.5 neo-box-sm flex items-start gap-2.5">
            <div className="w-6 h-6 bg-black text-white font-mono-code font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <div className="text-xs font-black text-black">
                تفعيل الوضع العمودي المخصص (9:16 Mobile View):
              </div>
              <div className="text-[11px] font-bold text-gray-700">
                اضغط على زر <strong className="text-black bg-[#00F0FF] px-1">وضع عمودي 9:16</strong> في أعلى الموقع ليتطابق تماماً مع مقاس شاشة جوال تيك توك بدون أي مساحات سوداء زائدة.
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-2.5 neo-box-sm flex items-start gap-2.5">
            <div className="w-6 h-6 bg-[#00FF66] text-black font-mono-code font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              4
            </div>
            <div>
              <div className="text-xs font-black text-black flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
                ميزة الدعم التلقائي بالورود:
              </div>
              <div className="text-[11px] font-bold text-gray-700">
                كل داعم يرسل ورود في البث، يتم تسجيل اسمه فوراً ويكبر حجم قطاعه في العجلة لزيادة حماسه وفرصة فوزه!
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full neo-btn bg-black text-white py-2 text-xs font-black cursor-pointer shadow-[3px_3px_0px_#000]"
          >
            فهمت، إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};
