/**
 * Badge Component
 * For displaying keywords, tags, and status indicators
 */

import React from 'react';
import { cn } from '@utils/helpers';

const variants = {
  green: 'bg-green-100 text-green-700 border-green-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
  teal: 'bg-teal-100 text-teal-700 border-teal-200',
};

export function Badge({ children, variant = 'gray', className = '', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
