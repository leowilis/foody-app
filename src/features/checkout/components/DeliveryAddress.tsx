import { MapPin } from 'lucide-react';

import { Input } from '@/components/ui/input';

interface DeliveryAddressProps {
  value: string;
  phone: string;
  isUserLoading: boolean;
  onChange: (value: string) => void;
}

// Collects the delivery address and displays the user's phone number.
export default function DeliveryAddress({
  value,
  phone,
  isUserLoading,
  onChange,
}: DeliveryAddressProps) {
  return (
    <div className='flex flex-col gap-4 rounded-3xl border border-border bg-surface p-4 shadow-foody-md md:gap-5 md:p-5'>
      {/* Delivery information */}
      <div className='flex flex-row items-center gap-2'>
        <MapPin
          aria-hidden='true'
          className='h-5 w-5 shrink-0 text-primary-100'
        />

        <h2 className='text-base font-extrabold leading-7.5 -tracking-[0.02em] text-text md:text-lg md:leading-8'>
          Delivery Address
        </h2>
      </div>

      {/* Address input */}
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='delivery-address'
          className='text-sm font-bold leading-7 -tracking-[0.02em] text-text'
        >
          Address
        </label>

        <Input
          id='delivery-address'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder='Enter your delivery address'
          autoComplete='street-address'
          required
          className='h-11 rounded-xl border-border bg-surface-subtle text-text placeholder:text-text-muted focus-visible:ring-ring md:h-12'
        />
      </div>

      {/* Authenticated user's phone number */}
      <div className='flex flex-col gap-2'>
        <span
          id='delivery-phone-label'
          className='text-sm font-bold leading-7 -tracking-[0.02em] text-text'
        >
          Phone Number
        </span>

        <div
          role='group'
          aria-labelledby='delivery-phone-label'
          aria-busy={isUserLoading}
          className='flex h-11 items-center rounded-xl border border-border bg-surface-subtle px-3 text-sm font-medium text-text-secondary md:h-12 md:text-base'
        >
          {isUserLoading ? 'Loading...' : phone || 'No phone number'}
        </div>
      </div>
    </div>
  );
}
