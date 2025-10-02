import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSettings: React.FC = () => {
  const { theme, colorTheme, toggleTheme, setColorTheme, soundEnabled, toggleSound } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const colorThemes = [
    { name: 'teal', label: 'أزرق فيروزي', colors: 'from-teal-400 to-blue-500' },
    { name: 'green', label: 'أخضر', colors: 'from-green-400 to-emerald-500' },
    { name: 'purple', label: 'بنفسجي', colors: 'from-purple-400 to-pink-500' },
    { name: 'blue', label: 'أزرق', colors: 'from-blue-400 to-indigo-500' },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-600 dark:to-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transform transition-all duration-200 hover:shadow-xl"
        aria-label="الإعدادات"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-80 transform transition-all duration-300 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">⚙️ الإعدادات</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="mb-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {theme === 'light' ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي'}
              </span>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                    theme === 'dark' ? 'transform translate-x-7' : ''
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Sound Toggle */}
          <div className="mb-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {soundEnabled ? '🔊 الأصوات مفعلة' : '🔇 الأصوات معطلة'}
              </span>
              <button
                onClick={toggleSound}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  soundEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                    soundEnabled ? 'transform translate-x-7' : ''
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Color Theme Selector */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">🎨 اختر اللون المفضل:</p>
            <div className="grid grid-cols-2 gap-3">
              {colorThemes.map((ct) => (
                <button
                  key={ct.name}
                  onClick={() => setColorTheme(ct.name as any)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    colorTheme === ct.name
                      ? 'ring-4 ring-offset-2 ring-teal-400 scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  <div className={`h-8 rounded-lg bg-gradient-to-r ${ct.colors} mb-2`} />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{ct.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSettings;