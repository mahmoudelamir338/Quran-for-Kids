import React, { useState, useEffect } from 'react';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (phone: string) => void;
  initialMode?: 'login' | 'register';
}

const UserAuthModal: React.FC<UserAuthModalProps> = ({ isOpen, onClose, onAuthenticated, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLogin = (phone: string) => {
    onAuthenticated(phone);
    onClose();
  };

  const handleRegister = (phone: string) => {
    onAuthenticated(phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative">
        {mode === 'login' ? (
          <UserLogin
            onLogin={handleLogin}
            onSwitchToRegister={() => setMode('register')}
          />
        ) : (
          <UserRegister
            onRegister={handleRegister}
            onSwitchToLogin={() => setMode('login')}
          />
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default UserAuthModal;