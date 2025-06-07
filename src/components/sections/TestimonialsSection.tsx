import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Fashion Enthusiast',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman smiling',
    quote: "MyStylist.AI has changed how I see my wardrobe! I'm discovering so many new outfits I never thought of. The 3D avatar is a game-changer for online shopping.",
    rating: 5,
  },
  {
    name: 'Mike P.',
    role: 'Tech Professional',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    quote: "Finally, an app that makes sense of my clothes. The AI suggestions are spot on, and uploading items is surprisingly easy. Highly recommend!",
    rating: 5,
  },
  {
    name: 'Jessica T.',
    role: 'Student',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'person happy',
    quote: "I used to spend ages deciding what to wear. Now, MyStylist.AI gives me great ideas in seconds. It's like having a personal stylist in my pocket!",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-foreground">
            Loved by <span className="text-primary">Fashion Lovers</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear what our early users are saying about MyStylist.AI.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                    data-ai-hint={testimonial.dataAiHint}
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                  ))}
                </div>
                <blockquote className="text-muted-foreground italic border-l-4 border-primary pl-4">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
