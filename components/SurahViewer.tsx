import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Surah, Ayah } from '../types';
import { getSurahById } from '../services/quranService';
import { PlayIcon, PauseIcon, NextIcon, PreviousIcon, BookOpenIcon, SparklesIcon, CloseIcon, PaperAirplaneIcon } from './icons';
import { GoogleGenAI } from '@google/genai';

interface SurahViewerProps {
  surahId: number;
}

const SurahViewer: React.FC<SurahViewerProps> = ({ surahId }) => {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Gemini state
  const [showGeminiHelper, setShowGeminiHelper] = useState(false);
  const [geminiQuestion, setGeminiQuestion] = useState('');
  const [geminiResponse, setGeminiResponse] = useState('');
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [activeAyahForGemini, setActiveAyahForGemini] = useState<Ayah | null>(null);

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
        setProgress(0);
        setIsLoading(false);
      }
    };
    fetchSurah();

    return () => {
      isCancelled = true; // Cleanup function to cancel stale requests
    };
  }, [surahId]);

  const currentAyah = surah?.ayahs[currentAyahIndex];
  
  const playNext = useCallback(() => {
    if (!surah) return;
    setCurrentAyahIndex(prevIndex => {
      if (prevIndex < surah.ayahs.length - 1) {
        return prevIndex + 1;
      }
      setIsPlaying(false);
      return prevIndex;
    });
  }, [surah]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
      const currentTime = audio.currentTime;
      const wordIndex = currentAyah?.words.findIndex(
        (word) => currentTime >= word.startTime && currentTime <= word.endTime
      ) ?? -1;
      setCurrentWordIndex(wordIndex);
    };
    
    const handleAudioEnd = () => {
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
      audioRef.current?.play().catch(e => console.error("Audio play failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);
  
  useEffect(() => {
      if(currentAyah && audioRef.current) {
        audioRef.current.src = currentAyah.audioUrl;
        setProgress(0);
        if(isPlaying){
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
        const newTime = (Number(e.target.value) / 100) * audio.duration;
        audio.currentTime = newTime;
        setProgress(Number(e.target.value));
    }
  }

  const openGeminiHelper = (ayah: Ayah) => {
    setActiveAyahForGemini(ayah);
    setGeminiQuestion(`اشرح لي هذه الآية ببساطة أكثر: "${ayah.text}"`);
    setGeminiResponse('');
    setShowGeminiHelper(true);
  }

  const closeGeminiHelper = () => {
    setShowGeminiHelper(false);
    setGeminiQuestion('');
    setGeminiResponse('');
    setActiveAyahForGemini(null);
  }

  const askGemini = async () => {
    if (!geminiQuestion || !activeAyahForGemini) return;
    setIsGeminiLoading(true);
    setGeminiResponse('');
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `الآية هي: "${activeAyahForGemini.text}".\nالتفسير المبدئي هو: "${activeAyahForGemini.tafsir}".\nسؤال الطفل هو: "${geminiQuestion}"`,
            config: {
                systemInstruction: "أنت مساعد ذكي ولطيف للغاية، متخصص في شرح معاني القرآن الكريم للأطفال الصغار (أعمارهم بين 5 و 10 سنوات). استخدم لغة بسيطة جدًا، وكلمات سهلة، وأمثلة من حياتهم اليومية. كن صبورًا ومشجعًا. اجعل إجاباتك قصيرة ومباشرة ومركزة على السؤال.",
            },
        });
        setGeminiResponse(response.text);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        setGeminiResponse("عفواً، حدث خطأ ما. حاول مرة أخرى.");
    } finally {
        setIsGeminiLoading(false);
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center w-full h-full text-2xl text-teal-600">...جاري تحميل السورة</div>;
  }

  if (!surah) {
    return <div className="flex items-center justify-center w-full h-full text-2xl text-red-500">لم يتم العثور على السورة</div>;
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-lg p-6 overflow-y-auto relative">
      <audio ref={audioRef} />
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-teal-700">{surah.name}</h1>
        <p className="text-gray-500">{surah.englishName}</p>
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
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-start gap-3">
                            <BookOpenIcon className="w-8 h-8 text-yellow-500 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-yellow-800">التفسير الميسر:</h3>
                            </div>
                        </div>
                         <button onClick={() => openGeminiHelper(ayah)} className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                            <SparklesIcon className="w-4 h-4" />
                            <span>اسأل مساعدك</span>
                        </button>
                    </div>
                    <p className="text-yellow-900 pr-11">{ayah.tafsir}</p>
                </div>
            )}
          </div>
        ))}
      </div>
        {/* Player Controls */}
      <div className="mt-6 sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 rounded-b-2xl z-10">
        <div className="w-full max-w-md mx-auto">
            <div className="w-full mb-2">
                <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500" />
            </div>
            <div className="flex items-center justify-center gap-6">
                <button onClick={playPrevious} disabled={currentAyahIndex === 0} className="text-gray-600 disabled:text-gray-300 hover:text-teal-600 transition-colors">
                    <PreviousIcon />
                </button>
                <button onClick={togglePlayPause} className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg hover:bg-teal-600 transition-transform transform hover:scale-105">
                    {isPlaying ? <PauseIcon className="w-10 h-10"/> : <PlayIcon className="w-10 h-10"/>}
                </button>
                <button onClick={playNext} disabled={currentAyahIndex === surah.ayahs.length - 1} className="text-gray-600 disabled:text-gray-300 hover:text-teal-600 transition-colors">
                    <NextIcon />
                </button>
            </div>
        </div>
      </div>

       {/* Gemini Helper Modal */}
      {showGeminiHelper && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
             onClick={closeGeminiHelper}
             style={{ opacity: showGeminiHelper ? 1 : 0 }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh] transform transition-transform duration-300" 
               onClick={e => e.stopPropagation()}
               style={{ transform: showGeminiHelper ? 'scale(1)' : 'scale(0.95)' }}>
            <header className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-teal-500"/>
                <h2 className="text-lg font-bold text-gray-800">مساعدك الذكي</h2>
              </div>
              <button onClick={closeGeminiHelper} className="text-gray-400 hover:text-gray-700">
                <CloseIcon />
              </button>
            </header>
            <main className="p-4 flex-grow overflow-y-auto space-y-4">
               <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">عن الآية:</p>
                <p className="font-bold text-gray-800">"{activeAyahForGemini?.text}"</p>
               </div>
               {geminiResponse && (
                <div className="p-3 bg-teal-50 rounded-lg text-teal-900 whitespace-pre-wrap">{geminiResponse}</div>
               )}
               {isGeminiLoading && (
                <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
               )}
            </main>
            <footer className="p-4 border-t bg-gray-50 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={geminiQuestion}
                  onChange={e => setGeminiQuestion(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && askGemini()}
                  placeholder="اسأل سؤالك هنا..."
                  className="w-full px-4 py-2 border rounded-full bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  disabled={isGeminiLoading}
                />
                <button onClick={askGemini} disabled={isGeminiLoading} className="p-3 rounded-full bg-teal-500 text-white disabled:bg-gray-300 hover:bg-teal-600 transition-colors">
                    <PaperAirplaneIcon className="w-5 h-5"/>
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurahViewer;