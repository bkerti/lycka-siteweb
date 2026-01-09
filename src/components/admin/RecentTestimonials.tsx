import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTestimonialsContext } from "@/hooks/useTestimonialsContext";

const RecentTestimonials = () => {
  const { testimonials } = useTestimonialsContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Témoignages Récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testimonials.slice(0, 5).map((testimonial) => (
            <div key={testimonial.id} className="flex items-start space-x-4">
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTestimonials;