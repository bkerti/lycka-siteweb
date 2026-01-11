import { useState, useEffect, useCallback } from "react";
import { Service, ServiceFormData } from "@/models/Service";
import { useToast } from "@/hooks/use-toast";

const API_URL = '/api';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const getAuthHeaders = (contentType: string = 'application/json') => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast({ title: "Erreur d'authentification", description: "Token non trouvé.", variant: "destructive" });
      return null;
    }
    const headers: { [key: string]: string } = {
      'Authorization': `Bearer ${token}`,
    };
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    return headers;
  };

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/services`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setServices(data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setError(error as Error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des services.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleDelete = async (id: string) => {
    const headers = getAuthHeaders('');
    if (!headers) return;

    try {
      const response = await fetch(`${API_URL}/services/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': headers.Authorization },
       });
      if (!response.ok) throw new Error('Failed to delete service');
      setServices(services.filter(service => service.id !== id));
      if (editingService?.id === id) {
        setEditingService(null);
      }
      toast({ title: "Service supprimé", description: "Le service a été supprimé avec succès" });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({ title: "Erreur", description: "Erreur lors de la suppression du service.", variant: "destructive" });
    }
  };

  const handleSubmit = async (data: ServiceFormData, file?: File): Promise<boolean> => {
    try {
      let imageUrl = data.imageUrl;
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        const uploadHeaders = getAuthHeaders('');
        if(!uploadHeaders) return false;
        
        const uploadResponse = await fetch(`${API_URL}/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          headers: { 'Authorization': uploadHeaders.Authorization },
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      const serviceData = { ...data, imageUrl };
      
      const headers = getAuthHeaders();
      if (!headers) return false;

      let response: Response;
      if (editingService) {
        response = await fetch(`${API_URL}/services/${editingService.id}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(serviceData),
        });
      } else {
        response = await fetch(`${API_URL}/services`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(serviceData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Gracefully handle non-JSON responses
        const errorMessage = errorData.error || (editingService ? 'Failed to update service' : 'Failed to create service');
        
        if (response.status === 409) {
            toast({ title: "Erreur de conflit", description: "Un service avec ce titre existe déjà.", variant: "destructive" });
        } else {
            throw new Error(errorMessage);
        }
        return false; // Stop execution and indicate failure
      }

      const updatedService: Service = await response.json();
      
      if (editingService) {
        setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
        toast({ title: "Service mis à jour", description: "Le service a été mis à jour avec succès" });
      } else {
        setServices([...services, updatedService]);
        toast({ title: "Service ajouté", description: "Le service a été ajouté avec succès" });
      }
      setEditingService(null);
      return true; // Indicate success

    } catch (error) {
      console.error("Error submitting service:", error);
      toast({ title: "Erreur", description: "Erreur lors de la soumission du service.", variant: "destructive" });
      return false; // Indicate failure
    }
  };

  const handleCancel = () => {
    setEditingService(null);
  };

  return {
    services,
    editingService,
    isLoading,
    error,
    setEditingService,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCancel,
  };
};