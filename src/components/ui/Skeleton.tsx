interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-zinc-800 rounded-xl';
  const variantStyles = {
    rectangular: '',
    circular: '!rounded-full',
    text: 'h-4 rounded-md',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}
