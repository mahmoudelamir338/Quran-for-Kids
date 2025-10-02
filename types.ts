
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
