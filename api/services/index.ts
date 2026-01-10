import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as serviceService from '../../lib/services/serviceService';
import { withRoles } from '../../lib/auth';
import type { VercelRequestWithUser } from '../../lib/auth';

const getHandler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const services = await serviceService.getAllServices();
    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const postHandler = async (req: VercelRequestWithUser, res: VercelResponse) => {
  try {
    const newService = await serviceService.createService(req.body);
    return res.status(201).json(newService);
  } catch (error) {
    console.error(error);
    const dbError = error as { code?: string, message: string };
    if (dbError.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Un service avec ce titre existe déjà.' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    const protectedPostHandler = withRoles(['admin', 'super_admin'], postHandler);
    return protectedPostHandler(req as VercelRequestWithUser, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}