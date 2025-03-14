'use client';

import { OccurrenceCard } from '@/components/OccurrenceCard';
import { CreateOccurrenceModal } from '@/components/modal/createOccurrence';
import api from '@/services/api';
import { Occurrence } from '@/types/Occurrence';
import { Leaf, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function OccurrencesPage() {
  const [occurrences, setOccurrences] = useState<Occurrence[] | undefined>(undefined);

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
        console.error(error);
        toast.error('Não foi possível buscar as ocorrências, tente novamente mais tarde.');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#e6ffe6]">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link className="w-12 h-12 bg-green-500 rounded-full mr-4 flex items-center justify-center" href="/user/home">
            <Leaf className="w-6 h-6 text-white m-auto" />
          </Link>
          <h1 className="text-lg font-medium">Todas as denúncias</h1>
        </div>
        <Link className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center" href="config">
          <User className="w-6 h-6 text-gray-600 m-auto" />
        </Link>
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
