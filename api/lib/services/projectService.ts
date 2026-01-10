import { sql } from '../../../../lib/db';
import { Project } from '../types';

export const getAllProjects = async (): Promise<Project[]> => {
  const { rows } = await sql<Project>`SELECT id, title, category, description, media, status, location, year, price FROM projects ORDER BY title ASC`;
  return rows;
};

export const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
  const { title, category, description, media, status, location, year, price } = projectData;
  const { rows } = await sql<Project>`
    INSERT INTO projects (title, category, description, media, status, location, year, price) 
    VALUES (${title}, ${category}, ${description}, ${media}, ${status}, ${location}, ${year}, ${price}) 
    RETURNING *
  `;
  return rows[0];
};

export const updateProject = async (id: string, projectData: Partial<Omit<Project, 'id'>>): Promise<Project | null> => {
  const { title, category, description, media, status, location, year, price } = projectData;
  const { rows } = await sql<Project>`
    UPDATE projects 
    SET title = ${title}, category = ${category}, description = ${description}, media = ${media}, status = ${status}, location = ${location}, year = ${year}, price = ${price} 
    WHERE id = ${id} 
    RETURNING *
  `;
  return rows[0] || null;
};

export const deleteProject = async (id: string): Promise<{ rowCount: number }> => {
  const result = await sql`DELETE FROM projects WHERE id = ${id}`;
  return { rowCount: result.rowCount };
};
