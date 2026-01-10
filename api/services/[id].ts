import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as serviceService from '../../../lib/services/serviceService';
import { withRoles } from '../../../lib/auth';
import type { VercelRequestWithUser } from '../../../lib/auth';

const putHandler = async (req: VercelRequestWithUser, res: VercelResponse) => {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'ID must be a string.' });
  try {
    const updatedService = await serviceService.updateService(id, req.body);
    if (!updatedService) return res.status(404).json({ error: 'Service not found.' });
    return res.status(200).json(updatedService);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteHandler = async (req: VercelRequestWithUser, res: VercelResponse) => {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'ID must be a string.' });
  try {
    const { rowCount } = await serviceService.deleteService(id);
    if (rowCount === 0) return res.status(404).json({ error: 'Service not found.' });
    return res.status(204).send(null);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'PUT') {
    const protectedHandler = withRoles(['admin', 'super_admin'], putHandler);
    return protectedHandler(req as VercelRequestWithUser, res);
  } else if (req.method === 'DELETE') {
    const protectedHandler = withRoles(['admin', 'super_admin'], deleteHandler);
    return protectedHandler(req as VercelRequestWithUser, res);
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
