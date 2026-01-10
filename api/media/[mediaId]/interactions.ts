import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as mediaInteractionService from '../../../../lib/services/mediaInteractionService';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { mediaId } = request.query;

  if (typeof mediaId !== 'string') {
    return response.status(400).json({ error: 'mediaId must be a string.' });
  }

  if (request.method === 'GET') {
    try {
      const interactions = await mediaInteractionService.getInteractionsForMedia(mediaId);
      return response.status(200).json(interactions);
    } catch (error) {
      console.error(`Error fetching interactions for mediaId ${mediaId}:`, error);
      const err = error as Error;
      return response.status(500).json({ error: 'Internal server error', details: err.message });
    }
  } else {
    response.setHeader('Allow', ['GET']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
