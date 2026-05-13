import type { Currency } from '@/types';

export const SHEET_ID =
  (import.meta.env.VITE_SHEET_ID as string | undefined) ||
  '1h8Z4pg3axi_VJVWiXAvK22ORSqy86xO_nqOGAR_zAW4';

export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;

// Moneda base en la que vienen los montos del sheet. La app internamente
// almacena todo en PEN (la moneda histórica del prototipo) y convierte
// con FX_PEN_USD al renderizar. Si tu sheet ya está en USD, ponlo aquí.
export const SHEET_BASE_CURRENCY: Currency =
  (import.meta.env.VITE_SHEET_CURRENCY as Currency | undefined) || 'USD';
