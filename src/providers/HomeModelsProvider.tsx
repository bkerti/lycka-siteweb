import { ReactNode } from 'react';
import { useHomeModels } from '@/hooks/useHomeModels';
import { HomeModelsContext } from '../contexts/HomeModelsContext';

export const HomeModelsProvider = ({ children }: { children: ReactNode }) => {
  const homeModelsData = useHomeModels();

  return (
    <HomeModelsContext.Provider value={homeModelsData}>
      {children}
    </HomeModelsContext.Provider>
  );
};