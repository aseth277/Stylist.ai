
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Shirt, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth/signin'); // Redirect to sign-in page after sign out
    } catch (error) {
      console.error('Sign out error:', error);
      // Handle error (e.g., show toast)
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-primary">Welcome to Your Dashboard!</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {user ? `Hello, ${user.displayName || user.email || 'Stylist User'}!` : 'Loading user...'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
              <LogOut className="h-6 w-6 text-muted-foreground hover:text-primary" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-foreground">
            This is your personal space to manage your wardrobe, discover new styles, and get AI-powered outfit recommendations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button size="lg" className="w-full bg-accent hover:bg-accent/80" onClick={() => router.push('/')}> {/* Assuming home has wardrobe features */}
              <Shirt className="mr-2 h-5 w-5" />
              Manage My Wardrobe
            </Button>
            <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" onClick={() => router.push('/')}>  {/* Assuming home has AI features */}
              <Sparkles className="mr-2 h-5 w-5" />
              Get AI Outfit Ideas
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            More features coming soon. Stay stylish!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
