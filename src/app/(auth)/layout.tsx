
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] bg-gradient-to-br from-background to-secondary/20 p-4">
      {children}
    </div>
  );
}
