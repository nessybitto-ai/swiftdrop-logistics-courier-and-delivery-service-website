import { Card, CardContent } from './ui/card';
import { Star } from 'lucide-react';
import type { Testimonial } from '../backend';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">What Our Customers Say</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card key={index} className="border-none bg-card shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={testimonial.authorImage}
                    alt={testimonial.authorName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.authorName}</div>
                    <div className="flex gap-1">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
