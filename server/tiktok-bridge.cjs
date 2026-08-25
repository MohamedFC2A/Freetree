const { TikTokLiveConnection } = require('tiktok-live-connector');
const { WebSocketServer } = require('ws');

const PORT = 21213;
const wss = new WebSocketServer({ port: PORT });
let tiktokConnection = null;
let currentUsername = 'matany_labs';
let isLive = false;
let retryTimer = null;

console.log(`====================================================`);
console.log(`🚀 TikTok Live Real-Time Bridge on port ${PORT}`);
console.log(`🎯 Active Channel: @${currentUsername}`);
console.log(`====================================================`);

function broadcast(data) {
  const json = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      try {
        client.send(json);
      } catch (e) {
        console.error('Error broadcasting to client:', e);
      }
    }
  });
}

function connectToTikTok(username) {
  if (!username) return;
  const cleanUsername = username.trim().replace(/^@/, '');
  currentUsername = cleanUsername;

  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }

  if (tiktokConnection) {
    try {
      tiktokConnection.disconnect();
    } catch (e) {}
    tiktokConnection = null;
  }

  console.log(`[TikTok Bridge] Checking live status for @${currentUsername}...`);
  broadcast({ type: 'status', status: 'connecting', username: currentUsername });

  try {
    tiktokConnection = new TikTokLiveConnection(currentUsername, {
      processInitialData: false,
      enableExtendedGiftInfo: true,
      requestPollingIntervalMs: 1000,
      clientParams: {
        app_language: 'ar-SA',
        device_platform: 'web'
      }
    });

    tiktokConnection.connect().then(state => {
      isLive = true;
      console.log(`[TikTok Bridge] ✅ CONNECTED to Room ID ${state.roomId} for @${currentUsername}! Receiving live gifts...`);
      broadcast({
        type: 'status',
        status: 'connected',
        isLive: true,
        username: currentUsername,
        roomId: state.roomId,
        message: `متصل بالبث المباشر لـ @${currentUsername}`
      });
    }).catch(err => {
      isLive = false;
      console.log(`[TikTok Bridge] ℹ️ @${currentUsername} is not live yet. Retrying in 12s... (${err.message || 'Offline'})`);
      broadcast({
        type: 'status',
        status: 'connected',
        isLive: false,
        username: currentUsername,
        message: `المستمع مفعّل لـ @${currentUsername} (بانتظار بدء البث)`
      });

      // Auto-retry checking if user went live every 12 seconds
      retryTimer = setTimeout(() => {
        if (!isLive) {
          connectToTikTok(currentUsername);
        }
      }, 12000);
    });

    // Handle Gift Event
    tiktokConnection.on('gift', data => {
      const giftCount = parseInt(data.repeatCount || data.count || 1, 10) || 1;
      const giftName = data.giftName || data.extendedGiftInfo?.name || 'Rose';
      console.log(`[TikTok Bridge] 🎁 GIFT RECEIVED: ${data.nickname || data.uniqueId} sent ${giftName} x${giftCount}`);

      broadcast({
        event: 'gift',
        uniqueId: data.uniqueId,
        nickname: data.nickname || data.uniqueId,
        profilePictureUrl: data.profilePictureUrl,
        repeatCount: giftCount,
        giftName: giftName,
        diamondCount: data.diamondCount || 1,
        timestamp: Date.now()
      });
    });

    // Handle Stream End
    tiktokConnection.on('streamEnd', () => {
      isLive = false;
      console.log(`[TikTok Bridge] ⏹️ Live stream ended for @${currentUsername}`);
      broadcast({
        type: 'status',
        status: 'connected',
        isLive: false,
        username: currentUsername,
        message: `انتهى البث المباشر لـ @${currentUsername}`
      });

      retryTimer = setTimeout(() => {
        connectToTikTok(currentUsername);
      }, 15000);
    });

    // Handle Disconnect
    tiktokConnection.on('disconnected', () => {
      console.log(`[TikTok Bridge] Disconnected from @${currentUsername}`);
      broadcast({
        type: 'status',
        status: 'disconnected',
        username: currentUsername
      });
    });

    tiktokConnection.on('error', err => {
      // quiet log
    });

  } catch (err) {
    console.error(`[TikTok Bridge] Setup error:`, err);
  }
}

wss.on('connection', ws => {
  console.log('[TikTok Bridge] UI Client connected via WebSocket');
  ws.send(JSON.stringify({
    type: 'status',
    status: 'connected',
    isLive: isLive,
    username: currentUsername,
    message: isLive ? `متصل بالبث المباشر لـ @${currentUsername}` : `المستمع التلقائي جاهز لـ @${currentUsername}`
  }));

  ws.on('message', message => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'connect' && data.username) {
        connectToTikTok(data.username);
      } else if (data.type === 'testGift') {
        const testCount = data.count || 1;
        const testName = data.name || 'داعم_تيك_توك';
        broadcast({
          event: 'gift',
          uniqueId: testName.replace(/\s+/g, '_').toLowerCase(),
          nickname: testName,
          profilePictureUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(testName)}`,
          repeatCount: testCount,
          giftName: 'Rose',
          diamondCount: testCount,
          timestamp: Date.now()
        });
      }
    } catch (e) {
      console.error('Error handling message:', e);
    }
  });
});

// Auto-start listening for matany_labs
connectToTikTok('matany_labs');
