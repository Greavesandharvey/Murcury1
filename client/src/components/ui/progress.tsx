import React from 'react';
import clsx from 'classnames';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  className?: string;
}

export function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div className={clsx('w-full bg-gray-800 rounded-full', className)} {...props}>
      <div
        className="h-full bg-green-500 rounded-full"
        style={{ width: `${value}%`, height: '100%' }}
      />
    </div>
  );
}
