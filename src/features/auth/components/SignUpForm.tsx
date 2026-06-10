import * as React from 'react';
import { motion } from 'framer-motion';
import { useSignUpForm } from '@/features/auth/components/hooks/useAuthForms';
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

export default function SignUpForm() {
  const { form, onSubmit, formError } = useSignUpForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <motion.form
      key='signup'
      onSubmit={onSubmit}
      className='flex flex-col gap-4 md:gap-5'
      {...fadeSlide}
    >
      <FieldWrapper error={errors.name?.message}>
        <input
          type='text'
          placeholder='Full Name'
          {...register('name')}
          className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
        />
      </FieldWrapper>

      <FieldWrapper error={errors.email?.message}>
        <input
          type='email'
          placeholder='Email'
          {...register('email')}
          className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
        />
      </FieldWrapper>

      <FieldWrapper error={errors.phone?.message}>
        <input
          type='tel'
          placeholder='Phone (e.g. 081234567890)'
          {...register('phone')}
          className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
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

      <FieldWrapper error={errors.confirmPassword?.message}>
        <div className='relative'>
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder='Confirm Password'
            {...register('confirmPassword')}
            className={`${inputBase} pr-14 ${errors.confirmPassword ? inputError : inputNormal}`}
          />
          <EyeToggle
            show={showConfirm}
            onToggle={() => setShowConfirm((s) => !s)}
          />
        </div>
      </FieldWrapper>

      {formError && <p className='text-sm text-red-600'>{formError}</p>}

      <SubmitButton loading={isSubmitting} label='Register' />
    </motion.form>
  );
}
