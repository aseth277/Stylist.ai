'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/#features', label: 'Features' },
  { href: '/#testimonials', label: 'Testimonials' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false); // Close mobile menu on route change
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <NavLinkItem key={link.href} href={link.href} label={link.label} />
          ))}
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
            <Link href="/join-waitlist">Join Waitlist</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg py-4 border-t border-border/40">
          <nav className="flex flex-col items-center space-y-3">
            {navLinks.map((link) => (
               <NavLinkItem key={link.href} href={link.href} label={link.label} />
            ))}
            <Button asChild variant="default" className="w-11/12 bg-primary hover:bg-primary/90">
              <Link href="/join-waitlist">Join Waitlist</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
