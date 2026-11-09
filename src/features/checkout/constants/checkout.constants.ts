import bniLogo from '@/assets/BNI.svg';
import briLogo from '@/assets/BRI.svg';
import bcaLogo from '@/assets/BCA.svg';
import mandiriLogo from '@/assets/Mandiri.svg';
import type { BankOption } from '../types';

export const DELIVERY_FEE = 10_000;
export const SERVICE_FEE = 1_000;

export const BANK_OPTIONS: readonly BankOption[] = [
  {
    value: 'BNI Bank Negara Indonesia',
    label: 'Bank Negara Indonesia',
    logo: bniLogo,
  },
  {
    value: 'BRI Bank Rakyat Indonesia',
    label: 'BRI',
    logo: briLogo,
  },
  {
    value: 'BCA Virtual Account',
    label: 'BCA Virtual Account',
    logo: bcaLogo,
  },
  {
    value: 'Mandiri',
    label: 'Mandiri',
    logo: mandiriLogo,
  },
];
