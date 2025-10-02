
import React, { useState } from 'react';
import { SearchIcon } from './icons';

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
}

const SurahList: React.FC<SurahListProps> = ({ surahs, onSelectSurah, activeSurahId, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase())
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
            {filteredSurahs.map(surah => (
              <li key={surah.id}>
                <button
                  onClick={() => onSelectSurah(surah.id)}
                  className={`w-full text-right flex items-center justify-between p-3 my-1 rounded-lg transition-all duration-200 ${
                    activeSurahId === surah.id
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'hover:bg-teal-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                     <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${activeSurahId === surah.id ? 'bg-white text-teal-600' : 'bg-teal-100 text-teal-700'}`}>
                        {surah.id}
                    </span>
                    <div>
                        <p className="font-bold">{surah.name}</p>
                        <p className={`text-xs ${activeSurahId === surah.id ? 'text-teal-100' : 'text-gray-500'}`}>{surah.englishName}</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SurahList;
