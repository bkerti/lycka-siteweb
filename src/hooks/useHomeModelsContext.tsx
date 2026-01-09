import { useContext } from 'react';
import { HomeModelsContext } from '../contexts/HomeModelsContext';

export const useHomeModelsContext = () => {
    const context = useContext(HomeModelsContext);
    if (context === undefined) {
        throw new Error('useHomeModelsContext must be used within a HomeModelsProvider');
    }
    return context;
};