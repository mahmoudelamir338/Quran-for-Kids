import React, { useState } from 'react';

const ARABIC_LETTERS = [
  'ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'
];

// mapping letter -> filename (latin) for audio files under /audio/letters/
const LETTER_TO_FILE: Record<string,string> = {
  'ا':'alif','ب':'baa','ت':'taa','ث':'thaa','ج':'jeem','ح':'haa','خ':'khaa','د':'dal','ذ':'dhal','ر':'raa','ز':'zay','س':'seen','ش':'sheen','ص':'saad','ض':'daad','ط':'taa_2','ظ':'thaa_2','ع':'ain','غ':'ghain','ف':'faa','ق':'qaaf','ك':'kaaf','ل':'laam','م':'meem','ن':'noon','ه':'haa_2','و':'waw','ي':'yaa'
};

const LetterCard: React.FC<{letter: string, onSpeak: (l:string, repeat?:number)=>void}> = ({ letter, onSpeak }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 justify-center text-center">
      <div className="text-6xl font-quranic text-teal-700">{letter}</div>
      <div className="flex gap-2">
        <button onClick={() => onSpeak(letter, 1)} className="kid-btn px-4 py-2 rounded-xl">🔊 استمع</button>
        <button onClick={() => onSpeak(letter, 3)} className="px-4 py-2 bg-white border rounded-xl">🔁×3</button>
      </div>
    </div>
  );
};

const Alphabet: React.FC = () => {
  const [playing, setPlaying] = useState<{letter:string, left:number}|null>(null);

  const speak = async (text: string, repeat = 1) => {
    if (typeof window === 'undefined') return;

    // try to play pre-recorded mp3 first
    const key = LETTER_TO_FILE[text[0]];
    if (key) {
      const url = `/audio/letters/${key}.mp3`;
      try {
        const audio = new Audio(url);
        setPlaying({letter:text,left:repeat});
        for (let i=0;i<repeat;i++) {
          await audio.play().catch(()=>{});
          // update counter
          setPlaying({letter:text,left:repeat - i - 1});
          await new Promise((res) => setTimeout(res, 700));
        }
        setPlaying(null);
        return;
      } catch (e) {
        // failed to play mp3 -> fallback to speech
      }
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ar-SA';
    utter.rate = 0.9;
    utter.pitch = 1.0;
    try {
      window.speechSynthesis.cancel();
      setPlaying({letter:text,left:repeat});
      if (repeat <= 1) {
        window.speechSynthesis.speak(utter);
      } else {
        for (let i=0;i<repeat;i++) {
          window.speechSynthesis.speak(utter);
          setPlaying({letter:text,left:repeat - i - 1});
          await new Promise((res) => setTimeout(res, 800));
        }
      }
      setPlaying(null);
    } catch (e) {
      console.warn('Speech API error', e);
      setPlaying(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">📚 الحروف الهجائية</h2>
      <p className="text-center text-gray-600 mb-6">اضغط على أي حرف للاستماع ونطقه ببطء مناسب للأطفال</p>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
        {ARABIC_LETTERS.map((l) => (
          <div key={l} className="relative">
            <LetterCard letter={l} onSpeak={speak} />
            {playing?.letter === l && (
              <div className="absolute -top-2 -right-2 bg-yellow-300 text-sm px-2 py-1 rounded-full shadow">剩 {playing.left}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alphabet;
