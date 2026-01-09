export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
}