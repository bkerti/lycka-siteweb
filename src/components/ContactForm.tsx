
import { useState, useEffect, useRef, useMemo } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";

const ContactForm = () => {
  const location = useLocation();
  const form = useRef<HTMLFormElement>(null);
  const modelInfo = useMemo(() => location.state || {}, [location.state]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: modelInfo.subject || "",
    message: modelInfo.message || (modelInfo.modelName 
      ? `Je souhaite obtenir plus d'informations sur le modèle ${modelInfo.modelName}.` 
      : ""),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Met à jour le sujet et le message si les informations du modèle changent
    if (modelInfo.subject || modelInfo.modelName) {
      setFormData(prev => ({
        ...prev,
        subject: modelInfo.subject || prev.subject,
        message: modelInfo.message || (modelInfo.modelName 
          ? `Je souhaite obtenir plus d'informations sur le modèle ${modelInfo.modelName}.` 
          : prev.message)
      }));
    }
  }, [modelInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.current) return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are not set.");
      toast({
        title: "Erreur de configuration",
        description: "Le service d'envoi d'emails n'est pas configuré.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    emailjs.sendForm(serviceId, templateId, form.current, publicKey)
      .then(() => {
        toast({
          title: "Message envoyé",
          description: "Nous vous répondrons dans les plus brefs délais.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, (error) => {
        console.error("EMAILJS ERROR:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi du message.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form ref={form} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nom complet
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Téléphone
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            Sujet
          </label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full min-h-[150px]"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-lycka-secondary hover:bg-lycka-primary text-white px-8 py-2"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer"}
      </Button>
    </form>
  );
};

export default ContactForm;
