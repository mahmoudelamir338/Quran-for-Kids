
import React, { useState } from 'react';
import { SearchIcon } from './icons';
import type { UserProgress } from '../types';

interface SurahInfo {
  id: number;
  name: string;
  englishName: string;
}

interface SurahListProps {
  surahs: SurahInfo[];
  onSelectSurah: (id: number) => void;
  activeSurahId: number | null;
  isLoading: boolean;
  progress: UserProgress;
}

const SurahList: React.FC<SurahListProps> = ({ surahs, onSelectSurah, activeSurahId, isLoading, progress }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.id.toString().includes(searchTerm)
  );

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl w-full md:w-80 flex flex-col h-full transition-colors duration-300 border-2 border-emerald-200 dark:border-emerald-700">
      <div className="p-5 border-b-2 border-emerald-200 dark:border-emerald-700 sticky top-0 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 rounded-t-3xl">
        <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-3 text-center">🌟 ابدأ رحلتك القرآنية الآن!</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 ابحث عن سورة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-emerald-300 rounded-full bg-white dark:bg-gray-700 dark:text-white dark:border-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-200 shadow-sm"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
            <SearchIcon />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto flex-grow p-2">
        {isLoading ? (
          <div className="text-center p-4 text-gray-500 dark:text-gray-400">
            <div className="animate-spin text-4xl mb-2">⏳</div>
            جاري التحميل...
          </div>
        ) : (
          <ul>
            {filteredSurahs.map(surah => {
              const isCompleted = progress.completedSurahs.includes(surah.id);
              const surahProgress = progress.surahProgress[surah.id] || 0;
              const isCurrent = progress.currentSurah === surah.id;
              
              return (
                <li key={surah.id}>
                  <button
                    onClick={() => onSelectSurah(surah.id)}
                    className={`w-full text-right flex items-center justify-between p-4 my-2 rounded-xl transition-all duration-200 relative overflow-hidden transform hover:scale-105 hover:shadow-lg ${
                      activeSurahId === surah.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl scale-105 border-2 border-emerald-300'
                        : isCompleted
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-800/50 dark:hover:to-emerald-800/50 border-2 border-green-300 dark:border-green-700'
                        : 'hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:bg-teal-900/30 border-2 border-transparent hover:border-emerald-200'
                    }`}
                  >
                    {/* Progress indicator background */}
                    {surahProgress > 0 && !isCompleted && (
                      <div 
                        className="absolute top-0 left-0 h-full bg-teal-100/50 transition-all duration-300"
                        style={{ width: `${surahProgress}%` }}
                      />
                    )}
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <span className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-bold shadow-md ${
                        activeSurahId === surah.id 
                          ? 'bg-white text-emerald-600 ring-2 ring-white' 
                          : isCompleted
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                          : 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-800 dark:to-teal-800 dark:text-emerald-200'
                      }`}>
                        {isCompleted ? '✓' : surah.id}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold ${
                            activeSurahId === surah.id 
                              ? 'text-white' 
                              : 'text-gray-800 dark:text-white'
                          }`}>
                            {surah.name}
                          </p>
                          {isCurrent && !isCompleted && (
                            <span className="text-xs bg-orange-400 text-white px-2 py-0.5 rounded-full animate-pulse">
                              جاري القراءة
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${
                          activeSurahId === surah.id 
                            ? 'text-teal-100' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {surah.englishName}
                        </p>
                      </div>
                      {isCompleted && (
                        <span className="text-2xl animate-bounce">⭐</span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SurahList;
