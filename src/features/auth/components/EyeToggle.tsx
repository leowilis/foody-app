import Eye from '@/assets/eye.svg'

interface EyeToggleProps {
  show: boolean
  onToggle: () => void
}

export default function EyeToggle({ show, onToggle }: EyeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 active:scale-95"
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      <img
        src={Eye}
        alt="Eye Toggle"
        className="h-5 w-5 opacity-80"
        draggable={false}
      />
    </button>
  )
}