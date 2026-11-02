import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  loading: boolean;
  label: string;
}

// Renders the primary submit action for authentication forms.
export default function SubmitButton({ loading, label }: SubmitButtonProps) {
  return (
    <Button
      type='submit'
      variant='default'
      disabled={loading}
      className='h-12 w-full cursor-pointer rounded-pill bg-primary-100 px-2 py-2 text-[16px] font-bold text-primary-foreground shadow-[0_10px_30px_rgba(255,107,53,0.22)] outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-200 hover:shadow-[0_14px_36px_rgba(255,107,53,0.28)] focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[0_10px_30px_rgba(255,107,53,0.22)]'
    >
      {loading ? 'Loading...' : label}
    </Button>
  );
}
