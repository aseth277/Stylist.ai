
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, onboardingComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user && !onboardingComplete) {
        router.push('/onboarding');
      }
    }
  }, [user, loading, onboardingComplete, router]);

  if (loading || (!user && typeof window !== 'undefined') || (user && onboardingComplete === null) || (user && !onboardingComplete)) {
    // Show loader if auth state is loading, or if there's no user client-side (initial check might still be pending),
    // or if user exists but onboarding status is still being determined or is false.
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }
  
  // If user exists and onboarding is complete, render children.
  // The redirects above handle cases where these conditions aren't met.
  return <>{children}</>;
}
