'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, ScanLine, UserCheck, Palette, Camera, PackageOpen } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const stepsData = [
  {
    id: 1,
    icon: <UploadCloud className="h-12 w-12 text-primary" />,
    title: 'Step 1: Build Your Digital Wardrobe',
    shortDescription: 'Effortlessly add your clothing items.',
    longDescription: "Getting your clothes into MyStylist.AI is a breeze. You can upload photos of your items, connect your online shopping accounts to import purchase history, or even scan receipts from physical stores. Our smart system categorizes everything for you.",
    illustration: 'https://placehold.co/500x350.png',
    dataAiHint: 'uploading clothes digital',
    details: [
      { icon: <Camera className="h-5 w-5 text-accent"/>, text: 'Snap photos of your garments.'},
      { icon: <PackageOpen className="h-5 w-5 text-accent"/>, text: 'Import from online retailers.'},
      { icon: <ScanLine className="h-5 w-5 text-accent"/>, text: 'Scan paper receipts.'}
    ]
  },
  {
    id: 2,
    icon: <Palette className="h-12 w-12 text-primary" />,
    title: 'Step 2: AI Does the Magic',
    shortDescription: 'Let our AI analyze and suggest.',
    longDescription: "Once your wardrobe is digitized, our powerful AI engine gets to work. It analyzes colors, styles, patterns, and even considers the current weather and your upcoming events. It then curates daily outfit recommendations, suggests new items that would complement your collection, and helps you explore different looks.",
    illustration: 'https://placehold.co/500x350.png',
    dataAiHint: 'AI fashion algorithm',
    details: [
      { icon: <Sparkles className="h-5 w-5 text-accent"/>, text: 'Personalized daily outfits.'},
      { icon: <Lightbulb className="h-5 w-5 text-accent"/>, text: 'Smart new item suggestions.'},
      { icon: <CalendarDays className="h-5 w-5 text-accent"/>, text: 'Event & weather-based styling.'}
    ]
  },
  {
    id: 3,
    icon: <UserCheck className="h-12 w-12 text-primary" />,
    title: 'Step 3: Visualize & Shine',
    shortDescription: 'See outfits on your 3D avatar.',
    longDescription: "The most exciting part! Create your personal 3D avatar. MyStylist.AI lets you virtually try on any outfit from your wardrobe or suggested new items. See how different combinations look on YOU before you even open your closet or make a purchase. Experiment with styles risk-free and step out with confidence every day.",
    illustration: 'https://placehold.co/500x350.png',
    dataAiHint: '3D avatar fashion',
    details: [
      { icon: <User className="h-5 w-5 text-accent"/>, text: 'Create your look-alike avatar.'},
      { icon: <Shirt className="h-5 w-5 text-accent"/>, text: 'Virtually try on any item.'},
      { icon: <CheckCircle className="h-5 w-5 text-accent"/>, text: 'Confidently choose your look.'}
    ]
  },
];

const HowItWorksDetailSection = () => {
  const [selectedStep, setSelectedStep] = useState(stepsData[0].id);

  const currentStepData = stepsData.find(step => step.id === selectedStep) || stepsData[0];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold font-headline text-foreground">
            How <span className="text-primary">MyStylist.AI</span> Transforms Your Style
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Dive deeper into the simple yet powerful process that MyStylist.AI uses to help you look your best, effortlessly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Step Selector */}
          <div className="lg:w-1/3 space-y-4">
            {stepsData.map((step) => (
              <Card 
                key={step.id} 
                className={`cursor-pointer transition-all duration-300 ${selectedStep === step.id ? 'bg-primary/10 border-primary shadow-lg' : 'hover:bg-muted/50'}`}
                onClick={() => setSelectedStep(step.id)}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  {step.icon}
                  <div>
                    <CardTitle className={`text-xl font-semibold ${selectedStep === step.id ? 'text-primary' : 'text-foreground'}`}>{step.title}</CardTitle>
                    <CardDescription className={`${selectedStep === step.id ? 'text-primary/80' : 'text-muted-foreground'}`}>{step.shortDescription}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Step Details */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-xl">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      {currentStepData.icon}
                      <CardTitle className="text-3xl font-bold text-primary">{currentStepData.title}</CardTitle>
                    </div>
                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-6">
                      <Image
                        src={currentStepData.illustration}
                        alt={currentStepData.title}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={currentStepData.dataAiHint}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-foreground mb-6 leading-relaxed">{currentStepData.longDescription}</p>
                    <h4 className="text-xl font-semibold text-foreground mb-3">Key Actions:</h4>
                    <ul className="space-y-3">
                      {currentStepData.details.map((detail, index) => (
                        <li key={index} className="flex items-center gap-3">
                          {detail.icon}
                          <span className="text-muted-foreground">{detail.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex justify-between">
              <Button 
                onClick={() => setSelectedStep(prev => Math.max(1, prev - 1))} 
                disabled={selectedStep === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button 
                onClick={() => setSelectedStep(prev => Math.min(stepsData.length, prev + 1))} 
                disabled={selectedStep === stepsData.length}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        <div className="text-center mt-16">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-lg px-10 py-6">
            <Link href="/join-waitlist">Ready to Start? Join Waitlist</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
// Helper icons - define if not already available or use lucide
const Sparkles = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2l2.35 4.7L19 7.7l-4.05 3.55L16.7 16 12 13.55 7.3 16l1.75-4.75L5 7.7l4.65-1L12 2zm0 15l-1.17 2.35L9.5 22l2.02-1.77L9.8 16.5 12 18.05 14.2 16.5l-1.72 3.73L14.5 22l-1.33-2.65L12 17zM20 9l-1.18 2.35L16.5 14l2.03-1.77L16.8 8.5 19 10.05 21.2 8.5l-1.72 3.73L21.5 14l-1.32-2.65L20 9z"/></svg>;
const Lightbulb = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>;
const CalendarDays = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zM5 8V6h14v2H5z"/></svg>;
const User = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const Shirt = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M8.75 3A1.75 1.75 0 007 4.75V8h1V4.75a.75.75 0 01.75-.75h1.316a4.502 4.502 0 018.868 0H19.25a.75.75 0 01.75.75V8h1V4.75A1.75 1.75 0 0019.25 3h-2.58a5.978 5.978 0 00-3.178-1.895 5.978 5.978 0 00-3.178 1.895H8.75zM5 9.75A1.75 1.75 0 003.25 11.5v8A1.75 1.75 0 005 21.25h14a1.75 1.75 0 001.75-1.75v-8A1.75 1.75 0 0019 9.75H5zm2 1.5h10v7.5H7v-7.5z"/></svg>;
const CheckCircle = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" /></svg>;


export default HowItWorksDetailSection;
