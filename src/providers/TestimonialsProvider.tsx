import { ReactNode } from 'react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { TestimonialsContext } from '../contexts/TestimonialsContext';

export const TestimonialsProvider = ({ children }: { children: ReactNode }) => {
  const testimonialsData = useTestimonials();

  return (
    <TestimonialsContext.Provider value={testimonialsData}>
      {children}
    </TestimonialsContext.Provider>
  );
};