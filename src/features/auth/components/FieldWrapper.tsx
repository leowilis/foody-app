import type { ReactNode } from 'react';

interface FieldWrapperProps {
  children: ReactNode;
  error?: string;
}

// Wraps a form field and connects validation errors to the field.
export default function FieldWrapper({ children, error }: FieldWrapperProps) {
  return (
    <div>
      {children}

      {error && (
        <p role='alert' className='mt-1 text-xs text-error'>
          {error}
        </p>
      )}
    </div>
  );
}
