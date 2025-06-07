
import OnboardingForm from '@/components/onboarding/OnboardingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/shared/Logo';

export default function OnboardingPage() {
  return (
    <Card className="w-full max-w-2xl shadow-xl my-8">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-fit">
            <Logo />
        </div>
        <CardTitle className="text-3xl">Tell Us About Yourself</CardTitle>
        <CardDescription>
          Personalize your experience for the best outfit recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OnboardingForm />
      </CardContent>
    </Card>
  );
}
