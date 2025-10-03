import React from 'react';

interface ShortSurahsProps {
  onSelect: (id:number)=>void;
}

const SHORT_SURAH_LIST = [
  {id:1, name:'الفاتحة', english:'Al-Fatiha'},
  {id:103, name:'العصر', english:'Al-Asr'},
  {id:112, name:'الإخلاص', english:'Al-Ikhlas'},
  {id:113, name:'الفلق', english:'Al-Falaq'},
  {id:114, name:'الناس', english:'An-Nas'}
];

const ShortSurahs: React.FC<ShortSurahsProps> = ({ onSelect }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">🕌 قصار السور</h2>
      <p className="text-center text-gray-600 mb-6">اختر إحدى السور القصيرة للاستماع والتكرار</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SHORT_SURAH_LIST.map(s => (
          <div key={s.id} className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-lg">{s.name}</div>
              <div className="text-sm text-gray-500">{s.english}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onSelect(s.id)} className="kid-btn px-4 py-2 rounded-xl">🔊 استمع</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortSurahs;
