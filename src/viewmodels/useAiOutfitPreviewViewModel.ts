
'use client';

import { useState, useTransition, useEffect } from 'react';
import { generateOutfitSuggestions, type GenerateOutfitSuggestionsOutput } from '@/ai/flows/generate-outfit-suggestions';
import { useToast } from '@/hooks/use-toast';

interface UseAiOutfitPreviewViewModelReturn {
  wardrobeDescription: string;
  setWardrobeDescription: (value: string) => void;
  avatarStyle: string;
  setAvatarStyle: (value: string) => void;
  result: GenerateOutfitSuggestionsOutput | null;
  isPending: boolean;
  handleSubmit: () => void;
}

export function useAiOutfitPreviewViewModel(initialGeneration: boolean = false): UseAiOutfitPreviewViewModelReturn {
  const [wardrobeDescription, setWardrobeDescription] = useState('A collection of casual chic items: skinny jeans (blue, black), oversized sweaters (cream, grey), ankle boots, white sneakers, a leather jacket, and a few band t-shirts.');
  const [avatarStyle, setAvatarStyle] = useState('realistic');
  const [result, setResult] = useState<GenerateOutfitSuggestionsOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [shouldGenerateInitially, setShouldGenerateInitially] = useState(initialGeneration);


  const performSubmit = () => {
    if (!wardrobeDescription.trim()) {
      toast({
        title: "Wardrobe Empty?",
        description: "Please describe your wardrobe to get suggestions.",
        variant: "destructive",
      });
      return;
    }
    
    startTransition(async () => {
      try {
        setResult(null);
        // Model Interaction: Calling the Genkit flow
        const suggestion = await generateOutfitSuggestions({ wardrobeDescription, avatarStyle });
        setResult(suggestion);
        toast({
          title: "Outfit Ready!",
          description: "Here's a fresh look for you.",
        });
      } catch (error) {
        console.error('Error generating outfit:', error);
        toast({
          title: "Uh Oh!",
          description: "Couldn't generate an outfit. Please try again.",
          variant: "destructive",
        });
        setResult(null);
      }
    });
  };

  useEffect(() => {
    if (shouldGenerateInitially) {
      performSubmit();
      setShouldGenerateInitially(false); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldGenerateInitially]);


  return {
    wardrobeDescription,
    setWardrobeDescription,
    avatarStyle,
    setAvatarStyle,
    result,
    isPending,
    handleSubmit: performSubmit,
  };
}
