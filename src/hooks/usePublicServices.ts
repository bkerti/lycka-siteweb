import { useState, useEffect, useCallback } from "react";
import { Service } from "@/models/Service";
import { useToast } from "@/hooks/use-toast";

const API_URL = '/api';

export const usePublicServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/services`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setError(error as Error);
      console.error("Failed to fetch services:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des services.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error };
};
