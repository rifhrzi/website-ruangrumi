'use client';

import { cn } from '@/lib/utils';
import { useInView } from '@/lib/hooks/use-in-view';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  ariaLabelledby?: string;
}

export default function AnimatedSection({
  children,
  className,
  id,
  ariaLabelledby,
}: AnimatedSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.05 });

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        'transition-all duration-700 ease-out',
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8',
        className
      )}
      aria-labelledby={ariaLabelledby}
    >
      {children}
    </section>
  );
}
