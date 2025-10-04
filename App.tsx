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
  <div className="flex flex-col items-center justify-center w-full h-full islamic-card rounded-3xl shadow-2xl p-8 text-center">
    <div className="mb-6">
      <img src="/assets/kid-reading.svg" alt="طفل يقرأ" className="w-40 h-40 mx-auto" />
    </div>
    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-full mb-6 animate-bounce shadow-xl">
      <BookOpenIcon className="w-16 h-16 text-white" />
    </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent islamic-glow mb-6">
            أهلاً وسهلاً في رحلتك القرآنية المباركة! 🌟
        </h2>
        <p className="text-gray-700 dark:text-gray-200 max-w-lg text-base md:text-lg leading-relaxed font-semibold">
            هيا يا بني، اختر سورة مباركة من القائمة لتبدأ في استكشاف كلام الله العزيز، وتستمع للتلاوة العطرة بصوت الشيخ المنشاوي.
        </p>
        <div className="mt-10 flex gap-6 text-5xl">
            <span className="animate-bounce" style={{animationDelay: '0s'}}>📖</span>
            <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🎧</span>
            <span className="animate-bounce" style={{animationDelay: '0.4s'}}>⭐</span>
        </div>
    </div>
);


const App: React.FC = () => {
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
      <div className="min-h-screen islamic-bg p-4 md:p-8 transition-colors duration-300">
         <header className="text-center mb-6 islamic-card p-6 rounded-2xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent islamic-glow">
              هيا نقرأ القرآن الكريم 📖
          </h1>
          <p className="text-gray-700 dark:text-gray-200 mt-3 text-base md:text-lg font-semibold">
              رحلة مباركة لتعلم كلام الله ✨
          </p>
          <div className="mt-4 text-center">
            <p className="text-emerald-700 dark:text-emerald-300 text-sm">اختر سورة واستمع للتلاوة المباركة</p>
          </div>
        </header>


        <main className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto" style={{ height: 'calc(100vh - 200px)' }}>
          <aside className="w-full md:w-1/3 lg:w-1/4 h-full">
            <SurahList
              surahs={surahs}
              onSelectSurah={handleSelectSurah}
              activeSurahId={selectedSurahId}
              isLoading={isLoadingList}
              progress={progress}
            />
          </aside>
          <section className="w-full md:w-2/3 lg:w-3/4 h-full">
            {selectedSurahId ? (
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

        {/* Footer with fixed message */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
            صدقة جارية لمن صمم هذا الموقع<br />
            لا تنسوني بصالح الدعاء
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;