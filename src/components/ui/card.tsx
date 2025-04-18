// File: components/ui/card.tsx
import { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}
