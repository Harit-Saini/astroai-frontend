/**
 * Initial curated astrology data, reel shorts, sample kundli contexts, and AI prompts.
 * Matches all specifications from the SOP.
 */

export const INITIAL_VIDEOS = [
  {
    _id: 'vid-101',
    title: 'Saturn Transit 2026: Shani Sade Sati Remedies & Impact',
    description: 'Understand how Saturn movements affect Capricorn, Aquarius, and Pisces. Proven Vedic remedies to reduce Malefic effects.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-a-milky-way-41617-large.mp4',
    thumbnail: '/src/assets/images/reels_astrology_cover_1791176913592.jpg',
    category: 'Planetary Transits',
    tags: ['Saturn', 'Shani', 'Remedies', 'Horoscope'],
    status: 'published',
    views: 14200,
    likes: 1240,
    isPremium: false,
    duration: '0:45',
    createdAt: '2026-03-15T10:00:00Z'
  },
  {
    _id: 'vid-102',
    title: 'Kundli Milan Secrets: What 36 Gunas Actually Mean',
    description: 'Why Nadi Dosha and Bhakoot Dosha matter more than just high Guna match in marriage astrology.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-outer-space-41584-large.mp4',
    thumbnail: '/src/assets/images/vedic_kundli_chart_1791176901357.jpg',
    category: 'Kundli & Dasha',
    tags: ['Kundli', 'Marriage', 'KundliMilan', 'Vedic'],
    status: 'published',
    views: 28900,
    likes: 3105,
    isPremium: true,
    duration: '0:58',
    createdAt: '2026-03-18T14:30:00Z'
  },
  {
    _id: 'vid-103',
    title: 'Money & Wealth Yogas: Check 2nd & 11th House in Birth Chart',
    description: 'Find out if you have Dhana Yoga or Lakshmi Yoga in your horoscope for financial abundance.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-movement-of-fluid-particles-in-purple-and-gold-41708-large.mp4',
    thumbnail: '/src/assets/images/hero_celestial_zodiac_1791176875369.jpg',
    category: 'Career & Wealth',
    tags: ['Wealth', 'DhanaYoga', 'Finance', 'Astrology'],
    status: 'published',
    views: 19540,
    likes: 1870,
    isPremium: false,
    duration: '0:50',
    createdAt: '2026-03-22T08:15:00Z'
  },
  {
    _id: 'vid-104',
    title: 'Tarot Oracle: Urgent Message for Your Career & Romance',
    description: 'Take a deep breath and pick a pile. A major celestial transition is approaching your 10th house.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-purple-nebula-in-deep-space-41619-large.mp4',
    thumbnail: '/src/assets/images/astro_ai_avatar_1791176888518.jpg',
    category: 'Tarot & Cards',
    tags: ['Tarot', 'PickACard', 'Career', 'Future'],
    status: 'published',
    views: 34100,
    likes: 4290,
    isPremium: false,
    duration: '0:42',
    createdAt: '2026-03-25T11:45:00Z'
  },
  {
    _id: 'vid-105',
    title: 'Vastu Tips for Main Entrance: Attract Positive Energy & Wealth',
    description: 'North-East entrance dos and don\'ts to unblock stagnation according to traditional Vastu Shastra.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-golden-dust-particles-moving-against-black-background-41628-large.mp4',
    thumbnail: '/src/assets/images/reels_astrology_cover_1791176913592.jpg',
    category: 'Vastu Shastra',
    tags: ['Vastu', 'HomeHarmony', 'Energy', 'Remedies'],
    status: 'published',
    views: 11200,
    likes: 980,
    isPremium: true,
    duration: '0:55',
    createdAt: '2026-03-28T16:00:00Z'
  }
];

export const ASTRO_CATEGORIES = [
  'All',
  'Kundli & Dasha',
  'Career & Wealth',
  'Planetary Transits',
  'Tarot & Cards',
  'Vastu Shastra'
];

export const INITIAL_AI_SETTINGS = {
  aiName: 'AstroAi Panditji',
  welcomeMessage: 'Namaste! Main aapka AI Astro Guide hoon. Janam kundli, graha dasha, career, vivah ya dhan sambhandhit sawal poochiye.',
  systemInstructions: 'You are AstroAi, a compassionate and deeply knowledgeable Vedic and Western Astrologer. Analyze the user\'s birth chart details (Date, Time, Place of Birth, Ascendant/Rashi) with precision. Give grounded, practical insights and traditional Vedic remedies (mantras, gemstones, charity, fasting). Maintain ethics and provide clear disclaimers that astrology is guidance, not guaranteed fate.',
  astrologyGuidelines: 'Vedic Parashari system with KP astrology and transit overlay. Avoid pessimistic doom-mongering; offer uplifting remedies.',
  responseLanguage: 'Hinglish (Hindi + English)',
  freeUserLimit: 5,
  premiumUserLimit: 9999,
  premiumPrompt: 'Premium Vedic Deep Dive: House-by-House Lordship analysis with Vimshottari Dasha timing, Gochar transits, and customized gemstones and rudraksha recommendations.'
};

export const QUICK_PROMPTS = [
  { label: 'Career & Job Change', prompt: 'Mera career kaisa rahega? Kya agle 6 mahine me nayi job ya promotion ke yog hain?' },
  { label: 'Marriage & Kundli', prompt: 'Meri marriage kab tak hone ki sambhavna hai aur jeevan saathi kaisa milega?' },
  { label: 'Financial Prospects', prompt: 'Mere kundli ke hisaab se financial prospects aur wealth growth kab shuru hogi?' },
  { label: 'Shani / Rahu Dasha', prompt: 'Meri kundli me kaunsi Mahadasha chal rahi hai aur iske kya prabhav hain?' },
  { label: 'Business vs Job', prompt: 'Kya mere liye business karna behtar rahega ya corporate job?' },
  { label: 'Gemstone & Remedy', prompt: 'Mujhe kaun sa ratna (gemstone) dharan karna chahiye mental peace aur success ke liye?' }
];

// Sample AI astrology responses generator for fallback/instant answering
export const generateAstrologyResponse = (userQuestion, profile = {}) => {
  const name = profile.name || 'Bhakt';
  const rashi = profile.rashi || 'Mesh / Aries';
  const q = userQuestion.toLowerCase();

  if (q.includes('career') || q.includes('job') || q.includes('promotion') || q.includes('naukri')) {
    return `Namaste ${name}! Aapki kundli ke 10th house (Karma Bhava) aur Guru (Jupiter) ke Gochar ka aakalan karne par yeh pata chalta hai:

1. **Vartaman Sthiti**: Aapke dashmesh ki sthiti anukool disha me badh rahi hai. Pichle kuch mahino ka mental pressure ab halka hoga.
2. **Shubh Samay**: Agle 3 se 7 mahine ke dauran nayi opportunity ya responsibility milne ke thos yog hain. Especially Thursday aur Wednesday ke din decisive steps lein.
3. **Upay (Remedies)**:
   - Brihaspati (Guru) Beej Mantra ka jaap karein: *"Om Gram Greem Groum Sah Guruve Namah"*.
   - Har Brihaspativar (Thursday) ko chane ki daal ya peeli vastu ka daan karein.
   - Surya Dev ko subah taambe ke lote se arghya dein.`;
  }

  if (q.includes('marriage') || q.includes('shadi') || q.includes('vivah') || q.includes('relationship')) {
    return `Namaste ${name}! 7th house (Kalatra Bhava) aur Shukra (Venus) ki dasha par dhyan dete hue:

1. **Vivah Yog**: Aapke chart me 7th lord ki sthiti darshati hai ki aapka jeevan saathi supportive, intellectual aur sanskari vyaktitva ka hoga.
2. **Samay**: Vartaman dasha anukool ban rahi hai. Kundli milan me Nadi aur Bhakoot gun par vishesh dhyan dena uchit hoga.
3. **Upay**:
   - Shukra Dev ke liye *"Om Shum Shukraya Namah"* ka jaap karein.
   - Shiv-Parvati puja har Somvar karein aur kheer ka bhog lagayein.`;
  }

  if (q.includes('finance') || q.includes('dhan') || q.includes('money') || q.includes('wealth')) {
    return `Namaste ${name}! Kundli ke 2nd house (Dhana) aur 11th house (Labha) ka vishleshan:

1. **Arthik Sthiti**: Dhan labha ke yog achhe hain par bina soche samjhe speculative investments (crypto/lottery) se bachein.
2. **Wealth Accumulation**: Jupiter ki drishti 2nd house par aane se saving capacity badhegi.
3. **Upay**:
   - Shukrawar ko Mahalaxmi Ashtakam ka path karein.
   - Apne purse ya locker me chandi ka ek chhota chaukor tukda rakhein.`;
  }

  return `Namaste ${name}! Aapke sawal: "${userQuestion}" par graha sthiti ka vishleshan:

1. **Graha Dasha**: Aapki vartaman Gochar sthiti me Surya aur Budh ka prabhav prabal hai, jo aapko logical decision lene me madad karega.
2. **Margdarshan**: Kisi bhi bade faisle ke liye jaldbaazi na karein. Apne intuition par vishwas rakhein.
3. **Dainik Upay**:
   - Subah Gayatri Mantra ka 11 baar jaap karein.
   - Pakshiyon ko daana aur paani niyamit roop se dein.

Agar aap deep kundli divisional charts (D-9 Navamsha, D-10 Dashamsha) aur personal remedies chahte hain, toh AstroAi Premium ₹299 activate karein!`;
};
