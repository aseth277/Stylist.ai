'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, ScanLine, UserCheck, Palette, Camera, PackageOpen, Sparkles, Lightbulb, CalendarDays, User, Shirt, CheckCircle } from 'lucide-react';
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

export default HowItWorksDetailSection;
