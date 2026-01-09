
import { MediaItem } from "./MediaItem";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  media: MediaItem[];
  status?: "realisations" | "conceptions"; // Ajout du statut pour distinguer les réalisations des conceptions
  location?: string;
  year?: string;
  price?: number;
}
