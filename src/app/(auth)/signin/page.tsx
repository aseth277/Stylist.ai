
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import FacebookSignInButton from '@/components/auth/FacebookSignInButton';
import PhoneSignInForm from '@/components/auth/PhoneSignInForm';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/shared/Logo';

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-fit">
          <Logo />
        </div>
        <CardTitle className="text-2xl">Sign In or Create Account</CardTitle>
        <CardDescription>Access your MyStylist.AI account or create a new one.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <GoogleSignInButton />
          <FacebookSignInButton />
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <PhoneSignInForm />
        
      </CardContent>
    </Card>
  );
}
