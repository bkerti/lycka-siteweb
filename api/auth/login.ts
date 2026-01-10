import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { User } from '../../../lib/types';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end('Method Not Allowed');
  }

  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
    const user = rows[0] as User | undefined;

    if (!user) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return response.status(200).json({ token, username: user.username, role: user.role });

  } catch (err) {
    console.error('Login error:', err);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
