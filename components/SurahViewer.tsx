import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Surah, Ayah, UserProgress } from '../types';
import { getSurahById } from '../services/quranService';
import { PlayIcon, PauseIcon, NextIcon, PreviousIcon, BookOpenIcon } from './icons';
import { completeSurah, updateSurahProgress } from '../services/progressService';
import RewardModal from './RewardModal';

interface SurahViewerProps {
  surahId: number;
  progress: UserProgress;
  onProgressUpdate: () => void;
}

const SurahViewer: React.FC<SurahViewerProps> = ({ surahId, progress, onProgressUpdate }) => {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reward state
  const [showReward, setShowReward] = useState(false);
  const [completedAyahs, setCompletedAyahs] = useState<Set<number>>(new Set());

  useEffect(() => {
    let isCancelled = false; // Flag to prevent race conditions

    const fetchSurah = async () => {
      setIsLoading(true);
      const surahData = await getSurahById(surahId);
      
      // Only update state if this is the most recent request
      if (!isCancelled) {
        setSurah(surahData || null);
        if (surahData) {
          ayahRefs.current = ayahRefs.current.slice(0, surahData.ayahs.length);
        }
        setCurrentAyahIndex(0);
        setIsPlaying(false);
        setCurrentWordIndex(-1);
        setCompletedAyahs(new Set());
        setIsLoading(false);
      }
    };
    fetchSurah();

    return () => {
      isCancelled = true; // Cleanup function to cancel stale requests
    };
  }, [surahId]);

  // Update progress when ayah changes
  useEffect(() => {
    if (surah && currentAyahIndex >= 0) {
      const progressPercentage = Math.round(((currentAyahIndex + 1) / surah.ayahs.length) * 100);
      updateSurahProgress(surahId, progressPercentage);
    }
  }, [currentAyahIndex, surah, surahId]);

  const currentAyah = surah?.ayahs[currentAyahIndex];
  
  const playNext = useCallback(() => {
    if (!surah) return;
    
    // Mark current ayah as completed
    setCompletedAyahs(prev => new Set(prev).add(currentAyahIndex));
    
    setCurrentAyahIndex(prevIndex => {
      if (prevIndex < surah.ayahs.length - 1) {
        return prevIndex + 1;
      } else {
        // Surah completed!
        setIsPlaying(false);
        if (!progress.completedSurahs.includes(surahId)) {
          completeSurah(surahId);
          onProgressUpdate();
          setShowReward(true);
        }
        return prevIndex;
      }
    });
  }, [surah, currentAyahIndex, surahId, progress, onProgressUpdate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const wordIndex = currentAyah?.words.findIndex(
        (word) => currentTime >= word.startTime && currentTime <= word.endTime
      ) ?? -1;
      setCurrentWordIndex(wordIndex);
    };

    const handleAudioEnd = () => {
      // Auto move to next ayah when current one ends
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [currentAyah, playNext]);
  
  useEffect(() => {
    if (surah && ayahRefs.current[currentAyahIndex]) {
        ayahRefs.current[currentAyahIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
  }, [currentAyahIndex, surah]);

  useEffect(() => {
    if (isPlaying) {
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch(e => console.error('Audio play failed', e));
      }
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);
  
  useEffect(() => {
      if(currentAyah && audioRef.current) {
        audioRef.current.src = currentAyah.audioUrl;
        if(isPlaying){
          audioRef.current.play().catch(e => console.error('Audio play failed', e));
        }
      }
  }, [currentAyah, isPlaying]);

  const togglePlayPause = () => {
    if (surah && surah.ayahs.length > 0) {
      setIsPlaying(!isPlaying);
    }
  };


  const playPrevious = useCallback(() => {
    setCurrentAyahIndex(prevIndex => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  }, []);
  
  const selectAyah = (index: number) => {
    setCurrentAyahIndex(index);
    setIsPlaying(true);
  }


  if (isLoading) {
    return <div className="flex items-center justify-center w-full h-full text-xl md:text-2xl text-teal-600">⏳ جاري تحميل السورة...</div>;
  }

  if (!surah) {
    return <div className="flex items-center justify-center w-full h-full text-xl md:text-2xl text-red-500">❌ لم يتم العثور على السورة</div>;
  }

  return (
    <div className="w-full h-full flex flex-col islamic-card rounded-2xl shadow-lg p-6 overflow-y-auto relative">
      <audio ref={audioRef} />
      <div className="text-center mb-6 flex items-center justify-center gap-4">
        <img src="/assets/mini-mushaf.svg" alt="مصحف" className="w-12 h-12" />
        <div class="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-800 islamic-glow">{surah.name}</h1>
          <p className="text-gray-600 text-sm md:text-base">{surah.englishName}</p>
        </div>
      </div>

      <div className="flex-grow space-y-4">
        {surah.ayahs.map((ayah, index) => (
          <div key={ayah.id} 
               ref={(el) => { ayahRefs.current[index] = el; }}
               onClick={() => selectAyah(index)} 
               className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${index === currentAyahIndex ? 'bg-gradient-to-r from-emerald-50 to-amber-50 border-r-4 border-emerald-600 islamic-border' : 'bg-gray-50 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-amber-50 hover:border-r-2 hover:border-emerald-400'}`}>
            <p className="text-3xl leading-relaxed text-right font-quranic" dir="rtl">
              {ayah.words.length > 0 ? (
                ayah.words.map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    className={`transition-colors duration-200 ${
                      index === currentAyahIndex && wordIdx === currentWordIndex ? 'text-orange-500' : 'text-gray-800'
                    }`}
                  >
                    {word.text}{' '}
                  </span>
                ))
              ) : (
                <span className={index === currentAyahIndex && isPlaying ? 'text-orange-500' : 'text-gray-800'}>{ayah.text}</span>
              )}
               <span className="text-lg text-emerald-700 font-bold mx-2 bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">({ayah.id})</span>
            </p>
            {index === currentAyahIndex && (
                 <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-lg border-r-4 border-emerald-600">
                    <div className="text-center">
                        <p className="text-emerald-800 font-semibold">استمع للآية بعناية</p>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
        {/* Player Controls */}
      <div className="mt-6 sticky bottom-0 bg-gradient-to-r from-emerald-50 via-amber-50 to-yellow-50 backdrop-blur-sm p-4 rounded-b-2xl z-10 shadow-lg">
        <div className="w-full max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-6">
                {/* Previous */}
                <button
                  onClick={playPrevious}
                  disabled={currentAyahIndex === 0}
                  aria-label="السابق"
                  className="p-4 rounded-full bg-white shadow-lg text-2xl text-emerald-700 disabled:opacity-40 hover:bg-emerald-50 transition-colors"
                >
                    <PreviousIcon />
                </button>

                {/* Play/Pause - Large central button */}
                <button
                  onClick={togglePlayPause}
                  aria-label="تشغيل/إيقاف"
                  className="kid-btn w-24 h-24 rounded-full flex items-center justify-center transform hover:scale-105 active:scale-95 mx-4"
                >
                    {isPlaying ? <PauseIcon className="w-14 h-14 kid-icon"/> : <PlayIcon className="w-14 h-14 kid-icon"/>}
                </button>

                {/* Next */}
                <button
                  onClick={playNext}
                  disabled={currentAyahIndex === surah.ayahs.length - 1}
                  aria-label="التالي"
                  className="p-4 rounded-full bg-white shadow-lg text-2xl text-emerald-700 disabled:opacity-40 hover:bg-emerald-50 transition-colors"
                >
                    <NextIcon />
                </button>
            </div>

            {/* Simple progress indicator */}
            <div className="mt-4 text-center">
                <p className="text-emerald-700 font-semibold">
                    الآية {currentAyahIndex + 1} من {surah.ayahs.length}
                </p>
            </div>
        </div>
      </div>

      {/* Reward Modal */}
      <RewardModal 
        show={showReward}
        onClose={() => setShowReward(false)}
        surahName={surah.name}
        starsEarned={progress.totalStars + 1}
      />
    </div>
  );
};

export default SurahViewer;