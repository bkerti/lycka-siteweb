import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as projectService from '../../../lib/services/projectService';
import { withRoles } from '../../../lib/auth';
import type { VercelRequestWithUser } from '../../../lib/auth';

// Handler for PUT requests (update)
const putHandler = async (req: VercelRequestWithUser, res: VercelResponse) => {
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID must be a string.' });
  }
  try {
    const updatedProject = await projectService.updateProject(id, req.body);
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler for DELETE requests
const deleteHandler = async (req: VercelRequestWithUser, res: VercelResponse) => {
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID must be a string.' });
  }
  try {
    const { rowCount } = await projectService.deleteProject(id);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    return res.status(204).send(null); // No content
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Main handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const protectedPutHandler = withRoles(['admin', 'super_admin'], putHandler);
  const protectedDeleteHandler = withRoles(['admin', 'super_admin'], deleteHandler);

  if (req.method === 'PUT') {
    return protectedPutHandler(req as VercelRequestWithUser, res);
  } else if (req.method === 'DELETE') {
    return protectedDeleteHandler(req as VercelRequestWithUser, res);
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
