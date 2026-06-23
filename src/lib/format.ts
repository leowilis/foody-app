import dayjs from 'dayjs';
import 'dayjs/locale/id';

// Formats a number as Indonesian Rupiah currency.
export const formatRupiah = (value: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

// Formats an ISO date string to a localized Indonesian date-time.
export const formatDate = (iso: string): string =>
  dayjs(iso).locale('id').format('DD MMM YYYY, HH:mm');
