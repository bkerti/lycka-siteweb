import { pool } from '../../database';
import { BlogArticle, LyckaBlogComment } from '../types';

export const getAllBlogArticles = async (): Promise<BlogArticle[]> => {
  const result = await pool.query('SELECT * FROM lycka_blog ORDER BY created_at DESC');
  return result.rows;
};

export const createBlogArticle = async (articleData: Omit<BlogArticle, 'id' | 'created_at'>): Promise<BlogArticle> => {
  const { title, content, media } = articleData;
  const newArticle = await pool.query(
    'INSERT INTO lycka_blog (title, content, media) VALUES ($1, $2, $3) RETURNING *',
    [title, content, JSON.stringify(media)]
  );
  return newArticle.rows[0];
};

export const updateBlogArticle = async (id: string, articleData: Partial<Omit<BlogArticle, 'id' | 'created_at'>>): Promise<BlogArticle | null> => {
  const { title, content, media } = articleData;
  const updatedArticle = await pool.query(
    'UPDATE lycka_blog SET title = $1, content = $2, media = $3 WHERE id = $4 RETURNING *',
    [title, content, JSON.stringify(media), id]
  );
  return updatedArticle.rows[0] || null;
};

export const deleteBlogArticle = async (id: string): Promise<{ rowCount: number | null }> => {
  const deleteOp = await pool.query('DELETE FROM lycka_blog WHERE id = $1 RETURNING *', [id]);
  return deleteOp;
};

export const getCommentsForArticle = async (articleId: string): Promise<LyckaBlogComment[]> => {
  const result = await pool.query('SELECT * FROM lycka_blog_comments WHERE article_id = $1 ORDER BY created_at DESC', [articleId]);
  return result.rows;
};

export const createCommentForArticle = async (articleId: string, commentData: Omit<LyckaBlogComment, 'id' | 'article_id' | 'created_at'>): Promise<LyckaBlogComment> => {
  const { author_name, content } = commentData;
  const newComment = await pool.query(
    'INSERT INTO lycka_blog_comments (article_id, author_name, content) VALUES ($1, $2, $3) RETURNING *',
    [articleId, author_name, content]
  );
  return newComment.rows[0];
};

export const getAllComments = async (): Promise<LyckaBlogComment[]> => {
  const result = await pool.query(`
    SELECT c.id, c.content, c.author_name, c.created_at, b.title as article_title
    FROM lycka_blog_comments c
    JOIN lycka_blog b ON c.article_id = b.id
    ORDER BY c.created_at DESC
  `);
  return result.rows;
};

export const deleteComment = async (commentId: string): Promise<{ rowCount: number | null }> => {
  const deleteOp = await pool.query('DELETE FROM lycka_blog_comments WHERE id = $1 RETURNING *', [commentId]);
  return deleteOp;
};
