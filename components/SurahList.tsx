
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
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg w-full md:w-80 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white/70 rounded-t-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن سورة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto flex-grow p-2">
        {isLoading ? (
          <div className="text-center p-4 text-gray-500">جاري التحميل...</div>
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
                    className={`w-full text-right flex items-center justify-between p-3 my-1 rounded-lg transition-all duration-200 relative overflow-hidden ${
                      activeSurahId === surah.id
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md'
                        : isCompleted
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100'
                        : 'hover:bg-teal-50'
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
                      <span className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                        activeSurahId === surah.id 
                          ? 'bg-white text-teal-600' 
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-teal-100 text-teal-700'
                      }`}>
                        {isCompleted ? '✓' : surah.id}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{surah.name}</p>
                          {isCurrent && !isCompleted && (
                            <span className="text-xs bg-orange-400 text-white px-2 py-0.5 rounded-full animate-pulse">
                              جاري القراءة
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${
                          activeSurahId === surah.id 
                            ? 'text-teal-100' 
                            : 'text-gray-500'
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
