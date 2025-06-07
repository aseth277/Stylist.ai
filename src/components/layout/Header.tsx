
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import { Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/#features', label: 'Features' },
  { href: '/#testimonials', label: 'Testimonials' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, onboardingComplete } = useAuth();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const NavLinkItem = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium",
        (pathname === href || (href === "/#features" && pathname==="/" && typeof window !== "undefined" && window.location.hash === "#features") || (href === "/#testimonials" && pathname==="/" && typeof window !== "undefined" && window.location.hash === "#testimonials")) && "text-primary font-semibold"
      )}
    >
      {label}
    </Link>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <NavLinkItem key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
            {!loading && user && onboardingComplete && (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
                          <AvatarFallback>{user.email?.[0]?.toUpperCase() || <UserCircle size={20}/>}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        <UserCircle className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
            )}
            {!loading && (!user || !onboardingComplete) && (
                 <Button asChild variant="default" className="bg-primary hover:bg-primary/90 hidden md:flex">
                    <Link href="/signin">Sign In / Join Waitlist</Link>
                 </Button>
            )}

            <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Toggle menu</span>
            </Button>
            </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg py-4 border-t border-border/40">
          <nav className="flex flex-col items-center space-y-3 px-4">
            {navLinks.map((link) => (
               <NavLinkItem key={link.href} href={link.href} label={link.label} />
            ))}
            {!loading && user && onboardingComplete && (
                <>
                <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">Dashboard</Button>
                <Button onClick={handleSignOut} variant="ghost" className="w-full">Sign Out</Button>
                </>
            )}
             {!loading && (!user || !onboardingComplete) && (
                <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90">
                    <Link href="/signin">Sign In / Join Waitlist</Link>
                </Button>
             )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
