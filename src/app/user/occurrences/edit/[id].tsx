'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Occurrence = {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  feedback?: string;
  dateTime: Date;
  created_at: Date;
  updated_at: Date;
  location: {
    lat: number;
    lng: number;
  };
  userId: string;
  employeeId?: string;
  images?: ImageOccurrence[];
};

type ImageOccurrence = {
  id: string;
  path: string;
  created_at: Date;
  updated_at: Date;
  occurrenceId: string;
};

// Validação do formulário
const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']),
  feedback: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Função simulada para buscar uma ocorrência
async function fetchOccurrence(id: string): Promise<Occurrence> {
  // Aqui você substituiria por uma chamada real à sua API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: 'Ocorrência X',
        description: 'Descrição detalhada da ocorrência ambiental',
        status: 'OPEN',
        dateTime: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        location: { lat: -23.5505, lng: -46.6333 },
        userId: 'user123',
        images: [
          {
            id: 'img1',
            path: '/placeholder.svg?height=300&width=300',
            created_at: new Date(),
            updated_at: new Date(),
            occurrenceId: id,
          },
        ],
      });
    }, 1000);
  });
}

// Função simulada para atualizar uma ocorrência
async function updateOccurrence(id: string, data: FormValues): Promise<Occurrence> {
  // Aqui você substituiria por uma chamada real à sua API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...data,
        id,
        dateTime: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        location: { lat: -23.5505, lng: -46.6333 },
        userId: 'user123',
      } as Occurrence);
    }, 1000);
  });
}

export default function EditOccurrencePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'OPEN',
      feedback: '',
    },
  });

  useEffect(() => {
    async function loadOccurrence() {
      try {
        const data = await fetchOccurrence(params.id);
        setOccurrence(data);

        // Preencher o formulário com os dados
        form.reset({
          title: data.title,
          description: data.description,
          status: data.status,
          feedback: data.feedback || '',
        });
      } catch (error) {
        console.error('Erro ao carregar ocorrência:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadOccurrence();
  }, [params.id, form]);

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    try {
      await updateOccurrence(params.id, values);
      router.push('/occurrences');
      router.refresh();
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Denúncia</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : occurrence ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OPEN">Aberta</SelectItem>
                          <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                          <SelectItem value="CLOSED">Fechada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feedback (opcional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Adicione um feedback sobre esta denúncia" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">Informações adicionais</div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Data da ocorrência:</span>
                      <div>
                        {occurrence.dateTime
                          ? dayjs(occurrence.dateTime).format("DD 'de' MMMM 'de' YYYY")
                          : 'Não disponível'}
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Localização:</span>
                      <div>
                        Lat: {occurrence.location.lat.toFixed(4)}, Lng: {occurrence.location.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="py-4 text-center text-muted-foreground">Ocorrência não encontrada</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
