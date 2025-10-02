# 🚀 دليل البدء السريع - Quran for Kids

## ⚡ البدء في 3 خطوات

### 1️⃣ التثبيت (دقيقة واحدة)

```bash
# استنساخ المشروع
git clone https://github.com/your-username/Quran-for-Kids.git
cd Quran-for-Kids

# تثبيت المكتبات
npm install
```

### 2️⃣ الإعداد (30 ثانية)

أنشئ ملف `.env.local` وأضف مفتاح Gemini API:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**احصل على مفتاح مجاني من:** https://makersuite.google.com/app/apikey

### 3️⃣ التشغيل (10 ثواني)

```bash
npm run dev
```

افتح المتصفح على: **http://localhost:5173** 🎉

---

## 📖 كيفية الاستخدام

### للأطفال 👶

```
1. اختر سورة من القائمة 📚
   ↓
2. اضغط زر التشغيل ▶️
   ↓
3. تابع الكلمات المظللة 🎯
   ↓
4. أكمل السورة واحصل على نجمة! ⭐
```

### للمطورين 👨‍💻

#### البنية الأساسية

```
src/
├── components/          # المكونات
│   ├── SurahList       # قائمة السور
│   ├── SurahViewer     # عرض السورة
│   ├── ProgressBar     # شريط التقدم
│   └── RewardModal     # نافذة المكافآت
├── services/           # الخدمات
│   └── progressService # إدارة التقدم
├── types.ts           # التعريفات
├── data.ts            # البيانات
└── App.tsx            # التطبيق الرئيسي
```

#### إضافة سورة جديدة

```typescript
// في data.ts
export const surahs: Surah[] = [
  {
    id: '6',
    number: 6,
    arabicName: 'الأنعام',
    englishName: 'Al-An\'am',
    meaning: 'The Cattle',
    ayahs: [
      {
        number: 1,
        arabicText: '...',
        translation: '...',
        tafsir: '...',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/006001.mp3',
        words: [...]
      }
    ]
  }
];
```

#### استخدام خدمة التقدم

```typescript
import { 
  getProgress, 
  updateCurrentSurah, 
  completeSurah 
} from './services/progressService';

// الحصول على التقدم
const progress = getProgress();
console.log(progress.totalStars); // عدد النجوم

// تحديث السورة الحالية
updateCurrentSurah('1');

// إكمال سورة
completeSurah('1');
```

---

## 🎨 التخصيص

### تغيير الألوان

```typescript
// في index.css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #10b981;
  --danger-color: #ef4444;
}
```

### إضافة حركة جديدة

```css
/* في index.css */
@keyframes myAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.my-element {
  animation: myAnimation 2s infinite;
}
```

### تخصيص الرسائل التحفيزية

```typescript
// في RewardModal.tsx
const messages = [
  'رسالتك المخصصة! 🎉',
  'رسالة أخرى! ⭐',
  // أضف المزيد...
];
```

---

## 🔧 الأوامر المتاحة

| الأمر | الوصف |
|-------|--------|
| `npm run dev` | تشغيل التطبيق في وضع التطوير |
| `npm run build` | بناء التطبيق للإنتاج |
| `npm run preview` | معاينة البناء |
| `npm run lint` | فحص الكود |

---

## 🐛 حل المشاكل الشائعة

### المشكلة: لا يعمل المساعد الذكي

**الحل:**
```bash
# تأكد من وجود مفتاح API في .env.local
echo "VITE_GEMINI_API_KEY=your_key" > .env.local

# أعد تشغيل التطبيق
npm run dev
```

### المشكلة: لا يتم حفظ التقدم

**الحل:**
```javascript
// افتح Console في المتصفح واكتب:
localStorage.getItem('quranProgress')

// إذا كانت النتيجة null، جرب:
localStorage.clear()
// ثم أعد تحميل الصفحة
```

### المشكلة: الصوت لا يعمل

**الحل:**
1. تأكد من اتصالك بالإنترنت
2. تحقق من إعدادات الصوت في المتصفح
3. جرب متصفح آخر
4. تحقق من Console للأخطاء

### المشكلة: خطأ في التثبيت

**الحل:**
```bash
# احذف المجلدات وأعد التثبيت
rm -rf node_modules package-lock.json
npm install

# أو استخدم yarn
yarn install
```

---

## 📚 موارد إضافية

### التوثيق
- [README.md](./README.md) - نظرة عامة
- [FEATURES.md](./FEATURES.md) - دليل الميزات التفصيلي
- [API Documentation](#) - توثيق API (قريباً)

### الروابط المفيدة
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Google Gemini AI](https://ai.google.dev/)

### المجتمع
- [GitHub Issues](https://github.com/your-username/Quran-for-Kids/issues)
- [Discussions](https://github.com/your-username/Quran-for-Kids/discussions)
- [Contributing Guide](./CONTRIBUTING.md) (قريباً)

---

## 💡 نصائح سريعة

### للتطوير

✅ **استخدم React DevTools** لتتبع الحالة  
✅ **فعّل Hot Reload** للتطوير السريع  
✅ **اختبر على أجهزة مختلفة** (موبايل، تابلت، كمبيوتر)  
✅ **راجع Console** للأخطاء والتحذيرات  
✅ **استخدم TypeScript** للكشف المبكر عن الأخطاء  

### للنشر

✅ **بناء الإنتاج**: `npm run build`  
✅ **اختبار البناء**: `npm run preview`  
✅ **تحسين الصور**: استخدم أدوات الضغط  
✅ **تفعيل HTTPS**: للأمان  
✅ **إعداد CDN**: لتسريع التحميل  

### للأداء

✅ **Lazy Loading**: للمكونات الكبيرة  
✅ **Code Splitting**: لتقليل حجم الحزمة  
✅ **Memoization**: لتحسين الأداء  
✅ **Debouncing**: للبحث والإدخال  
✅ **Caching**: للبيانات والصور  

---

## 🎯 الخطوات التالية

بعد التشغيل الناجح، يمكنك:

1. **استكشاف الكود** 📖
   - افتح `src/App.tsx` لفهم البنية
   - راجع `components/` للمكونات
   - اطلع على `services/` للخدمات

2. **إضافة ميزات** ✨
   - أضف سور جديدة في `data.ts`
   - خصص التصميم في `index.css`
   - طور ميزات جديدة

3. **المساهمة** 🤝
   - Fork المشروع
   - أنشئ فرع جديد
   - أرسل Pull Request

4. **النشر** 🚀
   - Vercel (موصى به)
   - Netlify
   - GitHub Pages
   - أي خدمة استضافة

---

## 📞 الدعم

هل تحتاج مساعدة؟

- 📧 **Email**: support@example.com
- 💬 **Discord**: [Join our server](#)
- 🐦 **Twitter**: [@QuranForKids](#)
- 📱 **WhatsApp**: [Community Group](#)

---

<div align="center">

**مستعد للبدء؟** 🚀

```bash
npm install && npm run dev
```

**استمتع بالتطوير!** 💻✨

</div>