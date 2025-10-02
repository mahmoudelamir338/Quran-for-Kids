import type { Surah } from '../types';

const MOCK_DATA: Surah[] = [
  {
    id: 1,
    name: "الفَاتِحَة",
    englishName: "Al-Fatiha",
    ayahs: [
      {
        id: 1,
        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
        words: [
          { text: "بِسْمِ", startTime: 0.5, endTime: 0.9 },
          { text: "اللَّهِ", startTime: 0.9, endTime: 1.5 },
          { text: "الرَّحْمَٰنِ", startTime: 1.5, endTime: 2.5 },
          { text: "الرَّحِيمِ", startTime: 2.5, endTime: 3.5 },
        ],
        tafsir: "نبدأ بكل أعمالنا باسم الله، الذي رحمته واسعة تشمل كل شيء، وهو يرحم المؤمنين رحمة خاصة.",
      },
      {
        id: 2,
        text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
        words: [
          { text: "الْحَمْدُ", startTime: 0.5, endTime: 1.2 },
          { text: "لِلَّهِ", startTime: 1.2, endTime: 1.8 },
          { text: "رَبِّ", startTime: 1.8, endTime: 2.2 },
          { text: "الْعَالَمِينَ", startTime: 2.2, endTime: 3.5 },
        ],
        tafsir: "كل الشكر والثناء الجميل لله وحده، فهو الذي خلق ورعى كل المخلوقات.",
      },
      {
        id: 3,
        text: "الرَّحْمَٰنِ الرَّحِيمِ",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001003.mp3",
        words: [
            { text: "الرَّحْمَٰنِ", startTime: 0.5, endTime: 1.5 },
            { text: "الرَّحِيمِ", startTime: 1.5, endTime: 2.5 },
        ],
        tafsir: "هو الله الذي رحمته عظيمة جدًا، يرحمنا في الدنيا والآخرة.",
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
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/103001.mp3",
        words: [
          { text: "وَالْعَصْرِ", startTime: 0.5, endTime: 1.8 },
        ],
        tafsir: "يقسم الله بالزمن، وهو وقتنا الذي نعيشه.",
      },
      {
        id: 2,
        text: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/103002.mp3",
        words: [
          { text: "إِنَّ", startTime: 0.4, endTime: 0.7 },
          { text: "الْإِنسَانَ", startTime: 0.7, endTime: 1.5 },
          { text: "لَفِي", startTime: 1.5, endTime: 1.9 },
          { text: "خُسْرٍ", startTime: 1.9, endTime: 2.5 },
        ],
        tafsir: "أن كل الناس قد يضيعون وقتهم في أشياء غير مفيدة ويخسرون.",
      },
      {
        id: 3,
        text: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/103003.mp3",
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
        tafsir: "إلا الذين يؤمنون بالله ويعملون أعمالاً طيبة، وينصحون بعضهم البعض بفعل الخير والصبر على الطاعة.",
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
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
        words: [
          { text: "قُلْ", startTime: 0.4, endTime: 0.7 },
          { text: "هُوَ", startTime: 0.7, endTime: 1.0 },
          { text: "اللَّهُ", startTime: 1.0, endTime: 1.5 },
          { text: "أَحَدٌ", startTime: 1.5, endTime: 2.2 },
        ],
        tafsir: "قل يا محمد، الله هو الواحد الأحد، لا يوجد مثله شيء.",
      },
      {
        id: 2,
        text: "اللَّهُ الصَّمَدُ",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112002.mp3",
        words: [
          { text: "اللَّهُ", startTime: 0.5, endTime: 1.1 },
          { text: "الصَّمَدُ", startTime: 1.1, endTime: 2.0 },
        ],
        tafsir: "الله هو الذي نلجأ إليه ونحتاجه في كل أمورنا، وهو لا يحتاج لأحد.",
      },
      {
        id: 3,
        text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112003.mp3",
        words: [
          { text: "لَمْ", startTime: 0.4, endTime: 0.7 },
          { text: "يَلِدْ", startTime: 0.7, endTime: 1.1 },
          { text: "وَلَمْ", startTime: 1.1, endTime: 1.5 },
          { text: "يُولَدْ", startTime: 1.5, endTime: 2.2 },
        ],
        tafsir: "ليس له أولاد، ولم يلده أحد، فهو الخالق وليس مخلوق.",
      },
       {
        id: 4,
        text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112004.mp3",
        words: [
          { text: "وَلَمْ", startTime: 0.4, endTime: 0.7 },
          { text: "يَكُن", startTime: 0.7, endTime: 1.1 },
          { text: "لَّهُ", startTime: 1.1, endTime: 1.4 },
          { text: "كُفُوًا", startTime: 1.4, endTime: 2.0 },
          { text: "أَحَدٌ", startTime: 2.0, endTime: 2.5 },
        ],
        tafsir: "لا يوجد أحد يشبهه أو يساويه في أي شيء.",
      },
    ],
  },
  {
    id: 113,
    name: "الفَلَق",
    englishName: "Al-Falaq",
    ayahs: [
        { id: 1, text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113001.mp3", words: [
            { "text": "قُلْ", "startTime": 0.5, "endTime": 0.7 },
            { "text": "أَعُوذُ", "startTime": 0.7, "endTime": 1.3 },
            { "text": "بِرَبِّ", "startTime": 1.3, "endTime": 1.8 },
            { "text": "الْفَلَقِ", "startTime": 1.8, "endTime": 2.5 }
        ], tafsir: "قل يا محمد، ألجأ وأحتمي بالله رب الصبح." },
        { id: 2, text: "مِن شَرِّ مَا خَلَقَ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113002.mp3", words: [
            { "text": "مِن", "startTime": 0.5, "endTime": 0.7 },
            { "text": "شَرِّ", "startTime": 0.7, "endTime": 1.1 },
            { "text": "مَا", "startTime": 1.1, "endTime": 1.4 },
            { "text": "خَلَقَ", "startTime": 1.4, "endTime": 2.0 }
        ], tafsir: "من شر كل المخلوقات التي يمكن أن تؤذي." },
        { id: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113003.mp3", words: [
            { text: "وَمِن", startTime: 0.5, endTime: 0.8 }, { text: "شَرِّ", startTime: 0.8, endTime: 1.2 }, { text: "غَاسِقٍ", startTime: 1.2, endTime: 1.8 }, { text: "إِذَا", startTime: 1.8, endTime: 2.2 }, { text: "وَقَبَ", startTime: 2.2, endTime: 2.8 }
        ], tafsir: "ومن شر الليل المظلم عندما يأتي." },
        { id: 4, text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113004.mp3", words: [
            { text: "وَمِن", startTime: 0.5, endTime: 0.8 }, { text: "شَرِّ", startTime: 0.8, endTime: 1.2 }, { text: "النَّفَّاثَاتِ", startTime: 1.2, endTime: 2.2 }, { text: "فِي", startTime: 2.2, endTime: 2.5 }, { text: "الْعُقَدِ", startTime: 2.5, endTime: 3.2 }
        ], tafsir: "ومن شر الساحرات اللاتي ينفخن في العقد ليؤذوا الناس." },
        { id: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113005.mp3", words: [
            { text: "وَمِن", startTime: 0.5, endTime: 0.8 }, { text: "شَرِّ", startTime: 0.8, endTime: 1.2 }, { text: "حَاسِدٍ", startTime: 1.2, endTime: 1.8 }, { text: "إِذَا", startTime: 1.8, endTime: 2.2 }, { text: "حَسَدَ", startTime: 2.2, endTime: 2.8 }
        ], tafsir: "ومن شر الحاسد الذي يتمنى زوال النعمة عن غيره." },
    ]
  },
   {
    id: 114,
    name: "النَّاس",
    englishName: "An-Nas",
    ayahs: [
        { id: 1, text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114001.mp3", words: [
            { "text": "قُلْ", "startTime": 0.5, "endTime": 0.8 },
            { "text": "أَعُوذُ", "startTime": 0.8, "endTime": 1.4 },
            { "text": "بِرَبِّ", "startTime": 1.4, "endTime": 1.9 },
            { "text": "النَّاسِ", "startTime": 1.9, "endTime": 2.6 }
        ], tafsir: "قل يا محمد، ألجأ وأحتمي بالله رب الناس." },
        { id: 2, text: "مَلِكِ النَّاسِ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114002.mp3", words: [
            { "text": "مَلِكِ", "startTime": 0.5, "endTime": 1.1 },
            { "text": "النَّاسِ", "startTime": 1.1, "endTime": 1.9 }
        ], tafsir: "وهو ملك الناس جميعًا، يتصرف في أمورهم." },
        { id: 3, text: "إِلَٰهِ النَّاسِ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114003.mp3", words: [
            { text: "إِلَٰهِ", startTime: 0.5, endTime: 1.1 }, { text: "النَّاسِ", startTime: 1.1, endTime: 1.9 }
        ], tafsir: "وهو إله الناس الذي يستحق العبادة وحده." },
        { id: 4, text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114004.mp3", words: [
            { text: "مِن", startTime: 0.5, endTime: 0.7 }, { text: "شَرِّ", startTime: 0.7, endTime: 1.1 }, { text: "الْوَسْوَاسِ", startTime: 1.1, endTime: 2.0 }, { text: "الْخَنَّاسِ", startTime: 2.0, endTime: 3.0 }
        ], tafsir: "من شر الشيطان الذي يوسوس ثم يختفي." },
        { id: 5, text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114005.mp3", words: [
            { text: "الَّذِي", startTime: 0.5, endTime: 1.0 }, { text: "يُوَسْوِسُ", startTime: 1.0, endTime: 1.8 }, { text: "فِي", startTime: 1.8, endTime: 2.1 }, { text: "صُدُورِ", startTime: 2.1, endTime: 2.8 }, { text: "النَّاسِ", startTime: 2.8, endTime: 3.5 }
        ], tafsir: "الذي يلقي الأفكار السيئة في قلوب الناس." },
        { id: 6, text: "مِنَ الْجِنَّةِ وَالنَّاسِ", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114006.mp3", words: [
            { text: "مِنَ", startTime: 0.5, endTime: 0.8 }, { text: "الْجِنَّةِ", startTime: 0.8, endTime: 1.6 }, { text: "وَالنَّاسِ", startTime: 1.6, endTime: 2.5 }
        ], tafsir: "سواء كان هذا الشيطان من الجن أو من الناس الأشرار." },
    ]
  }
];

export const getSurahList = async (): Promise<{ id: number; name: string; englishName: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA.map(({ id, name, englishName }) => ({ id, name, englishName })));
    }, 500);
  });
};

export const getSurahById = async (id: number): Promise<Surah | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA.find((surah) => surah.id === id));
    }, 300);
  });
};