/**
 * Card Component
 * Reusable card container with consistent styling
 */

import React from 'react';
import { cn } from '@utils/helpers';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-xl p-6',
        hover && 'transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={cn('mb-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={cn('text-2xl font-bold text-gray-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
