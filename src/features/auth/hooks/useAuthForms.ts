import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '@/types/user';
import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from '@/features/auth/schema';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/api-helpers';
import { setAuthSession } from '../authStorage';
import { AUTH_API } from '../constants/auth.constants';

type AuthResponse = {
  readonly success: true;
  readonly message: string;
  readonly data: {
    readonly token: string;
    readonly user: AuthUser;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAuthUser(value: unknown): value is AuthUser {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    Number.isFinite(value.id) &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.phone === 'string' &&
    (typeof value.avatar === 'string' || value.avatar === null)
  );
}

function isAuthResponse(value: unknown): value is AuthResponse {
  return (
    isRecord(value) &&
    value.success === true &&
    typeof value.message === 'string' &&
    isRecord(value.data) &&
    typeof value.data.token === 'string' &&
    value.data.token.trim().length > 0 &&
    isAuthUser(value.data.user)
  );
}

function getAuthSession(response: unknown): {
  token: string;
  user: AuthUser;
} {
  if (!isAuthResponse(response)) {
    throw new Error('Invalid authentication response. Please try again.');
  }

  return {
    token: response.data.token,
    user: response.data.user,
  };
}

// Formats Indonesian phone numbers to international format (62xxx).
const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }

  if (!digits.startsWith('62')) {
    return `62${digits}`;
  }

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
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setFormError('');

    try {
      const response = await api.post<unknown>(AUTH_API.LOGIN, {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      const { token, user } = getAuthSession(response.data);
      setAuthSession(token, user, data.remember);

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
      const response = await api.post<unknown>(AUTH_API.REGISTER, {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: formatPhone(data.phone),
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      const { token, user } = getAuthSession(response.data);
      setAuthSession(token, user, true);

      form.reset();
      navigate('/');
    } catch (error) {
      const message = getErrorMessage(error);
      const normalizedMessage = message.toLowerCase();

      if (normalizedMessage.includes('email')) {
        form.setError('email', { message });
      } else if (normalizedMessage.includes('phone')) {
        form.setError('phone', { message });
      } else if (normalizedMessage.includes('password')) {
        form.setError('password', { message });
      } else {
        setFormError(message);
      }
    }
  });

  return { form, onSubmit, formError };
}
