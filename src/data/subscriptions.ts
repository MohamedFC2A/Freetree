export interface SubscriptionItemWithImage {
  id: string;
  name: string;
  nameAr: string;
  category: 'all' | 'ai' | 'streaming' | 'gaming' | 'productivity' | 'custom';
  imagePng: string;
  fallbackIcon: string;
  color: string;
  badge: string;
  durationAr: string;
  descriptionAr: string;
  value: string;
  features: string[];
}

export const REAL_SUBSCRIPTIONS: SubscriptionItemWithImage[] = [
  {
    id: 'gemini-18m',
    name: 'Gemini Advanced',
    nameAr: 'اشتراك جيمناي ادفانسد (18 شهر مجاناً)',
    category: 'ai',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/google-gemini.png',
    fallbackIcon: '✨',
    color: '#FFE600', // Neo Lemon
    badge: '👑 الجائزة الكبرى',
    durationAr: '18 شهر مجاناً بالكامل',
    descriptionAr: 'وصول كامل لأحدث نماذج Gemini 2.0 Pro و Ultra مع سعة 2TB في Google One ودمج كامل مع Gmail و Docs.',
    value: '$360',
    features: ['الوصول لنموذج Gemini 1.5 Pro & 2.0', 'مساحة تخزين سحابي 2 تيرابايت', 'تحليل ملفات ضخمة وبرمجة ذكية']
  },
  {
    id: 'netflix-premium',
    name: 'Netflix Premium 4K',
    nameAr: 'اشتراك نيتفليكس بريميوم 4K UHD',
    category: 'streaming',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/netflix.png',
    fallbackIcon: '🎬',
    color: '#FF5376', // Neo Rose
    badge: '🔥 الأكثر طلباً',
    durationAr: 'سنة كاملة (12 شهر)',
    descriptionAr: 'مشاهدة غير محدودة بدقة 4K Ultra HD وصوت مكاني Spatial Audio على 4 أجهزة في نفس الوقت.',
    value: '$240',
    features: ['دقة فائقة 4K + HDR', 'تشغيل على 4 شاشات متزامنة', 'تنزيل الحلقات للمشاهدة بدون إنترنت']
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro (Sonnet 3.5)',
    nameAr: 'اشتراك كلود برو (Claude 3.5 Sonnet)',
    category: 'ai',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/anthropic.png',
    fallbackIcon: '🧠',
    color: '#FF9900', // Neo Orange
    badge: '⚡ وحش البرمجة',
    durationAr: '6 أشهر كاملة',
    descriptionAr: 'اشتراك الذكاء الاصطناعي الأفضل عالمياً في البرمجة وكتابة الأكواد ومشاريع الـ Artifacts.',
    value: '$120',
    features: ['استخدام 5x أضعاف للرسائل', 'الوصول لأقوى نموذج كودينج في العالم', 'أولوية الاستخدام وقت الذروة']
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus (GPT-4o)',
    nameAr: 'اشتراك شات جي بي تي بلس (GPT-4o)',
    category: 'ai',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/chatgpt.png',
    fallbackIcon: '🤖',
    color: '#00F0FF', // Neo Cyan
    badge: '🚀 رائد الذكاء الاصطناعي',
    durationAr: '6 أشهر كاملة',
    descriptionAr: 'الوصول لنموذج GPT-4o المباشر وميزة البحث المباشر وتوليد الصور DALL·E 3 والصوت الحي Voice Mode.',
    value: '$120',
    features: ['محادثات صوتية فورية متقدمة', 'توليد الصور بدقة فائقة عبر DALL-E', 'إنشاء واستخدام GPTs المخصصة']
  },
  {
    id: 'spotify-premium',
    name: 'Spotify Premium',
    nameAr: 'اشتراك سبوتيفاي بريميوم',
    category: 'streaming',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/spotify.png',
    fallbackIcon: '🎵',
    color: '#00FF66', // Neo Green
    badge: '🎧 صوت نقي بدون إعلانات',
    durationAr: 'سنة كاملة (12 شهر)',
    descriptionAr: 'استماع لجميع الأغاني والبودكاست بأعلى جودة صوتية بدون أي إعلانات مزعجة مع التنزيل أوفلاين.',
    value: '$130',
    features: ['استماع بدون فواصل إعلانية', 'تنزيل غير محدود للاستماع بدون نت', 'صوت فائق النقاوة']
  },
  {
    id: 'discord-nitro',
    name: 'Discord Nitro Full',
    nameAr: 'اشتراك ديسكورد نيترو الكامل',
    category: 'gaming',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/discord.png',
    fallbackIcon: '👾',
    color: '#B185FF', // Neo Purple
    badge: '💎 تمييز سيرفرات وبروفايل',
    durationAr: 'سنة كاملة (12 شهر)',
    descriptionAr: '2 بوست سيرفر، بث شاشة 4K 60FPS، ايموجيز متحركة، وحجم رفع ملفات يصل 500MB.',
    value: '$100',
    features: ['2 سيرفر بوست مجاني', 'بث بجودة 4K 60fps', 'إيموجيات واستيكرات مخصصة عالمياً']
  },
  {
    id: 'xbox-gamepass',
    name: 'Xbox Game Pass Ultimate',
    nameAr: 'اشتراك جيم باس التيميت',
    category: 'gaming',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/xbox.png',
    fallbackIcon: '🎮',
    color: '#00F0FF',
    badge: '🏆 مكتبة ألعاب ضخمة',
    durationAr: 'سنة كاملة (12 شهر)',
    descriptionAr: 'أكثر من 400 لعبة ضخمة على الكمبيوتر والكونسول مع EA Play واللعب السحابي Cloud Gaming.',
    value: '$200',
    features: ['ألعاب مايكروسوفت الحصرية فور صدورها', 'اشتراك EA Play متضمن بالكامل', 'ألعاب سحابية على الجوال']
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium Family',
    nameAr: 'اشتراك يوتيوب بريميوم',
    category: 'streaming',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/youtube.png',
    fallbackIcon: '📺',
    color: '#FF2E63',
    badge: '🚫 بدون إعلانات',
    durationAr: 'سنة كاملة (12 شهر)',
    descriptionAr: 'مشاهدة كل مقاطع يوتيوب بدون إعلانات مع تشغيل في الخلفية وتنزيل مقاطع واشتراك Music مجاناً.',
    value: '$180',
    features: ['مشاهدة خالية تماماً من الإعلانات', 'تشغيل الصوت مع قفل الشاشة', 'تنزيل المقاطع بدقة عالية']
  },
  {
    id: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    nameAr: 'اشتراك أدوبي السحابي كامل',
    category: 'productivity',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/adobe.png',
    fallbackIcon: '🎨',
    color: '#FF5376',
    badge: '🖌️ للمصممين والمونتيرز',
    durationAr: 'سنة كاملة (12 شهر)',
    descriptionAr: 'حزمة أدوبي الكاملة بأكثر من 20 برنامج احترافي تشمل Photoshop و Premiere Pro و After Effects.',
    value: '$600',
    features: ['فوتوشوب، بريمير، افتر افكتس', 'توليد ذكاء اصطناعي عبر Firefly', 'مساحة سحابية 100GB']
  },
  {
    id: 'midjourney-pro',
    name: 'Midjourney Pro',
    nameAr: 'اشتراك ميدجورني لتوليد الصور',
    category: 'ai',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/midjourney.png',
    fallbackIcon: '🖼️',
    color: '#B185FF',
    badge: '🎨 أقوى ذكاء للصور',
    durationAr: 'سنة كاملة (12 شهر)',
    descriptionAr: 'توليد وتعديل صور فائقة الواقعية والجمال عبر أحدث نماذج Midjourney v6 مع وضع التوليد فائق السرعة.',
    value: '$360',
    features: ['توليد سريع غير محدود Fast Hours', 'الوضع الخفي Stealth Mode', 'دقة فائقة وجودة استثنائية']
  },
  {
    id: 'steam-gift-card',
    name: 'Steam Wallet $100',
    nameAr: 'بطاقة رصيد ستيم (100 دولار)',
    category: 'gaming',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/steam.png',
    fallbackIcon: '🎁',
    color: '#00F0FF',
    badge: '💳 رصيد فوري',
    durationAr: 'كود رقمي فوري',
    descriptionAr: 'شحن رصيد محفظة ستيم لشراء أي لعبة أو سكنات من متجر Steam العالمي.',
    value: '$100',
    features: ['كود تفعيل فوري عالمي', 'شراء أي لعبة على ستيم', 'صالح لجميع الحسابات']
  },
  {
    id: 'playstation-plus',
    name: 'PlayStation Plus Deluxe',
    nameAr: 'اشتراك بلايستيشن بلس ديلوكس',
    category: 'gaming',
    imagePng: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/playstation.png',
    fallbackIcon: '🕹️',
    color: '#B185FF',
    badge: '🎮 لعشاق PS4 و PS5',
    durationAr: 'سنة كاملة (12 شهر)',
    descriptionAr: 'ألعاب شهرية مجانية، كتالوج ألعاب ضخم، لعب أونلاين متعدد، وتجربة الألعاب قبل الشراء.',
    value: '$160',
    features: ['مئات ألعاب PS4 و PS5 المجانية', 'اللعب أونلاين في جميع الألعاب', 'تخفيضات حصرية أسبوعية']
  }
];
