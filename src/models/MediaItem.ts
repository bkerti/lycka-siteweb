
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
