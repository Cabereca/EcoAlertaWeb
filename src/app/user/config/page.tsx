'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUserAuth } from '@/hooks/useAuth';
import { ChevronRight, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useUserAuth();

  const handleLogout = async () => {
    try {
      logout();

      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Erro ao sair',
        description: 'Ocorreu um erro ao tentar desconectar.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#e6ffe6] px-4 py-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* Perfil Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-xl font-medium">{user?.name}</h1>
        </div>

        {/* Menu de Navegação */}
        <nav className="space-y-2">
          <Link
            href="occurrences/my"
            className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-900">Minhas denúncias</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            href="config/edit"
            className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-900">Alterar informações</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 text-red-500 font-normal"
            onClick={handleLogout}
          >
            <span>Sair</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
