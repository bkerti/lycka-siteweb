
import React, { useState } from 'react';
import { useBlog } from '@/hooks/useBlog';
import CommentSection from './CommentSection';
import ArticleImageCarousel from './admin/lyckablog/ArticleImageCarousel';

const LyckaBlogSection = () => {
  const { articles } = useBlog();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!articles || articles.length === 0) {
    return null; // Don't render the section if there are no articles
  }

  const toggleArticles = () => {
    setIsExpanded(!isExpanded);
  };

  const visibleArticles = isExpanded ? articles.length : 3;

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-gray-900 dark:text-white">Lycka Blog</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, visibleArticles).map((article) => (
            <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {article.media && article.media.length > 0 && (
                <ArticleImageCarousel images={article.media} articleTitle={article.title} />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{article.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{article.content}</p>
              </div>
              <CommentSection articleId={article.id} />
            </div>
          ))}
        </div>
        {articles.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={toggleArticles}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {isExpanded ? 'Voir moins' : 'Voir plus'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LyckaBlogSection;
