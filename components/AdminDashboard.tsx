import React, { useState, useEffect } from 'react';
import { getProgress } from '../services/progressService';
import { getSurahList } from '../services/quranService';
import type { UserProgress } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'stats' | 'surahs' | 'tafsir' | 'users' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [surahs, setSurahs] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const surahList = await getSurahList();
      setSurahs(surahList);
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    onLogout();
  };

  const tabs = [
    { id: 'stats', label: '📊 الإحصائيات', icon: '📊' },
    { id: 'surahs', label: '📖 إدارة السور', icon: '📖' },
    { id: 'tafsir', label: '✏️ إدارة التفسير', icon: '✏️' },
    { id: 'users', label: '👥 المستخدمين', icon: '👥' },
    { id: 'settings', label: '⚙️ الإعدادات', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-3 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🕌 لوحة تحكم القرآن للأطفال</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">مرحباً بك في لوحة الإدارة</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-all duration-200 border-b-4 ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="text-xl mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'stats' && <StatsTab progress={progress} surahs={surahs} />}
        {activeTab === 'surahs' && <SurahsTab surahs={surahs} />}
        {activeTab === 'tafsir' && <TafsirTab />}
        {activeTab === 'users' && <UsersTab progress={progress} />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};

// Stats Tab Component
const StatsTab: React.FC<{ progress: UserProgress; surahs: any[] }> = ({ progress, surahs }) => {
  const totalSurahs = surahs.length;
  const completedSurahs = progress.completedSurahs.length;
  const completionRate = totalSurahs > 0 ? Math.round((completedSurahs / totalSurahs) * 100) : 0;
  const totalStars = progress.totalStars;

  const stats = [
    { label: 'إجمالي السور', value: totalSurahs, icon: '📚', color: 'from-blue-500 to-blue-600' },
    { label: 'السور المكتملة', value: completedSurahs, icon: '✅', color: 'from-green-500 to-green-600' },
    { label: 'نسبة الإنجاز', value: `${completionRate}%`, icon: '📈', color: 'from-purple-500 to-purple-600' },
    { label: 'إجمالي النجوم', value: totalStars, icon: '⭐', color: 'from-yellow-500 to-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">📊 إحصائيات عامة</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} text-white text-2xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">📋 آخر النشاطات</h3>
        <div className="space-y-3">
          {progress.completedSurahs.slice(-5).reverse().map((surahId, index) => {
            const surah = surahs.find(s => s.id === surahId);
            return (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span className="text-2xl">🎉</span>
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-white font-medium">
                    تم إكمال سورة {surah?.name || `رقم ${surahId}`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">حصل المستخدم على نجمة ⭐</p>
                </div>
              </div>
            );
          })}
          {progress.completedSurahs.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">لا توجد نشاطات بعد</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Surahs Tab Component
const SurahsTab: React.FC<{ surahs: any[] }> = ({ surahs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurahs = surahs.filter(surah =>
    surah.name.includes(searchTerm) ||
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.id.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📖 إدارة السور</h2>
        <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-medium hover:scale-105 transition-transform duration-200">
          ➕ إضافة سورة جديدة
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <input
          type="text"
          placeholder="🔍 ابحث عن سورة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      {/* Surahs List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">الرقم</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">اسم السورة</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">الاسم بالإنجليزية</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSurahs.map((surah) => (
                <tr key={surah.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 text-gray-800 dark:text-white font-medium">{surah.id}</td>
                  <td className="px-6 py-4 text-gray-800 dark:text-white font-bold">{surah.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{surah.englishName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors duration-200">
                        ✏️ تعديل
                      </button>
                      <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors duration-200">
                        🗑️ حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Tafsir Tab Component
const TafsirTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">✏️ إدارة التفسير</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4">إضافة أو تعديل التفسير المبسط للآيات</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">رقم السورة</label>
            <input
              type="number"
              placeholder="مثال: 1"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">رقم الآية</label>
            <input
              type="number"
              placeholder="مثال: 1"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">التفسير بالعامية المصرية</label>
            <textarea
              rows={4}
              placeholder="اكتب التفسير المبسط هنا..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          
          <button className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-bold hover:scale-105 transition-transform duration-200">
            💾 حفظ التفسير
          </button>
        </div>
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab: React.FC<{ progress: UserProgress }> = ({ progress }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">👥 إدارة المستخدمين</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div>
              <p className="text-gray-800 dark:text-white font-bold">المستخدم الحالي</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">التقدم: {progress.completedSurahs.length} سورة مكتملة</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors duration-200">
                📊 عرض التفاصيل
              </button>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors duration-200">
                🔄 إعادة تعيين
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      alert('✅ تم تغيير كلمة السر بنجاح!');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert('❌ كلمة السر غير متطابقة أو قصيرة جداً');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">⚙️ الإعدادات</h2>
      
      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🔐 تغيير كلمة السر</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">كلمة السر الجديدة</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">تأكيد كلمة السر</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          
          <button
            onClick={handleChangePassword}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-bold hover:scale-105 transition-transform duration-200"
          >
            💾 حفظ كلمة السر الجديدة
          </button>
        </div>
      </div>

      {/* Backup */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">💾 النسخ الاحتياطي</h3>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors duration-200">
            📥 تصدير البيانات
          </button>
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors duration-200">
            📤 استيراد البيانات
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;