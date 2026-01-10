import { sql } from '../db.js';
import { BlogArticle, LyckaBlogComment } from '../types.js';

export const getAllBlogArticles = async (): Promise<BlogArticle[]> => {
  const { rows } = await sql<BlogArticle>`SELECT * FROM lycka_blog ORDER BY created_at DESC`;
  return rows;
};

export const createBlogArticle = async (articleData: Omit<BlogArticle, 'id' | 'created_at'>): Promise<BlogArticle> => {
  const { title, content, media } = articleData;
  const { rows } = await sql<BlogArticle>`
    INSERT INTO lycka_blog (title, content, media) 
    VALUES (${title}, ${content}, ${JSON.stringify(media)}::jsonb) 
    RETURNING *
  `;
  return rows[0];
};

export const updateBlogArticle = async (id: string, articleData: Partial<Omit<BlogArticle, 'id' | 'created_at'>>): Promise<BlogArticle | null> => {
  const { title, content, media } = articleData;
  const { rows } = await sql<BlogArticle>`
    UPDATE lycka_blog 
    SET title = ${title}, content = ${content}, media = ${JSON.stringify(media)}::jsonb 
    WHERE id = ${id} 
    RETURNING *
  `;
  return rows[0] || null;
};

export const deleteBlogArticle = async (id: string): Promise<{ rowCount: number }> => {
  const result = await sql`DELETE FROM lycka_blog WHERE id = ${id}`;
  return { rowCount: result.rowCount };
};

export const getCommentsForArticle = async (articleId: string): Promise<LyckaBlogComment[]> => {
  const { rows } = await sql<LyckaBlogComment>`SELECT * FROM lycka_blog_comments WHERE article_id = ${articleId} ORDER BY created_at DESC`;
  return rows;
};

export const createCommentForArticle = async (articleId: string, commentData: Omit<LyckaBlogComment, 'id' | 'article_id' | 'created_at'>): Promise<LyckaBlogComment> => {
  const { author_name, content } = commentData;
  const { rows } = await sql<LyckaBlogComment>`
    INSERT INTO lycka_blog_comments (article_id, author_name, content) 
    VALUES (${articleId}, ${author_name}, ${content}) 
    RETURNING *
  `;
  return rows[0];
};

export const getAllComments = async (): Promise<LyckaBlogComment[]> => {
  const { rows } = await sql<LyckaBlogComment>`
    SELECT c.id, c.content, c.author_name, c.created_at, b.title as article_title
    FROM lycka_blog_comments c
    JOIN lycka_blog b ON c.article_id = b.id
    ORDER BY c.created_at DESC
  `;
  return rows;
};

export const deleteComment = async (commentId: string): Promise<{ rowCount: number }> => {
  const result = await sql`DELETE FROM lycka_blog_comments WHERE id = ${commentId}`;
  return { rowCount: result.rowCount };
};
