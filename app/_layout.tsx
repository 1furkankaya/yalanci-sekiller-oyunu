import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// ✅ i18n çeviri sistemi
import './📁 locales/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './📁 locales/i18n';

import { SoundSettingsProvider } from './SoundSettingsContext';
import ThemeProvider from './ThemeContext';
import { DifficultySettingsProvider } from './DifficultySettingsContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // ✅ Dil ayarını başlarken uygula
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang === 'tr' || savedLang === 'en') {
        await i18n.changeLanguage(savedLang);
      }
    };
    loadLanguage();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <SoundSettingsProvider>
        <DifficultySettingsProvider>
          <NavigationThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="GameScreen" options={{ headerShown: false }} />
              <Stack.Screen name="DifficultyScreen" options={{ headerShown: false }} />
              <Stack.Screen name="SettingsScreen" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </NavigationThemeProvider>
        </DifficultySettingsProvider>
      </SoundSettingsProvider>
    </ThemeProvider>
  );
}
