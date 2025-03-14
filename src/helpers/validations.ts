import { z } from 'zod';

const isValidPhone = (telefone: string) => {
  const phoneValidate = /^(\+\d{1,2}\s?)?(\()?\d{2,4}(\))?\s?(\d{4,5}(-|\s)?\d{4})$/;
  const isValid = phoneValidate.test(telefone);
  return isValid;
};

//  Função para validar o numero de registro
export const isValidRegistrationNumber = (registrationNumber: string) => {
  const registrationNumberValidate = /^[0-9.-]+$/;
  const isValid = registrationNumberValidate.test(registrationNumber);
  return isValid;
};

export const loginValidationSchema = z.object({
  email: z.string().min(1, { message: 'Email é obrigatório' }).email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

export const registerValidationSchema = z
  .object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }),
    cpf: z.string().min(1, { message: 'CPF é obrigatório' }),
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
      const cpf = data.cpf.replace(/\D/g, '');
      return cpf.length === 11;
    },
    {
      message: 'CPF inválido',
    }
  );

export const userEditValidationSchema = z.object({
  name: z.string({ message: 'O nome é obrigatório' }).min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'O email é obrigatório' }),
  phone: z.string().refine((data) => isValidPhone(data), { message: 'Invalid telephone number' }),
});
