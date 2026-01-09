import React, { useState, useEffect, useCallback } from 'react';
import { BlogContext } from '../contexts/BlogContext';

export const BlogProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);

  const fetchArticles = useCallback(async () => {
    try {
      const response = await fetch('/api/lycka-blog');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch blog articles:", error);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const value = {
    articles,
    fetchArticles,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};