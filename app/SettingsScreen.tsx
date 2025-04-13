import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playMusic, stopMusic } from '../components/MusicManager';
import { playClickSound } from '../components/SoundEffectsManager';
import { useSoundSettings } from '../app/SoundSettingsContext';
import { useThemeContext } from './ThemeContext';
import { useTranslation } from 'react-i18next';
import i18n from './📁 locales/i18n';

export default function SettingsScreen() {
  const router = useRouter();
  const isFirstRender = useRef(true);

  const { t } = useTranslation();
  const { soundEnabled, toggleSound } = useSoundSettings();
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';
  const styles = createStyles(isDark);

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [screenKey, setScreenKey] = useState(0); // Ekranı yeniden render etmek için

  const changeLanguage = async (lang: 'tr' | 'en') => {
    await i18n.changeLanguage(lang);
    Alert.alert(
      lang === 'tr' ? 'Dil değiştirildi' : 'Language Changed',
      lang === 'tr' ? 'Uygulama dili Türkçe oldu.' : 'App language is now English.',
      [{ text: 'Tamam' }]
    );
    setLanguage(lang);
    setScreenKey(prev => prev + 1); // ✅ Ekranı güncelle
    await AsyncStorage.setItem('appLanguage', lang);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang === 'tr' || savedLang === 'en') {
        await i18n.changeLanguage(savedLang);
        setLanguage(savedLang);
      }
    };
    loadLanguage();
  }, []);

  useEffect(() => {
    const loadMusicPreference = async () => {
      const saved = await AsyncStorage.getItem('musicEnabled');
      if (saved !== null) {
        setMusicEnabled(saved === 'true');
        if (saved === 'true') playMusic();
      }
    };
    loadMusicPreference();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const saveAndToggleMusic = async () => {
      await AsyncStorage.setItem('musicEnabled', musicEnabled.toString());
      musicEnabled ? playMusic() : stopMusic();
    };

    saveAndToggleMusic();
  }, [musicEnabled]);

  return (
    <LinearGradient
      colors={isDark ? ['#000000', '#1a1a1a'] : ['#1e1eff', '#8e00ff']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      key={screenKey} // 🔁 Ekranı yeniden render et
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (soundEnabled) playClickSound();
          router.back();
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.header}>{t('settings.title')}</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>{t('settings.soundEffects')}</Text>
        <Switch
          value={soundEnabled}
          onValueChange={(val) => {
            playClickSound();
            toggleSound(val);
          }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>{t('settings.muzik')}</Text>
        <Switch
          value={musicEnabled}
          onValueChange={(val) => {
            if (soundEnabled) playClickSound();
            setMusicEnabled(val);
          }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>{t('settings.darkTheme')}</Text>
        <Switch
          value={isDark}
          onValueChange={() => {
            if (soundEnabled) playClickSound();
            toggleTheme();
          }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>{t('settings.language')}</Text>
        <TouchableOpacity
          onPress={() => {
            if (soundEnabled) playClickSound();
            changeLanguage(language === 'tr' ? 'en' : 'tr');
          }}
        >
          <Text style={styles.languageButton}>
            {i18n.language === 'tr' ? t('settings.en') : t('settings.tr')}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 64,
      paddingHorizontal: 24,
    },
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 32,
      textAlign: 'center',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? '#ffffff11' : '#00000011',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? '#ffffff22' : '#00000022',
    },
    label: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    languageButton: {
      fontSize: 16,
      color: '#FFD166',
      fontWeight: 'bold',
    },
    backButton: {
      position: 'absolute',
      top: 48,
      left: 24,
    },
  });
