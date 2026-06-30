import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}
// Fallback dialog for copying the share link on devices without native share.
export default function ShareDialog({
  open,
  onOpenChange,
  shareUrl,
}: ShareDialogProps) {
  const [status, setStatus] = React.useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='rounded-3xl'>
        <DialogHeader>
          <DialogTitle>Share this restaurant</DialogTitle>
          <DialogDescription>
            Copy the link below and send it to a friend.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-3'>
          <div className='break-all rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800'>
            {shareUrl}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className='h-10 cursor-pointer rounded-[100px] bg-primary-100 text-[14px] font-bold leading-7 text-white -tracking-[0.02em]'
        >
          Copy Link
        </button>
      </DialogContent>
    </Dialog>
  );
}
