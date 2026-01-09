import { useContext } from 'react';
import { BlogContext } from '../contexts/BlogContext';

export const useBlog = () => useContext(BlogContext);