import { ReactNode } from 'react';
import { useServices } from '@/hooks/useServices';
import { ServicesContext } from '../contexts/ServicesContext';

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const servicesData = useServices();

  return (
    <ServicesContext.Provider value={servicesData}>
      {children}
    </ServicesContext.Provider>
  );
};