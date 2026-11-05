import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}

// Provides a fallback dialog for copying the restaurant share link.
export default function ShareDialog({
  open,
  onOpenChange,
  shareUrl,
}: ShareDialogProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStatus('idle');
    }
    onOpenChange(nextOpen);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='rounded-3xl border-border bg-surface'>
        <DialogHeader>
          <DialogTitle className='text-text'>Share this restaurant</DialogTitle>

          <DialogDescription className='text-text-secondary'>
            Copy the link below and send it to a friend.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-3'>
          <div className='break-all rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text'>
            {shareUrl}
          </div>

          <Button
            type='button'
            onClick={handleCopy}
            className='h-10 rounded-pill bg-primary-100 text-[14px] font-bold leading-7 text-primary-foreground -tracking-[0.02em] hover:bg-primary-200'
          >
            Copy Link
          </Button>

          {status === 'copied' && (
            <p role='status' className='text-sm font-semibold text-success'>
              Link copied successfully.
            </p>
          )}

          {status === 'failed' && (
            <p role='alert' className='text-sm font-semibold text-error'>
              Failed to copy link. Please try again.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
