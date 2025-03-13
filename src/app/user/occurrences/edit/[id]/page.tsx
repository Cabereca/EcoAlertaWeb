'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import { Occurrence } from '@/types/Occurrence';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Validação do formulário
const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']),
  feedback: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

async function fetchOccurrence(id: string) {
  return api.get<Occurrence>(`/occurrence/${id}`);
}

export default function EditOccurrencePage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Função simulada para atualizar uma ocorrência
  async function updateOccurrence(id: string, data: FormValues) {
    try {
      await api.put(`/occurrence/${id}`, data);
      toast({
        title: 'Sucesso',
        description: 'Ocorrência atualizada com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar a ocorrência.',
        variant: 'destructive',
      });
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'OPEN',
      feedback: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    try {
      await updateOccurrence(params.id as string, values);
      router.push('/user/occurrrences/my');
      router.refresh();
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchOccurrence(params.id as string);
        setOccurrence(data);
        console.log(data);

        // Preencher o formulário com os dados
        form.reset({
          title: data.title,
          description: data.description,
          status: data.status,
          feedback: data.feedback || '',
        });
      } catch (error) {
        console.error('Erro ao carregar ocorrência:', error);
      }
    })();
  }, [params.id, form]);

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
          {occurrence ? (
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
