import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, CalendarDays, Lightbulb, User, ShoppingBag, Sparkles } from 'lucide-react';

const features = [
  {
    icon: <Archive className="h-8 w-8 text-primary" />,
    title: 'Virtual Wardrobe',
    description: 'Digitize your closet. Keep track of all your clothes, shoes, and accessories in one place.',
  },
  {
    icon: <CalendarDays className="h-8 w-8 text-primary" />,
    title: 'Daily Outfit Picks',
    description: 'Receive personalized outfit recommendations every day based on your wardrobe and the weather.',
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: 'Smart Suggestions',
    description: 'Discover new clothing items that perfectly complement your existing style and wardrobe.',
  },
  {
    icon: <User className="h-8 w-8 text-primary" />,
    title: 'Personal 3D Avatar',
    description: 'Create a 3D avatar that looks like you. Try on clothes virtually before you decide.',
  },
  {
    icon: <ShoppingBag className="h-8 w-8 text-primary" />,
    title: 'Easy Item Upload',
    description: 'Add items via photos, online shopping history, or by scanning receipts.',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Styling',
    description: 'Leverage cutting-edge AI to mix & match, find your best looks, and stay on trend.',
  },
];

const FeaturesGridSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-foreground">
            App <span className="text-primary">Features</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the powerful tools MyStylist.AI offers to upgrade your fashion game.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                {feature.icon}
                <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGridSection;
