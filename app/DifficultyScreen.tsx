import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from './ThemeContext';
import { useSoundSettings } from '../app/SoundSettingsContext';
import { useDifficultySettings } from './DifficultySettingsContext';
import { playClickSound } from '../components/SoundEffectsManager';
import { useTranslation } from 'react-i18next';

export default function DifficultyScreen() {
  const router = useRouter();
  const { theme } = useThemeContext();
  const { soundEnabled } = useSoundSettings();
  const { setAutoDifficulty } = useDifficultySettings();
  const isDark = theme === 'dark';
  const { t } = useTranslation();

  const handleSelect = async (difficulty: string) => {
    if (soundEnabled) await playClickSound();
    setAutoDifficulty(false);
    router.replace({ pathname: '/GameScreen', params: { difficulty } });
  };

  const handleAuto = async () => {
    if (soundEnabled) await playClickSound();
    setAutoDifficulty(true);
    router.replace({ pathname: '/GameScreen', params: { difficulty: 'auto' } });
  };

  const handleBack = async () => {
    if (soundEnabled) await playClickSound();
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/GameScreen');
    }
  };

  const styles = createStyles(isDark);

  return (
    <LinearGradient
      colors={isDark ? ['#0d0d0d', '#1a1a1a'] : ['#1e1eff', '#8e00ff']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={28} color="#ffffff" />
      </TouchableOpacity>

      <Text style={styles.title}>{t('difficulty.title')}</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.difficultyButton} onPress={() => handleSelect('easy')}>
          <Text style={styles.buttonText}>{t('difficulty.easy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.difficultyButton} onPress={() => handleSelect('medium')}>
          <Text style={styles.buttonText}>{t('difficulty.medium')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.difficultyButton} onPress={() => handleSelect('hard')}>
          <Text style={styles.buttonText}>{t('difficulty.hard')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.difficultyButton, styles.autoButton]} onPress={handleAuto}>
          <Text style={styles.buttonText}>{t('difficulty.auto')}</Text>
        </TouchableOpacity>
        <Text style={styles.autoDescription}>{t('difficulty.description')}</Text>
      </View>
    </LinearGradient>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 120,
    },
    backButton: {
      position: 'absolute',
      top: 48,
      left: 24,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 40,
      letterSpacing: 1,
      textShadowColor: '#00000066',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
    },
    buttonGroup: {
      gap: 24,
      width: '100%',
      alignItems: 'center',
    },
    difficultyButton: {
      backgroundColor: '#ffffff22',
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 40,
      borderWidth: 1.5,
      borderColor: '#ffffff44',
      width: '80%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 8,
    },
    autoButton: {
      borderColor: '#FFD700',
      shadowColor: '#FFD700',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: 1,
    },
    autoDescription: {
      marginTop: 12,
      color: '#ddd',
      fontSize: 14,
      textAlign: 'center',
      paddingHorizontal: 12,
    },
  });
