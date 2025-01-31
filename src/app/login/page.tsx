'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { loginValidationSchema } from '@/helpers/validations';
import { api } from '@/services/api';
import { AuthUser, TLogin } from '@/utils/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginValidationSchema),
    reValidateMode: 'onSubmit',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const onSubmit = async (values: TLogin) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { data } = await api.post<AuthUser>('/auth/login', values);
      login(data);
      toast('Login efetuado com sucesso', { type: 'success' });
      router.push('/');
    } catch (error) {
      console.error(error);
      toast('Erro ao efetuar login', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {/* Logo */}
      <div className="mb-20 mt-4">
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 rounded bg-black"></div>
          <span className="text-xl font-medium">AgentesGPT</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-[400px] space-y-6">
        <h1 className="text-center text-2xl font-semibold mb-8">Bem vindo</h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <Input {...register('email')} id="email" placeholder="name@example.com" className="h-11" />
          </div>
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

          <div className="space-y-2">
            <label className="text-sm" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <Input
                {...register('password')}
                id="password"
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
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>

          <Button type="submit" className="w-full h-11 bg-black hover:bg-black/90">
            Entrar
          </Button>
        </form>

        <div className="text-center space-y-6">
          <div className="text-sm">
            Ainda não tem uma conta?{' '}
            <Link href="/signup" className="text-black font-semibold hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
