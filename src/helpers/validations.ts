import { z } from 'zod';

export const loginValidationSchema = z.object({
  email: z.string().min(1, { message: 'Email é obrigatório' }).email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

export const registerValidationSchema = z
  .object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }),
    cpfOrCnpj: z.string().min(1, { message: 'CPF/CNPJ é obrigatório' }),
    email: z.string().min(1, { message: 'Email é obrigatório' }).email({ message: 'Email inválido' }),
    phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
    password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'Confirmação de senha deve ter no mínimo 6 caracteres' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      const cpf = data.cpfOrCnpj.replace(/\D/g, '');
      return cpf.length === 11 || cpf.length === 14;
    },
    {
      message: 'CPF/CNPJ inválido',
    }
  );
