import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  loading: boolean;
  label: string;
}

export default function SubmitButton({ loading, label }: SubmitButtonProps) {
  return (
    <Button
      type='submit'
      variant='destructive'
      disabled={loading}
      className='h-12 w-full cursor-pointer rounded-full bg-red-600 px-2 py-2 text-[16px] font-bold text-white shadow-[0_10px_20px_rgba(220,38,38,0.35)] transition hover:bg-red-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
    >
      {loading ? 'Loading...' : label}
    </Button>
  );
}
