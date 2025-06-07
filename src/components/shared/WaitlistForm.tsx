'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { useState, useTransition } from 'react';

const FormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

// Dummy server action
async function submitToWaitlist(data: z.infer<typeof FormSchema>): Promise<{ success: boolean; message: string }> {
  console.log('Submitted to waitlist:', data.email);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, you would save the email to a database here.
  // For now, we'll always return success.
  return { success: true, message: `Successfully added ${data.email} to the waitlist!` };
}


export function WaitlistForm({ className }: { className?: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const result = await submitToWaitlist(data);
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
          variant: 'default',
        });
        setSubmitted(true);
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    });
  }
  
  if (submitted) {
    return (
      <div className={`text-center p-6 rounded-lg bg-secondary/30 ${className}`}>
        <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-2xl font-semibold text-primary mb-2">Thank You!</h3>
        <p className="text-foreground">You're on the list. We'll be in touch soon!</p>
         <Button variant="link" onClick={() => setSubmitted(false)} className="mt-4 text-primary">Join with another email</Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email address" 
                    {...field} 
                    className="pl-10 h-12 text-base"
                    aria-label="Email address for waitlist"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold bg-accent hover:bg-accent/90"
          disabled={isPending}
          aria-label="Join the waitlist"
        >
          {isPending ? 'Joining...' : 'Join the Waitlist'}
        </Button>
      </form>
    </Form>
  );
}
