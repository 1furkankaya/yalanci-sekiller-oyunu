import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  tr: {
    translation: {
      settings: {
        title: 'Ayarlar',
        soundEffects: '🔈 Ses Efektleri',
        muzik: '🎵 Arka Plan Müziği',
        darkTheme: '🌗 Tema (Koyu)',
        language: '🌍 Dil',
        tr: 'Türkçe 🇹🇷',
        en: 'İngilizce 🇬🇧',
        back: 'Geri',
      },
      level_easy: 'Kolay 🟢',
      level_medium: 'Orta ⚠️',
      level_hard: 'Zor 🔥',
      score: 'Skor',
      time: 'Süre',
      paused: 'Oyun Durduruldu ⏸',
      correct: 'Doğru! 🎯',
      watch_ad: '🎥 Reklam İzle ve Devam Et',
      restart: '🔁 Yeniden Başla',
      pause: 'Duraklat',
      continue: 'Devam Et',
      select_difficulty: 'Zorluk Seç',
      highest_score: '🏆 En Yüksek Skor',
      game_over: 'YANLIŞ! ❌',
      time_up: 'SÜRE DOLDU ⏰',
      correct_button: 'DOĞRU',
      wrong_button: 'YANLIŞ',
      shapes: {
        daire: 'DAİRE',
        kare: 'KARE',
        üçgen: 'ÜÇGEN',
        yıldız: 'YILDIZ',
        altigen: 'ALTIGEN',
        kalp: 'KALP'
      },
      difficulty: {
        title: 'Zorluk Seç',
        easy: '🟢 Kolay',
        medium: '🟡 Orta',
        hard: '🔴 Zor',
        auto: '🧠 Otomatik Zorluk',
        description: 'Skorun arttıkça zorluk seviyesi otomatik olarak değişir.',
      },
    },
  },
  en: {
    translation: {
      settings: {
        title: 'Settings',
        soundEffects: '🔈 Sound Effects',
        muzik: '🎵 Background Music',
        darkTheme: '🌗 Theme (Dark)',
        language: '🌍 Language',
        tr: 'Turkish 🇹🇷',
        en: 'English 🇬🇧',
        back: 'Back',
      },
      level_easy: 'Easy 🟢',
      level_medium: 'Medium ⚠️',
      level_hard: 'Hard 🔥',
      score: 'Score',
      time: 'Time',
      paused: 'Game Paused ⏸',
      correct: 'Correct! 🎯',
      watch_ad: '🎥 Watch Ad and Continue',
      restart: '🔁 Restart',
      pause: 'Pause',
      continue: 'Continue',
      select_difficulty: 'Select Difficulty',
      highest_score: '🏆 Highest Score',
      game_over: 'WRONG! ❌',
      time_up: 'TIME UP ⏰',
      correct_button: 'CORRECT',
      wrong_button: 'WRONG',
      shapes: {
        daire: 'CIRCLE',
        kare: 'SQUARE',
        üçgen: 'TRIANGLE',
        yıldız: 'STAR',
        altigen: 'HEXAGON',
        kalp: 'HEART'
      },
      difficulty: {
        title: 'Select Difficulty',
        easy: '🟢 Easy',
        medium: '🟡 Medium',
        hard: '🔴 Hard',
        auto: '🧠 Auto Difficulty',
        description: 'As your score increases, the difficulty will automatically adjust.',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'tr',
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
