import { sql } from '../db.js';
import { Testimonial } from '../types.js';

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const { rows } = await sql<Testimonial>`SELECT * FROM testimonials ORDER BY created_at DESC`;
  return rows;
};

export const createTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> => {
  const { name, content } = testimonialData;
  const { rows } = await sql<Testimonial>`
    INSERT INTO testimonials (name, content) 
    VALUES (${name}, ${content}) 
    RETURNING *
  `;
  return rows[0];
};

export const deleteTestimonial = async (id: string): Promise<{ rowCount: number }> => {
  const result = await sql`DELETE FROM testimonials WHERE id = ${id}`;
  return { rowCount: result.rowCount };
};
