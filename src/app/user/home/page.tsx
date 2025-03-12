'use client';

import { OccurrenceCard } from '@/components/OccurrenceCard';
import { CreateOccurrenceModal } from '@/components/modal/createOccurrence';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import { Occurrence } from '@/types/Occurrence';
import { useEffect, useState } from 'react';

export default function OccurrencesPage() {
  const [occurrences, setOccurrences] = useState<Occurrence[] | undefined>(undefined);
  const { toast } = useToast();

  const handleCreateSuccess = async () => {
    // Simulação de adição de uma nova ocorrência
    const { data } = await api.get<Occurrence[]>('/occurrence/all');

    setOccurrences(data);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Occurrence[]>('/occurrence/all');

        setOccurrences(data);
      } catch (error) {
        toast({
          title: 'Erro ao buscar as ocorrências',
          description: 'Não foi possível buscar as ocorrências, tente novamente mais tarde',
          status: 'error',
        });
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#e6ffe6]">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-500 rounded-full mr-4"></div>
          <h1 className="text-lg font-medium">Todas as denúncias</h1>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      </header>

      <main className="container p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {occurrences?.map((occurrence) => (
            <OccurrenceCard key={occurrence.id} occurrence={occurrence} />
          ))}
        </div>
      </main>

      <CreateOccurrenceModal onSuccess={handleCreateSuccess} />
    </div>
  );
}
