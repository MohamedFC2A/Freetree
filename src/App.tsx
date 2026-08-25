import { useState, useEffect, useCallback } from 'react';
import type { SubscriptionItem, Participant, WinnerRecord, FloatingRose, ScreenRatioMode } from './types';
import { REAL_SUBSCRIPTIONS } from './data/subscriptions';
import { INITIAL_PARTICIPANTS } from './data/initialParticipants';
import { soundEngine } from './utils/audio';
import type { TikTokGiftEvent } from './services/tiktokLiveService';

import { Header } from './components/Header';
import { TikTokLiveConnector } from './components/TikTokLiveConnector';
import { SmartPrizeDropdown } from './components/SmartPrizeDropdown';
import { TikFinityWheel } from './components/TikFinityWheel';
import { CleanSupportersManager } from './components/CleanSupportersManager';
import { CustomPrizeModal } from './components/CustomPrizeModal';
import { WinnerModal } from './components/WinnerModal';
import { WinnersHistoryModal } from './components/WinnersHistoryModal';
import { OBSOverlayModal } from './components/OBSOverlayModal';
import { ScreenRatioModal } from './components/ScreenRatioModal';
import { FloatingRosesLayer } from './components/FloatingRosesLayer';

export function App() {
  // 1. Subscriptions State (Persistent in localStorage)
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() => {
    try {
      const saved = localStorage.getItem('tikfinity_subscriptions');
      return saved ? JSON.parse(saved) : REAL_SUBSCRIPTIONS;
    } catch {
      return REAL_SUBSCRIPTIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tikfinity_subscriptions', JSON.stringify(subscriptions));
    } catch {}
  }, [subscriptions]);

  // 2. Selected Prize State (Persistent in localStorage)
  const [selectedPrize, setSelectedPrize] = useState<SubscriptionItem>(() => {
    try {
      const saved = localStorage.getItem('tikfinity_selected_prize');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = subscriptions.find(s => s.id === parsed.id);
        if (match) return match;
      }
      return subscriptions[0] || REAL_SUBSCRIPTIONS[0];
    } catch {
      return REAL_SUBSCRIPTIONS[0];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tikfinity_selected_prize', JSON.stringify(selectedPrize));
    } catch {}
  }, [selectedPrize]);

  // 3. Participants State (Persistent in localStorage)
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem('tikfinity_participants');
      return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tikfinity_participants', JSON.stringify(participants));
    } catch {}
  }, [participants]);

  // 4. Winners History State (Persistent in localStorage)
  const [winnersHistory, setWinnersHistory] = useState<WinnerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('tikfinity_winners_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tikfinity_winners_history', JSON.stringify(winnersHistory));
    } catch {}
  }, [winnersHistory]);

  // 5. Audio Mute State (Persistent in localStorage)
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('tikfinity_is_muted') === 'true';
  });

  const handleToggleMute = useCallback(() => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    localStorage.setItem('tikfinity_is_muted', String(nextMuted));
  }, []);

  // 6. Screen Ratio Mode (Persistent in localStorage)
  const [screenRatio, setScreenRatio] = useState<ScreenRatioMode>(() => {
    const saved = localStorage.getItem('tikfinity_screen_ratio') as ScreenRatioMode;
    return saved || 'full';
  });

  const handleSelectScreenRatio = useCallback((mode: ScreenRatioMode) => {
    setScreenRatio(mode);
    localStorage.setItem('tikfinity_screen_ratio', mode);
  }, []);

  // Modals & Floating Roses
  const [isScreenRatioModalOpen, setIsScreenRatioModalOpen] = useState(false);
  const [floatingRoses, setFloatingRoses] = useState<FloatingRose[]>([]);
  const [isCustomPrizeModalOpen, setIsCustomPrizeModalOpen] = useState(false);
  const [isWinnersHistoryModalOpen, setIsWinnersHistoryModalOpen] = useState(false);
  const [isOBSModalOpen, setIsOBSModalOpen] = useState(false);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);

  // Floating Rose Trigger
  const triggerFloatingRose = useCallback((sender: string, count: number) => {
    const roseId = `rose-${Date.now()}-${Math.random()}`;
    const x = Math.floor(Math.random() * 60) + 20;
    const y = Math.floor(Math.random() * 30) + 50;

    const newRose: FloatingRose = { id: roseId, x, y, sender, count };
    setFloatingRoses(prev => [...prev, newRose]);

    setTimeout(() => {
      setFloatingRoses(prev => prev.filter(r => r.id !== roseId));
    }, 2000);
  }, []);

  // Auto-Add Supporter from Real-Time TikTok Live Events
  const handleAutoAddSupporter = useCallback((event: TikTokGiftEvent) => {
    soundEngine.playRoseDrop();
    triggerFloatingRose(event.displayName, event.count);

    setParticipants(prev => {
      const cleanUsername = event.username.toLowerCase();
      const existing = prev.find(p => p.username.toLowerCase() === cleanUsername);

      if (existing) {
        return prev.map(p => {
          if (p.id === existing.id) {
            const newCount = p.rosesCount + event.count;
            return {
              ...p,
              displayName: event.displayName || p.displayName,
              avatarUrl: event.avatarUrl || p.avatarUrl,
              rosesCount: newCount,
              isVip: newCount >= 10,
              streak: (p.streak || 1) + 1
            };
          }
          return p;
        });
      } else {
        const newParticipant: Participant = {
          id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          username: cleanUsername,
          displayName: event.displayName || cleanUsername,
          avatarUrl: event.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
          rosesCount: event.count,
          joinedAt: Date.now(),
          isVip: event.count >= 10,
          streak: 1
        };
        return [newParticipant, ...prev];
      }
    });
  }, [triggerFloatingRose]);

  // Add Participant Manually
  const handleAddParticipant = (participant: Participant) => {
    setParticipants(prev => [participant, ...prev]);
    triggerFloatingRose(participant.displayName, participant.rosesCount);
  };

  // Remove Participant
  const handleRemoveParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  // Update Roses
  const handleUpdateRoses = (id: string, delta: number) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        const newCount = Math.max(1, p.rosesCount + delta);
        if (delta > 0) {
          triggerFloatingRose(p.displayName, delta);
        }
        return {
          ...p,
          rosesCount: newCount,
          isVip: newCount >= 10,
          streak: delta > 0 ? (p.streak || 1) + 1 : p.streak
        };
      }
      return p;
    }));
  };

  // Bulk Add
  const handleBulkAdd = (names: string[]) => {
    const newItems: Participant[] = names.map(rawName => {
      let name = rawName;
      let roses = 1;

      const match = rawName.match(/^(.+?)[:\s]+(\d+)$/);
      if (match) {
        name = match[1].trim();
        roses = parseInt(match[2], 10) || 1;
      }

      return {
        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        username: name.replace(/\s+/g, '_').toLowerCase(),
        displayName: name,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        rosesCount: roses,
        joinedAt: Date.now(),
        isVip: roses >= 10,
        streak: 1
      };
    });

    setParticipants(prev => [...newItems, ...prev]);
  };

  // Shuffle
  const handleShuffle = () => {
    setParticipants(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    soundEngine.playTick();
  };

  // Clear All
  const handleClear = () => {
    if (window.confirm('هل أنت متأكد من مسح جميع الأسماء من العجلة؟')) {
      setParticipants([]);
    }
  };

  // Reset to Defaults
  const handleResetToDefaults = () => {
    if (window.confirm('هل تريد إعادة تعيين الأسماء والاشتراكات للوضع الافتراضي؟')) {
      setParticipants(INITIAL_PARTICIPANTS);
      setSubscriptions(REAL_SUBSCRIPTIONS);
      setSelectedPrize(REAL_SUBSCRIPTIONS[0]);
    }
  };

  // Wheel Spin Completed
  const handleSpinEnd = (winner: Participant) => {
    setCurrentWinner(winner);
    setWinnerModalOpen(true);
  };

  // Save Winner Record
  const handleSaveWinner = (record: WinnerRecord) => {
    setWinnersHistory(prev => [record, ...prev]);
  };

  // Remove Winner from Wheel
  const handleRemoveWinnerFromWheel = (winnerId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== winnerId));
  };

  // Re-spin
  const handleReSpin = () => {
    setWinnerModalOpen(false);
  };

  // Total roses
  const totalRoses = participants.reduce((sum, p) => sum + p.rosesCount, 0);

  // Dynamic Container Class based on screen ratio mode
  const getContainerClasses = () => {
    switch (screenRatio) {
      case '9:16':
        return 'max-w-[440px] sm:border-4 border-black sm:shadow-[0_0_20px_rgba(0,0,0,0.5)]';
      case '1:1':
        return 'max-w-[760px] sm:border-4 border-black sm:shadow-[0_0_20px_rgba(0,0,0,0.5)]';
      case '16:9':
        return 'max-w-[1100px] sm:border-4 border-black sm:shadow-[0_0_20px_rgba(0,0,0,0.5)]';
      case '4:3':
        return 'max-w-[900px] sm:border-4 border-black sm:shadow-[0_0_20px_rgba(0,0,0,0.5)]';
      case 'dock':
        return 'max-w-[360px] sm:border-4 border-black sm:shadow-[0_0_20px_rgba(0,0,0,0.5)]';
      case 'full':
      default:
        return 'max-w-7xl w-full';
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-start bg-[#18181B] text-black font-sans select-none overflow-x-hidden">
      {/* Floating Roses Layer */}
      <FloatingRosesLayer roses={floatingRoses} />

      {/* Frame Container */}
      <div className={`w-full min-h-screen lg:h-screen lg:max-h-screen bg-[#FFFDF0] flex flex-col transition-all duration-200 ${getContainerClasses()}`}>
        {/* Fixed Header */}
        <Header
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenObsMode={() => setIsOBSModalOpen(true)}
          onOpenWinnersHistory={() => setIsWinnersHistoryModalOpen(true)}
          onOpenScreenRatioModal={() => setIsScreenRatioModalOpen(true)}
          currentScreenRatio={screenRatio}
          participantsCount={participants.length}
          totalRosesCount={totalRoses}
          winnersCount={winnersHistory.length}
        />

        {/* Responsive Main Layout: Stacked on Mobile & Tablet, 2-Column Zero-Scroll on Desktop */}
        <main className="flex-1 w-full p-2.5 sm:p-3 overflow-y-auto lg:overflow-hidden lg:grid lg:grid-cols-12 lg:gap-2.5 flex flex-col gap-3 pb-16 lg:pb-3">
          {/* Section A: Prize & Wheel Spotlight (Prominently displayed first on Mobile!) */}
          <div className="lg:col-span-7 flex flex-col gap-2.5 lg:h-full lg:overflow-hidden order-1 lg:order-2">
            {/* Active Selected Prize Showcase */}
            <div className="shrink-0">
              <SmartPrizeDropdown
                subscriptions={subscriptions}
                selectedPrize={selectedPrize}
                onSelectPrize={(prize) => {
                  setSelectedPrize(prize);
                  soundEngine.playRoseDrop();
                }}
                onOpenCustomModal={() => setIsCustomPrizeModalOpen(true)}
              />
            </div>

            {/* TikFinity Wheel Spotlight (Large, round, gorgeous on mobile and desktop) */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <TikFinityWheel
                participants={participants}
                activePrize={selectedPrize}
                onSpinEnd={handleSpinEnd}
                onShuffle={handleShuffle}
                onClear={handleClear}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onAddParticipant={handleAddParticipant}
                onUpdateRoses={handleUpdateRoses}
                onRemoveParticipant={handleRemoveParticipant}
              />
            </div>
          </div>

          {/* Section B: TikTok Live Connector + Supporters Management Feed */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 lg:h-full lg:overflow-hidden order-2 lg:order-1">
            {/* Real-time TikTok Live Automatic Connection Bar */}
            <div className="shrink-0">
              <TikTokLiveConnector onAutoAddSupporter={handleAutoAddSupporter} />
            </div>

            {/* Supporters Manager */}
            <div className="flex-1 min-h-[320px] lg:min-h-0">
              <CleanSupportersManager
                participants={participants}
                onAddParticipant={handleAddParticipant}
                onRemoveParticipant={handleRemoveParticipant}
                onUpdateRoses={handleUpdateRoses}
                onBulkAdd={handleBulkAdd}
                onClearAll={handleClear}
                onResetDefaults={handleResetToDefaults}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Screen Ratio Selector Modal */}
      <ScreenRatioModal
        isOpen={isScreenRatioModalOpen}
        onClose={() => setIsScreenRatioModalOpen(false)}
        currentMode={screenRatio}
        onSelectMode={handleSelectScreenRatio}
      />

      {/* Winner Modal */}
      <WinnerModal
        isOpen={winnerModalOpen}
        winner={currentWinner}
        prize={selectedPrize}
        onClose={() => setWinnerModalOpen(false)}
        onRemoveWinnerFromWheel={handleRemoveWinnerFromWheel}
        onReSpin={handleReSpin}
        onSaveWinner={handleSaveWinner}
      />

      {/* Winners History Modal */}
      <WinnersHistoryModal
        isOpen={isWinnersHistoryModalOpen}
        onClose={() => setIsWinnersHistoryModalOpen(false)}
        winners={winnersHistory}
        onClearHistory={() => setWinnersHistory([])}
      />

      {/* Custom Prize Modal */}
      <CustomPrizeModal
        isOpen={isCustomPrizeModalOpen}
        onClose={() => setIsCustomPrizeModalOpen(false)}
        onAddCustomPrize={(newPrize) => {
          setSubscriptions(prev => [newPrize, ...prev]);
          setSelectedPrize(newPrize);
          soundEngine.playCombo();
        }}
      />

      {/* OBS Overlay Modal */}
      <OBSOverlayModal
        isOpen={isOBSModalOpen}
        onClose={() => setIsOBSModalOpen(false)}
      />
    </div>
  );
}

export default App;
