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
  const [repeatCount, setRepeatCount] = useState(1); // 1 = normal, 0 = no repeat, 3 = repeat 3 times
  const [playbackRate, setPlaybackRate] = useState(1); // normal or slow (0.85)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [audioProgress, setAudioProgress] = useState(0);
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
        setAudioProgress(0);
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
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
      const currentTime = audio.currentTime;
      const wordIndex = currentAyah?.words.findIndex(
        (word) => currentTime >= word.startTime && currentTime <= word.endTime
      ) ?? -1;
      setCurrentWordIndex(wordIndex);
    };
    
    let endCounter = 0;
    const handleAudioEnd = () => {
      endCounter += 1;
      if (repeatCount === 3 && endCounter < 3) {
        // replay same ayah
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
        return;
      }
      endCounter = 0;
      if (repeatCount === 0) {
        // no repeat, move next
        playNext();
      } else if (repeatCount === 1) {
        playNext();
      } else if (repeatCount === 3) {
        // after 3 plays move next
        playNext();
      }
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
        setAudioProgress(0);
    audioRef.current.playbackRate = playbackRate;
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

  const setRepeat = (count: number) => {
    setRepeatCount(count);
  };

  const toggleSlow = () => {
    const nextRate = playbackRate === 1 ? 0.85 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) audioRef.current.playbackRate = nextRate;
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
        const newTime = (Number(e.target.value) / 100) * audio.duration;
        audio.currentTime = newTime;
        setAudioProgress(Number(e.target.value));
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center w-full h-full text-xl md:text-2xl text-teal-600">⏳ جاري تحميل السورة...</div>;
  }

  if (!surah) {
    return <div className="flex items-center justify-center w-full h-full text-xl md:text-2xl text-red-500">❌ لم يتم العثور على السورة</div>;
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-lg p-6 overflow-y-auto relative">
      <audio ref={audioRef} />
      <div className="text-center mb-6 flex items-center justify-center gap-4">
        <img src="/assets/mini-mushaf.svg" alt="مصحف" className="w-12 h-12" />
        <div>
          <h1 className="text-3xl font-bold text-teal-700">{surah.name}</h1>
          <p className="text-gray-500">{surah.englishName}</p>
        </div>
      </div>

      <div className="flex-grow space-y-4">
        {surah.ayahs.map((ayah, index) => (
          <div key={ayah.id} 
               ref={(el) => { ayahRefs.current[index] = el; }}
               onClick={() => selectAyah(index)} 
               className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${index === currentAyahIndex ? 'bg-teal-50 border-r-4 border-teal-500' : 'bg-gray-50 hover:bg-teal-50'}`}>
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
               <span className="text-xl text-teal-500 font-bold mx-2">({ayah.id})</span>
            </p>
            {index === currentAyahIndex && (
                 <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-r-4 border-yellow-400">
                    <div className="flex items-start gap-3">
                        <BookOpenIcon className="w-8 h-8 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-yellow-800 mb-2">التفسير الميسر:</h3>
                            <p className="text-yellow-900">{ayah.tafsir}</p>
                        </div>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
        {/* Player Controls */}
      <div className="mt-6 sticky bottom-0 bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 backdrop-blur-sm p-4 rounded-b-2xl z-10 shadow-lg">
        <div className="w-full max-w-md mx-auto">
            {/* Progress info */}
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-gray-600">
                الآية {currentAyahIndex + 1} من {surah.ayahs.length}
              </span>
              <div className="flex items-center gap-2">
                {completedAyahs.size > 0 && (
                  <span className="text-green-600 font-bold">
                    ✓ {completedAyahs.size} آية مكتملة
                  </span>
                )}
              </div>
            </div>
            <div className="w-full mb-3">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={audioProgress} 
                  onChange={handleSeek} 
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-600" 
                />
            </div>
            <div className="flex items-center justify-center gap-4">
                {/* Prev */}
                <button 
                  onClick={playPrevious} 
                  disabled={currentAyahIndex === 0} 
                  aria-label="السابق"
                  className="p-3 rounded-lg bg-white shadow-md text-2xl text-gray-700 disabled:opacity-40"
                >
                    <PreviousIcon />
                </button>

                {/* Play/Pause */}
                <button 
                  onClick={togglePlayPause} 
                  aria-label="تشغيل/إيقاف"
                  className="kid-btn w-20 h-20 rounded-full flex items-center justify-center transform hover:scale-105 active:scale-95"
                >
                    {isPlaying ? <PauseIcon className="w-12 h-12 kid-icon"/> : <PlayIcon className="w-12 h-12 kid-icon"/>}
                </button>

                {/* Next */}
                <button 
                  onClick={playNext} 
                  disabled={currentAyahIndex === surah.ayahs.length - 1} 
                  aria-label="التالي"
                  className="p-3 rounded-lg bg-white shadow-md text-2xl text-gray-700 disabled:opacity-40"
                >
                    <NextIcon />
                </button>
            </div>

            {/* Secondary controls: repeat, repeat 3x, slow */}
            <div className="mt-3 flex items-center justify-center gap-3">
                <button onClick={() => setRepeat(0)} className={`px-3 py-2 rounded-lg ${repeatCount===0? 'bg-yellow-300':'bg-white'} shadow-md`}>
                  ⏹️ تكرار: لا
                </button>
                <button onClick={() => setRepeat(1)} className={`px-3 py-2 rounded-lg ${repeatCount===1? 'bg-yellow-300':'bg-white'} shadow-md`}>
                  🔁 تكرار
                </button>
                <button onClick={() => setRepeat(3)} className={`px-3 py-2 rounded-lg ${repeatCount===3? 'bg-yellow-300':'bg-white'} shadow-md`}>
                  🔁×3
                </button>
                <button onClick={toggleSlow} className={`px-3 py-2 rounded-lg ${playbackRate===0.85? 'bg-sky-200':'bg-white'} shadow-md`}>
                  🐢 بطيء
                </button>
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