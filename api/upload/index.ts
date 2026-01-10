import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end('Method Not Allowed');
  }

  const filename = request.query.filename as string;
  if (!filename) {
    return response.status(400).json({ error: '`filename` query parameter is required.' });
  }

  try {
    const blob = await put(filename, request, { // Pass the request stream directly
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN, // Explicitly pass the token
    });

    return response.status(200).json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    const err = error as Error;
    return response.status(500).json({ error: 'Error uploading file.', details: err.message });
  }
}
