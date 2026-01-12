
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import ArticleImageCarousel from './lyckablog/ArticleImageCarousel';
import { useBlog } from '@/hooks/useBlog';
import LyckaBlogForm from './LyckaBlogForm';

const AdminLyckaBlog = () => {
  const { articles, fetchArticles } = useBlog();
  const [editingArticle, setEditingArticle] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    setEditingArticle(null);
    setIsFormVisible(true);
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      const token = localStorage.getItem('adminToken');
      try {
        await fetch(`/api/lycka-blog/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        fetchArticles();
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const handleSave = async (article: any) => {
    const url = article.id ? `/api/lycka-blog/${article.id}` : '/api/lycka-blog';
    const method = article.id ? 'PUT' : 'POST';
    const token = localStorage.getItem('adminToken');

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(article),
      });
      fetchArticles();
      setIsFormVisible(false);
      setEditingArticle(null);
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingArticle(null);
  };

  useEffect(() => {
    if (isFormVisible && formRef.current) {
      // Timeout to ensure the element is in the DOM and rendered
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isFormVisible]);

  if (isFormVisible) {
    return (
      <div ref={formRef}>
        <LyckaBlogForm item={editingArticle} onSave={handleSave} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lycka Blog</h1>
        <Button onClick={handleAdd}>Ajouter un article</Button>
      </div>
      <div className="space-y-4">
        {articles.map((article: any) => (
          <div key={article.id} className="p-4 border rounded-lg flex items-center gap-4">
            {article.media && article.media.length > 0 && (
              <div className="w-48">
                <ArticleImageCarousel images={article.media} articleTitle={article.title} />
              </div>
            )}
            <div className="flex-grow">
              <h3 className="font-bold">{article.title}</h3>
              <p className="text-sm text-gray-500">{new Date(article.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(article)}>Modifier</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}>Supprimer</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLyckaBlog;
