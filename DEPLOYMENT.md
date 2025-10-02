# 🚀 دليل النشر - Quran for Kids

## 📋 جدول المحتويات

1. [النشر على Vercel](#النشر-على-vercel) ⭐ موصى به
2. [النشر على Netlify](#النشر-على-netlify)
3. [النشر على GitHub Pages](#النشر-على-github-pages)
4. [النشر على خادم خاص](#النشر-على-خادم-خاص)
5. [إعداد المتغيرات البيئية](#إعداد-المتغيرات-البيئية)

---

## 🌟 النشر على Vercel (موصى به)

### لماذا Vercel؟

✅ **مجاني تماماً** للمشاريع الشخصية  
✅ **نشر تلقائي** من GitHub  
✅ **سريع جداً** (CDN عالمي)  
✅ **سهل الإعداد** (دقائق معدودة)  
✅ **دعم متغيرات البيئة**  
✅ **HTTPS مجاني**  

### الخطوات

#### 1. إنشاء حساب Vercel

1. اذهب إلى: https://vercel.com/signup
2. سجل الدخول باستخدام GitHub
3. امنح Vercel الصلاحيات المطلوبة

#### 2. رفع المشروع على GitHub

```bash
# إذا لم تكن قد رفعت المشروع بعد
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/Quran-for-Kids.git
git push -u origin main
```

#### 3. استيراد المشروع في Vercel

1. اذهب إلى: https://vercel.com/new
2. اختر "Import Git Repository"
3. اختر مستودع "Quran-for-Kids"
4. اضغط "Import"

#### 4. إعداد المشروع

```
Project Name: quran-for-kids
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 5. إضافة متغيرات البيئة

في صفحة الإعدادات:

```
Environment Variables:
├── VITE_GEMINI_API_KEY = your_api_key_here
```

#### 6. النشر

اضغط "Deploy" وانتظر دقيقة واحدة! 🎉

**رابط التطبيق:** `https://quran-for-kids.vercel.app`

### التحديثات التلقائية

كل مرة تدفع تغييرات إلى GitHub، سيتم نشرها تلقائياً!

```bash
git add .
git commit -m "Update features"
git push
# ✅ سيتم النشر تلقائياً!
```

---

## 🎯 النشر على Netlify

### الخطوات

#### 1. إنشاء حساب Netlify

1. اذهب إلى: https://app.netlify.com/signup
2. سجل الدخول باستخدام GitHub

#### 2. إنشاء موقع جديد

1. اضغط "Add new site" → "Import an existing project"
2. اختر "GitHub"
3. اختر مستودع "Quran-for-Kids"

#### 3. إعداد البناء

```
Build command: npm run build
Publish directory: dist
```

#### 4. إضافة متغيرات البيئة

في "Site settings" → "Environment variables":

```
VITE_GEMINI_API_KEY = your_api_key_here
```

#### 5. النشر

اضغط "Deploy site" 🚀

**رابط التطبيق:** `https://quran-for-kids.netlify.app`

### ملف netlify.toml (اختياري)

أنشئ ملف `netlify.toml` في المجلد الرئيسي:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## 📄 النشر على GitHub Pages

### الخطوات

#### 1. تعديل vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Quran-for-Kids/', // اسم المستودع
})
```

#### 2. إنشاء سكريبت النشر

أضف في `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
```

#### 3. تثبيت gh-pages

```bash
npm install --save-dev gh-pages
```

#### 4. النشر

```bash
npm run deploy
```

#### 5. تفعيل GitHub Pages

1. اذهب إلى Settings → Pages
2. اختر Branch: `gh-pages`
3. اضغط Save

**رابط التطبيق:** `https://your-username.github.io/Quran-for-Kids/`

### ⚠️ ملاحظة مهمة

GitHub Pages لا يدعم متغيرات البيئة السرية!  
المساعد الذكي (Gemini AI) لن يعمل.

**الحل:**
- استخدم Vercel أو Netlify للميزات الكاملة
- أو أنشئ backend بسيط لإخفاء API key

---

## 🖥️ النشر على خادم خاص

### المتطلبات

- خادم Linux (Ubuntu/Debian)
- Node.js 18+
- Nginx أو Apache
- اسم نطاق (اختياري)

### الخطوات

#### 1. بناء المشروع محلياً

```bash
npm run build
```

#### 2. رفع ملفات dist

```bash
# باستخدام SCP
scp -r dist/* user@your-server:/var/www/quran-for-kids/

# أو باستخدام FTP/SFTP
```

#### 3. إعداد Nginx

أنشئ ملف `/etc/nginx/sites-available/quran-for-kids`:

```nginx
server {
    listen 80;
    server_name quran-for-kids.com www.quran-for-kids.com;
    root /var/www/quran-for-kids;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 4. تفعيل الموقع

```bash
sudo ln -s /etc/nginx/sites-available/quran-for-kids /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. إعداد HTTPS (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d quran-for-kids.com -d www.quran-for-kids.com
```

---

## 🔐 إعداد المتغيرات البيئية

### الحصول على مفتاح Gemini API

1. اذهب إلى: https://makersuite.google.com/app/apikey
2. سجل الدخول بحساب Google
3. اضغط "Create API Key"
4. انسخ المفتاح

### إضافة المفتاح

#### في Vercel

```
Dashboard → Settings → Environment Variables
├── Key: VITE_GEMINI_API_KEY
└── Value: your_api_key_here
```

#### في Netlify

```
Site settings → Environment variables → Add a variable
├── Key: VITE_GEMINI_API_KEY
└── Value: your_api_key_here
```

#### محلياً

أنشئ ملف `.env.local`:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

⚠️ **لا ترفع `.env.local` على GitHub!**

---

## 🔍 التحقق من النشر

### قائمة التحقق

- [ ] التطبيق يفتح بدون أخطاء
- [ ] قائمة السور تظهر بشكل صحيح
- [ ] البحث يعمل
- [ ] التلاوة الصوتية تعمل
- [ ] تظليل الكلمات يعمل
- [ ] التفسير يظهر
- [ ] المساعد الذكي يعمل (إذا أضفت API key)
- [ ] نظام التقدم يحفظ البيانات
- [ ] المكافآت تظهر عند الإكمال
- [ ] التطبيق responsive على الموبايل
- [ ] HTTPS مفعل (قفل أخضر)

### أدوات الاختبار

#### 1. Lighthouse (Chrome DevTools)

```
F12 → Lighthouse → Generate report
```

**الأهداف:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

#### 2. PageSpeed Insights

https://pagespeed.web.dev/

أدخل رابط موقعك واحصل على تقرير مفصل.

#### 3. اختبار الموبايل

https://search.google.com/test/mobile-friendly

تأكد من أن الموقع mobile-friendly.

---

## 🐛 حل مشاكل النشر

### المشكلة: الصفحة فارغة

**الأسباب المحتملة:**
1. مسار base خاطئ في vite.config.ts
2. ملفات JavaScript لم يتم تحميلها
3. أخطاء في Console

**الحل:**
```bash
# تحقق من Console في المتصفح (F12)
# تأكد من مسار base في vite.config.ts
# أعد البناء والنشر
npm run build
```

### المشكلة: المساعد الذكي لا يعمل

**الأسباب:**
1. لم تضف VITE_GEMINI_API_KEY
2. المفتاح غير صحيح
3. تجاوزت حد الاستخدام المجاني

**الحل:**
```bash
# تحقق من المتغيرات البيئية في لوحة التحكم
# تأكد من أن المفتاح يبدأ بـ VITE_
# جرب مفتاح جديد
```

### المشكلة: الصوت لا يعمل

**الأسباب:**
1. مشكلة في CORS
2. ملفات الصوت غير متاحة
3. المتصفح يحظر autoplay

**الحل:**
```javascript
// تأكد من أن المستخدم تفاعل مع الصفحة أولاً
// ملفات EveryAyah.com تدعم CORS
// جرب متصفح آخر
```

### المشكلة: 404 عند التحديث

**السبب:**
الخادم لا يعيد توجيه جميع المسارات إلى index.html

**الحل (Nginx):**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**الحل (Vercel/Netlify):**
يتم تلقائياً ✅

---

## 📊 مراقبة الأداء

### Google Analytics (اختياري)

#### 1. إنشاء حساب

https://analytics.google.com/

#### 2. إضافة الكود

في `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Vercel Analytics

مدمج تلقائياً! ✅

اذهب إلى Dashboard → Analytics

---

## 🔄 التحديثات المستقبلية

### سير العمل الموصى به

```bash
# 1. إنشاء فرع جديد
git checkout -b feature/new-feature

# 2. إجراء التغييرات
# ... edit files ...

# 3. اختبار محلياً
npm run dev

# 4. بناء واختبار
npm run build
npm run preview

# 5. Commit و Push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 6. إنشاء Pull Request على GitHub

# 7. دمج في main
# سيتم النشر تلقائياً على Vercel/Netlify!
```

---

## 🎯 نصائح للأداء الأمثل

### 1. تحسين الصور

```bash
# استخدم أدوات ضغط الصور
npm install -g imagemin-cli
imagemin images/* --out-dir=images/optimized
```

### 2. تفعيل Compression

معظم خدمات الاستضافة تفعلها تلقائياً ✅

### 3. استخدام CDN

Vercel و Netlify يستخدمان CDN تلقائياً ✅

### 4. Lazy Loading

```typescript
// للمكونات الكبيرة
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 5. Code Splitting

Vite يفعلها تلقائياً ✅

---

## 📝 قائمة مرجعية للنشر

### قبل النشر

- [ ] اختبار جميع الميزات محلياً
- [ ] إصلاح جميع الأخطاء في Console
- [ ] تحديث README.md
- [ ] إضافة .env.example
- [ ] تحديث package.json (version, description)
- [ ] إزالة console.log غير الضرورية
- [ ] اختبار على أجهزة مختلفة
- [ ] التأكد من .gitignore صحيح

### أثناء النشر

- [ ] اختيار منصة الاستضافة
- [ ] إعداد المتغيرات البيئية
- [ ] تكوين إعدادات البناء
- [ ] نشر التطبيق
- [ ] التحقق من الرابط

### بعد النشر

- [ ] اختبار جميع الميزات على الموقع المباشر
- [ ] اختبار على موبايل حقيقي
- [ ] تشغيل Lighthouse
- [ ] إعداد Google Analytics (اختياري)
- [ ] مشاركة الرابط
- [ ] مراقبة الأخطاء

---

## 🎉 تهانينا!

تطبيقك الآن مباشر على الإنترنت! 🚀

**شارك رابطك:**
- مع الأصدقاء والعائلة
- على وسائل التواصل الاجتماعي
- في المجتمعات التعليمية
- مع المدارس والمراكز الإسلامية

**استمر في التطوير:**
- أضف ميزات جديدة
- استمع لملاحظات المستخدمين
- حسّن الأداء
- أضف المزيد من السور

---

<div align="center">

**صُنع بـ ❤️ ونُشر بـ 🚀**

```
🌍 الآن متاح للعالم! 🌍
```

**رابط التطبيق المباشر:**  
https://quran-for-kids.vercel.app/

⭐ لا تنسَ إعطاء المشروع نجمة على GitHub! ⭐

</div>