import * as React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { useSignInForm } from '@/features/auth/hooks/useAuthForms';
import FieldWrapper from './FieldWrapper';
import EyeToggle from './EyeToggle';
import SubmitButton from './SubmitButton';

const fadeSlide = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

const inputBase =
  'h-12 md:h-14 w-full rounded-2xl border bg-white px-3 text-base outline-none placeholder:text-neutral-500 placeholder:-tracking-[0.02em]';
const inputNormal = 'border-neutral-200 focus:border-neutral-300';
const inputError = 'border-red-400 focus:border-red-400';

export default function SignInForm() {
  const { form, onSubmit, formError } = useSignInForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form;

  return (
    <motion.form
      key='signin'
      onSubmit={onSubmit}
      className='flex flex-col gap-4 md:gap-5'
      {...fadeSlide}
    >
      <FieldWrapper error={errors.email?.message}>
        <input
          type='email'
          placeholder='Email'
          {...register('email')}
          className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
        />
      </FieldWrapper>

      <FieldWrapper error={errors.password?.message}>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            {...register('password')}
            className={`${inputBase} pr-14 ${errors.password ? inputError : inputNormal}`}
          />
          <EyeToggle
            show={showPassword}
            onToggle={() => setShowPassword((s) => !s)}
          />
        </div>
      </FieldWrapper>

      <label className='flex cursor-pointer select-none items-center gap-3'>
        <Checkbox
          checked={watch('remember')}
          onCheckedChange={(checked) => setValue('remember', Boolean(checked))}
          className='h-6 w-6 cursor-pointer rounded-md border-neutral-300 data-[state=checked]:border-primary-100 data-[state=checked]:bg-primary-100'
        />
        <span className='text-[14px] font-medium leading-7 -tracking-[0.03em] text-neutral-900 md:text-[16px] md:leading-7.5'>
          Remember Me
        </span>
      </label>

      {formError && <p className='text-sm text-red-600'>{formError}</p>}

      <SubmitButton loading={isSubmitting} label='Login' />
    </motion.form>
  );
}
