import { Audio } from 'expo-av';

export const playCorrectSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('../app/assets/sounds/correct.mp3'),
    { shouldPlay: true }
  );
  await sound.playAsync();
};

export const playWrongSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('../app/assets/sounds/wrong.mp3'),
    { shouldPlay: true }
  );
  await sound.playAsync();
};

export const playClickSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('../app/assets/sounds/click.mp3'),
    { shouldPlay: true, volume: 1.0 }
  );
  await sound.playAsync();
};
