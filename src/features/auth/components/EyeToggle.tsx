import { Eye, EyeOff } from 'lucide-react';

interface EyeToggleProps {
  show: boolean;
  onToggle: () => void;
}

// Toggles password visibility from a form field.
export default function EyeToggle({ show, onToggle }: EyeToggleProps) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className='absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-text-muted outline-none transition-colors hover:text-text focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-95'
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? (
        <EyeOff aria-hidden='true' className='h-5 w-5' />
      ) : (
        <Eye aria-hidden='true' className='h-5 w-5' />
      )}
    </button>
  );
}
