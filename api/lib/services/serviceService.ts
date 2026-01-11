import { sql } from '../db.js';
import { Service } from '../types.js';

export const getAllServices = async (): Promise<Service[]> => {
  const { rows } = await sql<Service>`SELECT * FROM services ORDER BY title ASC`;
  return rows;
};

export const createService = async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
  const { title, description, icon, imageUrl, features } = serviceData;
  const { rows } = await sql(
    `INSERT INTO services (title, description, icon, imageUrl, features) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [title, description, icon, imageUrl, features]
  );
  return rows[0] as Service;
};

export const updateService = async (id: string, serviceData: Partial<Omit<Service, 'id'>>): Promise<Service | null> => {
  const { title, description, icon, imageUrl, features } = serviceData;
  const { rows } = await sql(
    `UPDATE services 
     SET title = $1, description = $2, icon = $3, imageUrl = $4, features = $5 
     WHERE id = $6 
     RETURNING *`,
    [title, description, icon, imageUrl, features, id]
  );
  return rows[0] as Service || null;
};

export const deleteService = async (id: string): Promise<{ rowCount: number }> => {
  const result = await sql`DELETE FROM services WHERE id = ${id}`;
  return { rowCount: result.rowCount };
};
