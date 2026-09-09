import { cn } from 'cn';
import type { HTMLAttributes } from 'react';

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function PageContainer({
  children,
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
