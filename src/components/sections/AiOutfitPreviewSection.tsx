
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2 } from 'lucide-react';
import { useAiOutfitPreviewViewModel } from '@/viewmodels/useAiOutfitPreviewViewModel';
import { useEffect } from 'react';

const AiOutfitPreviewSection = () => {
  const {
    wardrobeDescription,
    setWardrobeDescription,
    avatarStyle,
    setAvatarStyle,
    result,
    isPending,
    handleSubmit,
  } = useAiOutfitPreviewViewModel(true); // Pass true to trigger initial generation in ViewModel


  return (
    <section id="ai-preview" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-foreground">
            AI Outfit <span className="text-primary">Preview</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See our AI in action! Describe your wardrobe, pick an avatar style, and get an instant outfit recommendation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Describe Your Style</CardTitle>
              <CardDescription>Tell us about your clothes and preferred avatar look.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wardrobeDescription">My Wardrobe Includes...</Label>
                <Textarea
                  id="wardrobeDescription"
                  value={wardrobeDescription}
                  onChange={(e) => setWardrobeDescription(e.target.value)}
                  placeholder="e.g., casual t-shirts, dark jeans, sneakers, a few formal shirts..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarStyle">Avatar Style</Label>
                <Select value={avatarStyle} onValueChange={setAvatarStyle}>
                  <SelectTrigger id="avatarStyle">
                    <SelectValue placeholder="Select avatar style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="cartoonish">Cartoonish</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isPending} className="w-full bg-accent hover:bg-accent/90">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {isPending ? 'Styling...' : 'Generate Outfit'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-xl min-h-[400px] flex flex-col items-center justify-center p-6 bg-secondary/20">
            {isPending && (
              <div className="text-center space-y-4">
                <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                <p className="text-lg text-muted-foreground">Crafting your look...</p>
                <p className="text-sm text-muted-foreground">This might take a moment.</p>
              </div>
            )}
            {!isPending && result && (
              <div className="text-center animate-fade-in w-full">
                <h3 className="text-2xl font-semibold text-primary mb-4">Your AI-Styled Outfit!</h3>
                {result.avatarImage && (
                  <div className="relative w-full max-w-xs h-auto mx-auto mb-4 aspect-[3/4] rounded-lg overflow-hidden shadow-lg border border-border">
                     <Image
                        src={result.avatarImage}
                        alt={`Avatar in ${avatarStyle} style wearing ${result.outfitSuggestion}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-opacity duration-500 opacity-0"
                        onLoadingComplete={(image) => image.classList.remove('opacity-0')}
                        data-ai-hint="fashion avatar model"
                      />
                  </div>
                )}
                <p className="text-muted-foreground italic">&quot;{result.outfitSuggestion}&quot;</p>
              </div>
            )}
            {!isPending && !result && (
               <div className="text-center text-muted-foreground space-y-2">
                <Wand2 className="h-12 w-12 mx-auto text-primary/50" />
                <p>Your outfit preview will appear here.</p>
                <p className="text-sm">Click "Generate Outfit" to see the magic!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AiOutfitPreviewSection;
