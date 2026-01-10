import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as lyckaBlogService from '../../lib/services/lyckaBlogService';
import { withRoles } from '../../lib/auth';
import type { VercelRequestWithUser } from '../../lib/auth';

const getHandler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const articles = await lyckaBlogService.getAllBlogArticles();
    return res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const postHandler = async (req: VercelRequestWithUser, res: VercelResponse) => {
  try {
    const newArticle = await lyckaBlogService.createBlogArticle(req.body);
    return res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
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