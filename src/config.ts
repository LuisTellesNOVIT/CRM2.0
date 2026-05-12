export const SHEET_ID =
  (import.meta.env.VITE_SHEET_ID as string | undefined) ||
  '1h8Z4pg3axi_VJVWiXAvK22ORSqy86xO_nqOGAR_zAW4';

export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
