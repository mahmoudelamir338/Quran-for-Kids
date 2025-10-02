import React, { useState } from 'react';
import { playSound } from '../utils/sounds';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Admin password
  const CORRECT_PASSWORD_HASH = '23235566';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      setError('⏱️ تم حظر المحاولات لمدة 15 دقيقة');
      return;
    }

    if (password === CORRECT_PASSWORD_HASH) {
      playSound('success', true);
      localStorage.setItem('adminAuth', 'true');
      onLogin();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      playSound('click', true);

      if (newAttempts >= 5) {
        setIsBlocked(true);
        setError('🚫 تم حظر المحاولات لمدة 15 دقيقة بسبب المحاولات الخاطئة المتكررة');
        
        // Unblock after 15 minutes
        setTimeout(() => {
          setIsBlocked(false);
          setAttempts(0);
          setError('');
        }, 15 * 60 * 1000);
      } else {
        setError(`❌ كلمة السر غير صحيحة (المحاولة ${newAttempts} من 5)`);
      }
    }

    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-teal-400 to-blue-500 p-4 rounded-full mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">🔐 لوحة التحكم</h1>
          <p className="text-gray-300">القرآن الكريم للأطفال</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              كلمة السر
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isBlocked}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="أدخل كلمة السر"
              autoComplete="off"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isBlocked}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transform transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isBlocked ? '🔒 محظور' : '🔓 دخول'}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>🛡️ هذه الصفحة محمية ومخصصة للمسؤولين فقط</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;