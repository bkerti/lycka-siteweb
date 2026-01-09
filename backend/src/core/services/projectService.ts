import { pool } from '../../database';
import { Project } from '../types';

export const getAllProjects = async (): Promise<Project[]> => {
  const result = await pool.query('SELECT id, title, category, description, media, status, location, year, price FROM projects ORDER BY title ASC');
  return result.rows;
};

export const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
  const { title, category, description, media, status, location, year, price } = projectData;
  const newProject = await pool.query(
    'INSERT INTO projects (title, category, description, media, status, location, year, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [title, category, description, media, status, location, year, price]
  );
  return newProject.rows[0];
};

export const updateProject = async (id: string, projectData: Partial<Omit<Project, 'id'>>): Promise<Project | null> => {
  const { title, category, description, media, status, location, year, price } = projectData;
  const updatedProject = await pool.query(
    'UPDATE projects SET title = $1, category = $2, description = $3, media = $4, status = $5, location = $6, year = $7, price = $8 WHERE id = $9 RETURNING *',
    [title, category, description, media, status, location, year, price, id]
  );
  return updatedProject.rows[0] || null;
};

export const deleteProject = async (id: string): Promise<{ rowCount: number | null }> => {
  const deleteOp = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
  return deleteOp;
};
