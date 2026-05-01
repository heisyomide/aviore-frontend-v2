// schemas/product.schema.ts
import { z } from 'zod';

export const variantSchema = z.object({
  color: z.string().min(1),
  sizes: z.array(z.string()).min(1),
  images: z.array(z.string()).min(1),
});

export const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  price: z.number().positive(),
  stock: z.number().min(0),
  categoryId: z.string().min(1),

  origin: z.enum(['LOCAL', 'INTERNATIONAL']),

  deliveryMin: z.number().optional(),
  deliveryMax: z.number().optional(),

  images: z.array(z.string()).max(4),
  variants: z.array(variantSchema).min(1),
}).refine((data) => {
  if (data.origin === 'INTERNATIONAL') {
    return data.deliveryMin && data.deliveryMax;
  }
  return true;
}, {
  message: 'International products need delivery range',
});