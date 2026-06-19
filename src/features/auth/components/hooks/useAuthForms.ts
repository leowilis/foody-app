import * as React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from '@/features/auth/schema';

// Formats Indonesian phone numbers to international format (62xxx).
const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  if (!digits.startsWith('62')) return '62' + digits;
  return digits;
};

/**
 * Handles sign-in form state, validation, and token storage.
 * Supports "Remember Me" via localStorage vs sessionStorage.
 */
export function useSignInForm() {
  const navigate = useNavigate();
  const [formError, setFormError] = React.useState('');

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema) as Resolver<SignInValues>,
    defaultValues: { email: '', password: '', remember: false },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setFormError('');
    try {
      const response = await api.post('/api/auth/login', {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token) {
        setFormError('Login failed. Please try again.');
        return;
      }

      const storage = data.remember ? localStorage : sessionStorage;
      const other = data.remember ? sessionStorage : localStorage;
      storage.setItem('auth_token', token);
      storage.setItem('auth_user', JSON.stringify(user ?? {}));
      other.removeItem('auth_token');
      other.removeItem('auth_user');

      form.reset();
      navigate('/');
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  return { form, onSubmit, formError };
}

/**
 * Handles sign-up form state, validation, and phone formatting.
 * Maps server-side field errors back to their respective form fields.
 */
export function useSignUpForm() {
  const navigate = useNavigate();
  const [formError, setFormError] = React.useState('');

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setFormError('');
    try {
      const response = await api.post('/api/auth/register', {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: formatPhone(data.phone),
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token) {
        setFormError('Registration failed. Please try again.');
        return;
      }

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user ?? {}));
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');

      form.reset();
      navigate('/');
    } catch (error) {
      const msg = getErrorMessage(error);
      const lower = msg.toLowerCase();
      if (lower.includes('email')) form.setError('email', { message: msg });
      else if (lower.includes('phone'))
        form.setError('phone', { message: msg });
      else if (lower.includes('password'))
        form.setError('password', { message: msg });
      else setFormError(msg);
    }
  });

  return { form, onSubmit, formError };
}
