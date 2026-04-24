// utils/safe.ts
export const safeNumber = (val: any, fallback = 0): number => {
  if (val === null || val === undefined) return fallback;
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};

export const safeString = (val: any, fallback = ''): string => {
  if (val === null || val === undefined) return fallback;
  return String(val);
};