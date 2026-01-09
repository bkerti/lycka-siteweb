import { createContext } from 'react';
import { Service, ServiceFormData } from '@/models/Service';

type ServicesContextType = {
  services: Service[];
  editingService: Service | null;
  isLoading: boolean;
  error: Error | null;
  setEditingService: (service: Service | null) => void;
  handleEdit: (service: Service) => void;
  handleDelete: (id: string) => void;
  handleSubmit: (data: ServiceFormData, file?: File) => void;
  handleCancel: () => void;
};

export const ServicesContext = createContext<ServicesContextType | undefined>(undefined);