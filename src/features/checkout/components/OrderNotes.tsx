interface OrderNotesProps {
  value: string;
  onChange: (value: string) => void;
}

// Collects optional notes for the restaurant or delivery.
export default function OrderNotes({ value, onChange }: OrderNotesProps) {
  return (
    <div className='flex flex-col gap-4 rounded-3xl border border-border bg-surface p-4 shadow-foody-md md:p-5'>
      {/* Order notes heading */}
      <div className='flex flex-col gap-1'>
        <h2 className='text-base font-extrabold leading-7.5 -tracking-[0.02em] text-text md:text-lg md:leading-8'>
          Order Notes
        </h2>
        <p
          id='order-notes-description'
          className='text-sm font-medium leading-6 text-text-secondary'
        >
          Add any special instructions for your order.
        </p>
      </div>

      {/* Optional order instructions */}
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='order-notes'
          className='text-sm font-bold leading-7 -tracking-[0.02em] text-text'
        >
          Notes
        </label>

        <textarea
          id='order-notes'
          aria-describedby='order-notes-description'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder='Example: Please ring the doorbell...'
          rows={4}
          maxLength={500}
          className='w-full resize-none rounded-xl border border-border bg-surface-subtle px-3 py-2.5 text-sm font-medium leading-6 text-text outline-none transition-colors placeholder:text-text-muted focus:border-primary-100 focus:ring-2 focus:ring-ring/30 md:text-base'
        />
        <p
          className='text-right text-xs text-text-secondary'
          aria-live='polite'
        >
          {value.length}/500 characters
        </p>
      </div>
    </div>
  );
}
