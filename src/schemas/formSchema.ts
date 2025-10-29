import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, {message: "Campo nome é obrigatorio e deve conter mais que 10 caracteres"}),
  price: z.any(),
  description: z.string().min(20, {message: "Campo descrição precia ter no minimo 20 caracteres obrigatorio"}),
  image: z.string().optional(),
  categoryId: z.string().min(1, {message: "Campo categoria é obrigatorio"}),
});

export type ProductSchema = z.infer<typeof productFormSchema>;