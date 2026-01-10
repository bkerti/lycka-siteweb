import { db } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // IMPORTANT: Only allow this in non-production environments
  if (process.env.NODE_ENV === 'production') {
    return response.status(404).json({ error: 'Not found' });
  }
  
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const client = await db.connect();

  try {
    await client.sql`BEGIN`;

    // Create tables
    await client.sql`
      DROP TABLE IF EXISTS users CASCADE;
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
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
    await client.sql`DELETE FROM users WHERE username IN ('admin', 'lycka', 'bkerti', 'jordan', 'franklin');`;
    
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
        ON CONFLICT (username) DO NOTHING
      `;
    }

    // Seed other data
    await client.sql`
      INSERT INTO projects (title, category, description, media, status, location, year, price) VALUES
      ('Tour résidentielle à Paris', 'Résidentiel', 'Un complexe résidentiel moderne.', ARRAY['{"url": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&auto=format", "type": "image"}'::jsonb], 'Terminé', 'Paris, France', '2023', 5000000),
      ('Centre commercial Lycka', 'Commercial', 'Un centre commercial moderne.', ARRAY['{"url": "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=500&auto=format", "type": "image"}'::jsonb], 'En cours', 'Lyon, France', '2024', 12000000)
      ON CONFLICT (title) DO NOTHING;
    `;
    await client.sql`
      INSERT INTO services (title, description, icon, imageUrl, features) VALUES
      ('conception-architecturale', 'Notre service de conception architecturale...', 'calculator', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format', '["Études préliminaires", "Conception de plans d''ensemble", "Modélisations et rendus 3D", "Adaptation aux contraintes du site", "Optimisation des espaces"]'::jsonb),
      ('Architecture et design intérieur', 'Notre service de décoration intérieure...', '3d', 'https://images.unsplash.com/photo-1498050108023-c249f4df085?w=500&auto=format', '["Conception d''ambiances", "Sélection des matériaux et finitions", "Aménagement d''espaces", "Conseils en éclairage", "Choix du mobilier et des accessoires"]'::jsonb)
      ON CONFLICT (title) DO NOTHING;
    `;
    await client.sql`
      INSERT INTO home_models (name, price, sqm, description, media, category, floors, livingRooms) VALUES
      ('Villa Moderna', 350000, 180, 'Une maison moderne.', ARRAY['{"url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format", "type": "image"}'::jsonb], 'Luxe', 2, 1),
      ('Eco Cottage', 220000, 120, 'Une maison écologique.', ARRAY['{"url": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&auto=format", "type": "image"}'::jsonb], 'Écologique', 1, 1)
      ON CONFLICT (name) DO NOTHING;
    `;
    await client.sql`
      INSERT INTO lycka_blog (title, content, media) VALUES
      ('Les tendances de l''architecture durable', 'Contenu de l''article sur l''architecture durable...', ARRAY['{"url": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&auto=format", "type": "image"}'::jsonb]),
      ('Comment choisir le bon architecte pour votre projet', 'Contenu de l''article sur le choix d''un architecte...', ARRAY['{"url": "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=500&auto=format", "type": "image"}'::jsonb])
      ON CONFLICT (title) DO NOTHING;
    `;

    await client.sql`COMMIT`;

    return response.status(200).send('Database setup complete! Tables created and seeded.');
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error(error);
    const err = error as Error;
    return response.status(500).json({ error: 'Error setting up database', details: err.message });
  } finally {
    client.release();
  }
}
