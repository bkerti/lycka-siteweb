import { JwtPayload } from 'jsonwebtoken';

declare namespace Express {
  export interface UserPayload extends JwtPayload {
    userId: string;
    username: string;
    role: string;
  }

  export interface Request {
    user?: UserPayload;
    file?: Express.Multer.File;
  }
}