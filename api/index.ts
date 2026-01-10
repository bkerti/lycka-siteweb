// api/index.ts
import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { put } from '@vercel/blob';
import { db, sql } from './lib/db.js'; // Direct db access
import bcrypt from 'bcryptjs';

// Import all refactored services
import * as projectService from './lib/services/projectService.js';
import * as serviceService from './lib/services/serviceService.js';
import * as homeModelService from './lib/services/homeModelService.js';
import * as lyckaBlogService from './lib/services/lyckaBlogService.js';
import *o testimonialService from './lib/services/testimonialService.js';
import * as mediaInteractionService from './lib/services/mediaInteractionService.js';
import type { User } from './lib/types.js';

const app = express();

// Global Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Auth Middleware
interface RequestWithUser extends Request {
  user?: UserPayload;
}
interface UserPayload extends JwtPayload {
  userId: string;
  username: string;
  role: string;
}

const authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user as UserPayload;
    next();
  });
};

const authorizeRoles = (roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

// --- API ROUTES ---

// Health Check
app.get('/api', (req, res) => {
  res.send('API is running.');
});

// --- DEV ONLY ---
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/dev/setup-database', async (req, res) => {
    const client = await db.connect();
    try {
      await client.sql`BEGIN`;
      
      // Create tables
      await client.sql`
        DROP TABLE IF EXISTS users CASCADE;
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      // ... (Include all other CREATE TABLE statements here from the previous setup file) ...
       await client.sql`
        DROP TABLE IF EXISTS projects CASCADE;
        CREATE TABLE IF NOT EXISTS projects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) UNIQUE NOT NULL,
            category VARCHAR(100),
            description TEXT,
            media JSONB[],
            status VARCHAR(50),
            location VARCHAR(255),
            year VARCHAR(4),
            price NUMERIC
        );
      `;
      await client.sql`
        DROP TABLE IF EXISTS services CASCADE;
        CREATE TABLE IF NOT EXISTS services (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            icon VARCHAR(100),
            imageUrl VARCHAR(255),
            features JSONB
        );
      `;
      await client.sql`
        DROP TABLE IF EXISTS home_models CASCADE;
        CREATE TABLE IF NOT EXISTS home_models (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) UNIQUE NOT NULL,
            price NUMERIC,
            sqm INTEGER,
            description TEXT,
            media JSONB[],
            category VARCHAR(100),
            floors INTEGER,
            livingRooms INTEGER
        );
      `;
       await client.sql`
        DROP TABLE IF EXISTS media_comments CASCADE;
        CREATE TABLE IF NOT EXISTS media_comments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            media_id VARCHAR(255) NOT NULL,
            author_name VARCHAR(100) NOT NULL DEFAULT 'Anonyme',
            comment_text TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      await client.sql`
        DROP TABLE IF EXISTS media_reactions CASCADE;
        CREATE TABLE IF NOT EXISTS media_reactions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            media_id VARCHAR(255) NOT NULL,
            reaction_type VARCHAR(50) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      await client.sql`
        DROP TABLE IF EXISTS testimonials;
        CREATE TABLE IF NOT EXISTS testimonials (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      await client.sql`
        DROP TABLE IF EXISTS lycka_blog CASCADE;
        CREATE TABLE IF NOT EXISTS lycka_blog (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) UNIQUE NOT NULL,
            content TEXT NOT NULL,
            media JSONB[],
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      await client.sql`
        DROP TABLE IF EXISTS lycka_blog_comments;
        CREATE TABLE IF NOT EXISTS lycka_blog_comments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            article_id UUID NOT NULL REFERENCES lycka_blog(id) ON DELETE CASCADE,
            author_name VARCHAR(100) NOT NULL DEFAULT 'Anonyme',
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      await client.sql`
        DROP TABLE IF EXISTS visits;
        CREATE TABLE IF NOT EXISTS visits (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          visit_timestamp TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      
      // Seed users
      const usersToSeed = [
        { username: 'bkerti', role: 'super_admin', password: 'password123' },
        { username: 'jordan', role: 'admin', password: 'password123' },
        { username: 'franklin', role: 'admin', password: 'password123' },
        { username: 'admin', role: 'admin', password: '0000' },
      ];

      for (const user of usersToSeed) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await client.sql`
          INSERT INTO users (username, password_hash, role) 
          VALUES (${user.username}, ${hashedPassword}, ${user.role}) 
          ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
        `;
      }
      
      await client.sql`COMMIT`;
      res.status(200).send('Database setup complete!');
    } catch (error) {
      await client.sql`ROLLBACK`;
      console.error(error);
      res.status(500).json({ error: 'Database setup failed.' });
    } finally {
      client.release();
    }
  });
}


// --- Upload ---
app.post('/api/upload', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req: Request, res: Response) => {
    const filename = req.query.filename as string;
    if (!filename) {
        return res.status(400).json({ error: 'Filename query parameter is required.' });
    }
    try {
        const blob = await put(filename, req, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return res.status(200).json(blob);
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Failed to upload file.' });
    }
});


// --- Auth ---
app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

    try {
        const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
        const user = rows[0] as User | undefined;
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        return res.status(200).json({ token, username: user.username, role: user.role });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// --- Projects ---
app.get('/api/projects', async (req, res) => res.json(await projectService.getAllProjects()));
app.post('/api/projects', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => res.status(201).json(await projectService.createProject(req.body)));
app.put('/api/projects/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => res.json(await projectService.updateProject(req.params.id as string, req.body)));
app.delete('/api/projects/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
    await projectService.deleteProject(req.params.id as string);
    res.status(204).send();
});

// --- Services ---
app.get('/api/services', async (req, res) => res.json(await serviceService.getAllServices()));
app.post('/api/services', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => res.status(201).json(await serviceService.createService(req.body)));
app.put('/api/services/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => res.json(await serviceService.updateService(req.params.id as string, req.body)));
app.delete('/api/services/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
    await serviceService.deleteService(req.params.id as string);
    res.status(204).send();
});


// --- Home Models ---
app.get('/api/homemodels', async (req, res) => res.json(await homeModelService.getAllHomeModels()));
app.post('/api/homemodels', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => res.status(201).json(await homeModelService.createHomeModel(req.body)));
app.put('/api/homemodels/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => res.json(await homeModelService.updateHomeModel(req.params.id as string, req.body)));
app.delete('/api/homemodels/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
    await homeModelService.deleteHomeModel(req.params.id as string);
    res.status(204).send();
});


// --- Testimonials ---
app.get('/api/testimonials', async (req, res) => res.json(await testimonialService.getAllTestimonials()));
app.post('/api/testimonials', async (req, res) => {
    if (req.body.subject) return res.status(200).send(); // Honeypot
    res.status(201).json(await testimonialService.createTestimonial(req.body));
});
app.delete('/api/testimonials/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
    await testimonialService.deleteTestimonial(req.params.id as string);
    res.status(204).send();
});

// --- Lycka Blog ---
app.get('/api/lycka-blog', async (req, res) => res.json(await lyckaBlogService.getAllBlogArticles()));
app.post('/api/lycka-blog', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => res.status(201).json(await lyckaBlogService.createBlogArticle(req.body)));
app.put('/api/lycka-blog/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => res.json(await lyckaBlogService.updateBlogArticle(req.params.id as string, req.body)));
app.delete('/api/lycka-blog/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
    await lyckaBlogService.deleteBlogArticle(req.params.id as string);
    res.status(204).send();
});
app.get('/api/lycka-blog/:articleId/comments', async (req, res) => res.json(await lyckaBlogService.getCommentsForArticle(req.params.articleId as string)));
app.post('/api/lycka-blog/:articleId/comments', async (req, res) => res.status(201).json(await lyckaBlogService.createCommentForArticle(req.params.articleId as string, req.body)));
app.delete('/api/lycka-blog/comments/:commentId', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
    await lyckaBlogService.deleteComment(req.params.commentId as string);
    res.status(204).send();
});


// --- Media Interactions ---
app.get('/api/media/:mediaId/interactions', async (req, res) => res.json(await mediaInteractionService.getInteractionsForMedia(req.params.mediaId as string)));
app.post('/api/media/:mediaId/comments', async (req, res) => {
    if (req.body.subject) return res.status(200).send(); // Honeypot
    res.status(201).json(await mediaInteractionService.addCommentToMedia(req.params.mediaId as string, req.body));
});
app.delete('/api/media/:mediaId/comments/:commentId', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
    await mediaInteractionService.deleteCommentFromMedia(req.params.commentId as string);
    res.status(204).send();
});
app.post('/api/media/:mediaId/reactions', async (req, res) => res.status(201).json(await mediaInteractionService.addReactionToMedia(req.params.mediaId as string, req.body)));
app.get('/api/interactions', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => res.json(await mediaInteractionService.getAllInteractions()));

// --- Analytics ---
app.post('/api/visits', async (req, res) => {
    try {
        await sql`INSERT INTO visits (visit_timestamp) VALUES (NOW())`;
        res.status(201).send();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Export the app as a serverless function
export default app;
