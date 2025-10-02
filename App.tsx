import React, { useState, useEffect } from 'react';
import SurahList from './components/SurahList';
import SurahViewer from './components/SurahViewer';
import { getSurahList } from './services/quranService';
import { BookOpenIcon } from './components/icons';

interface SurahInfo {
  id: number;
  name: string;
  englishName: string;
}

const WelcomeScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="bg-teal-100 p-6 rounded-full mb-6">
            <BookOpenIcon className="w-16 h-16 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-teal-700 mb-2">أهلاً بك في رحلتك القرآنية!</h2>
        <p className="text-gray-500 max-w-md">
            هيا يا صديقي، اختر سورة من القائمة على اليمين لتبدأ في استكشاف كلام الله، وتستمع للتلاوة العطرة، وتتعلم التفسير الميسر.
        </p>
    </div>
);


const App: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahInfo[]>([]);
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);

  useEffect(() => {
    const loadSurahs = async () => {
      setIsLoadingList(true);
      const surahList = await getSurahList();
      setSurahs(surahList);
       if (surahList.length > 0 && selectedSurahId === null) {
        // We set it to null initially to show the welcome screen
        // setSelectedSurahId(surahList[0].id); 
      }
      setIsLoadingList(false);
    };
    loadSurahs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSurah = (id: number) => {
    setSelectedSurahId(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-teal-100 p-4 md:p-8">
       <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-teal-800">
            القرآن الكريم للأطفال
        </h1>
        <p className="text-gray-600 mt-2">
            رحلة ممتعة لتعلم وفهم كلام الله
        </p>
      </header>
      <main className="flex flex-col md:flex-row gap-8" style={{ height: 'calc(100vh - 150px)' }}>
        <aside className="w-full md:w-1/4 h-full">
          <SurahList
            surahs={surahs}
            onSelectSurah={handleSelectSurah}
            activeSurahId={selectedSurahId}
            isLoading={isLoadingList}
          />
        </aside>
        <section className="w-full md:w-3/4 h-full">
          {selectedSurahId ? (
            <SurahViewer surahId={selectedSurahId} />
          ) : (
            <WelcomeScreen />
          )}
        </section>
      </main>
    </div>
  );
};

export default App;