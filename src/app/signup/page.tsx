'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerValidationSchema } from '@/helpers/validations';
import { TSignup } from '@/utils/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHookFormMask } from 'use-mask-input';

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      cpfOrCnpj: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(registerValidationSchema),
    reValidateMode: 'onSubmit',
  });
  const registerWithMask = useHookFormMask(register);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const router = useRouter();
  // const { login } = useAuth();

  const onSubmit = (values: TSignup) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log(values);

      // REMEBER TO CHECK IF THE CPF or CNPJ IS VALID
      // const { data } = await api.post<AuthUser>('/auth/register', data);
      // toast('Conta criada com sucesso', { type: 'success' });
      // login(data);
      // router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {/* Logo */}
      <div className="mb-20 mt-4">
        <div className="flex items-center gap-2 absolute top-4 left-4">
          <Image src="logo.svg" alt="Logo" width={50} height={50} className="h-12 w-12 rounded" />
          <span className="text-xl font-medium">T3A</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-[400px] space-y-6">
        <h1 className="text-center text-2xl font-semibold mb-8">Criar uma conta</h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="name">
              Nome completo
            </label>
            <Input {...register('name')} placeholder="Maria de Fátima" className="h-11" />
          </div>
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}

          <div className="space-y-2">
            <label className="text-sm" htmlFor="email">
              CPF / CNPJ
            </label>
            <Input
              {...registerWithMask('cpfOrCnpj', ['999.999.999-99', '99.999.999/9999-99'], {
                autoUnmask: true,
              })}
              placeholder="123.456.789-00"
              className="h-11"
            />
          </div>
          {errors.cpfOrCnpj && <span className="text-red-500 text-sm">{errors.cpfOrCnpj.message}</span>}

          <div className="space-y-2">
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <Input {...registerWithMask('email', 'email')} placeholder="name@example.com" className="h-11" />
          </div>
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

          <div className="space-y-2">
            <label className="text-sm" htmlFor="phone">
              Telefone
            </label>
            <Input
              {...registerWithMask('phone', ['(99) 9999-9999', '(99) 99999-9999'], {
                autoUnmask: true,
              })}
              type="tel"
              placeholder="(11) 91111-1111"
              className="h-11"
            />
          </div>
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}

          <div className="space-y-2">
            <label className="text-sm" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                className="h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

          <div className="space-y-2">
            <label className="text-sm" htmlFor="confirmPassword">
              Confirmar Senha
            </label>
            <div className="relative">
              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmar Senha"
                className="h-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}

          <Button type="submit" className="w-full h-11 bg-black hover:bg-black/90">
            Cadastrar
          </Button>
        </form>

        <div className="text-center space-y-6">
          <div className="text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-black font-semibold hover:underline">
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
