import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a custom request type that includes the user payload
export interface VercelRequestWithUser extends VercelRequest {
  user?: UserPayload;
}

export interface UserPayload extends JwtPayload {
  userId: string;
  username: string;
  role: string;
}

type ApiHandler = (req: VercelRequestWithUser, res: VercelResponse) => Promise<any>;

// Higher-order function to wrap a handler with authentication
export const withAuth = (handler: ApiHandler): ApiHandler => {
  return async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
  };
};

// Higher-order function to wrap an authenticated handler with role authorization
export const withRoles = (roles: string[], handler: ApiHandler): ApiHandler => {
  return withAuth(async (req, res) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role.' });
    }
    return handler(req, res);
  });
};
