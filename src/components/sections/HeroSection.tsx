import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline tracking-tight text-foreground">
            Meet <span className="text-primary">MyStylist.AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Your personal AI fashion assistant. Build your virtual wardrobe, get daily outfit recommendations, and see how new styles look on your 3D avatar.
          </p>
          <ul className="space-y-2 text-left">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Smart outfit suggestions tailored to you.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Visualize clothes on your personal 3D avatar.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Discover new items that match your style.</span>
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
              <Link href="/join-waitlist">Join Waitlist Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 hover:text-accent text-lg px-8 py-6">
              <Link href="/how-it-works">Learn More <Zap className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
        <div className="relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Image
            src="https://placehold.co/600x700.png"
            alt="MyStylist.AI app interface mockup on a phone"
            width={600}
            height={700}
            className="rounded-xl shadow-2xl mx-auto"
            priority
            data-ai-hint="fashion app interface"
          />
           <div className="absolute -bottom-8 -right-8 bg-card p-4 rounded-lg shadow-xl animate-fade-in" style={{animationDelay: '0.8s'}}>
             <p className="text-sm font-semibold text-primary">✨ Daily Outfit Ready!</p>
             <p className="text-xs text-muted-foreground">Tap to view your personalized look.</p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
