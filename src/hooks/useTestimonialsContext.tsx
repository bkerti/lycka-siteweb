import { useContext } from 'react';
import { TestimonialsContext } from '../contexts/TestimonialsContext';

export const useTestimonialsContext = () => {
    const context = useContext(TestimonialsContext);
    if (context === undefined) {
        throw new Error('useTestimonialsContext must be used within a TestimonialsProvider');
    }
    return context;
};