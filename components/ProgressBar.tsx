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
    <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/50 dark:via-teal-900/50 dark:to-cyan-900/50 rounded-3xl shadow-2xl p-6 mb-4 border-2 border-emerald-200 dark:border-emerald-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">🏆</span>
          <div>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">إنجازاتك</p>
            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
              {progress.completedSurahs.length} / {totalSurahs} سورة
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-5 py-3 shadow-lg">
          <span className="text-3xl">⭐</span>
          <span className="text-2xl font-bold text-white drop-shadow-md">
            {progress.totalStars}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-8 bg-white/70 dark:bg-gray-700/50 rounded-full overflow-hidden shadow-inner border-2 border-emerald-300 dark:border-emerald-600">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3 shadow-lg"
          style={{ width: `${completionPercentage}%` }}
        >
          {completionPercentage > 10 && (
            <span className="text-white text-sm font-bold drop-shadow-lg">
              {completionPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Motivational Messages */}
      <div className="mt-4 text-center">
        {completionPercentage === 0 && (
          <p className="text-base text-emerald-700 dark:text-emerald-300 font-semibold">🌟 ابدأ رحلتك القرآنية الآن!</p>
        )}
        {completionPercentage > 0 && completionPercentage < 25 && (
          <p className="text-base text-teal-700 dark:text-teal-300 font-semibold">💪 بداية رائعة! استمر!</p>
        )}
        {completionPercentage >= 25 && completionPercentage < 50 && (
          <p className="text-base text-emerald-700 dark:text-emerald-300 font-semibold">🎯 أنت في منتصف الطريق!</p>
        )}
        {completionPercentage >= 50 && completionPercentage < 75 && (
          <p className="text-base text-cyan-700 dark:text-cyan-300 font-semibold">🚀 ممتاز! أكثر من النصف!</p>
        )}
        {completionPercentage >= 75 && completionPercentage < 100 && (
          <p className="text-base text-orange-600 dark:text-orange-400 font-semibold">🔥 أنت قريب جداً من النهاية!</p>
        )}
        {completionPercentage === 100 && (
          <p className="text-base text-emerald-700 dark:text-emerald-300 font-bold">🎉 ما شاء الله! أكملت كل السور!</p>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;