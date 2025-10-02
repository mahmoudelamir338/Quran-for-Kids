import React from 'react';
import type { UserProgress } from '../types';

interface ProgressBarProps {
  progress: UserProgress;
  totalSurahs: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, totalSurahs }) => {
  const completionPercentage = totalSurahs > 0 
    ? Math.round((progress.completedSurahs.length / totalSurahs) * 100) 
    : 0;

  return (
    <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-2xl shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-sm text-gray-600">إنجازاتك</p>
            <p className="text-xl font-bold text-purple-700">
              {progress.completedSurahs.length} / {totalSurahs} سورة
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/70 rounded-full px-4 py-2 shadow-inner">
          <span className="text-2xl">⭐</span>
          <span className="text-2xl font-bold text-yellow-600">
            {progress.totalStars}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-6 bg-white/50 rounded-full overflow-hidden shadow-inner">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
          style={{ width: `${completionPercentage}%` }}
        >
          {completionPercentage > 10 && (
            <span className="text-white text-xs font-bold drop-shadow">
              {completionPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Motivational Messages */}
      <div className="mt-3 text-center">
        {completionPercentage === 0 && (
          <p className="text-sm text-gray-600">🌟 ابدأ رحلتك القرآنية الآن!</p>
        )}
        {completionPercentage > 0 && completionPercentage < 25 && (
          <p className="text-sm text-blue-600">💪 بداية رائعة! استمر!</p>
        )}
        {completionPercentage >= 25 && completionPercentage < 50 && (
          <p className="text-sm text-green-600">🎯 أنت في منتصف الطريق!</p>
        )}
        {completionPercentage >= 50 && completionPercentage < 75 && (
          <p className="text-sm text-purple-600">🚀 ممتاز! أكثر من النصف!</p>
        )}
        {completionPercentage >= 75 && completionPercentage < 100 && (
          <p className="text-sm text-orange-600">🔥 أنت قريب جداً من النهاية!</p>
        )}
        {completionPercentage === 100 && (
          <p className="text-sm text-pink-600 font-bold">🎉 ما شاء الله! أكملت كل السور!</p>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;