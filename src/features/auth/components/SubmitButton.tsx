import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  loading: boolean
  label: string
}

export default function SubmitButton({ loading, label }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={loading}
      className="h-12 w-full cursor-pointer rounded-full bg-primary-100 px-2 py-2 text-[16px] font-bold leading-7.5 -tracking-[0.02em] text-neutral-25 shadow-[0_10px_20px_rgba(184,13,13,0.18)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Loading...' : label}
    </Button>
  )
}