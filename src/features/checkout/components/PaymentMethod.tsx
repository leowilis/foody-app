import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BANK_OPTIONS } from '../constants/checkout.constants';

interface PaymentMethodProps {
  value: string;
  onChange: (value: string) => void;
}

// Renders the available bank payment options.
export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <div className='flex flex-col gap-3 md:gap-4'>
      <h2 className='text-base font-bold leading-7.5 -tracking-[0.02em] text-text md:text-lg md:leading-8'>
        Payment Method
      </h2>

      <RadioGroup
        value={value}
        onValueChange={onChange}
        className='flex flex-col gap-3'
      >
        {/* Render each bank as a selectable payment option. */}
        {BANK_OPTIONS.map((bank, index) => {
          const inputId = `payment-method-${index}`;

          return (
            <label
              key={bank.value}
              htmlFor={inputId}
              className='flex cursor-pointer flex-row items-center justify-between gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:bg-surface-subtle has-[[data-state=checked]]:border-border has-[[data-state=checked]]:bg-surface-subtle'
            >
              <div className='flex min-w-0 flex-1 flex-row items-center gap-2'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-subtle'>
                  <img
                    src={bank.logo}
                    className='h-6 w-6 object-contain'
                    alt=''
                    aria-hidden='true'
                  />
                </div>

                <span className='truncate text-sm font-bold leading-7.5 -tracking-[0.02em] text-text md:text-base md:leading-7.5'>
                  {bank.label}
                </span>
              </div>

              <RadioGroupItem id={inputId} value={bank.value} />
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
