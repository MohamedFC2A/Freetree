export type SubscriptionCategory = 'all' | 'ai' | 'streaming' | 'gaming' | 'productivity' | 'custom';

export type ScreenRatioMode = 'full' | '9:16' | '1:1' | '4:3' | '16:9' | 'dock';

export interface ScreenRatioOption {
  id: ScreenRatioMode;
  nameAr: string;
  badge: string;
  descAr: string;
  iconType: 'monitor' | 'phone' | 'square' | 'tv' | 'sidebar';
}

export interface SubscriptionItem {
  id: string;
  name: string;
  nameAr: string;
  category: SubscriptionCategory;
  imagePng?: string;
  fallbackIcon?: string;
  icon?: string;
  color: string;
  badge: string;
  duration?: string;
  durationAr: string;
  descriptionAr: string;
  value: string;
  popular?: boolean;
  features: string[];
}

export interface Participant {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  rosesCount: number;
  joinedAt: number;
  isVip?: boolean;
  streak?: number;
}

export interface WinnerRecord {
  id: string;
  participant: Participant;
  prize: SubscriptionItem;
  timestamp: number;
  claimCode: string;
}

export interface FloatingRose {
  id: string;
  x: number;
  y: number;
  sender: string;
  count: number;
}
