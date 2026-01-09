import { pool } from '../../database';
import { Testimonial } from '../types';

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
  return result.rows;
};

export const createTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> => {
  const { name, content } = testimonialData;
  const newTestimonial = await pool.query(
    'INSERT INTO testimonials (name, content) VALUES ($1, $2) RETURNING *',
    [name, content]
  );
  return newTestimonial.rows[0];
};

export const deleteTestimonial = async (id: string): Promise<{ rowCount: number | null }> => {
  const deleteOp = await pool.query('DELETE FROM testimonials WHERE id = $1 RETURNING *', [id]);
  return deleteOp;
};
