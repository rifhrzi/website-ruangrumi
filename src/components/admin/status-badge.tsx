import { cn } from '@/lib/utils';
import { getStatusColor } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const colorClasses = getStatusColor(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium capitalize',
        colorClasses,
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      )}
    >
      {/* Dot indicator */}
      <span
        className={cn(
          'inline-block rounded-full',
          size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
          // Derive the dot color from the text color class
          status === 'pending' && 'bg-yellow-500',
          status === 'confirmed' && 'bg-blue-500',
          status === 'preparing' && 'bg-orange-500',
          status === 'ready' && 'bg-green-500',
          status === 'completed' && 'bg-gray-400',
          status === 'cancelled' && 'bg-red-500',
          status === 'seated' && 'bg-purple-500',
          status === 'no-show' && 'bg-red-500',
          status === 'paid' && 'bg-green-500',
          status === 'unpaid' && 'bg-yellow-500',
          status === 'refunded' && 'bg-gray-400',
        )}
      />
      {status.replace('-', ' ')}
    </span>
  );
}
