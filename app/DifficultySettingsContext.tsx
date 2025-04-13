import React, { createContext, useContext, useState } from 'react';

type DifficultyContextType = {
  autoDifficulty: boolean;
  setAutoDifficulty: (val: boolean) => void;
};

const DifficultySettingsContext = createContext<DifficultyContextType | undefined>(undefined);

export const useDifficultySettings = () => {
  const context = useContext(DifficultySettingsContext);
  if (!context) {
    throw new Error('useDifficultySettings must be used within DifficultySettingsProvider');
  }
  return context;
};

export const DifficultySettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [autoDifficulty, setAutoDifficulty] = useState(false);
  return (
    <DifficultySettingsContext.Provider value={{ autoDifficulty, setAutoDifficulty }}>
      {children}
    </DifficultySettingsContext.Provider>
  );
};

// ❗ Bunu EKLE:
export default DifficultySettingsProvider;
