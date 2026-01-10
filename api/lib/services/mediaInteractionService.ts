import { sql } from '../db.js';
import { MediaComment, MediaReaction, AggregatedReaction } from '../types.js';

export const getInteractionsForMedia = async (mediaId: string): Promise<{ comments: MediaComment[]; reactions: { [key: string]: AggregatedReaction } }> => {
  const commentsResult = await sql<MediaComment>`SELECT * FROM media_comments WHERE media_id = ${mediaId} ORDER BY created_at DESC`;
  const reactionsResult = await sql<AggregatedReaction>`SELECT reaction_type, COUNT(*) as count FROM media_reactions WHERE media_id = ${mediaId} GROUP BY reaction_type`;

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
  const { rows } = await sql<MediaComment>`
    INSERT INTO media_comments (media_id, author_name, comment_text) 
    VALUES (${mediaId}, ${author_name}, ${comment_text}) 
    RETURNING *
  `;
  return rows[0];
};

export const deleteCommentFromMedia = async (commentId: string): Promise<{ rowCount: number }> => {
  const result = await sql`DELETE FROM media_comments WHERE id = ${commentId}`;
  return { rowCount: result.rowCount };
};

export const addReactionToMedia = async (mediaId: string, reactionData: Omit<MediaReaction, 'id' | 'media_id' | 'created_at'>): Promise<MediaReaction> => {
  const { reaction_type } = reactionData;
  const { rows } = await sql<MediaReaction>`
    INSERT INTO media_reactions (media_id, reaction_type) 
    VALUES (${mediaId}, ${reaction_type}) 
    RETURNING *
  `;
  return rows[0];
};

export const getAllInteractions = async (): Promise<{ [mediaId: string]: { comments: MediaComment[]; reactions: { [key: string]: AggregatedReaction } } }> => {
  const commentsResult = await sql<MediaComment>`SELECT * FROM media_comments ORDER BY created_at DESC`;
  const reactionsResult = await sql<AggregatedReaction & { media_id: string }>`SELECT media_id, reaction_type, COUNT(*) as count FROM media_reactions GROUP BY media_id, reaction_type`;

  const interactions: { [mediaId: string]: { comments: MediaComment[]; reactions: { [key: string]: AggregatedReaction } } } = {};

  // Process comments
  for (const comment of commentsResult.rows) {
    const mediaId = comment.media_id;
    if (!interactions[mediaId]) {
      interactions[mediaId] = { comments: [], reactions: {} };
    }
    interactions[mediaId].comments.push(comment);
  }

  // Process reactions
  for (const reaction of reactionsResult.rows) {
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
