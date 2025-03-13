'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginValidationSchema } from '@/helpers/validations';
import { useUserAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type TLogin = {
  email: string;
  password: string;
};

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
  const { login } = useUserAuth();

  const onSubmit = async (values: TLogin) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { data } = await api.post('/userLogin', values);
      login(data.user, data.token);
      toast('Login efetuado com sucesso', { type: 'success' });
      router.push('/user/home');
    } catch (error) {
      console.error(error);
      toast('Erro ao efetuar login', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Form Container */}
      <div className="w-full max-w-[400px] space-y-6">
        <div className="mb-12 flex justify-center">
          <Image src="leaf.svg" alt="Folha" width={100} height={100} />
        </div>

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

          <Button type="submit" className="w-full h-11 bg-green-500 hover:bg-green-600">
            Entrar
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <Link href="/admin/login" className="hover:text-green-600 hover:underline">
            Sou administrador
          </Link>
        </div>

        <div className="text-center space-y-6">
          <div className="text-sm">
            Ainda não tem uma conta?{' '}
            <Link href="/signup" className="text-green-500 font-semibold hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
