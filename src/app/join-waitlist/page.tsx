import { WaitlistForm } from '@/components/shared/WaitlistForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Gift, Users } from 'lucide-react';
import Image from 'next/image';

export default function JoinWaitlistPage() {
  return (
    <div className="py-12 md:py-20 bg-gradient-to-br from-background to-secondary/20 min-h-[calc(100vh-8rem)] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline text-foreground mb-6">
              You&apos;re Almost <span className="text-primary">In!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join the MyStylist.AI waitlist and be among the first to experience the future of fashion. Get ready to transform your wardrobe and discover your unique style like never before.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Gift className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Early Access Perks</h3>
                  <p className="text-muted-foreground">Get exclusive access before the public launch and enjoy special founder benefits.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Exclusive Updates</h3>
                  <p className="text-muted-foreground">Receive behind-the-scenes content and be the first to know about new features.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Shape The Future</h3>
                  <p className="text-muted-foreground">Provide feedback and help us build the best personal styling assistant for you.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Card className="shadow-2xl overflow-hidden">
              <div className="relative h-48 w-full">
                <Image 
                  src="https://placehold.co/600x300.png"
                  alt="Fashion collage"
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="fashion style clothes"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                 <CardHeader className="absolute bottom-0 left-0 p-6">
                    <CardTitle className="text-3xl font-bold text-white">Join Our Community</CardTitle>
                    <CardDescription className="text-gray-200 text-lg">Sign up below to secure your spot.</CardDescription>
                  </CardHeader>
              </div>
              <CardContent className="p-6 md:p-8">
                <WaitlistForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
