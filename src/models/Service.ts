
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  features: string[];
}

export type ServiceFormData = Omit<Service, "id">;
