import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as testimonialService from '../../lib/services/testimonialService';
import { withRoles } from '../../lib/auth';
import type { VercelRequestWithUser } from '../../lib/auth';

const getHandler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const testimonials = await testimonialService.getAllTestimonials();
    return res.status(200).json(testimonials);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const postHandler = async (req: VercelRequest, res: VercelResponse) => {
  // Honeypot check from original backend
  if (req.body.subject) {
    return res.status(200).send({ message: 'Accepted' }); 
  }
  try {
    const newTestimonial = await testimonialService.createTestimonial(req.body);
    return res.status(201).json(newTestimonial);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    // This is a public endpoint
    return postHandler(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
