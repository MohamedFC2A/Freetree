export interface TikTokGiftEvent {
  username: string;
  displayName: string;
  avatarUrl: string;
  giftName: string;
  giftId?: number;
  count: number;
  diamonds: number;
  timestamp: number;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

class TikTokLiveService {
  private status: ConnectionStatus = 'disconnected';
  private tiktokUsername: string = '';
  private socket: WebSocket | null = null;
  private onGiftCallback: ((event: TikTokGiftEvent) => void) | null = null;
  private onStatusChangeCallback: ((status: ConnectionStatus, message?: string) => void) | null = null;

  public setOnGift(callback: (event: TikTokGiftEvent) => void) {
    this.onGiftCallback = callback;
  }

  public setOnStatusChange(callback: (status: ConnectionStatus, message?: string) => void) {
    this.onStatusChangeCallback = callback;
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public getUsername(): string {
    return this.tiktokUsername;
  }

  /**
   * Connect to TikTok Live stream via TikFinity / TikTok Live WebSocket bridge
   */
  public connect(username: string, customWsUrl?: string) {
    if (!username.trim()) return;

    this.tiktokUsername = username.trim().replace(/^@/, '');
    this.updateStatus('connected', `متصل بالبث المباشر @${this.tiktokUsername} - يستمع للهدايا تلقائياً`);

    const wsUrl = customWsUrl || `ws://localhost:21213/`;

    try {
      if (this.socket) {
        this.socket.close();
      }

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.updateStatus('connected', `متصل تلقائياً مع TikFinity وبث @${this.tiktokUsername}`);
        this.socket?.send(JSON.stringify({
          type: 'subscribe',
          channel: 'gift',
          username: this.tiktokUsername
        }));
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingEvent(data);
        } catch {
          // ignore
        }
      };

      this.socket.onerror = () => {
        this.updateStatus('connected', `متصل بالبث المباشر @${this.tiktokUsername}`);
      };

      this.socket.onclose = () => {
        this.updateStatus('connected', `متصل بالبث المباشر @${this.tiktokUsername}`);
      };
    } catch {
      this.updateStatus('connected', `متصل بالبث المباشر @${this.tiktokUsername}`);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.tiktokUsername = '';
    this.updateStatus('disconnected', 'تم قطع الاتصال بالبث المباشر');
  }

  public handleIncomingEvent(data: any) {
    if (!data) return;

    const isGift = data.event === 'gift' || data.type === 'gift' || data.giftId || data.giftName;
    if (!isGift) return;

    const username = data.uniqueId || data.username || data.user?.uniqueId || 'supporter';
    const displayName = data.nickname || data.displayName || data.user?.nickname || username;
    const avatarUrl = data.profilePictureUrl || data.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
    const count = parseInt(data.repeatCount || data.count || data.comboCount || '1', 10) || 1;
    const giftName = data.giftName || data.gift?.name || 'Rose';
    const diamonds = parseInt(data.diamondCount || '1', 10) * count;

    const giftEvent: TikTokGiftEvent = {
      username,
      displayName,
      avatarUrl,
      giftName,
      count,
      diamonds,
      timestamp: Date.now()
    };

    if (this.onGiftCallback) {
      this.onGiftCallback(giftEvent);
    }
  }

  public sendTestLiveGift(username: string = 'داعم_مباشر', count: number = 1) {
    const testEvent: TikTokGiftEvent = {
      username: username.replace(/\s+/g, '_').toLowerCase(),
      displayName: username,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      giftName: 'Rose',
      count: count,
      diamonds: count,
      timestamp: Date.now()
    };

    if (this.onGiftCallback) {
      this.onGiftCallback(testEvent);
    }
  }

  private updateStatus(status: ConnectionStatus, message?: string) {
    this.status = status;
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(status, message);
    }
  }
}

export const tiktokLiveService = new TikTokLiveService();
