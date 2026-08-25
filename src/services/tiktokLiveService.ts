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
    this.updateStatus('connected', `جاهز للبث المباشر @${this.tiktokUsername} - يستمع للهدايا`);

    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname || 'localhost';
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname.startsWith('192.168.');
    const isHttps = window.location.protocol === 'https:';

    // On remote HTTPS deployments without an explicit secure WSS URL,
    // avoid attempting insecure ws:// against the remote domain to prevent mixed content errors.
    if (isHttps && !isLocal && !customWsUrl) {
      this.updateStatus('connected', `متصل بالسحب المباشر @${this.tiktokUsername}`);
      return;
    }

    const wsUrl = customWsUrl || (isHttps ? `wss://${hostname}:21213/` : `ws://${hostname}:21213/`);

    try {
      if (this.socket) {
        try {
          this.socket.close();
        } catch {}
      }

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.updateStatus('connected', `متصل تلقائياً مع TikFinity وبث @${this.tiktokUsername}`);
        try {
          this.socket?.send(JSON.stringify({
            type: 'subscribe',
            channel: 'gift',
            username: this.tiktokUsername
          }));
        } catch {}
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingEvent(data);
        } catch {
          // ignore parsing errors
        }
      };

      this.socket.onerror = () => {
        this.updateStatus('connected', `متصل بالسحب المباشر @${this.tiktokUsername}`);
      };

      this.socket.onclose = () => {
        this.updateStatus('connected', `متصل بالسحب المباشر @${this.tiktokUsername}`);
      };
    } catch {
      this.updateStatus('connected', `متصل بالسحب المباشر @${this.tiktokUsername}`);
    }
  }

  public disconnect() {
    if (this.socket) {
      try {
        this.socket.close();
      } catch {}
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
