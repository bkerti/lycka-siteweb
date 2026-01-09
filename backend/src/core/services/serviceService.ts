import { pool } from '../../database';
import { Service } from '../types';

export const getAllServices = async (): Promise<Service[]> => {
  const result = await pool.query('SELECT * FROM services ORDER BY title ASC');
  return result.rows;
};

export const createService = async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
  const { title, description, icon, imageUrl, features } = serviceData;
  const newService = await pool.query(
    'INSERT INTO services (title, description, icon, imageUrl, features) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, description, icon, imageUrl, JSON.stringify(features)]
  );
  return newService.rows[0];
};

export const updateService = async (id: string, serviceData: Partial<Omit<Service, 'id'>>): Promise<Service | null> => {
  const { title, description, icon, imageUrl, features } = serviceData;
  const updatedService = await pool.query(
    'UPDATE services SET title = $1, description = $2, icon = $3, imageUrl = $4, features = $5 WHERE id = $6 RETURNING *',
    [title, description, icon, imageUrl, JSON.stringify(features), id]
  );
  return updatedService.rows[0] || null;
};

export const deleteService = async (id: string): Promise<{ rowCount: number | null }> => {
  const deleteOp = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
  return deleteOp;
};
