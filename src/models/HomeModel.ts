
import { MediaItem } from "./MediaItem";

export interface HomeModel {
  id: string;
  name: string;
  price: number;
  sqm: number;
  description: string;
  media: MediaItem[];
  category?: string;
  floors?: number;
  livingRooms?: number;
}
