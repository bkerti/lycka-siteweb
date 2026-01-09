
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const AdminBlogComments = () => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('/api/lycka-blog/comments', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      const token = localStorage.getItem('adminToken');
      try {
        await fetch(`/api/lycka-blog/comments/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        fetchComments(); // Refresh comments after deletion
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestion des commentaires du Blog</h1>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{comment.author_name}</p>
                <p className="text-sm text-gray-500">Article: {comment.article_title}</p>
              </div>
              <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>
            </div>
            <p className="mt-2">{comment.content}</p>
            <div className="text-right mt-2">
              <Button variant="destructive" size="sm" onClick={() => handleDelete(comment.id)}>Supprimer</Button>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p>Aucun commentaire à afficher.</p>}
      </div>
    </div>
  );
};

export default AdminBlogComments;
