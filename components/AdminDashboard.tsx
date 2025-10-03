import React from 'react';

// Admin dashboard removed to keep the site kid-friendly. This stub preserves imports.
const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold">لوحة التحكم غير متاحة</h2>
      <p className="text-gray-600 mt-2">تم تعطيل لوحة التحكم لتبسيط الواجهة والتركيز على المحتوى التعليمي للأطفال.</p>
    </div>
  );
};

export default AdminDashboard;

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