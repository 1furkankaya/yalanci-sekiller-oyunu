import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SoundSettingsContextType = {
  soundEnabled: boolean;
  toggleSound: (enabled: boolean) => void;
};

const SoundSettingsContext = createContext<SoundSettingsContextType>({
  soundEnabled: true,
  toggleSound: () => {},
});

// ✅ Hook: Kolay erişim için
export const useSoundSettings = () => useContext(SoundSettingsContext);

// ✅ Provider bileşeni
export const SoundSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false); // İlk yükleme kontrolü

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('soundEnabled');
        if (saved !== null) {
          setSoundEnabled(saved === 'true');
        }
      } catch (err) {
        console.warn('Ses ayarı yüklenemedi:', err);
      } finally {
        setIsLoaded(true); // Yükleme tamamlandı
      }
    };
    load();
  }, []);

  const toggleSound = async (enabled: boolean) => {
    try {
      setSoundEnabled(enabled);
      await AsyncStorage.setItem('soundEnabled', enabled.toString());
    } catch (err) {
      console.warn('Ses ayarı kaydedilemedi:', err);
    }
  };

  // ✅ Veriler yüklenmeden boş ekran döndür (opsiyonel ama sağlıklı)
  if (!isLoaded) return null;

  return (
    <SoundSettingsContext.Provider value={{ soundEnabled, toggleSound }}>
      {children}
    </SoundSettingsContext.Provider>
  );
};

export default SoundSettingsProvider;
