
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
// Removed direct db/doc/setDoc imports
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition, useEffect } from 'react';
import { saveUserOnboardingData } from '@/services/userService'; // Import the Model function

const onboardingSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  height: z.coerce.number().positive({ message: 'Height must be a positive number.' }).min(50, "Too short").max(300, "Too tall"),
  weight: z.coerce.number().positive({ message: 'Weight must be a positive number.' }).min(20, "Too light").max(500, "Too heavy"),
  bodyShape: z.enum(['Slim', 'Athletic', 'Average', 'Curvy', 'Heavy'], { required_error: 'Please select your body shape.' }),
  complexion: z.enum(['Fair', 'Wheatish', 'Dusky', 'Dark'], { required_error: 'Please select your complexion.' }),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Please select your gender identity.' }),
  shoppingEmail: z.string().email({ message: 'Please enter a valid email for shopping.' }).optional().or(z.literal('')),
  emailConsent: z.boolean().refine(val => val === true, {
    message: 'You must consent to proceed if providing a shopping email.',
  }).or(z.literal(false)),
}).refine(data => {
    if (data.shoppingEmail && data.shoppingEmail.trim() !== '') {
        return data.emailConsent === true;
    }
    return true;
}, {
    message: "Please consent to email access if you've provided a shopping email.",
    path: ["emailConsent"],
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

const totalFields = 8; // fullName, height, weight, bodyShape, complexion, gender, shoppingEmail, emailConsent

interface UseOnboardingViewModelReturn {
  form: UseFormReturn<OnboardingFormData>;
  isPending: boolean;
  progress: number;
  shoppingEmailValue: string | undefined;
  handleSubmit: (data: OnboardingFormData) => Promise<void>;
}

export function useOnboardingViewModel(): UseOnboardingViewModelReturn {
  const { user, checkOnboardingStatus } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState(0);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      height: undefined,
      weight: undefined,
      shoppingEmail: user?.email || '',
      emailConsent: false,
    },
  });

  const shoppingEmailValue = form.watch("shoppingEmail");

  const calculateProgress = () => {
    const values = form.getValues();
    let filledFields = 0;
    if (values.fullName && values.fullName.length >= 2) filledFields++;
    if (values.height && values.height > 0) filledFields++;
    if (values.weight && values.weight > 0) filledFields++;
    if (values.bodyShape) filledFields++;
    if (values.complexion) filledFields++;
    if (values.gender) filledFields++;
    if (values.shoppingEmail && typeof values.shoppingEmail === 'string' && values.shoppingEmail.includes('@')) filledFields++;
    if ((values.shoppingEmail && typeof values.shoppingEmail === 'string' && values.emailConsent) || !values.shoppingEmail || values.shoppingEmail.trim() === '') filledFields++;
    
    return (filledFields / totalFields) * 100;
  };
  

  useEffect(() => {
    const subscription = form.watch(() => {
      setProgress(calculateProgress());
    });
    setProgress(calculateProgress()); // Initial calculation
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch, user]);

  const handleFormSubmit = async (data: OnboardingFormData) => {
    if (!user) {
      toast({ title: 'Error', description: 'You are not logged in.', variant: 'destructive' });
      router.push('/signin');
      return;
    }

    startTransition(async () => {
      try {
        // Call to Model (userService)
        await saveUserOnboardingData(user.uid, data, user.email);
        toast({
          title: 'Onboarding Complete!',
          description: 'Your profile has been saved. Welcome to MyStylist.AI!',
        });
        await checkOnboardingStatus();
        // router.push('/dashboard'); // AuthContext handles this
      } catch (error: any) {
        console.error('Onboarding Error:', error);
        toast({
          title: 'Submission Failed',
          description: error.message || 'Could not save your profile. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return {
    form,
    isPending,
    progress,
    shoppingEmailValue,
    handleSubmit: handleFormSubmit,
  };
}
