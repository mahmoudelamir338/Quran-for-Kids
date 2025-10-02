import type { UserProgress } from '../types';

const STORAGE_KEY = 'quran_kids_progress';

const defaultProgress: UserProgress = {
  completedSurahs: [],
  currentSurah: null,
  totalStars: 0,
  lastVisit: new Date().toISOString(),
  surahProgress: {},
};

export const getProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return { ...defaultProgress };
};

export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const updateCurrentSurah = (surahId: number): void => {
  const progress = getProgress();
  progress.currentSurah = surahId;
  progress.lastVisit = new Date().toISOString();
  saveProgress(progress);
};

export const updateSurahProgress = (surahId: number, percentage: number): void => {
  const progress = getProgress();
  progress.surahProgress[surahId] = percentage;
  saveProgress(progress);
};

export const completeSurah = (surahId: number): void => {
  const progress = getProgress();
  
  // Check if surah is already completed
  if (!progress.completedSurahs.includes(surahId)) {
    progress.completedSurahs.push(surahId);
    progress.totalStars += 1; // Award one star per completed surah
    progress.surahProgress[surahId] = 100;
    saveProgress(progress);
  }
};

export const resetProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};