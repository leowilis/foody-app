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

/**
 * Sanitizes and formats Indonesian phone numbers into the international standard format.
 * Strips non-digit characters and ensures the string starts with country code '62'.
 */
const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  if (!digits.startsWith('62')) return '62' + digits;
  return digits;
};

/**
 * Custom React hook orchestration for handling the Sign-In (Login) form state and lifecycle.
 * Manages form initialization, Zod schema validation, network submission, and token storage orchestration.
 *
 * Includes logical handling for the "Remember Me" toggle to isolate authorization data between
 * `localStorage` (persistent) and `sessionStorage` (temporary).
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
 * Custom React hook orchestration for handling the Sign-Up (Registration) form state and lifecycle.
 * Manages initialization for new user profiles, phone normalization, and processes input validation.
 *
 * Integrates an advanced error catching engine that automatically parses back-end server messages
 * and maps validation failures directly onto their respective fields (`email`, `phone`, `password`)
 * inside the React Hook Form UI register.
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
