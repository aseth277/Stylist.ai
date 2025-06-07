
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useState, useTransition, useEffect } from 'react';

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
    // This refine will only apply if shoppingEmail is provided.
    // We'll handle conditional requirement in the component or by making consent always required.
    // For simplicity, making consent required if email is filled.
  }).or(z.literal(false)), // Allow false if email is not provided
}).refine(data => {
    // If shoppingEmail is provided, emailConsent must be true
    if (data.shoppingEmail && data.shoppingEmail.trim() !== '') {
        return data.emailConsent === true;
    }
    return true; // Otherwise, consent is not strictly required to be true
}, {
    message: "Please consent to email access if you've provided a shopping email.",
    path: ["emailConsent"], // Show error under emailConsent field
});


type OnboardingFormData = z.infer<typeof onboardingSchema>;

const totalFields = 8; // fullName, height, weight, bodyShape, complexion, gender, shoppingEmail, emailConsent

export default function OnboardingForm() {
  const { user, checkOnboardingStatus } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      height: undefined,
      weight: undefined,
      shoppingEmail: user?.email || '', // Pre-fill with user's auth email if available
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
    if (values.shoppingEmail && values.shoppingEmail.includes('@')) filledFields++; // Simple check for email
    // Consent is a bit tricky for progress, let's count it if shoppingEmail is present and consent is checked or if shoppingEmail is absent.
    if ((values.shoppingEmail && values.emailConsent) || !values.shoppingEmail) filledFields++;
    
    return (filledFields / totalFields) * 100;
  };
  
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const subscription = form.watch(() => {
      setProgress(calculateProgress());
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);


  async function onSubmit(data: OnboardingFormData) {
    if (!user) {
      toast({ title: 'Error', description: 'You are not logged in.', variant: 'destructive' });
      router.push('/signin');
      return;
    }

    startTransition(async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          ...data,
          uid: user.uid,
          authEmail: user.email, // Store the primary auth email as well
          onboardingComplete: true,
          profileLastUpdatedAt: new Date().toISOString(),
        }, { merge: true }); // Merge to not overwrite existing fields like createdAt

        toast({
          title: 'Onboarding Complete!',
          description: 'Your profile has been saved. Welcome to MyStylist.AI!',
        });
        await checkOnboardingStatus(); // This will trigger redirection via AuthContext
        // router.push('/dashboard'); // AuthContext will handle this
      } catch (error: any) {
        console.error('Onboarding Error:', error);
        toast({
          title: 'Submission Failed',
          description: error.message || 'Could not save your profile. Please try again.',
          variant: 'destructive',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="mb-6">
            <Label className="text-sm font-medium text-muted-foreground">Progress</Label>
            <Progress value={progress} className="w-full mt-1 h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(progress)}% complete</p>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 170" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 65" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="bodyShape"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body Shape</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your body shape" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Slim">Slim</SelectItem>
                  <SelectItem value="Athletic">Athletic</SelectItem>
                  <SelectItem value="Average">Average</SelectItem>
                  <SelectItem value="Curvy">Curvy</SelectItem>
                  <SelectItem value="Heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="complexion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complexion</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your complexion" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Wheatish">Wheatish</SelectItem>
                  <SelectItem value="Dusky">Dusky</SelectItem>
                  <SelectItem value="Dark">Dark</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender Identity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender identity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="shoppingEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Shopping Email (Optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., email@example.com (for Myntra, Ajio, etc.)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {shoppingEmailValue && shoppingEmailValue.trim() !== '' && (
            <FormField
            control={form.control}
            name="emailConsent"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>
                    I consent to MyStylist.AI accessing my shopping email to fetch invoices/receipts for automatic wardrobe updates.
                    </FormLabel>
                    <FormMessage />
                </div>
                </FormItem>
            )}
            />
        )}
        

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete Onboarding
        </Button>
      </form>
    </Form>
  );
}
