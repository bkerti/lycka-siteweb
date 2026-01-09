
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [commentContent, setCommentContent] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/lycka-blog/${articleId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [articleId]);

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId, fetchComments]);

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return; // Don't submit empty comments

    try {
      await fetch(`/api/lycka-blog/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: authorName || 'Anonyme', content: commentContent }),
      });
      setCommentContent('');
      setAuthorName('');
      fetchComments(); // Refresh comments after submission
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-700/50">
      <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Commentaires</h4>
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="font-bold text-gray-800 dark:text-gray-100">{comment.author_name}</p>
            <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(comment.created_at).toLocaleString()}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-gray-500 dark:text-gray-400">Aucun commentaire pour le moment.</p>}
      </div>
      <div className="space-y-2">
        <Input 
          placeholder="Votre nom (optionnel)" 
          value={authorName} 
          onChange={(e) => setAuthorName(e.target.value)} 
        />
        <Textarea 
          placeholder="Laissez un commentaire..." 
          value={commentContent} 
          onChange={(e) => setCommentContent(e.target.value)} 
        />
        <Button onClick={handleSubmitComment} className="bg-blue-500 hover:bg-blue-600 text-white">Envoyer</Button>
      </div>
    </div>
  );
};

export default CommentSection;
