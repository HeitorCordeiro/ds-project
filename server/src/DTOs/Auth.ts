import { z } from 'zod';

export const Auth = z.object({
  cnpj: z
    .string({
      invalid_type_error: 'O CNPJ deve ser uma string',
      required_error: 'O CNPJ é obrigatório',
    })
    .regex(/^\d{14}$/, { message: 'O CNPJ deve conter exatamente 14 dígitos numéricos' }),
  password: z
    .string({ invalid_type_error: 'A senha deve ser uma string' })
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
});

export type AuthType = z.infer<typeof Auth>;