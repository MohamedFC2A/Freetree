import React, { useState, useEffect, useCallback } from 'react';
import { tiktokLiveService, type TikTokGiftEvent, type ConnectionStatus } from '../services/tiktokLiveService';
import { Zap, Radio, RefreshCw } from 'lucide-react';
import { RoseIcon } from './RoseIcon';

interface TikTokLiveConnectorProps {
  onAutoAddSupporter: (event: TikTokGiftEvent) => void;
}

export const TikTokLiveConnector: React.FC<TikTokLiveConnectorProps> = ({
  onAutoAddSupporter
}) => {
  const username = localStorage.getItem('tikfinity_tiktok_username') || 'matany_labs';
  const [status, setStatus] = useState<ConnectionStatus>('connected');
  const [latestGift, setLatestGift] = useState<{ sender: string; count: number } | null>(null);

  useEffect(() => {
    tiktokLiveService.setOnStatusChange((newStatus) => {
      setStatus(newStatus);
    });

    tiktokLiveService.setOnGift((gift) => {
      onAutoAddSupporter(gift);
      setLatestGift({ sender: gift.displayName, count: gift.count });
      setTimeout(() => setLatestGift(null), 3000);
    });

    tiktokLiveService.connect(username);

    return () => {
      tiktokLiveService.disconnect();
    };
  }, [username, onAutoAddSupporter]);

  const handleManualConnect = () => {
    tiktokLiveService.connect(username);
  };

  const handleTestGift = useCallback(() => {
    tiktokLiveService.sendTestLiveGift('داعم_الورود_🌸', 5);
  }, []);

  return (
    <div className="w-full neo-box p-2 bg-[#FFFDF0] border-2 sm:border-3 border-black shadow-[2px_2px_0px_#000] select-none">
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex items-center gap-1">
            <Radio className={`w-3.5 h-3.5 ${
              status === 'connected'
                ? 'text-[#00FF66] animate-pulse'
                : status === 'connecting'
                ? 'text-[#FFE600] animate-spin'
                : 'text-gray-400'
            }`} />
            <span className="text-[11px] font-black text-black">
              الربط المباشر:
            </span>
          </div>

          <span className="font-mono-code font-black text-xs text-[#FF2E63] bg-white px-1.5 py-0.2 border border-black neo-box-sm">
            @{username}
          </span>

          <span className={`text-[9px] font-black px-1.5 py-0.2 neo-badge ${
            status === 'connected'
              ? 'bg-[#00FF66] text-black'
              : status === 'connecting'
              ? 'bg-[#FFE600] text-black'
              : 'bg-black text-white'
          }`}>
            {status === 'connected' ? '🟢 متصل' : status === 'connecting' ? 'جاري الفحص...' : 'في الانتظار'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {latestGift && (
            <div className="bg-[#FF5376] text-white px-2 py-0.5 text-[10px] font-black neo-box-sm flex items-center gap-1 animate-bounce">
              <RoseIcon className="w-2.5 h-2.5 text-white" />
              <span>+{latestGift.count} من {latestGift.sender}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleTestGift}
            className="neo-btn bg-[#FFE600] text-black px-2 py-1 text-[10px] font-black flex items-center gap-1 cursor-pointer"
            title="إرسال وردة تجريبية"
          >
            <Zap className="w-3 h-3 text-[#FF2E63]" />
            <span>تجربة وردة</span>
          </button>

          <button
            type="button"
            onClick={handleManualConnect}
            className="neo-btn bg-white text-black p-1 cursor-pointer"
            title="إعادة فحص الاتصال"
          >
            <RefreshCw className="w-3 h-3 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
