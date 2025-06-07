import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, ScanLine, UserCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <UploadCloud className="h-10 w-10 text-primary mb-4" />,
    title: 'Upload Your Wardrobe',
    description: 'Easily add clothes by uploading shopping bills, order history, or snapping photos.',
  },
  {
    icon: <ScanLine className="h-10 w-10 text-primary mb-4" />,
    title: 'AI Styling Engine',
    description: 'Our AI analyzes your items, suggests daily outfits, and finds matching new pieces.',
  },
  {
    icon: <UserCheck className="h-10 w-10 text-primary mb-4" />,
    title: 'Visualize on Avatar',
    description: 'See how outfits and new clothes look on your personalized 3D avatar.',
  },
];

const HowItWorksSummarySection = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-foreground">
            How <span className="text-primary">MyStylist.AI</span> Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started is simple. Follow these three easy steps to revolutionize your style.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardHeader>
                <div className="flex justify-center items-center">
                  {step.icon}
                </div>
                <CardTitle className="text-2xl font-semibold text-foreground">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent text-lg">
            <Link href="/how-it-works">
              See Detailed Steps <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSummarySection;
