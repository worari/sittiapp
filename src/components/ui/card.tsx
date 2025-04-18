// File: components/ui/card.tsx
import { ReactNode } from 'react';
import { Card } from '../components/ui/card';

export function Card({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {children}
    </div>
  );
}
