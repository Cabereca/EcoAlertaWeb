'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUserAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { Occurrence } from '@/types/Occurrence';
import { ArrowLeft, ChevronDown, ChevronUp, Edit2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MinhasDenunciasPage() {
  const router = useRouter();
  const { user } = useUserAuth();
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [occurrences, setOccurrences] = useState<Occurrence[] | undefined>(undefined);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEdit = (occurrence: Occurrence) => {
    router.push(`edit/${occurrence.id}`);
  };

  const handleClose = async (occurrence: Occurrence) => {
    try {
      await api.delete(`/occurrence/${occurrence.id}`);

      toast({
        title: 'Sucesso',
        description: 'Denúncia fechada com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível fechar a denúncia.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: Occurrence['status']) => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'IN_PROGRESS':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'CLOSED':
        return 'bg-green-500 hover:bg-green-600';
    }
  };

  const getStatusText = (status: Occurrence['status']) => {
    switch (status) {
      case 'OPEN':
        return 'Aberta';
      case 'IN_PROGRESS':
        return 'Em Andamento';
      case 'CLOSED':
        return 'Fechada';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    (async () => {
      try {
        console.log(user);
        const { data } = await api.get<Occurrence[]>(`/occurrence/byUser/${user?.id}`);

        setOccurrences(data);

        toast({
          title: 'Sucesso',
          description: 'Denúncias carregadas com sucesso!',
        });
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as denúncias.',
          variant: 'destructive',
        });
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="text-gray-800 h-5 w-5" />
          </button>
          <h1 className="text-gray-800 text-lg font-semibold">Minhas denúncias</h1>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-3xl mx-auto">
        {occurrences?.map((occurrence) => (
          <Card key={occurrence.id} className="overflow-hidden">
            <CardHeader
              className="p-4 cursor-pointer flex flex-row items-center justify-between"
              onClick={() => handleToggleExpand(occurrence.id)}
            >
              <h3 className="font-medium text-gray-800">{occurrence.title}</h3>
              {expandedId === occurrence.id ? (
                <ChevronUp className="text-gray-500 h-5 w-5" />
              ) : (
                <ChevronDown className="text-gray-500 h-5 w-5" />
              )}
            </CardHeader>

            {expandedId === occurrence.id && (
              <CardContent className="p-4 border-t border-gray-200 space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Status</p>
                  <Badge className={getStatusColor(occurrence.status)}>{getStatusText(occurrence.status)}</Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Descrição</p>
                  <p className="text-gray-800">{occurrence.description}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Data</p>
                  <p className="text-gray-800">{formatDate(occurrence.dateTime)}</p>
                </div>

                {occurrence.feedback && (
                  <div className="space-y-2">
                    <p className="text-gray-500 text-sm">Feedback</p>
                    <p className="text-gray-800">{occurrence.feedback}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600" onClick={() => handleEdit(occurrence)}>
                    <Edit2 className="text-white mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    className="flex-1 bg-red-500 hover:bg-red-600"
                    onClick={() => handleClose(occurrence)}
                    disabled={occurrence.status === 'CLOSED'}
                  >
                    <XCircle className="text-white mr-2 h-4 w-4" />
                    Fechar
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </main>
    </div>
  );
}
