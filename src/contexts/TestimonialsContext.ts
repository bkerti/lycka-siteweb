import { createContext } from 'react';
import { Testimonial } from '@/hooks/useTestimonials';

type TestimonialsContextType = {
  testimonials: Testimonial[];
  fetchTestimonials: () => void;
  handleDelete: (id: string) => void;
};

export const TestimonialsContext = createContext<TestimonialsContextType | undefined>(undefined);