export interface User {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  media: any[]; // JSONB
  status: string;
  location: string;
  year: string;
  price: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  features: any; // JSONB
}

export interface HomeModel {
  id: string;
  name: string;
  price: number;
  sqm: number;
  description: string;
  media: any[]; // JSONB
  category: string;
  floors: number;
  livingRooms: number;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  content: string;
  media: any[]; // JSONB
  created_at: string;
}

export interface LyckaBlogComment {
  id: string;
  article_id: string;
  author_name: string;
  content: string;
  created_at: string;
  article_title?: string; // For joins
}

export interface MediaComment {
  id: string;
  media_id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
}

export interface MediaReaction {
  id: string;
  media_id: string;
  reaction_type: string;
  created_at: string;
}

export interface AggregatedReaction {
  reaction_type: string;
  count: number;
}

// This empty export forces TypeScript to generate a .js file,
// preventing "module not found" errors for type-only files.
export {};
