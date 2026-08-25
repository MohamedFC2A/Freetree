import type { Participant } from '../types';

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'p-1',
    username: 'ahmed_alharbi',
    displayName: 'أحمد الحربي 👑',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rosesCount: 15,
    joinedAt: Date.now() - 3600000,
    isVip: true,
    streak: 3
  },
  {
    id: 'p-2',
    username: 'sara_gamer_99',
    displayName: 'سارة القيصر 🎮',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rosesCount: 28,
    joinedAt: Date.now() - 3000000,
    isVip: true,
    streak: 5
  },
  {
    id: 'p-3',
    username: 'faisal_ksa_7',
    displayName: 'فيصل الشمري ⚡',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    rosesCount: 8,
    joinedAt: Date.now() - 2500000,
    isVip: false,
    streak: 1
  },
  {
    id: 'p-4',
    username: 'nour_design',
    displayName: 'نور المصممة ✨',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rosesCount: 12,
    joinedAt: Date.now() - 2000000,
    isVip: false,
    streak: 2
  },
  {
    id: 'p-5',
    username: 'omar_legend',
    displayName: 'عمر الأسطورة 🦁',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rosesCount: 42,
    joinedAt: Date.now() - 1500000,
    isVip: true,
    streak: 8
  },
  {
    id: 'p-6',
    username: 'mariam_rose',
    displayName: 'مريم وردة 🌹',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rosesCount: 6,
    joinedAt: Date.now() - 1200000,
    isVip: false,
    streak: 1
  },
  {
    id: 'p-7',
    username: 'khalid_streamer',
    displayName: 'خالد ستريم 🎬',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rosesCount: 19,
    joinedAt: Date.now() - 900000,
    isVip: true,
    streak: 4
  },
  {
    id: 'p-8',
    username: 'yousef_vip',
    displayName: 'يوسف العتيبي 💎',
    avatarUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
    rosesCount: 55,
    joinedAt: Date.now() - 500000,
    isVip: true,
    streak: 10
  }
];
