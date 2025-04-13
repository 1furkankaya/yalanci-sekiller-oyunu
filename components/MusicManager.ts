import { Audio } from 'expo-av';

let soundObject: Audio.Sound | null = null;

export const playMusic = async () => {
  if (soundObject) return;

  const { sound } = await Audio.Sound.createAsync(
    require('../app/assets/sounds/muzik.mp3'),
    { isLooping: true, volume: 0.5 }
  );
  

  soundObject = sound;
  await sound.playAsync();
};

export const stopMusic = async () => {
  if (soundObject) {
    try {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
    } catch (error) {
      console.log('Müzik durdurulurken hata:', error);
    }
    soundObject = null;
  }
};
