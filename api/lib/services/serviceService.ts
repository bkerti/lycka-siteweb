import { sql } from '../db.js';
import { Service } from '../types.js';

export const getAllServices = async (): Promise<Service[]> => {
  const { rows } = await sql<Service>`SELECT * FROM services ORDER BY title ASC`;
  return rows;
};

export const createService = async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
  const { title, description, icon, imageUrl, features } = serviceData;
  const { rows } = await sql<Service>`
    INSERT INTO services (title, description, icon, imageUrl, features) 
    VALUES (${title}, ${description}, ${icon}, ${imageUrl}, ${JSON.stringify(features)}::jsonb) 
    RETURNING *
  `;
  return rows[0];
};

export const updateService = async (id: string, serviceData: Partial<Omit<Service, 'id'>>): Promise<Service | null> => {
  const { title, description, icon, imageUrl, features } = serviceData;
  const { rows } = await sql<Service>`
    UPDATE services 
    SET title = ${title}, description = ${description}, icon = ${icon}, imageUrl = ${imageUrl}, features = ${JSON.stringify(features)}::jsonb 
    WHERE id = ${id} 
    RETURNING *
  `;
  return rows[0] || null;
};

export const deleteService = async (id: string): Promise<{ rowCount: number }> => {
  const result = await sql`DELETE FROM services WHERE id = ${id}`;
  return { rowCount: result.rowCount };
};
