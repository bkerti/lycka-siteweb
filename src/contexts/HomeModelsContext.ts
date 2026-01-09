import { createContext } from 'react';
import { HomeModel } from '@/models/HomeModel';
import { MediaItem } from '@/models/MediaItem';

type HomeModelsContextType = {
  homeModels: HomeModel[];
  isLoading: boolean;
  editingModel: HomeModel | null;
  currentMedia: MediaItem[];
  handleEdit: (model: HomeModel) => void;
  handleDelete: (id: string) => void;
  handleSubmit: (data: Partial<HomeModel>) => void;
  resetForm: () => void;
  addMediaToGallery: (mediaItem: MediaItem) => void;
  removeMediaFromGallery: (index: number) => void;
  fetchHomeModels: () => void;
};

export const HomeModelsContext = createContext<HomeModelsContextType | undefined>(undefined);