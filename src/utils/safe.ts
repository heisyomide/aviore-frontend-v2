// src/utils/safe.ts

/* ====================== INTERNAL HELPERS ====================== */
const isNil = (val: unknown): val is null | undefined =>
  val === null || val === undefined;

const isFiniteNumber = (val: unknown): val is number =>
  typeof val === 'number' && Number.isFinite(val);

const cleanNumberString = (val: string): string =>
  val.replace(/[^\d.-]/g, '').trim();

/* ====================== SAFE NUMBER ====================== */
export const safeNumber = (
  val: unknown,
  fallback = 0
): number => {
  if (isNil(val)) return fallback;

  if (isFiniteNumber(val)) return val;

  if (typeof val === 'string') {
    const cleaned = cleanNumberString(val);

    // prevent parsing junk like "-" or "."
    if (!cleaned || cleaned === '-' || cleaned === '.') {
      return fallback;
    }

    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

/* ====================== SAFE STRING ====================== */
export const safeString = (
  val: unknown,
  fallback = ''
): string => {
  if (isNil(val)) return fallback;

  try {
    const str = String(val).trim();
    return str || fallback;
  } catch {
    return fallback;
  }
};

/* ====================== SAFE ARRAY ====================== */
export const safeArray = <T = unknown>(
  val: unknown,
  fallback: T[] = []
): T[] => {
  return Array.isArray(val) ? val : fallback;
};

/* ====================== SAFE OBJECT ====================== */
export const safeObject = <T extends Record<string, unknown>>(
  val: unknown,
  fallback: T = {} as T
): T => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as T;
  }
  return fallback;
};

/* ====================== SAFE BOOLEAN ====================== */
export const safeBoolean = (
  val: unknown,
  fallback = false
): boolean => {
  if (typeof val === 'boolean') return val;

  if (typeof val === 'string') {
    const normalized = val.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  if (typeof val === 'number') {
    return val > 0;
  }

  return fallback;
};

/* ====================== SAFE IMAGE ====================== */
export const safeImage = (
  val: unknown,
  fallback = '/placeholder.png'
): string => {
  if (isNil(val)) return fallback;

  if (typeof val === 'string') {
    const trimmed = val.trim();

    if (
      !trimmed ||
      trimmed === 'undefined' ||
      trimmed === 'null'
    ) {
      return fallback;
    }

    return trimmed;
  }

  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>;

    const possible =
      obj.url ||
      obj.imageUrl ||
      obj.src ||
      obj.path;

    if (typeof possible === 'string' && possible.trim()) {
      return possible.trim();
    }
  }

  return fallback;
};

/* ====================== FORMATTERS ====================== */
export const formatMoney = (
  val: unknown,
  currency = '₦',
  locale = 'en-NG'
): string => {
  const num = safeNumber(val, 0);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `${currency}${num.toLocaleString()}`;
  }
};

export const formatNumber = (
  val: unknown,
  locale = 'en-NG'
): string => {
  const num = safeNumber(val, 0);

  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch {
    return String(num);
  }
};