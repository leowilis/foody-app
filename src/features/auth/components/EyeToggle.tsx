import { Eye, EyeOff } from 'lucide-react';

interface EyeToggleProps {
  show: boolean;
  onToggle: () => void;
}

export default function EyeToggle({ show, onToggle }: EyeToggleProps) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className='absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 active:scale-95'
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? (
        <EyeOff className='h-5 w-5 text-neutral-400' />
      ) : (
        <Eye className='h-5 w-5 text-neutral-400' />
      )}
    </button>
  );
}
