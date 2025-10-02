import React, { useState } from 'react';
import { playSound } from '../utils/sounds';

interface UserRegisterProps {
  onRegister: (phone: string) => void;
  onSwitchToLogin: () => void;
}

const UserRegister: React.FC<UserRegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [phone, setPhone] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }

    if (phone !== confirmPhone) {
      setError('أرقام الهاتف غير متطابقة');
      return;
    }

    // For demo purposes, accept any phone number
    // In production, you'd validate uniqueness and create account
    playSound('success', true);
    localStorage.setItem('userPhone', phone);
    onRegister(phone);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">إنشاء حساب</h2>
        <p className="text-gray-300">القرآن الكريم للأطفال</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-white font-medium mb-2">
            رقم الهاتف
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            placeholder="أدخل رقم الهاتف"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPhone" className="block text-white font-medium mb-2">
            تأكيد رقم الهاتف
          </label>
          <input
            type="tel"
            id="confirmPhone"
            value={confirmPhone}
            onChange={(e) => setConfirmPhone(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            placeholder="أعد إدخال رقم الهاتف"
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
          className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transform transition-all duration-200 hover:shadow-xl"
        >
          إنشاء الحساب
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-teal-300 hover:text-teal-200 underline"
        >
          لديك حساب بالفعل؟ سجل دخول
        </button>
      </div>
    </div>
  );
};

export default UserRegister;