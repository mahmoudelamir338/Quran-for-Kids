import React, { useEffect, useState } from 'react';
import { playSound, triggerConfetti } from '../utils/sounds';

interface RewardModalProps {
  show: boolean;
  onClose: () => void;
  surahName: string;
  starsEarned: number;
  soundEnabled?: boolean;
}

const RewardModal: React.FC<RewardModalProps> = ({ show, onClose, surahName, starsEarned, soundEnabled = true }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimate(true);
      playSound('complete', soundEnabled);
      triggerConfetti();
      
      // Play star sound after a delay
      setTimeout(() => {
        playSound('star', soundEnabled);
      }, 500);
    } else {
      setAnimate(false);
    }
  }, [show, soundEnabled]);

  if (!show) return null;

  const encouragements = [
    "ما شاء الله! أنت رائع! 🌟",
    "أحسنت! استمر في التقدم! 🎉",
    "بارك الله فيك! 💫",
    "ممتاز جداً! واصل! 🌈",
    "أنت بطل! 🏆",
  ];

  const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className={`bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${
          animate ? 'scale-100 rotate-0' : 'scale-50 rotate-12'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Stars */}
        <div className="flex justify-center mb-6 relative">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`text-6xl animate-bounce`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              ⭐
            </div>
          ))}
        </div>

        {/* Congratulations Message */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-orange-600 animate-pulse">
            {randomEncouragement}
          </h2>
          
          <div className="bg-white/70 rounded-2xl p-4 shadow-inner">
            <p className="text-xl text-gray-700 mb-2">
              أكملت سورة
            </p>
            <p className="text-2xl font-bold text-teal-700">
              {surahName}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-600">
            <span>⭐</span>
            <span>حصلت على نجمة!</span>
            <span>⭐</span>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3">
            <p className="text-lg text-purple-700">
              مجموع نجومك: <span className="font-bold text-2xl">{starsEarned}</span> ⭐
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 transform transition-all duration-200 hover:shadow-xl"
          >
            رائع! استمر 🚀
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 text-4xl animate-spin-slow">🎯</div>
        <div className="absolute bottom-4 left-4 text-4xl animate-bounce">🎈</div>
      </div>
    </div>
  );
};

export default RewardModal;