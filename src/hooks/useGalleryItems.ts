import { useState, useEffect } from 'react';

export const useGalleryItems = (filter, category) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const response = await fetch('/api/gallery-items');
        const data = await response.json();
        setMediaItems(data);
      } catch (error) {
        console.error("Failed to fetch gallery items:", error);
      }
    };

    fetchMediaItems();
  }, []);

  useEffect(() => {
    const filtered = mediaItems.filter(item => {
      const sectionFilter = filter === 'all' || item.section === filter;
      const categoryFilter = category === 'all' || item.category === category;
      return sectionFilter && categoryFilter;
    });
    setFilteredItems(filtered);

    const uniqueCategories = ['all', ...new Set(mediaItems.filter(item => filter === 'all' || item.section === filter).map(item => item.category || ''))].filter(Boolean);
    setCategories(uniqueCategories);

  }, [filter, category, mediaItems]);

  return { mediaItems, filteredItems, categories };
};