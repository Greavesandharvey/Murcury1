import React from 'react';
import clsx from 'classnames';

export function ScrollArea({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('overflow-y-auto', className)} {...props} />
  );
}
