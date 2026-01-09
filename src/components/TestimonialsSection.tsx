import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const TestimonialCard = ({ testimonial }) => (
  <Card>
    <CardHeader>
      <CardTitle>{testimonial.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="break-words">"{testimonial.content}"</p>
    </CardContent>
    <CardFooter>
      <p className="text-sm text-muted-foreground">{new Date(testimonial.created_at).toLocaleDateString()}</p>
    </CardFooter>
  </Card>
);

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Honeypot field
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials");
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting testimonial:", { name, content });
    if (name && content) {
      try {
        const response = await fetch("/api/testimonials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, content, subject: honeypot }), // Include honeypot
        });
        console.log("Submit response:", response);
        if (response.ok) {
          console.log("Testimonial submitted successfully, refetching...");
          fetchTestimonials(); // Refresh testimonials after adding a new one
          setName("");
          setContent("");
        }
      } catch (error) {
        console.error("Error submitting testimonial:", error);
      }
    }
  };

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Témoignages de nos clients</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.slice(0, showAll ? testimonials.length : 3).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {testimonials.length > 3 && (
          <div className="text-center mb-12">
            <Button onClick={() => setShowAll(!showAll)}>
              {showAll ? "Voir moins" : "Voir plus"}
            </Button>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">Laissez votre avis</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - visually hidden */}
            <div className="absolute w-0 h-0 overflow-hidden">
              <label htmlFor="subject">Subject</label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>
            
            <Input
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Textarea
              placeholder="Votre commentaire"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">Envoyer</Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;