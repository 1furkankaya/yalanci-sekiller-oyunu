// GameScreen.tsx (Timer Düzgün Çalışan Versiyon)
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playMusic } from '../components/MusicManager';
import { playCorrectSound, playWrongSound, playClickSound } from '../components/SoundEffectsManager';
import { Vibration } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Animated } from 'react-native';
import { useSoundSettings } from '../app/SoundSettingsContext';
import { useThemeContext } from './ThemeContext';
import { useDifficultySettings } from './DifficultySettingsContext'; // eklenmiş olmalı
import i18n from './📁 locales/i18n'; 
import { useTranslation } from 'react-i18next'; // en üste ekle
import Svg, { Polygon } from 'react-native-svg';




const { width } = Dimensions.get('window');
const shapes = ['daire', 'kare', 'üçgen', 'yıldız', 'kalp', 'altigen'];


export default function GameScreen() {
  const { difficulty } = useLocalSearchParams();
  const router = useRouter();
  const { autoDifficulty } = useDifficultySettings(); // Önce bu tanımlanmalı
  const { t } = useTranslation(); // ✅ buraya ekle
  const selectedDifficulty = (difficulty as 'easy' | 'medium' | 'hard') || 'easy';
  
  const [score, setScore] = useState(0); // Önce score lazım çünkü getCurrentLevel içinde kullanılıyor
  

  
  const currentLevel = getCurrentLevel(); // Artık güvenle çağrılabilir
  const isHard = currentLevel === 'hard';


  const [maxScore, setMaxScore] = useState(0);
  const { soundEnabled } = useSoundSettings();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  
  const shapeAnim = useState(new Animated.Value(0))[0];
  const textAnim = useState(new Animated.Value(0))[0];
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const styles = createStyles(isDark);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [timeUp, setTimeUp] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [textShape, setTextShape] = useState('');
  const [realShape, setRealShape] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');
  
  function getCurrentLevel() {
    if (!autoDifficulty) return selectedDifficulty;
    if (score >= 10) return 'hard';
    if (score >= 5) return 'medium';
    return 'easy';
  }
  
  useEffect(() => {
    const checkMusicSetting = async () => {
      const saved = await AsyncStorage.getItem('musicEnabled');
      if (saved === 'true') playMusic(); 
    };
    checkMusicSetting();
  }, []);

  useEffect(() => {
    const loadMaxScore = async () => {
      const saved = await AsyncStorage.getItem('maxScore');
      if (saved) setMaxScore(parseInt(saved));
    };
    loadMaxScore();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setRunning(false);
        setMessage(t('paused'));

      };
    }, [])
  );

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setRunning(false);
            setTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      {autoDifficulty && (
        <Text style={{ color: '#ccc', fontSize: 14, marginBottom: 6 }}>
          Seviye: {score >= 10 ? 'Zor 🔥' : score >= 5 ? 'Orta ⚠️' : 'Kolay 🟢'}
        </Text>
      )}
      
    };
  }, [running]);

  function getInitialTime(scoreValue = score) {
    let level = selectedDifficulty;
  
    if (autoDifficulty) {
      if (scoreValue >= 10) level = 'hard';
      else if (scoreValue >= 5) level = 'medium';
      else level = 'easy';
    }
  
    switch (level) {
      case 'easy': return 10;
      case 'medium': return 5;
      case 'hard': return 3;
      default: return 5;
    }
  }
  
  

  const triggerShake = () => {
    Vibration.vibrate(100);
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };
  const getDisplayedText = () => {
     // Küçük harfe çevir (çünkü çeviri key'leri küçük)
  const translated = t(`shapes.${textShape.toLowerCase()}`);
  
  // Eğer zor modda isek, metni ters çevir
  return isHard ? translated.split('').reverse().join('') : translated;
  
  };

  const generateNewRound = useCallback(() => {
    const text = shapes[Math.floor(Math.random() * shapes.length)]; 
    const real = Math.random() > 0.5 ? text : shapes[Math.floor(Math.random() * shapes.length)];
    setTextShape(text);
    setRealShape(real);
    setTimeLeft(getInitialTime(score)); // Böyle yap




    setRunning(true);
    shapeAnim.setValue(0);
    textAnim.setValue(0);

    Animated.parallel([
      Animated.timing(shapeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(textAnim, { toValue: 1, duration: 400, useNativeDriver: true })
    ]).start();
  }, [selectedDifficulty]);
  useEffect(() => {
    const restoreScore = async () => {
      const savedScore = await AsyncStorage.getItem('tempScore');
      if (savedScore) {
        setScore(parseInt(savedScore));
        await AsyncStorage.removeItem('tempScore'); // Temizle
      }
      generateNewRound();
    };
    restoreScore();
  }, []);
  

  const handleAnswer = async (isCorrectPressed: boolean) => {
    const isActuallyCorrect = textShape === realShape;
    if (isCorrectPressed === isActuallyCorrect) {
      await playCorrectSound();
      setScore(prev => {
        const newScore = prev + 1;
        if (newScore > maxScore) {
          setMaxScore(newScore);
          AsyncStorage.setItem('maxScore', newScore.toString());
        }
        return newScore;
      });
      setMessage(t('correct'));

         generateNewRound();
      setTimeout(() => setMessage(''), 1000);
    } else {
      await playWrongSound();
      setRunning(false);
      setGameOver(true);
      triggerShake();
    }
  };

  const handleClick = async (callback: () => void) => {
    if (soundEnabled) await playClickSound();
    callback();
  };

  const pauseGame = async () => {
    await AsyncStorage.setItem('tempScore', score.toString());
    setRunning(false);
    setMessage(t('paused'));
  };

  const continueGame = () => {
    setRunning(true);
    setMessage('');
  };


  const renderShape = () => {
    const size = width * 0.3;
    const getRandomColor = () => {
      const colors = ['#00ffff', '#ff4b5c', '#f5c542', '#8e44ad'];
      return colors[Math.floor(Math.random() * colors.length)];
    };
    const shapeColor = isHard ? getRandomColor() : '#00ffff';
    const animatedStyle = {
      opacity: shapeAnim,
      transform: [
        {
          scale: shapeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          }),
        },
      ],
    };
    const shakeStyle = { transform: [{ translateX: shakeAnimation }] };
  
    let shape;
    switch (realShape) {
      case 'daire':
        shape = (
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: shapeColor,
            }}
          />
        );
        break;
  
      case 'kare':
        shape = (
          <View
            style={{
              width: size,
              height: size,
              backgroundColor: shapeColor,
            }}
          />
        );
        break;
  
      case 'üçgen':
        shape = (
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: size / 2,
              borderRightWidth: size / 2,
              borderBottomWidth: size,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: shapeColor,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
            }}
          />
        );
        break;
  
      case 'yıldız':
        shape = (
          <View
            style={{
              width: size,
              height: size,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: size * 0.8, color: shapeColor }}>★</Text>
          </View>
        );
        break;
  
        case 'altigen':
          shape = (
            <View
              style={{
                width: size,
                height: size,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Svg width={size} height={size * 1.15} viewBox="0 0 100 115">
                <Polygon
                  points="50,5 95,30 95,85 50,110 5,85 5,30"
                  fill={shapeColor}
                />
              </Svg>
            </View>
          );
        break;
  
      case 'kalp':
        shape = (
          <View
            style={{
              width: size,
              height: size,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: size * 0.8, color: shapeColor }}>❤️</Text>
          </View>
        );
        break;
        
  
      default:
        shape = null;
    }
  
    return <Animated.View style={[animatedStyle, shakeStyle]}>{shape}</Animated.View>;
  };
  

  const renderOverlay = (title: string, showState: boolean, hide: () => void) => (
    <LinearGradient   colors={isDark ? ['#000000', '#1a1a1a'] : ['#1e1eff', '#8e00ff']}
    style={styles.overlay}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
      <View style={styles.gameOverBox}>
        <Text style={styles.gameOverTitle}>{title}</Text>
        <Text style={styles.finalScore}>Skorun: {score}</Text>
        <TouchableOpacity style={styles.overlayButton} onPress={() => handleClick(() => {
          hide();
          setTimeLeft(getInitialTime());
          setRunning(true);
        })}>
         <Text style={styles.overlayButtonText}>{t('watch_ad')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.overlayButton} onPress={() => handleClick(() => {
          setScore(0);
          hide();
          generateNewRound();
        })}>
        <Text style={styles.overlayButtonText}>{t('restart')}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
  if (timeUp) return renderOverlay(t('time_up'), timeUp, () => setTimeUp(false));
  if (gameOver) return renderOverlay(t('game_over'), gameOver, () => setGameOver(false));
  

  return (
    <LinearGradient   colors={isDark ? ['#000000', '#1a1a1a'] : ['#1e1eff', '#8e00ff']}
    style={styles.container}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
      <TouchableOpacity style={{ position: 'absolute', top: 48, right: 24 }} onPress={() => handleClick(() => router.push('/SettingsScreen'))}>
        <Ionicons name="settings-sharp" size={28} color="#ffffff" />
      </TouchableOpacity>

      <View style={styles.topBar}>
      <Text style={styles.topMaxScore}>{t('highest_score')}: {maxScore}</Text>

    </View>


      <Animated.Text style={[styles.shapeText, {
        opacity: textAnim,
        transform: [{ scale: textAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }]
      }]}
      >{getDisplayedText()}</Animated.Text>

      <View style={styles.shapeBox}>{renderShape()}</View>
      {autoDifficulty && (
        <Text style={{
  color: '#ccc',
  fontSize: 14,
  marginBottom: 10,
  marginTop: 16,
  textAlign: 'center'
}}>
  {t('level_' + getCurrentLevel())}
</Text>

)}



<Text style={styles.score}>{t('score')}: {score}</Text>
<Text style={styles.timer}>{t('time')}: {timeLeft}s</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.button} onPress={() => handleAnswer(true)}>
  <Text style={styles.buttonText}>{t('correct_button')}</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.button} onPress={() => handleAnswer(false)}>
  <Text style={styles.buttonText}>{t('wrong_button')}</Text>
</TouchableOpacity>

      </View>

      <View style={styles.bottomButtons}>
        {running ? (
          <TouchableOpacity style={styles.controlButton} onPress={() => handleClick(pauseGame)}><Text style={styles.buttonText}>{t('pause')}</Text></TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.controlButton} onPress={() => handleClick(continueGame)}><Text style={styles.buttonText}>{t('continue')}</Text></TouchableOpacity>
        )}
        <TouchableOpacity style={styles.controlButton} onPress={() => handleClick(() => router.replace('/DifficultyScreen'))}>
        <Text style={styles.buttonText}>{t('select_difficulty')}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      backgroundColor: isDark ? '#000' : '#fff', // Fallback eklendi
    },
    shapeText: {
      fontSize: 48, // 60 yerine 48 daha esnek
      fontWeight: '900',
      color: isDark ? '#FFFFFF' : '#222222',
      marginBottom: 24,
      letterSpacing: 2, // 4 yerine 2 yap
      textAlign: 'center', // eklendi
      maxWidth: '90%',     // eklendi
      alignSelf: 'center', // ortalamak için
      textShadowColor: isDark ? '#70f0ff' : '#8e00ff',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
  },
  maxScore: {
    fontSize: 16,
    color: '#FFD166', // turuncu ton ile vurgulu yapar
    marginTop: 4,
    fontWeight: '600',
  },
  
  score: {
    fontSize: 22,
    color: '#ECECEC',
    marginTop: 4,
  },
  timer: {
    fontSize: 20,         
    color: '#FFD166',
    marginVertical: 8,
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    color: '#CCCCCC',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 14,
  },
  button: {
    backgroundColor: '#1f1fff',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#70f0ff',
    shadowColor: '#70f0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomButtons: {
    flexDirection: 'row',
    marginTop: 36,
    gap: 16,
  },
  controlButton: {
    backgroundColor: '#2B2D36',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3d3f47',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gameOverBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)', // soft glassmorphism efekti
    borderRadius: 24,
    padding: 32,
    width: '90%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff33',
    shadowColor: '#8e00ff',
    shadowOpacity: 0.4,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
    backdropFilter: 'blur(10px)', // (sadece webde geçerli ama mantık olarak burada)
  },
  gameOverTitle: {
    fontSize: 36,
    color: '#FF6B81',
    fontWeight: 'bold',
    marginBottom: 18,
    letterSpacing: 1,
    textShadowColor: '#ff6b8177',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    includeFontPadding: false, // Android'de padding sorunu önler
    lineHeight: 40, // metin yüksekliğini dengelemek için
    textAlign: 'center',
  },
  finalScore: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 26,
  },
  adButton: {
    backgroundColor: '#1f1fff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#70f0ff',
    shadowColor: '#70f0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  restartButton: {
    backgroundColor: '#2B2D36',
  paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 14,
  width: '100%',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ffffff22',
  },
  
  overlayButton: {
    backgroundColor: '#1e1eff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#80f0ff',
    shadowColor: '#80f0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 12,
  },
  overlayButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  topBar: {
    position: 'absolute',
    top: 48,
    left: 24,
    right: 72, // Ayarlara çakışmasın diye
    alignItems: 'flex-start',
    zIndex: 5,
  },
  
  topMaxScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#FFD70099',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  

});