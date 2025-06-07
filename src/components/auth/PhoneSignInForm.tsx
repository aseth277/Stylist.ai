
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth, db } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Phone, KeyRound, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function PhoneSignInForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const { checkOnboardingStatus } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          toast({ title: "reCAPTCHA Expired", description: "Please try sending OTP again.", variant: "destructive" });
        }
      });
    }
  }, [toast]);
  

  const handleSendOtp = async () => {
    if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
        toast({ title: 'Invalid Phone Number', description: 'Please enter a valid phone number with country code (e.g., +1234567890).', variant: 'destructive' });
        return;
    }
    setLoading(true);
    try {
      const verifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      setOtpSent(true);
      toast({ title: 'OTP Sent!', description: `An OTP has been sent to ${phoneNumber}.` });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({ title: 'OTP Error', description: error.message || 'Failed to send OTP. Please try again.', variant: 'destructive' });
      // Reset reCAPTCHA if it exists and there's an error
      window.recaptchaVerifier?.render().then((widgetId: any) => {
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset(widgetId);
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
        toast({ title: 'Verification Error', description: 'Please send OTP first.', variant: 'destructive' });
        return;
    }
    if (otp.length !== 6) {
        toast({ title: 'Invalid OTP', description: 'OTP must be 6 digits.', variant: 'destructive' });
        return;
    }
    setLoading(true);
    try {
      const credential = await confirmationResult.confirm(otp);
      const user = credential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          phoneNumber: user.phoneNumber,
          createdAt: new Date().toISOString(),
          onboardingComplete: false,
        }, { merge: true });
        toast({ title: 'Welcome!', description: 'Let\'s get you set up.' });
        await checkOnboardingStatus();
        router.push('/onboarding');
      } else {
        toast({ title: 'Welcome back!' });
        await checkOnboardingStatus();
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({ title: 'OTP Verification Failed', description: error.message || 'Could not verify OTP. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!otpSent ? (
        <>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone Number (with country code)</Label>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 123 456 7890"
                    className="pl-10"
                />
            </div>
          </div>
          <Button onClick={handleSendOtp} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-1">
            <Label htmlFor="otp">Enter OTP</Label>
             <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="pl-10"
                />
            </div>
          </div>
          <Button onClick={handleVerifyOtp} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify OTP &amp; Sign In
          </Button>
          <Button variant="link" onClick={() => { setOtpSent(false); setOtp(''); setConfirmationResult(null);}} className="w-full">
            Change phone number
          </Button>
        </>
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
}

// Add this to your global types or a specific types file if you have one
declare global {
    interface Window {
      recaptchaVerifier: RecaptchaVerifier;
      grecaptcha: any; // Or a more specific type if you import reCAPTCHA types
    }
  }
