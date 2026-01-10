import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as projectService from '../../lib/services/projectService';
import { withRoles } from '../../lib/auth';
import type { VercelRequestWithUser } from '../../lib/auth';

// Handler for GET requests
const getHandler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const projects = await projectService.getAllProjects();
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    const err = error as Error;
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Handler for POST requests
const postHandler = async (req: VercelRequestWithUser, res: VercelResponse) => {
  try {
    const newProject = await projectService.createProject(req.body);
    return res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    const err = error as Error;
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Main handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    // Protect the POST route
    const protectedPostHandler = withRoles(['admin', 'super_admin'], postHandler);
    return protectedPostHandler(req as VercelRequestWithUser, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
