
export interface WordTiming {
  text: string;
  startTime: number;
  endTime: number;
}

export interface Ayah {
  id: number;
  text: string;
  audioUrl: string;
  words: WordTiming[];
  tafsir: string; // Simplified explanation for kids
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  ayahs: Ayah[];
}

// Progress tracking types
export interface UserProgress {
  completedSurahs: number[]; // IDs of completed surahs
  currentSurah: number | null; // Current surah being read
  totalStars: number; // Total stars earned
  lastVisit: string; // Last visit date
  surahProgress: { [surahId: number]: number }; // Progress per surah (percentage)
}
