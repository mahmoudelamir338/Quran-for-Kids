import React, { useState, useEffect } from 'react';
import SurahList from './components/SurahList';
import SurahViewer from './components/SurahViewer';
import ProgressBar from './components/ProgressBar';
import ThemeSettings from './components/ThemeSettings';
import AdminPage from './pages/AdminPage';
import UserAuthModal from './components/UserAuthModal';
import { ThemeProvider } from './contexts/ThemeContext';
import { getSurahList } from './services/quranService';
import { getProgress, updateCurrentSurah } from './services/progressService';
import { BookOpenIcon } from './components/icons';
import type { UserProgress } from './types';

interface SurahInfo {
  id: number;
  name: string;
  englishName: string;
}

const WelcomeScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-800 dark:via-emerald-900/30 dark:to-teal-900/30 rounded-3xl shadow-2xl p-8 text-center border-2 border-emerald-200 dark:border-emerald-700">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 rounded-full mb-8 animate-bounce shadow-xl">
            <BookOpenIcon className="w-20 h-20 text-white" />
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
  const [surahs, setSurahs] = useState<SurahInfo[]>([]);
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress>(getProgress());
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState(false);
  const [userAuthMode, setUserAuthMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Check if current route is admin and user auth
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin' || path.includes('/admin'));
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);

    // Check if user is already logged in
    const userPhone = localStorage.getItem('userPhone');
    if (userPhone) {
      setCurrentUser(userPhone);
    }

    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  useEffect(() => {
    const loadSurahs = async () => {
      setIsLoadingList(true);
      const surahList = await getSurahList();
      setSurahs(surahList);
      
      // Load last visited surah if available
      const progress = getProgress();
      if (progress.currentSurah && surahList.find(s => s.id === progress.currentSurah)) {
        // Don't auto-select, let user choose
        // setSelectedSurahId(progress.currentSurah);
      }
      
      setIsLoadingList(false);
    };
    loadSurahs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSurah = (id: number) => {
    setSelectedSurahId(id);
    updateCurrentSurah(id);
    setUserProgress(getProgress());
  };

  const handleProgressUpdate = () => {
    setUserProgress(getProgress());
  };

  const handleUserAuthenticated = (phone: string) => {
    setCurrentUser(phone);
  };

  const handleUserLogout = () => {
    localStorage.removeItem('userPhone');
    setCurrentUser(null);
  };

  const openLoginModal = () => {
    setUserAuthMode('login');
    setIsUserAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setUserAuthMode('register');
    setIsUserAuthModalOpen(true);
  };

  // If admin route, show admin page
  if (isAdminRoute) {
    return <AdminPage />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900 p-4 md:p-8 transition-colors duration-300">
         <header className="text-center mb-6 relative">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
              هيا نقرأ 📖
          </h1>
          <p className="text-gray-700 dark:text-gray-200 mt-3 text-xl font-semibold">
              رحلة ممتعة لتعلم القرآن الكريم ✨
          </p>

          {/* User Auth Buttons */}
          <div className="absolute top-0 right-0 flex gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">مرحباً: {currentUser}</span>
                <button
                  onClick={handleUserLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm font-bold"
                >
                  خروج
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm font-bold"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={openRegisterModal}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm font-bold"
                >
                  إنشاء حساب
                </button>
              </>
            )}

            {/* Admin Button */}
            <a
              href="/admin"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-1 text-sm font-bold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              المدير
            </a>
          </div>
        </header>
        
        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto mb-4">
          <ProgressBar progress={userProgress} totalSurahs={surahs.length} />
        </div>

        <main className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto" style={{ height: 'calc(100vh - 250px)' }}>
          <aside className="w-full md:w-1/3 lg:w-1/4 h-full">
            <SurahList
              surahs={surahs}
              onSelectSurah={handleSelectSurah}
              activeSurahId={selectedSurahId}
              isLoading={isLoadingList}
              progress={userProgress}
            />
          </aside>
          <section className="w-full md:w-2/3 lg:w-3/4 h-full">
            {selectedSurahId ? (
              <SurahViewer 
                surahId={selectedSurahId} 
                progress={userProgress}
                onProgressUpdate={handleProgressUpdate}
              />
            ) : (
              <WelcomeScreen />
            )}
          </section>
        </main>

        {/* Theme Settings */}
        <ThemeSettings />

        {/* User Auth Modal */}
        <UserAuthModal
          isOpen={isUserAuthModalOpen}
          onClose={() => setIsUserAuthModalOpen(false)}
          onAuthenticated={handleUserAuthenticated}
          initialMode={userAuthMode}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;