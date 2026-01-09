import { pool } from '../../database';
import { MediaComment, MediaReaction, AggregatedReaction } from '../types';

export const getInteractionsForMedia = async (mediaId: string): Promise<{ comments: MediaComment[]; reactions: { [key: string]: AggregatedReaction } }> => {
  const commentsResult = await pool.query('SELECT * FROM media_comments WHERE media_id = $1 ORDER BY created_at DESC', [mediaId]);
  const reactionsResult = await pool.query('SELECT reaction_type, COUNT(*) as count FROM media_reactions WHERE media_id = $1 GROUP BY reaction_type', [mediaId]);

  const reactions: { [key: string]: AggregatedReaction } = (reactionsResult.rows as AggregatedReaction[]).reduce((acc: { [key: string]: AggregatedReaction }, row: AggregatedReaction) => {
    acc[row.reaction_type] = { reaction_type: row.reaction_type, count: parseInt(row.count.toString(), 10) };
    return acc;
  }, {});

  return {
    comments: commentsResult.rows,
    reactions,
  };
};

export const addCommentToMedia = async (mediaId: string, commentData: Omit<MediaComment, 'id' | 'media_id' | 'created_at'>): Promise<MediaComment> => {
  const { author_name, comment_text } = commentData;
  const newComment = await pool.query(
    'INSERT INTO media_comments (media_id, author_name, comment_text) VALUES ($1, $2, $3) RETURNING *',
    [mediaId, author_name, comment_text]
  );
  return newComment.rows[0];
};

export const deleteCommentFromMedia = async (commentId: string): Promise<{ rowCount: number | null }> => {
  const deleteOp = await pool.query('DELETE FROM media_comments WHERE id = $1 RETURNING *', [commentId]);
  return deleteOp;
};

export const addReactionToMedia = async (mediaId: string, reactionData: Omit<MediaReaction, 'id' | 'media_id' | 'created_at'>): Promise<MediaReaction> => {
  const { reaction_type } = reactionData;
  const newReaction = await pool.query(
    'INSERT INTO media_reactions (media_id, reaction_type) VALUES ($1, $2) RETURNING *',
    [mediaId, reaction_type]
  );
  return newReaction.rows[0];
};

export const getAllInteractions = async (): Promise<{ [mediaId: string]: { comments: MediaComment[]; reactions: { [key: string]: AggregatedReaction } } }> => {
  const commentsResult = await pool.query('SELECT * FROM media_comments ORDER BY created_at DESC');
  const reactionsResult = await pool.query('SELECT media_id, reaction_type, COUNT(*) as count FROM media_reactions GROUP BY media_id, reaction_type');

  const interactions: { [mediaId: string]: { comments: MediaComment[]; reactions: { [key: string]: AggregatedReaction } } } = {};

  // Process comments
  for (const comment of commentsResult.rows as MediaComment[]) {
    const mediaId = comment.media_id;
    if (!interactions[mediaId]) {
      interactions[mediaId] = { comments: [], reactions: {} };
    }
    interactions[mediaId].comments.push(comment);
  }

  // Process reactions
  for (const reaction of reactionsResult.rows as (AggregatedReaction & { media_id: string })[]) {
    const mediaId = reaction.media_id;
    if (!interactions[mediaId]) {
      interactions[mediaId] = { comments: [], reactions: {} };
    }
    if (!interactions[mediaId].reactions[reaction.reaction_type]) {
      interactions[mediaId].reactions[reaction.reaction_type] = { reaction_type: reaction.reaction_type, count: 0 };
    }
    interactions[mediaId].reactions[reaction.reaction_type].count += parseInt(reaction.count.toString(), 10);
  }

  return interactions;
};
