import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

const API_URL = '/api';

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const { toast } = useToast();

  const fetchTestimonials = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/testimonials`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des témoignages.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast({ title: "Erreur d'authentification", description: "Token non trouvé.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/testimonials/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
       });
      if (!response.ok) throw new Error('Failed to delete testimonial');
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
      toast({ title: "Témoignage supprimé", description: "Le témoignage a été supprimé avec succès" });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({ title: "Erreur", description: "Erreur lors de la suppression du témoignage.", variant: "destructive" });
    }
  };

  return {
    testimonials,
    fetchTestimonials,
    handleDelete,
  };
};