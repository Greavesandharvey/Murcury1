import React from 'react';
import clsx from 'classnames';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({ orientation = 'horizontal', className, ...props }: SeparatorProps) {
  const isVertical = orientation === 'vertical';
  return (
    <div
      role="separator"
      className={clsx(
        isVertical ? 'w-px h-full bg-border' : 'h-px w-full bg-border',
        className,
      )}
      {...props}
    />
  );
}
