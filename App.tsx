import React, { useState, useEffect } from 'react';
import SurahList from './components/SurahList';
import SurahViewer from './components/SurahViewer';
import ThemeSettings from './components/ThemeSettings';
import { ThemeProvider } from './contexts/ThemeContext';
import { getSurahList } from './services/quranService';
import { getProgress } from './services/progressService';
import { BookOpenIcon } from './components/icons';
import Alphabet from './components/Alphabet';
import ShortSurahs from './components/ShortSurahs';
import type { UserProgress } from './types';

interface SurahInfo {
  id: number;
  name: string;
  englishName: string;
}

const WelcomeScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-800 dark:via-emerald-900/30 dark:to-teal-900/30 rounded-3xl shadow-2xl p-8 text-center border-2 border-emerald-200 dark:border-emerald-700">
    <div className="mb-6">
      <img src="/assets/kid-reading.svg" alt="طفل يقرأ" className="w-40 h-40 mx-auto" />
    </div>
    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-full mb-6 animate-bounce shadow-xl">
      <BookOpenIcon className="w-16 h-16 text-white" />
    </div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            أهلاً بك في رحلتك القرآنية! 🌟
        </h2>
        <p className="text-gray-700 dark:text-gray-200 max-w-md text-xl leading-relaxed font-semibold">
            هيا يا صديقي، اختر سورة من القائمة على اليمين لتبدأ في استكشاف كلام الله، وتستمع للتلاوة العطرة، وتتعلم التفسير الميسر.
        </p>
        <div className="mt-10 flex gap-6 text-5xl">
            <span className="animate-bounce" style={{animationDelay: '0s'}}>📖</span>
            <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🎧</span>
            <span className="animate-bounce" style={{animationDelay: '0.4s'}}>⭐</span>
        </div>
    </div>
);


const App: React.FC = () => {
  const [showAlphabet, setShowAlphabet] = useState(false);
  const [showShortSurahs, setShowShortSurahs] = useState(false);
  const [surahs, setSurahs] = useState<SurahInfo[]>([]);
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [progress, setProgress] = useState<UserProgress>(getProgress());

  useEffect(() => {
    const loadSurahs = async () => {
      setIsLoadingList(true);
      const surahList = await getSurahList();
      setSurahs(surahList);
      setIsLoadingList(false);
    };
    loadSurahs();
  }, []);

  const handleSelectSurah = (id: number) => {
    setSelectedSurahId(id);
    // Update current surah in progress
    const { updateCurrentSurah } = require('./services/progressService');
    updateCurrentSurah(id);
    setProgress(getProgress());
  };



  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900 p-4 md:p-8 transition-colors duration-300">
         <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
              هيا نقرأ 📖
          </h1>
          <p className="text-gray-700 dark:text-gray-200 mt-3 text-lg font-semibold">
              رحلة ممتعة لتعلم القرآن الكريم ✨
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button onClick={() => setShowAlphabet(true)} className="kid-btn px-4 py-2 rounded-xl">🔤 الحروف الهجائية</button>
            <button onClick={() => setShowAlphabet(false)} className="px-4 py-2 bg-white border rounded-xl">🔙 العودة</button>
            <button onClick={() => { setShowShortSurahs(true); setShowAlphabet(false); }} className="px-4 py-2 bg-white border rounded-xl">🕌 قصار السور</button>
          </div>
        </header>


        <main className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto" style={{ height: 'calc(100vh - 250px)' }}>
          <aside className="w-full md:w-1/3 lg:w-1/4 h-full">
            {!showAlphabet && (
              <SurahList
                surahs={surahs}
                onSelectSurah={handleSelectSurah}
                activeSurahId={selectedSurahId}
                isLoading={isLoadingList}
                progress={progress}
              />
            )}
          </aside>
          <section className="w-full md:w-2/3 lg:w-3/4 h-full">
            {showAlphabet ? (
              <Alphabet />
            ) : showShortSurahs ? (
              <ShortSurahs onSelect={(id)=>{ setSelectedSurahId(id); setShowShortSurahs(false); }} />
            ) : selectedSurahId ? (
              <SurahViewer
                surahId={selectedSurahId}
                progress={progress}
                onProgressUpdate={() => setProgress(getProgress())}
              />
            ) : (
              <WelcomeScreen />
            )}
          </section>
        </main>

        {/* Theme Settings */}
        <ThemeSettings />
      </div>
    </ThemeProvider>
  );
};

export default App;