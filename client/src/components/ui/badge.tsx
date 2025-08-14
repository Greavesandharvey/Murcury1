import React from 'react';
import clsx from 'classnames';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  const variantClass =
    variant === 'outline'
      ? 'border text-foreground'
      : 'bg-primary text-primary-foreground';
  return <span className={clsx('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', variantClass, className)} {...props} />;
}
