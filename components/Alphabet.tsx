import React from 'react';

const ARABIC_LETTERS = [
  'ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'
];

const LetterCard: React.FC<{letter: string, onSpeak: (l:string)=>void}> = ({ letter, onSpeak }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 justify-center text-center">
      <div className="text-6xl font-quranic text-teal-700">{letter}</div>
      <div className="flex gap-2">
        <button onClick={() => onSpeak(letter)} className="kid-btn px-4 py-2 rounded-xl">🔊 استمع</button>
        <button onClick={() => onSpeak(letter + 'ـ')} className="px-4 py-2 bg-white border rounded-xl">🔁 ترديد</button>
      </div>
    </div>
  );
};

const Alphabet: React.FC = () => {
  const speak = (text: string) => {
    if (typeof window === 'undefined') return;
    const utter = new SpeechSynthesisUtterance(text);
    // Arabic voice preference
    utter.lang = 'ar-SA';
    utter.rate = 0.9; // slightly slower for children
    utter.pitch = 1.0;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('Speech API error', e);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">📚 الحروف الهجائية</h2>
      <p className="text-center text-gray-600 mb-6">اضغط على أي حرف للاستماع ونطقه ببطء مناسب للأطفال</p>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
        {ARABIC_LETTERS.map((l) => (
          <LetterCard key={l} letter={l} onSpeak={speak} />
        ))}
      </div>
    </div>
  );
};

export default Alphabet;
