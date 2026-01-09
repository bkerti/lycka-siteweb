import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const TestimonialCard = ({ testimonial, onDelete }: { testimonial: Testimonial, onDelete: (id: string) => void }) => (
  <Card>
    <CardHeader>
      <CardTitle>{testimonial.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>"{testimonial.content}"</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <p className="text-sm text-gray-500">{new Date(testimonial.created_at).toLocaleDateString()}</p>
      <Button variant="destructive" onClick={() => onDelete(testimonial.id)}>Supprimer</Button>
    </CardFooter>
  </Card>
);

const AdminTestimonials = () => {
  const { testimonials, handleDelete } = useTestimonials();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gérer les témoignages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;