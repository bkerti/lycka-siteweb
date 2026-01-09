import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload extends JwtPayload {
  userId: string;
  username: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user?: UserPayload;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "image";
  url: string;
  thumbnailUrl?: string;
  section: "projects" | "lycka-home";
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  media: MediaItem[];
  status?: "realisations" | "conceptions";
  location?: string;
  year?: string;
  price?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  features: string[];
}

export interface HomeModel {
  id: string;
  name: string;
  price: number;
  sqm: number;
  description: string;
  media: MediaItem[];
  category: string;
  floors: number;
  livingRooms: number;
}

export interface BlogArticle {
  id: string;
  title: string;
  content: string;
  media: MediaItem[];
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

export interface MediaComment {
    id: string;
    media_id: string;
    author_name: string;
    comment_text: string;
    created_at: string;
}

export interface LyckaBlogComment {
    id: string;
    article_id: string;
    author_name: string;
    content: string;
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