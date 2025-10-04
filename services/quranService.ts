import type { Surah } from '../types';
import { getTafsir } from '../data/tafsir-egyptian';

// Cache for storing fetched surahs
const surahCache: Map<number, Surah> = new Map();
let surahListCache: { id: number; name: string; englishName: string }[] | null = null;

// Surah metadata (114 surahs)
const SURAH_METADATA = [
  { id: 1, name: "الفَاتِحَة", englishName: "Al-Fatiha", ayahCount: 7 },
  { id: 2, name: "البَقَرَة", englishName: "Al-Baqara", ayahCount: 286 },
  { id: 3, name: "آل عِمْرَان", englishName: "Aal-i-Imraan", ayahCount: 200 },
  { id: 4, name: "النِّسَاء", englishName: "An-Nisaa", ayahCount: 176 },
  { id: 5, name: "المَائدة", englishName: "Al-Maaida", ayahCount: 120 },
  { id: 6, name: "الأَنْعَام", englishName: "Al-An'aam", ayahCount: 165 },
  { id: 7, name: "الأَعْرَاف", englishName: "Al-A'raaf", ayahCount: 206 },
  { id: 8, name: "الأَنْفَال", englishName: "Al-Anfaal", ayahCount: 75 },
  { id: 9, name: "التَّوْبَة", englishName: "At-Tawba", ayahCount: 129 },
  { id: 10, name: "يُونُس", englishName: "Yunus", ayahCount: 109 },
  { id: 11, name: "هُود", englishName: "Hud", ayahCount: 123 },
  { id: 12, name: "يُوسُف", englishName: "Yusuf", ayahCount: 111 },
  { id: 13, name: "الرَّعْد", englishName: "Ar-Ra'd", ayahCount: 43 },
  { id: 14, name: "إِبْرَاهِيم", englishName: "Ibrahim", ayahCount: 52 },
  { id: 15, name: "الحِجْر", englishName: "Al-Hijr", ayahCount: 99 },
  { id: 16, name: "النَّحْل", englishName: "An-Nahl", ayahCount: 128 },
  { id: 17, name: "الإِسْرَاء", englishName: "Al-Israa", ayahCount: 111 },
  { id: 18, name: "الكَهْف", englishName: "Al-Kahf", ayahCount: 110 },
  { id: 19, name: "مَرْيَم", englishName: "Maryam", ayahCount: 98 },
  { id: 20, name: "طه", englishName: "Taa-Haa", ayahCount: 135 },
  { id: 21, name: "الأَنْبِيَاء", englishName: "Al-Anbiyaa", ayahCount: 112 },
  { id: 22, name: "الحَجّ", englishName: "Al-Hajj", ayahCount: 78 },
  { id: 23, name: "المُؤْمِنُون", englishName: "Al-Muminoon", ayahCount: 118 },
  { id: 24, name: "النُّور", englishName: "An-Noor", ayahCount: 64 },
  { id: 25, name: "الفُرْقَان", englishName: "Al-Furqaan", ayahCount: 77 },
  { id: 26, name: "الشُّعَرَاء", englishName: "Ash-Shu'araa", ayahCount: 227 },
  { id: 27, name: "النَّمْل", englishName: "An-Naml", ayahCount: 93 },
  { id: 28, name: "القَصَص", englishName: "Al-Qasas", ayahCount: 88 },
  { id: 29, name: "العَنْكَبُوت", englishName: "Al-Ankaboot", ayahCount: 69 },
  { id: 30, name: "الرُّوم", englishName: "Ar-Room", ayahCount: 60 },
  { id: 31, name: "لُقْمَان", englishName: "Luqman", ayahCount: 34 },
  { id: 32, name: "السَّجْدَة", englishName: "As-Sajda", ayahCount: 30 },
  { id: 33, name: "الأَحْزَاب", englishName: "Al-Ahzaab", ayahCount: 73 },
  { id: 34, name: "سَبَأ", englishName: "Saba", ayahCount: 54 },
  { id: 35, name: "فَاطِر", englishName: "Faatir", ayahCount: 45 },
  { id: 36, name: "يس", englishName: "Yaseen", ayahCount: 83 },
  { id: 37, name: "الصَّافَّات", englishName: "As-Saaffaat", ayahCount: 182 },
  { id: 38, name: "ص", englishName: "Saad", ayahCount: 88 },
  { id: 39, name: "الزُّمَر", englishName: "Az-Zumar", ayahCount: 75 },
  { id: 40, name: "غَافِر", englishName: "Ghafir", ayahCount: 85 },
  { id: 41, name: "فُصِّلَت", englishName: "Fussilat", ayahCount: 54 },
  { id: 42, name: "الشُّورَى", englishName: "Ash-Shura", ayahCount: 53 },
  { id: 43, name: "الزُّخْرُف", englishName: "Az-Zukhruf", ayahCount: 89 },
  { id: 44, name: "الدُّخَان", englishName: "Ad-Dukhaan", ayahCount: 59 },
  { id: 45, name: "الجَاثِيَة", englishName: "Al-Jaathiya", ayahCount: 37 },
  { id: 46, name: "الأَحْقَاف", englishName: "Al-Ahqaf", ayahCount: 35 },
  { id: 47, name: "مُحَمَّد", englishName: "Muhammad", ayahCount: 38 },
  { id: 48, name: "الفَتْح", englishName: "Al-Fath", ayahCount: 29 },
  { id: 49, name: "الحُجُرَات", englishName: "Al-Hujuraat", ayahCount: 18 },
  { id: 50, name: "ق", englishName: "Qaaf", ayahCount: 45 },
  { id: 51, name: "الذَّارِيَات", englishName: "Adh-Dhaariyat", ayahCount: 60 },
  { id: 52, name: "الطُّور", englishName: "At-Tur", ayahCount: 49 },
  { id: 53, name: "النَّجْم", englishName: "An-Najm", ayahCount: 62 },
  { id: 54, name: "القَمَر", englishName: "Al-Qamar", ayahCount: 55 },
  { id: 55, name: "الرَّحْمَن", englishName: "Ar-Rahmaan", ayahCount: 78 },
  { id: 56, name: "الوَاقِعَة", englishName: "Al-Waaqia", ayahCount: 96 },
  { id: 57, name: "الحَدِيد", englishName: "Al-Hadid", ayahCount: 29 },
  { id: 58, name: "المُجَادَلَة", englishName: "Al-Mujaadila", ayahCount: 22 },
  { id: 59, name: "الحَشْر", englishName: "Al-Hashr", ayahCount: 24 },
  { id: 60, name: "المُمْتَحَنَة", englishName: "Al-Mumtahana", ayahCount: 13 },
  { id: 61, name: "الصَّف", englishName: "As-Saff", ayahCount: 14 },
  { id: 62, name: "الجُمُعَة", englishName: "Al-Jumu'a", ayahCount: 11 },
  { id: 63, name: "المُنَافِقُون", englishName: "Al-Munaafiqoon", ayahCount: 11 },
  { id: 64, name: "التَّغَابُن", englishName: "At-Taghaabun", ayahCount: 18 },
  { id: 65, name: "الطَّلَاق", englishName: "At-Talaaq", ayahCount: 12 },
  { id: 66, name: "التَّحْرِيم", englishName: "At-Tahrim", ayahCount: 12 },
  { id: 67, name: "المُلْك", englishName: "Al-Mulk", ayahCount: 30 },
  { id: 68, name: "القَلَم", englishName: "Al-Qalam", ayahCount: 52 },
  { id: 69, name: "الحَاقَّة", englishName: "Al-Haaqqa", ayahCount: 52 },
  { id: 70, name: "المَعَارِج", englishName: "Al-Ma'aarij", ayahCount: 44 },
  { id: 71, name: "نُوح", englishName: "Nooh", ayahCount: 28 },
  { id: 72, name: "الجِنّ", englishName: "Al-Jinn", ayahCount: 28 },
  { id: 73, name: "المُزَّمِّل", englishName: "Al-Muzzammil", ayahCount: 20 },
  { id: 74, name: "المُدَّثِّر", englishName: "Al-Muddaththir", ayahCount: 56 },
  { id: 75, name: "القِيَامَة", englishName: "Al-Qiyaama", ayahCount: 40 },
  { id: 76, name: "الإِنْسَان", englishName: "Al-Insaan", ayahCount: 31 },
  { id: 77, name: "المُرْسَلَات", englishName: "Al-Mursalaat", ayahCount: 50 },
  { id: 78, name: "النَّبَأ", englishName: "An-Naba", ayahCount: 40 },
  { id: 79, name: "النَّازِعَات", englishName: "An-Naazi'aat", ayahCount: 46 },
  { id: 80, name: "عَبَس", englishName: "Abasa", ayahCount: 42 },
  { id: 81, name: "التَّكْوِير", englishName: "At-Takwir", ayahCount: 29 },
  { id: 82, name: "الانْفِطَار", englishName: "Al-Infitaar", ayahCount: 19 },
  { id: 83, name: "المُطَفِّفِين", englishName: "Al-Mutaffifin", ayahCount: 36 },
  { id: 84, name: "الانْشِقَاق", englishName: "Al-Inshiqaaq", ayahCount: 25 },
  { id: 85, name: "البُرُوج", englishName: "Al-Burooj", ayahCount: 22 },
  { id: 86, name: "الطَّارِق", englishName: "At-Taariq", ayahCount: 17 },
  { id: 87, name: "الأَعْلَى", englishName: "Al-A'laa", ayahCount: 19 },
  { id: 88, name: "الغَاشِيَة", englishName: "Al-Ghaashiya", ayahCount: 26 },
  { id: 89, name: "الفَجْر", englishName: "Al-Fajr", ayahCount: 30 },
  { id: 90, name: "البَلَد", englishName: "Al-Balad", ayahCount: 20 },
  { id: 91, name: "الشَّمْس", englishName: "Ash-Shams", ayahCount: 15 },
  { id: 92, name: "اللَّيْل", englishName: "Al-Lail", ayahCount: 21 },
  { id: 93, name: "الضُّحَى", englishName: "Ad-Dhuhaa", ayahCount: 11 },
  { id: 94, name: "الشَّرْح", englishName: "Ash-Sharh", ayahCount: 8 },
  { id: 95, name: "التِّين", englishName: "At-Tin", ayahCount: 8 },
  { id: 96, name: "العَلَق", englishName: "Al-Alaq", ayahCount: 19 },
  { id: 97, name: "القَدْر", englishName: "Al-Qadr", ayahCount: 5 },
  { id: 98, name: "البَيِّنَة", englishName: "Al-Bayyina", ayahCount: 8 },
  { id: 99, name: "الزَّلْزَلَة", englishName: "Az-Zalzala", ayahCount: 8 },
  { id: 100, name: "العَادِيَات", englishName: "Al-Aadiyaat", ayahCount: 11 },
  { id: 101, name: "القَارِعَة", englishName: "Al-Qaari'a", ayahCount: 11 },
  { id: 102, name: "التَّكَاثُر", englishName: "At-Takaathur", ayahCount: 8 },
  { id: 103, name: "العَصْر", englishName: "Al-Asr", ayahCount: 3 },
  { id: 104, name: "الهُمَزَة", englishName: "Al-Humaza", ayahCount: 9 },
  { id: 105, name: "الفِيل", englishName: "Al-Fil", ayahCount: 5 },
  { id: 106, name: "قُرَيْش", englishName: "Quraish", ayahCount: 4 },
  { id: 107, name: "المَاعُون", englishName: "Al-Maa'un", ayahCount: 7 },
  { id: 108, name: "الكَوْثَر", englishName: "Al-Kawthar", ayahCount: 3 },
  { id: 109, name: "الكَافِرُون", englishName: "Al-Kaafiroon", ayahCount: 6 },
  { id: 110, name: "النَّصْر", englishName: "An-Nasr", ayahCount: 3 },
  { id: 111, name: "المَسَد", englishName: "Al-Masad", ayahCount: 5 },
  { id: 112, name: "الإِخْلَاص", englishName: "Al-Ikhlas", ayahCount: 4 },
  { id: 113, name: "الفَلَق", englishName: "Al-Falaq", ayahCount: 5 },
  { id: 114, name: "النَّاس", englishName: "An-Nas", ayahCount: 6 },
];

// Fetch surah from API
async function fetchSurahFromAPI(surahNumber: number): Promise<Surah | null> {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const data = await response.json();
    
    if (data.code !== 200) {
      console.error('Failed to fetch surah:', surahNumber);
      return null;
    }

    const surahData = data.data;
    
    return {
      id: surahData.number,
      name: surahData.name,
      englishName: surahData.englishName,
      ayahs: surahData.ayahs.map((ayah: any) => {
        const surahNum = String(surahData.number).padStart(3, '0');
        const ayahNum = String(ayah.numberInSurah).padStart(3, '0');
        
        return {
          id: ayah.numberInSurah,
          text: ayah.text,
          // استخدام صوت الشيخ المنشاوي المعلم (Minshawy_Murattal)
          audioUrl: `https://everyayah.com/data/Minshawy_Murattal_128kbps/${surahNum}${ayahNum}.mp3`,
          words: [],
          // استخدام التفسير المبسط
          tafsir: getTafsir(surahData.number, ayah.numberInSurah)
        };
      })
    };
  } catch (error) {
    console.error('Error fetching surah:', error);
    return null;
  }
}

// Old mock data for fallback
const MOCK_DATA: Surah[] = [
  {
    id: 1,
    name: "الفَاتِحَة",
    englishName: "Al-Fatiha",
    ayahs: [
      {
        id: 1,
        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/001001.mp3",
        words: [
          { text: "بِسْمِ", startTime: 0.5, endTime: 0.9 },
          { text: "اللَّهِ", startTime: 0.9, endTime: 1.5 },
          { text: "الرَّحْمَٰنِ", startTime: 1.5, endTime: 2.5 },
          { text: "الرَّحِيمِ", startTime: 2.5, endTime: 3.5 },
        ],
        tafsir: "بنبدأ كل حاجة بنعملها باسم ربنا، اللي رحمته واسعة على كل الناس 💚",
      },
      {
        id: 2,
        text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/001002.mp3",
        words: [
          { text: "الْحَمْدُ", startTime: 0.5, endTime: 1.2 },
          { text: "لِلَّهِ", startTime: 1.2, endTime: 1.8 },
          { text: "رَبِّ", startTime: 1.8, endTime: 2.2 },
          { text: "الْعَالَمِينَ", startTime: 2.2, endTime: 3.5 },
        ],
        tafsir: "الحمد والشكر كله لله، اللي خلق كل حاجة في الدنيا دي 🌍",
      },
      {
        id: 3,
        text: "الرَّحْمَٰنِ الرَّحِيمِ",
        audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/001003.mp3",
        words: [
            { text: "الرَّحْمَٰنِ", startTime: 0.5, endTime: 1.5 },
            { text: "الرَّحِيمِ", startTime: 1.5, endTime: 2.5 },
        ],
        tafsir: "ربنا الرحمن الرحيم، رحمته كبيرة جداً على كل الناس 🤲",
      },
    ],
  },
   {
    id: 103,
    name: "العَصْر",
    englishName: "Al-Asr",
    ayahs: [
      {
        id: 1,
        text: "وَالْعَصْرِ",
        audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/103001.mp3",
        words: [
          { text: "وَالْعَصْرِ", startTime: 0.5, endTime: 1.8 },
        ],
        tafsir: "ربنا بيقسم بالوقت والزمن، عشان الوقت مهم جداً ⏰",
      },
      {
        id: 2,
        text: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
        audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/103002.mp3",
        words: [
          { text: "إِنَّ", startTime: 0.4, endTime: 0.7 },
          { text: "الْإِنسَانَ", startTime: 0.7, endTime: 1.5 },
          { text: "لَفِي", startTime: 1.5, endTime: 1.9 },
          { text: "خُسْرٍ", startTime: 1.9, endTime: 2.5 },
        ],
        tafsir: "الإنسان لو مش بيعمل حاجات كويسة هيخسر، زي ما بنخسر في اللعبة 😔",
      },
      {
        id: 3,
        text: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
        audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/103003.mp3",
        words: [
          { text: "إِلَّا", startTime: 0.4, endTime: 0.8 },
          { text: "الَّذِينَ", startTime: 0.8, endTime: 1.3 },
          { text: "آمَنُوا", startTime: 1.3, endTime: 2.0 },
          { text: "وَعَمِلُوا", startTime: 2.0, endTime: 2.6 },
          { text: "الصَّالِحَاتِ", startTime: 2.6, endTime: 3.6 },
          { text: "وَتَوَاصَوْا", startTime: 3.6, endTime: 4.5 },
          { text: "بِالْحَقِّ", startTime: 4.5, endTime: 5.2 },
          { text: "وَتَوَاصَوْا", startTime: 5.2, endTime: 6.0 },
          { text: "بِالصَّبْرِ", startTime: 6.0, endTime: 6.8 },
        ],
        tafsir: "بس اللي بيؤمنوا بربنا ويعملوا حاجات حلوة وينصحوا بعض ويصبروا، دول هم الكسبانين 🌟",
      },
    ],
  },
  {
    id: 112,
    name: "الإِخْلَاص",
    englishName: "Al-Ikhlas",
    ayahs: [
      {
        id: 1,
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/112001.mp3",
        words: [
          { text: "قُلْ", startTime: 0.4, endTime: 0.7 },
          { text: "هُوَ", startTime: 0.7, endTime: 1.0 },
          { text: "اللَّهُ", startTime: 1.0, endTime: 1.5 },
          { text: "أَحَدٌ", startTime: 1.5, endTime: 2.2 },
        ],
        tafsir: "قول يا محمد: ربنا واحد أحد، مفيش حد زيه أبداً ☝️",
      },
      {
        id: 2,
        text: "اللَّهُ الصَّمَدُ",
        audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/112002.mp3",
        words: [
          { text: "اللَّهُ", startTime: 0.5, endTime: 1.1 },
          { text: "الصَّمَدُ", startTime: 1.1, endTime: 2.0 },
        ],
        tafsir: "ربنا الصمد يعني كل الناس محتاجاله، وهو مش محتاج حد 💪",
      },
      {
        id: 3,
        text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/112003.mp3",
        words: [
          { text: "لَمْ", startTime: 0.4, endTime: 0.7 },
          { text: "يَلِدْ", startTime: 0.7, endTime: 1.1 },
          { text: "وَلَمْ", startTime: 1.1, endTime: 1.5 },
          { text: "يُولَدْ", startTime: 1.5, endTime: 2.2 },
        ],
        tafsir: "ربنا مالوش أولاد ومحدش خلقه، هو اللي خلق كل حاجة 🌍",
      },
       {
        id: 4,
        text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/112004.mp3",
        words: [
          { text: "وَلَمْ", startTime: 0.4, endTime: 0.7 },
          { text: "يَكُن", startTime: 0.7, endTime: 1.1 },
          { text: "لَّهُ", startTime: 1.1, endTime: 1.4 },
          { text: "كُفُوًا", startTime: 1.4, endTime: 2.0 },
          { text: "أَحَدٌ", startTime: 2.0, endTime: 2.5 },
        ],
        tafsir: "مفيش حد يشبه ربنا أو يساويه في أي حاجة، هو الأعظم ✨",
      },
    ],
  },
  {
    id: 113,
    name: "الفَلَق",
    englishName: "Al-Falaq",
    ayahs: [
        { id: 1, text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/113001.mp3", words: [
            { "text": "قُلْ", "startTime": 0.5, "endTime": 0.7 },
            { "text": "أَعُوذُ", "startTime": 0.7, "endTime": 1.3 },
            { "text": "بِرَبِّ", "startTime": 1.3, "endTime": 1.8 },
            { "text": "الْفَلَقِ", "startTime": 1.8, "endTime": 2.5 }
        ], tafsir: "قول يا محمد: أنا بستعيذ بربنا رب الفجر والصبح 🌅" },
        { id: 2, text: "مِن شَرِّ مَا خَلَقَ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/113002.mp3", words: [
            { "text": "مِن", "startTime": 0.5, "endTime": 0.7 },
            { "text": "شَرِّ", "startTime": 0.7, "endTime": 1.1 },
            { "text": "مَا", "startTime": 1.1, "endTime": 1.4 },
            { "text": "خَلَقَ", "startTime": 1.4, "endTime": 2.0 }
        ], tafsir: "من شر كل المخلوقات اللي ممكن تأذينا 🛡️" },
        { id: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/113003.mp3", words: [
            { text: "وَمِن", startTime: 0.5, endTime: 0.8 }, { text: "شَرِّ", startTime: 0.8, endTime: 1.2 }, { text: "غَاسِقٍ", startTime: 1.2, endTime: 1.8 }, { text: "إِذَا", startTime: 1.8, endTime: 2.2 }, { text: "وَقَبَ", startTime: 2.2, endTime: 2.8 }
        ], tafsir: "ومن شر الليل الضلمة لما ييجي 🌙" },
        { id: 4, text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/113004.mp3", words: [
            { text: "وَمِن", startTime: 0.5, endTime: 0.8 }, { text: "شَرِّ", startTime: 0.8, endTime: 1.2 }, { text: "النَّفَّاثَاتِ", startTime: 1.2, endTime: 2.2 }, { text: "فِي", startTime: 2.2, endTime: 2.5 }, { text: "الْعُقَدِ", startTime: 2.5, endTime: 3.2 }
        ], tafsir: "ومن شر السحرة اللي بينفخوا في العقد عشان يأذوا الناس 🪢" },
        { id: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/113005.mp3", words: [
            { text: "وَمِن", startTime: 0.5, endTime: 0.8 }, { text: "شَرِّ", startTime: 0.8, endTime: 1.2 }, { text: "حَاسِدٍ", startTime: 1.2, endTime: 1.8 }, { text: "إِذَا", startTime: 1.8, endTime: 2.2 }, { text: "حَسَدَ", startTime: 2.2, endTime: 2.8 }
        ], tafsir: "ومن شر الحاسد اللي بيتمنى إن النعمة تروح من غيره 😔" },
    ]
  },
   {
    id: 114,
    name: "النَّاس",
    englishName: "An-Nas",
    ayahs: [
        { id: 1, text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/114001.mp3", words: [
            { "text": "قُلْ", "startTime": 0.5, "endTime": 0.8 },
            { "text": "أَعُوذُ", "startTime": 0.8, "endTime": 1.4 },
            { "text": "بِرَبِّ", "startTime": 1.4, "endTime": 1.9 },
            { "text": "النَّاسِ", "startTime": 1.9, "endTime": 2.6 }
        ], tafsir: "قول يا محمد: أنا بستعيذ بربنا رب كل الناس 👥" },
        { id: 2, text: "مَلِكِ النَّاسِ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/114002.mp3", words: [
            { "text": "مَلِكِ", "startTime": 0.5, "endTime": 1.1 },
            { "text": "النَّاسِ", "startTime": 1.1, "endTime": 1.9 }
        ], tafsir: "ربنا هو ملك كل الناس، بيتحكم في كل حاجة 👑" },
        { id: 3, text: "إِلَٰهِ النَّاسِ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/114003.mp3", words: [
            { text: "إِلَٰهِ", startTime: 0.5, endTime: 1.1 }, { text: "النَّاسِ", startTime: 1.1, endTime: 1.9 }
        ], tafsir: "ربنا هو إله كل الناس، اللي يستاهل نعبده لوحده 🤲" },
        { id: 4, text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/114004.mp3", words: [
            { text: "مِن", startTime: 0.5, endTime: 0.7 }, { text: "شَرِّ", startTime: 0.7, endTime: 1.1 }, { text: "الْوَسْوَاسِ", startTime: 1.1, endTime: 2.0 }, { text: "الْخَنَّاسِ", startTime: 2.0, endTime: 3.0 }
        ], tafsir: "من شر الشيطان اللي بيوسوس وبعدين يختفي 👹" },
        { id: 5, text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/114005.mp3", words: [
            { text: "الَّذِي", startTime: 0.5, endTime: 1.0 }, { text: "يُوَسْوِسُ", startTime: 1.0, endTime: 1.8 }, { text: "فِي", startTime: 1.8, endTime: 2.1 }, { text: "صُدُورِ", startTime: 2.1, endTime: 2.8 }, { text: "النَّاسِ", startTime: 2.8, endTime: 3.5 }
        ], tafsir: "اللي بيحط الأفكار الوحشة في قلوب الناس 💭" },
        { id: 6, text: "مِنَ الْجِنَّةِ وَالنَّاسِ", audioUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/114006.mp3", words: [
            { text: "مِنَ", startTime: 0.5, endTime: 0.8 }, { text: "الْجِنَّةِ", startTime: 0.8, endTime: 1.6 }, { text: "وَالنَّاسِ", startTime: 1.6, endTime: 2.5 }
        ], tafsir: "سواء كان الشيطان ده من الجن أو من الناس الوحشين 😈" },
    ]
  }
];

export const getSurahList = async (): Promise<{ id: number; name: string; englishName: string }[]> => {
  // Return cached list if available
  if (surahListCache) {
    return surahListCache;
  }

  // Return all 114 surahs metadata
  surahListCache = SURAH_METADATA.map(({ id, name, englishName }) => ({ id, name, englishName }));
  return surahListCache;
};

export const getSurahById = async (id: number): Promise<Surah | undefined> => {
  // Check cache first
  if (surahCache.has(id)) {
    return surahCache.get(id);
  }

  // Try to fetch from API
  const surah = await fetchSurahFromAPI(id);
  
  if (surah) {
    // Cache the result
    surahCache.set(id, surah);
    return surah;
  }

  // Fallback to mock data if API fails
  const mockSurah = MOCK_DATA.find((s) => s.id === id);
  if (mockSurah) {
    surahCache.set(id, mockSurah);
  }
  return mockSurah;
};