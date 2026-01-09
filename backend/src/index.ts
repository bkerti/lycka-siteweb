import express from 'express';
import cors from 'cors';
import { pool } from './database';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

import * as projectService from './core/services/projectService';
import * as serviceService from './core/services/serviceService';
import * as homeModelService from './core/services/homeModelService';
import * as lyckaBlogService from './core/services/lyckaBlogService';
import * as testimonialService from './core/services/testimonialService';
import * as mediaInteractionService from './core/services/mediaInteractionService';
import { RequestWithUser, UserPayload } from './core/types'; 

// Function to get local IP address
const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const alias of iface) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }
  return 'localhost';
};


dotenv.config({ path: './.env.local' });

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined. Please set this environment variable.');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3001;

const localIp = getLocalIpAddress();
const BACKEND_URL = process.env.BACKEND_URL || `http://${localIp}:${port}`;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:8080', `http://${localIp}:5173`] }));
app.use(express.json());

// Middleware to verify JWT and attach user to request
const authenticateToken = (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, user: string | JwtPayload | undefined) => {
    if (err || !user || typeof user === 'string') {
      return res.sendStatus(403); // Invalid token
    }
    req.user = user as UserPayload;
    next();
  });
};

// Middleware to authorize roles
const authorizeRoles = (roles: string[]) => {
  return (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

// Multer storage configuration for images
const storage = multer.diskStorage({
  destination: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Image upload endpoint
app.post('/api/upload', authenticateToken, authorizeRoles(['admin', 'super_admin']), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  // Return the URL of the uploaded image
  res.json({ imageUrl: `${BACKEND_URL}/uploads/${req.file.filename}` });
});



// DEV ONLY: These routes should not be exposed in production
if (process.env.NODE_ENV !== 'production') {
  // Endpoint to initialize database
  app.get('/api/dev/setup-database', async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create tables
      const createUsersTable = `
        DROP TABLE IF EXISTS users CASCADE;
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      const createProjectsTable = `
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
      const createServicesTable = `
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
      const createHomeModelsTable = `
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
      const createMediaCommentsTable = `
        DROP TABLE IF EXISTS media_comments CASCADE;
        CREATE TABLE IF NOT EXISTS media_comments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            media_id VARCHAR(255) NOT NULL,
            author_name VARCHAR(100) NOT NULL DEFAULT 'Anonyme',
            comment_text TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      const createMediaReactionsTable = `
        DROP TABLE IF EXISTS media_reactions CASCADE;
        CREATE TABLE IF NOT EXISTS media_reactions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            media_id VARCHAR(255) NOT NULL,
            reaction_type VARCHAR(50) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      const createTestimonialsTable = `
        DROP TABLE IF EXISTS testimonials;
        CREATE TABLE IF NOT EXISTS testimonials (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      const createLyckaBlogTable = `
        DROP TABLE IF EXISTS lycka_blog CASCADE;
        CREATE TABLE IF NOT EXISTS lycka_blog (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) UNIQUE NOT NULL,
            content TEXT NOT NULL,
            media JSONB[],
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      const createLyckaBlogCommentsTable = `
        DROP TABLE IF EXISTS lycka_blog_comments;
        CREATE TABLE IF NOT EXISTS lycka_blog_comments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            article_id UUID NOT NULL REFERENCES lycka_blog(id) ON DELETE CASCADE,
            author_name VARCHAR(100) NOT NULL DEFAULT 'Anonyme',
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      const createVisitsTable = `
        DROP TABLE IF EXISTS visits;
        CREATE TABLE IF NOT EXISTS visits (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          visit_timestamp TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      await client.query(createUsersTable);
      await client.query(createProjectsTable);
      await client.query(createServicesTable);
      await client.query(createHomeModelsTable);
      await client.query(createMediaCommentsTable);
      await client.query(createMediaReactionsTable);
      await client.query(createTestimonialsTable);
      await client.query(createLyckaBlogTable);
      await client.query(createLyckaBlogCommentsTable);
      await client.query(createVisitsTable);

      // Seed data: Force delete and re-insert admin user for consistency
      const deleteAdmin = `DELETE FROM users WHERE username IN ('admin', 'lycka', 'bkerti', 'jordan', 'franklin');`;
      await client.query(deleteAdmin);

      const usersToSeed = [
        { username: 'bkerti', role: 'super_admin', password: 'password123' },
        { username: 'jordan', role: 'admin', password: 'password123' },
        { username: 'franklin', role: 'admin', password: 'password123' },
        { username: 'admin', role: 'admin', password: '0000' },
      ];

      for (const user of usersToSeed) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await client.query(
          'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
          [user.username, hashedPassword, user.role]
        );
      }

      const seedProjects = `
        INSERT INTO projects (title, category, description, media, status, location, year, price) VALUES
        ('Tour résidentielle à Paris', 'Résidentiel', 'Un complexe résidentiel moderne.', ARRAY['{"url": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&auto=format", "type": "image"}'::jsonb], 'Terminé', 'Paris, France', '2023', 5000000),
        ('Centre commercial Lycka', 'Commercial', 'Un centre commercial moderne.', ARRAY['{"url": "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=500&auto=format", "type": "image"}'::jsonb], 'En cours', 'Lyon, France', '2024', 12000000)
        ON CONFLICT (title) DO NOTHING;
      `;

      const seedServices = `
        INSERT INTO services (title, description, icon, imageUrl, features) VALUES
        ('conception-architecturale', 'Notre service de conception architecturale...', 'calculator', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format', '["Études préliminaires", "Conception de plans d''ensemble", "Modélisations et rendus 3D", "Adaptation aux contraintes du site", "Optimisation des espaces"]'::jsonb),
        ('Architecture et design intérieur', 'Notre service de décoration intérieure...', '3d', 'https://images.unsplash.com/photo-1498050108023-c249f4df085?w=500&auto=format', '["Conception d''ambiances", "Sélection des matériaux et finitions", "Aménagement d''espaces", "Conseils en éclairage", "Choix du mobilier et des accessoires"]'::jsonb)
        ON CONFLICT (title) DO NOTHING;
      `;

      const seedHomeModels = `
        INSERT INTO home_models (name, price, sqm, description, media, category, floors, livingRooms) VALUES
        ('Villa Moderna', 350000, 180, 'Une maison moderne.', ARRAY['{"url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format", "type": "image"}'::jsonb], 'Luxe', 2, 1),
        ('Eco Cottage', 220000, 120, 'Une maison écologique.', ARRAY['{"url": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&auto=format", "type": "image"}'::jsonb], 'Écologique', 1, 1)
        ON CONFLICT (name) DO NOTHING;
      `;

      const seedLyckaBlog = `
        INSERT INTO lycka_blog (title, content, media) VALUES
        ('Les tendances de l''architecture durable', 'Contenu de l''article sur l''architecture durable...', ARRAY['{"url": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&auto=format", "type": "image"}'::jsonb]),
        ('Comment choisir le bon architecte pour votre projet', 'Contenu de l''article sur le choix d''un architecte...', ARRAY['{"url": "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=500&auto=format", "type": "image"}'::jsonb])
        ON CONFLICT (title) DO NOTHING;
      `;

          await client.query(seedProjects);
          await client.query(seedServices);
          await client.query(seedHomeModels);
          await client.query(seedLyckaBlog);
      await client.query('COMMIT');
      res.status(200).send('Database setup complete! Tables created and seeded.');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error(e);
      res.status(500).send('Error setting up database: ' + (e as Error).message);
    } finally {
      client.release();
    }
  });

  // Endpoint to add a new user
  app.post('/api/dev/add-user', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await pool.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
        [username, hashedPassword, role || 'user']
      );
      res.status(201).json({ message: 'User added successfully', user: newUser.rows[0] });
    } catch (err) {
      console.error('Error adding user:', err);
      res.status(500).json({ error: 'Error adding user: ' + (err as Error).message });
    }
  });
}

// Auth Endpoints
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({ token, username: user.username, role: user.role });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Gallery Items Endpoint
app.get('/api/gallery-items', async (req, res) => {
  try {
    const projectsResult = await projectService.getAllProjects();
    const homeModelsResult = await homeModelService.getAllHomeModels();

    const galleryItems = [
      ...projectsResult.map(p => ({ ...p, section: 'projects' })),
      ...homeModelsResult.map(m => ({ ...m, section: 'lycka-home' }))
    ];

    res.json(galleryItems);
  } catch (err) {
    console.error('Error fetching gallery items:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics Endpoints

// Record a new visit
app.post('/api/visits', async (req, res) => {
  try {
    await pool.query('INSERT INTO visits (visit_timestamp) VALUES (NOW())');
    res.status(201).send();
  } catch (err) {
    console.error('Error recording visit:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get visit summary
app.get('/api/analytics/visits-summary', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const range = req.query.range || 'month'; // day, week, month, year

    let query;
    let groupBy;
    let interval;

    switch (range) {
      case 'day':
        interval = `NOW() - INTERVAL '1 day'`;
        groupBy = `EXTRACT(HOUR FROM visit_timestamp)`;
        query = `
          SELECT 
            EXTRACT(HOUR FROM visit_timestamp) AS hour,
            COUNT(id) AS count
          FROM visits
          WHERE visit_timestamp >= ${interval}
          GROUP BY hour
          ORDER BY hour ASC
        `;
        break;
      case 'week':
        interval = `NOW() - INTERVAL '7 day'`;
        groupBy = `DATE_TRUNC('day', visit_timestamp)`;
        query = `
          SELECT 
            DATE_TRUNC('day', visit_timestamp) AS date,
            COUNT(id) AS count
          FROM visits
          WHERE visit_timestamp >= ${interval}
          GROUP BY date
          ORDER BY date ASC
        `;
        break;
      case 'year':
        interval = `NOW() - INTERVAL '1 year'`;
        groupBy = `DATE_TRUNC('month', visit_timestamp)`;
        query = `
          SELECT 
            DATE_TRUNC('month', visit_timestamp) AS date,
            COUNT(id) AS count
          FROM visits
          WHERE visit_timestamp >= ${interval}
          GROUP BY date
          ORDER BY date ASC
        `;
        break;
      case 'month':
      default:
        interval = `NOW() - INTERVAL '1 month'`;
        groupBy = `DATE_TRUNC('day', visit_timestamp)`;
        query = `
          SELECT 
            DATE_TRUNC('day', visit_timestamp) AS date,
            COUNT(id) AS count
          FROM visits
          WHERE visit_timestamp >= ${interval}
          GROUP BY date
          ORDER BY date ASC
        `;
        break;
    }

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching visit summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new project
app.post('/api/projects', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const newProject = await projectService.createProject(req.body);
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a project
app.put('/api/projects/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = await projectService.updateProject(id, req.body);
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a project
app.delete('/api/projects/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await projectService.deleteProject(id);
    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Services API Endpoints

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await serviceService.getAllServices();
    const servicesWithUrls = services.map(service => ({
      ...service,
      imageUrl: service.imageUrl && service.imageUrl.startsWith('/uploads') ? `${BACKEND_URL}${service.imageUrl}` : service.imageUrl
    }));
    res.json(servicesWithUrls);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new service
app.post('/api/services', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const newService = await serviceService.createService(req.body);
    res.status(201).json(newService);
  } catch (err) {
    console.error('Error creating service:', err);
    const dbError = err as { code?: string };
    if (dbError.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Un service avec ce titre existe déjà.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a service
app.put('/api/services/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await serviceService.updateService(id, req.body);
    if (!updatedService) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(updatedService);
  } catch (err) {
    console.error('Error updating service:', err);
    const dbError = err as { code?: string };
    if (dbError.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Un service avec ce titre existe déjà.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a service
app.delete('/api/services/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await serviceService.deleteService(id);
    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Home Models API Endpoints

// Get all home models
app.get('/api/homemodels', async (req, res) => {
  try {
    const homeModels = await homeModelService.getAllHomeModels();
    res.json(homeModels);
  } catch (err) {
    console.error('Error fetching home models:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new home model
app.post('/api/homemodels', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const newModel = await homeModelService.createHomeModel(req.body);
    res.status(201).json(newModel);
  } catch (err) {
    console.error('Error creating home model:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a home model
app.put('/api/homemodels/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedModel = await homeModelService.updateHomeModel(id, req.body);
    if (!updatedModel) {
      return res.status(404).json({ error: 'Home model not found' });
    }
    res.json(updatedModel);
  } catch (err) {
    console.error('Error updating home model:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a home model
app.delete('/api/homemodels/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await homeModelService.deleteHomeModel(id);
    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ error: 'Home model not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    console.error('Error deleting home model:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Media Interactions API Endpoints

// Get all interactions for a specific media item
app.get('/api/media/:mediaId/interactions', async (req, res) => {
  const { mediaId } = req.params;
  try {
    const interactions = await mediaInteractionService.getInteractionsForMedia(mediaId);
    res.json(interactions);
  } catch (err) {
    console.error('Error fetching interactions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a comment to a media item
app.post('/api/media/:mediaId/comments', async (req, res) => {
  // Honeypot check
  if (req.body.subject) {
    return res.status(200).send(); // Silently accept and do nothing
  }

  const { mediaId } = req.params;
  try {
    const newComment = await mediaInteractionService.addCommentToMedia(mediaId, req.body);
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a comment from a media item
app.delete('/api/media/:mediaId/comments/:commentId', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleteOp = await mediaInteractionService.deleteCommentFromMedia(commentId);
    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a reaction to a media item
app.post('/api/media/:mediaId/reactions', async (req, res) => {
  const { mediaId } = req.params;
  try {
    const newReaction = await mediaInteractionService.addReactionToMedia(mediaId, req.body);
    res.status(201).json(newReaction);
  } catch (err) {
    console.error('Error adding reaction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all media interactions
app.get('/api/interactions', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const interactions = await mediaInteractionService.getAllInteractions();
    res.json(interactions);
  } catch (err) {
    console.error('Error fetching all interactions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Testimonials API Endpoints

// Get all testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await testimonialService.getAllTestimonials();
    res.json(testimonials);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new testimonial
app.post('/api/testimonials', async (req, res) => {
  // Honeypot check
  if (req.body.subject) {
    return res.status(200).send(); // Silently accept and do nothing
  }

  try {
    const newTestimonial = await testimonialService.createTestimonial(req.body);
    res.status(201).json(newTestimonial);
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a testimonial
app.delete('/api/testimonials/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await testimonialService.deleteTestimonial(id);
    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Lycka Blog API Endpoints

// Get all blog articles
app.get('/api/lycka-blog', async (req, res) => {
  try {
    const articles = await lyckaBlogService.getAllBlogArticles();
    const articlesWithUrls = articles.map(article => ({
      ...article,
      media: article.media.map((m: any) => ({
        ...m,
        url: m.url && m.url.startsWith('/uploads') ? `${BACKEND_URL}${m.url}` : m.url
      }))
    }));
    res.json(articlesWithUrls);
  } catch (err) {
    console.error('Error fetching blog articles:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
);

// Create a new blog article
app.post('/api/lycka-blog', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const newArticle = await lyckaBlogService.createBlogArticle(req.body);
    res.status(201).json(newArticle);
  } catch (err) {
    console.error('Error creating blog article:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a blog article
app.put('/api/lycka-blog/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedArticle = await lyckaBlogService.updateBlogArticle(id, req.body);
    if (!updatedArticle) {
      return res.status(404).json({ error: 'Blog article not found' });
    }
    res.json(updatedArticle);
  } catch (err) {
    console.error('Error updating blog article:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a blog article
app.delete('/api/lycka-blog/:id', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await lyckaBlogService.deleteBlogArticle(id);
    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ error: 'Blog article not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting blog article:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Lycka Blog Comments API Endpoints

// Get all comments for a specific article
app.get('/api/lycka-blog/:articleId/comments', async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await lyckaBlogService.getCommentsForArticle(articleId);
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new comment for an article
app.post('/api/lycka-blog/:articleId/comments', async (req, res) => {
  try {
    const { articleId } = req.params;
    const newComment = await lyckaBlogService.createCommentForArticle(articleId, req.body);
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all comments (for admin)
app.get('/api/lycka-blog/comments', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const comments = await lyckaBlogService.getAllComments();
    res.json(comments);
  } catch (err) {
    console.error('Error fetching all comments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a comment (for admin)
app.delete('/api/lycka-blog/comments/:commentId', authenticateToken, authorizeRoles(['admin', 'super_admin']), async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleteOp = await lyckaBlogService.deleteComment(commentId);
    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
