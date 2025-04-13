import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { playClickSound } from '../components/SoundEffectsManager';
import { LinearGradient } from 'expo-linear-gradient';

export default function ClickTestScreen() {
  return (
    <LinearGradient
      colors={['#1e1eff', '#8e00ff']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>Tıklama Sesi Test</Text>

      <TouchableOpacity style={styles.button} onPress={playClickSound}>
        <Text style={styles.buttonText}>🔊 Tıkla & Dinle</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#1f1fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#70f0ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
