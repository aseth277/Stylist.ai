
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth, db } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult, type UserCredential } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Phone, KeyRound, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Add recaptchaWidgetId to window declaration
declare global {
    interface Window {
      recaptchaVerifier?: RecaptchaVerifier; // Made optional to reflect it might not be set initially
      grecaptcha: any; 
      recaptchaWidgetId?: number; 
    }
  }

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
    if (typeof window !== 'undefined') {
      if (!window.recaptchaVerifier) {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response: any) => {
            console.log('reCAPTCHA solved:', response);
          },
          'expired-callback': () => {
            toast({ title: "reCAPTCHA Expired", description: "Please try sending OTP again.", variant: "destructive" });
            if (typeof window.grecaptcha !== 'undefined' && window.recaptchaWidgetId !== undefined) {
              try {
                window.grecaptcha.reset(window.recaptchaWidgetId);
              } catch (e) {
                console.error("Error resetting reCAPTCHA on expiration:", e);
              }
            }
          },
          'error-callback': (error: any) => {
            console.error("reCAPTCHA error-callback:", error);
            toast({ title: "reCAPTCHA Problem", description: "There was an issue with reCAPTCHA. Please refresh and try again.", variant: "destructive" });
          }
        });
        
        verifier.render().then((widgetId) => {
          console.log('reCAPTCHA widgetId assigned:', widgetId);
          window.recaptchaWidgetId = widgetId;
        }).catch(error => {
          console.error('reCAPTCHA render error:', error);
          toast({ title: "reCAPTCHA Setup Failed", description: "Could not set up reCAPTCHA. Please refresh the page.", variant: "destructive" });
        });
        window.recaptchaVerifier = verifier;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, toast]); // Added auth to dependency array
  

  const handleSendOtp = async () => {
    if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
        toast({ title: 'Invalid Phone Number', description: 'Please enter a valid phone number with country code (e.g., +1234567890).', variant: 'destructive' });
        return;
    }
    setLoading(true);
    try {
      if (!window.recaptchaVerifier) {
        toast({ title: 'Verification Not Ready', description: 'reCAPTCHA verifier is not initialized. Please refresh.', variant: 'destructive' });
        setLoading(false);
        return;
      }
      const verifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      setOtpSent(true);
      toast({ title: 'OTP Sent!', description: `An OTP has been sent to ${phoneNumber}.` });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({ title: 'OTP Error', description: error.message || 'Failed to send OTP. Please try again.', variant: 'destructive' });
      
      if (typeof window.grecaptcha !== 'undefined' && window.recaptchaWidgetId !== undefined) {
        try {
            window.grecaptcha.reset(window.recaptchaWidgetId);
        } catch (resetError) {
            console.error("Error resetting reCAPTCHA in handleSendOtp catch:", resetError);
        }
      } else {
          console.warn("reCAPTCHA widgetId not available for reset in handleSendOtp catch.");
      }
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
      const credential: UserCredential = await confirmationResult.confirm(otp);
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
        await checkOnboardingStatus(); // This should trigger redirect via AuthContext
        // router.push('/onboarding'); // AuthContext handles this
      } else {
        toast({ title: 'Welcome back!' });
        await checkOnboardingStatus(); // This should trigger redirect via AuthContext
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
