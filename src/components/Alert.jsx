/**
 * Alert Component
 * For displaying messages, errors, and notifications
 */

import React from 'react';
import { cn } from '@utils/helpers';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const variants = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: XCircle,
    iconColor: 'text-red-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: AlertCircle,
    iconColor: 'text-yellow-600',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: Info,
    iconColor: 'text-blue-600',
  },
};

export function Alert({ 
  children, 
  variant = 'info', 
  title,
  onClose,
  className = '',
  ...props 
}) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-lg border p-4 flex items-start gap-3',
        config.bg,
        config.border,
        className
      )}
      {...props}
    >
      <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.iconColor)} />
      <div className="flex-1">
        {title && (
          <p className={cn('font-semibold mb-1', config.text)}>{title}</p>
        )}
        <div className={cn('text-sm', config.text)}>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn('ml-auto flex-shrink-0', config.iconColor, 'hover:opacity-70')}
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default Alert;
