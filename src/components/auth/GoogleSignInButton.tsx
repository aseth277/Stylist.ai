
'use client';

import { Button } from '@/components/ui/button';
import { auth, db } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Globe } from 'lucide-react'; // Placeholder for Google icon
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function GoogleSignInButton() {
  const router = useRouter();
  const { checkOnboardingStatus } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists, if not, it's a new user (or first sign-in here)
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Minimal user profile, mainly for marking this user record exists
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          onboardingComplete: false, // Explicitly set onboarding as not complete
        }, { merge: true });
        toast({ title: 'Welcome!', description: 'Let\'s get you set up.' });
        await checkOnboardingStatus(); // Re-check to update context
        router.push('/onboarding');
      } else {
         // If doc exists, checkOnboardingStatus will handle redirection based on onboardingComplete field
        toast({ title: 'Welcome back!' });
        await checkOnboardingStatus(); 
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Sign-In Failed',
        description: error.message || 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleSignIn} variant="outline" className="w-full">
      <Globe className="mr-2 h-5 w-5" />
      Sign in with Google
    </Button>
  );
}
