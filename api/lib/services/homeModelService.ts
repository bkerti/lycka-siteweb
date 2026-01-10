import { sql } from '../db.js';
import { HomeModel } from '../types.js';

export const getAllHomeModels = async (): Promise<HomeModel[]> => {
  const { rows } = await sql<HomeModel>`SELECT id, name, price, sqm, description, media, category, floors, livingRooms FROM home_models ORDER BY name ASC`;
  return rows;
};

export const createHomeModel = async (homeModelData: Omit<HomeModel, 'id'>): Promise<HomeModel> => {
  const { name, price, sqm, description, media, category, floors, livingRooms } = homeModelData;
  const { rows } = await sql<HomeModel>`
    INSERT INTO home_models (name, price, sqm, description, media, category, floors, livingRooms) 
    VALUES (${name}, ${price}, ${sqm}, ${description}, ${JSON.stringify(media)}, ${category}, ${floors}, ${livingRooms}) 
    RETURNING *
  `;
  return rows[0];
};

export const updateHomeModel = async (id: string, homeModelData: Partial<Omit<HomeModel, 'id'>>): Promise<HomeModel | null> => {
  const { name, price, sqm, description, media, category, floors, livingRooms } = homeModelData;
  const { rows } = await sql<HomeModel>`
    UPDATE home_models 
    SET name = ${name}, price = ${price}, sqm = ${sqm}, description = ${description}, media = ${JSON.stringify(media)}, category = ${category}, floors = ${floors}, livingRooms = ${livingRooms} 
    WHERE id = ${id} 
    RETURNING *
  `;
  return rows[0] || null;
};

export const deleteHomeModel = async (id: string): Promise<{ rowCount: number }> => {
  const result = await sql`DELETE FROM home_models WHERE id = ${id}`;
  return { rowCount: result.rowCount };
};
