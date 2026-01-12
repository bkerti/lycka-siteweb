
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
    console.log("1. handleSubmit called.");
    
    if (!form.current) {
      console.log("1a. form.current is null. Exiting.");
      return;
    }
    console.log("1b. form.current is not null.");

    // --- WhatsApp Redirection Logic (MOVED HERE) ---
    const whatsappNumber = "237691759654"; // Le premier numéro
    const whatsappMessage = `Nom: ${formData.name}\nEmail: ${formData.email}\nTéléphone: ${formData.phone}\nSujet: ${formData.subject}\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    console.log("1c. WhatsApp redirection attempted.");
    // --- End WhatsApp Redirection Logic ---

    // Now, proceed with EmailJS
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    console.log(`2. EmailJS Config: serviceId=${serviceId}, templateId=${templateId}, publicKey=${publicKey}`);


    if (!serviceId || !templateId || !publicKey) {
      console.error("3. EmailJS environment variables are not set. Email will not be sent.");
      toast({
        title: "Configuration manquante",
        description: "Les variables d'environnement EmailJS ne sont pas configurées. L'email ne sera pas envoyé.",
        variant: "destructive",
      });
      // Do NOT return here, allow the rest of the function (setIsSubmitting(false)) to run
    } else {
        console.log("3a. EmailJS environment variables are set. Attempting to send email.");
        setIsSubmitting(true); // Only disable button if we attempt EmailJS
        console.log("4. setIsSubmitting(true) called.");

        emailjs.sendForm(serviceId, templateId, form.current, publicKey)
            .then(() => {
                console.log("5. EmailJS sendForm Succeeded.");
                toast({
                title: "Message envoyé par email",
                description: "Nous vous répondrons dans les plus brefs délais.",
                });
                setFormData({ // Clear form only if email send successful
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
                });
            }, (error) => {
                console.error("5. EmailJS sendForm FAILED:", error);
                toast({
                title: "Erreur d'envoi d'email",
                description: "Une erreur est survenue lors de l'envoi du message par email.",
                variant: "destructive",
                });
            })
            .finally(() => {
                console.log("6. EmailJS sendForm FINALLY block entered. Resetting submitting state.");
                setIsSubmitting(false); // Re-enable button
                console.log("6b. setIsSubmitting(false) called.");
            });
    }
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
