import { sql } from '../db.js';
import { HomeModel } from '../types.js';

export const getAllHomeModels = async (): Promise<HomeModel[]> => {
  const { rows } = await sql<HomeModel>`SELECT id, name, price, sqm, description, media, category, floors, livingRooms FROM home_models ORDER BY name ASC`;
  return rows;
};

export const createHomeModel = async (homeModelData: Omit<HomeModel, 'id'>): Promise<HomeModel> => {
  const { name, price, sqm, description, media, category, floors, livingRooms } = homeModelData;
  const { rows } = await sql(
    `INSERT INTO home_models (name, price, sqm, description, media, category, floors, livingRooms) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
     RETURNING *`,
    [name, price, sqm, description, media, category, floors, livingRooms]
  );
  return rows[0] as HomeModel;
};

export const updateHomeModel = async (id: string, homeModelData: Partial<Omit<HomeModel, 'id'>>): Promise<HomeModel | null> => {
  const { name, price, sqm, description, media, category, floors, livingRooms } = homeModelData;
  const { rows } = await sql(
    `UPDATE home_models 
     SET name = $1, price = $2, sqm = $3, description = $4, media = $5, category = $6, floors = $7, livingRooms = $8 
     WHERE id = $9 
     RETURNING *`,
    [name, price, sqm, description, media, category, floors, livingRooms, id]
  );
  return rows[0] as HomeModel || null;
};

export const deleteHomeModel = async (id: string): Promise<{ rowCount: number }> => {
  const result = await sql`DELETE FROM home_models WHERE id = ${id}`;
  return { rowCount: result.rowCount };
};
