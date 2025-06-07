import { WaitlistForm } from '@/components/shared/WaitlistForm';
import { Gift } from 'lucide-react';

const WaitlistSignupSection = () => {
  return (
    <section id="waitlist" className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Gift className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-foreground mb-4">
            Be the First to <span className="text-primary">Experience MyStylist.AI</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our waitlist to get early access, exclusive updates, and special launch day perks. Don&apos;t miss out on revolutionizing your style!
          </p>
          <div className="bg-card p-6 sm:p-8 rounded-xl shadow-2xl">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSignupSection;
