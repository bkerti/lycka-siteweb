import { sql } from '../db.js';
import { Project } from '../types.js';

export const getAllProjects = async (): Promise<Project[]> => {
  const { rows } = await sql<Project>`SELECT id, title, category, description, media, status, location, year, price FROM projects ORDER BY title ASC`;
  return rows;
};

export const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
  const { title, category, description, media, status, location, year, price } = projectData;
  const { rows } = await sql(
    `INSERT INTO projects (title, category, description, media, status, location, year, price) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
     RETURNING *`,
    [title, category, description, media, status, location, year, price]
  );
  return rows[0] as Project;
};

export const updateProject = async (id: string, projectData: Partial<Omit<Project, 'id'>>): Promise<Project | null> => {
  const { title, category, description, media, status, location, year, price } = projectData;
  const { rows } = await sql(
    `UPDATE projects 
     SET title = $1, category = $2, description = $3, media = $4, status = $5, location = $6, year = $7, price = $8 
     WHERE id = $9 
     RETURNING *`,
    [title, category, description, media, status, location, year, price, id]
  );
  return rows[0] as Project || null;
};

export const deleteProject = async (id: string): Promise<{ rowCount: number }> => {
  const result = await sql`DELETE FROM projects WHERE id = ${id}`;
  return { rowCount: result.rowCount };
};
