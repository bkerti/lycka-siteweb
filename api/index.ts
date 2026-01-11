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
import *as testimonialService from './lib/services/testimonialService.js';
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
// if (process.env.NODE_ENV !== 'production') {
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
        { username: 'bkerti', role: 'super_admin', password: 'lycka3310' },
        { username: 'jordan', role: 'admin', password: 'lycka3310' },
        { username: 'franklin', role: 'admin', password: 'lycka3310' },
        { username: 'admin', role: 'admin', password: 'lycka3310' },
      ];

      for (const user of usersToSeed) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await client.sql`
          INSERT INTO users (username, password_hash, role) 
          VALUES (${user.username}, ${hashedPassword}, ${user.role}) 
          ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
        `;
      }

      for (const project of projectsToSeed) {
        await client.query(
          `INSERT INTO projects (title, category, description, media, status, location, year, price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (title) DO NOTHING;`,
          [project.title, project.category, project.description, project.media as any, project.status, project.location, project.year, project.price]
        );
      }

      // Seed Services
      const servicesToSeed = [
        { title: 'conception-architecturale', description: 'Notre service de conception architecturale...', icon: 'calculator', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format', features: [`Études préliminaires`, `Conception de plans d'ensemble`, `Modélisations et rendus 3D`, `Adaptation aux contraintes du site`, `Optimisation des espaces`] },
        { title: 'Architecture et design intérieur', description: 'Notre service de décoration intérieure...', icon: '3d', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c249f4df085?w=500&auto=format', features: [`Conception d'ambiances`, `Sélection des matériaux et finitions`, `Aménagement d'espaces`, `Conseils en éclairage`, `Choix du mobilier et des accessoires`] }
      ];
      for (const service of servicesToSeed) {
        await client.query(
          `INSERT INTO services (title, description, icon, imageUrl, features)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (title) DO NOTHING;`,
          [service.title, service.description, service.icon, service.imageUrl, service.features as any]
        );
      }

      // Seed Home Models
      const homeModelsToSeed = [
        { name: 'Villa Moderna', price: 350000, sqm: 180, description: 'Une maison moderne.', media: [{url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format", type: "image"}], category: 'Luxe', floors: 2, livingRooms: 1 },
        { name: 'Eco Cottage', price: 220000, sqm: 120, description: 'Une maison écologique.', media: [{url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&auto=format", type: "image"}], category: 'Écologique', floors: 1, livingRooms: 1 }
      ];
      for (const model of homeModelsToSeed) {
        await client.query(
          `INSERT INTO home_models (name, price, sqm, description, media, category, floors, livingRooms)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (name) DO NOTHING;`,
          [model.name, model.price, model.sqm, model.description, model.media as any, model.category, model.floors, model.livingRooms]
        );
      }

      // Seed Lycka Blog
      const blogToSeed = [
        { title: `Les tendances de l'architecture durable`, content: `Contenu de l'article sur l'architecture durable...`, media: [{url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&auto=format", type: "image"}] },
        { title: `Comment choisir le bon architecte pour votre projet`, content: `Contenu de l'article sur le choix d'un architecte...`, media: [{url: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=500&auto=format", type: "image"}] }
      ];
      for (const article of blogToSeed) {
        await client.query(
          `INSERT INTO lycka_blog (title, content, media)
           VALUES ($1, $2, $3)
           ON CONFLICT (title) DO NOTHING;`,
          [article.title, article.content, article.media as any]
        );
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
// }


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
