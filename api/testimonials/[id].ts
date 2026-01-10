import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as testimonialService from '../../../lib/services/testimonialService';
import { withRoles } from '../../../lib/auth';
import type { VercelRequestWithUser } from '../../../lib/auth';

const deleteHandler = async (req: VercelRequestWithUser, res: VercelResponse) => {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'ID must be a string.' });
  try {
    const { rowCount } = await testimonialService.deleteTestimonial(id);
    if (rowCount === 0) return res.status(404).json({ error: 'Testimonial not found.' });
    return res.status(204).send(null);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'DELETE') {
    const protectedHandler = withRoles(['admin', 'super_admin'], deleteHandler);
    return protectedHandler(req as VercelRequestWithUser, res);
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
