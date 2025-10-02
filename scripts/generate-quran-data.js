/**
 * Script to generate complete Quran data from Al-Quran Cloud API
 * Run: node scripts/generate-quran-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simplified Tafsir for children (you can expand this later)
const simpleTafsir = {
  // This is a placeholder - you'll need to add proper tafsir for each ayah
  default: "هذه آية كريمة من كتاب الله، اسأل معلمك أو والديك عن معناها."
};

async function fetchQuranData() {
  console.log('🕌 Fetching complete Quran data...');
  
  try {
    // Fetch Quran with Arabic text
    const response = await fetch('https://api.alquran.cloud/v1/quran/ar.alafasy');
    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error('Failed to fetch Quran data');
    }

    console.log('✅ Data fetched successfully!');
    console.log(`📖 Total Surahs: ${data.data.surahs.length}`);
    
    // Transform data to our format
    const surahs = data.data.surahs.map((surah) => {
      return {
        id: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        numberOfAyahs: surah.ayahs.length,
        revelationType: surah.revelationType,
        ayahs: surah.ayahs.map((ayah) => {
          // Format surah and ayah numbers with leading zeros
          const surahNum = String(surah.number).padStart(3, '0');
          const ayahNum = String(ayah.numberInSurah).padStart(3, '0');
          
          return {
            id: ayah.numberInSurah,
            text: ayah.text,
            audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${surahNum}${ayahNum}.mp3`,
            words: [], // Will be empty for now - can be added later
            tafsir: simpleTafsir.default // Placeholder tafsir
          };
        })
      };
    });

    console.log('✅ Data transformed successfully!');
    
    // Save to file
    const outputPath = path.join(__dirname, '..', 'data', 'quran-complete.json');
    const outputDir = path.dirname(outputPath);
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(surahs, null, 2), 'utf-8');
    
    console.log('✅ Data saved to:', outputPath);
    console.log(`📊 Total size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
    console.log('🎉 Done!');
    
    // Generate TypeScript file
    generateTypeScriptFile(surahs);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function generateTypeScriptFile(surahs) {
  console.log('📝 Generating TypeScript file...');
  
  const tsContent = `/**
 * Complete Quran Data - 114 Surahs
 * Generated automatically from Al-Quran Cloud API
 * Audio: Mishary Rashid Alafasy
 */

import type { Surah } from '../types';

export const QURAN_DATA: Surah[] = ${JSON.stringify(surahs, null, 2)};

export const getSurahList = async (): Promise<{ id: number; name: string; englishName: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(QURAN_DATA.map(({ id, name, englishName }) => ({ id, name, englishName })));
    }, 100);
  });
};

export const getSurahById = async (id: number): Promise<Surah | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(QURAN_DATA.find((surah) => surah.id === id));
    }, 100);
  });
};
`;

  const outputPath = path.join(__dirname, '..', 'data', 'quran-data.ts');
  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  
  console.log('✅ TypeScript file generated:', outputPath);
}

// Run the script
fetchQuranData();