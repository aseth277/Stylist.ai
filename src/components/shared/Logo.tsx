import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Sparkles className="h-8 w-8 text-primary group-hover:animate-pulse" />
      <span className="text-2xl font-bold text-primary group-hover:text-accent transition-colors">
        MyStylist<span className="text-accent">.AI</span>
      </span>
    </Link>
  );
};

export default Logo;
