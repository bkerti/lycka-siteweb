import { pool } from '../../database';
import { HomeModel } from '../types';

export const getAllHomeModels = async (): Promise<HomeModel[]> => {
  const result = await pool.query('SELECT id, name, price, sqm, description, media, category, floors, livingRooms FROM home_models ORDER BY name ASC');
  return result.rows;
};

export const createHomeModel = async (homeModelData: Omit<HomeModel, 'id'>): Promise<HomeModel> => {
  const { name, price, sqm, description, media, category, floors, livingRooms } = homeModelData;
  const newModel = await pool.query(
    'INSERT INTO home_models (name, price, sqm, description, media, category, floors, livingRooms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [name, price, sqm, description, media, category, floors, livingRooms]
  );
  return newModel.rows[0];
};

export const updateHomeModel = async (id: string, homeModelData: Partial<Omit<HomeModel, 'id'>>): Promise<HomeModel | null> => {
  const { name, price, sqm, description, media, category, floors, livingRooms } = homeModelData;
  const updatedModel = await pool.query(
    'UPDATE home_models SET name = $1, price = $2, sqm = $3, description = $4, media = $5, category = $6, floors = $7, livingRooms = $8 WHERE id = $9 RETURNING *',
    [name, price, sqm, description, media, category, floors, livingRooms, id]
  );
  return updatedModel.rows[0] || null;
};

export const deleteHomeModel = async (id: string): Promise<{ rowCount: number | null }> => {
  const deleteOp = await pool.query('DELETE FROM home_models WHERE id = $1 RETURNING *', [id]);
  return deleteOp;
};
