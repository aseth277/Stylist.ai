
'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useOnboardingViewModel } from '@/viewmodels/useOnboardingViewModel';
import { Label } from '@/components/ui/label';

export default function OnboardingForm() {
  const {
    form,
    isPending,
    progress,
    shoppingEmailValue,
    handleSubmit,
  } = useOnboardingViewModel();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-full">
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
