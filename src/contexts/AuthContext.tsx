
'use client';

import type { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  onboardingComplete: boolean | null; // null if loading, true/false otherwise
  checkOnboardingStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, authLoading, error] = useAuthState(auth);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkOnboardingStatus = async () => {
    if (user) {
      setCheckingOnboarding(true);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data()?.onboardingComplete) {
          setOnboardingComplete(true);
        } else {
          setOnboardingComplete(false);
          // If user doc exists but no onboardingComplete field, or if it's false,
          // it implies onboarding is needed. If doc doesn't exist, also new.
        }
      } catch (err) {
        console.error("Error checking onboarding status:", err);
        setOnboardingComplete(false); // Default to needing onboarding on error
      } finally {
        setCheckingOnboarding(false);
      }
    } else {
      setOnboardingComplete(null); // No user, so onboarding status is not applicable or known
      setCheckingOnboarding(false);
    }
  };
  
  useEffect(() => {
    if (!authLoading) {
      checkOnboardingStatus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);


  useEffect(() => {
    if (authLoading || checkingOnboarding) return; // Still loading, wait

    const isAuthPage = pathname?.startsWith('/auth');
    const isSignInPage = pathname === '/auth/signin';
    const isOnboardingPage = pathname === '/auth/onboarding';

    if (user) { // User is logged in
      if (onboardingComplete === false) { // Needs onboarding
        if (!isOnboardingPage) {
          router.push('/auth/onboarding');
        }
      } else if (onboardingComplete === true) { // Onboarding is complete
        if (isAuthPage) { // If on an auth page (signin/onboarding), redirect to dashboard
          router.push('/dashboard');
        }
      }
      // If onboardingComplete is null, we're still checking, so don't redirect yet
    } else { // No user is logged in
      if (!isSignInPage && !pathname?.startsWith('/how-it-works') && pathname !== '/' && !isAuthPage) {
        // If not on signin, how-it-works, home, or any auth page, redirect to signin
         router.push('/auth/signin');
      } else if (isOnboardingPage) { // If on onboarding page without user, redirect to signin
         router.push('/auth/signin');
      }
    }
  }, [user, authLoading, onboardingComplete, checkingOnboarding, router, pathname]);


  const overallLoading = authLoading || checkingOnboarding;

  if (overallLoading && !pathname?.startsWith('/auth/signin') && pathname !== '/' && !pathname?.startsWith('/how-it-works')) {
    const isPublicPath = pathname === '/' || pathname?.startsWith('/how-it-works') || pathname?.startsWith('/join-waitlist');
    if (!user && !isPublicPath && !pathname?.startsWith('/auth/signin')) {
        // Show loader only if not on public paths and not on signin, while initial auth check is happening
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
          );
    }
  }


  return (
    <AuthContext.Provider value={{ user, loading: overallLoading, onboardingComplete, checkOnboardingStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
