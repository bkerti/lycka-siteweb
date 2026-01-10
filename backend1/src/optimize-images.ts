import { Pool } from 'pg';
import dotenv from 'dotenv';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const supportedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

const getWebpPath = (filePath: string): string => {
  const ext = path.extname(filePath);
  return filePath.replace(new RegExp(`${ext}$`), '.webp');
};

const getWebpUrl = (url: string): string => {
  if (!url || url.startsWith('http')) return url;
  const oldExt = path.extname(url);
  if (supportedExtensions.includes(oldExt.toLowerCase())) {
    return url.replace(new RegExp(`${oldExt}$`), '.webp');
  }
  return url;
};

async function convertImagesToWebp() {
  console.log('--- Starting Image Conversion ---');
  try {
    const files = await fs.readdir(uploadsDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (supportedExtensions.includes(ext)) {
        const fullPath = path.join(uploadsDir, file);
        const webpPath = getWebpPath(fullPath);
        try {
          await fs.access(webpPath);
        } catch (error) {
          await sharp(fullPath)
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(webpPath);
        }
      }
    }
  } catch (error) {
    console.error('Error during image conversion:', error);
  }
  console.log('--- Finished Image Conversion ---');
}

async function updateDatabaseReferences() {
  console.log('--- Starting Database Update ---');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const tablesWithMedia = ['projects', 'home_models', 'lycka_blog'];
    for (const table of tablesWithMedia) {
        try {
            const items = await client.query(`SELECT id, media FROM ${table}`);
            for (const row of items.rows) {
                if (!row.media || !Array.isArray(row.media)) continue;
                const updatedMedia = row.media.map((m: any) => {
                    const mediaObject = typeof m === 'string' ? JSON.parse(m) : m;
                    const updatedUrl = getWebpUrl(mediaObject.url);
                    return { ...mediaObject, url: updatedUrl };
                });
                await client.query(`UPDATE ${table} SET media = $1 WHERE id = $2`, [updatedMedia, row.id]);
            }
        } catch (tableError) {
            console.error(`Error processing table ${table}:`, tableError);
            await client.query('ROLLBACK');
            return;
        }
    }

    try {
        const services = await client.query('SELECT id, imageUrl FROM services');
        for (const row of services.rows) {
           if (!row.imageurl) continue;
          const updatedUrl = getWebpUrl(row.imageurl);
          if (updatedUrl !== row.imageurl) {
            await client.query('UPDATE services SET imageUrl = $1 WHERE id = $2', [updatedUrl, row.id]);
          }
        }
    } catch (tableError) {
        console.error(`Error processing table services:`, tableError);
        await client.query('ROLLBACK');
        return;
    }

    await client.query('COMMIT');
    console.log('--- Database Update Complete ---');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database update failed:', error);
  } finally {
    client.release();
  }
}

async function run() {
  await convertImagesToWebp();
  await updateDatabaseReferences();
  await pool.end();
  console.log('--- Optimization Process Finished ---');
}

run();
