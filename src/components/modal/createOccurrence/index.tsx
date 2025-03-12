'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import api from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, CalendarIcon, Camera, Check, Loader2, Plus, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Esquema de validação
const occurrenceCreateValidationSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  dateTime: z.date({
    required_error: 'Por favor selecione uma data e hora',
  }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

type FormData = z.infer<typeof occurrenceCreateValidationSchema>;

// Carregamento dinâmico do componente Map para evitar erros de SSR
const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-100 rounded-md flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

interface CreateOccurrenceModalProps {
  onSuccess?: () => void;
}

export function CreateOccurrenceModal({ onSuccess }: CreateOccurrenceModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Dados básicos, 2: Localização
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Valores padrão para o formulário
  const defaultValues = {
    title: '',
    description: '',
    dateTime: new Date(),
    location: {
      lat: -23.5505,
      lng: -46.6333,
    },
  };

  const form = useForm<FormData>({
    resolver: zodResolver(occurrenceCreateValidationSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Reset o formulário e o estado quando o modal é fechado
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        form.reset(defaultValues);
        setImages([]);
      }, 300);
    }
  }, [open, form]);

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('dateTime', data.dateTime.toISOString());
      formData.append('location', `${data.location.lat} ${data.location.lng}`);
      formData.append('status', 'OPEN');
      formData.append('userId', user?.user.id || '');
      images.forEach((image) => {
        formData.append('images', image);
      });

      await api.post('/occurrence', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Denúncia efetuada com sucesso!',
        description: 'Sua denúncia foi enviada com sucesso e será analisada.',
      });

      // Resetar formulário e fechar modal
      form.reset(defaultValues);
      setImages([]);
      setOpen(false);
      setStep(1);

      // Callback de sucesso
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao enviar denúncia:', error);
      toast({
        title: 'Erro ao enviar denúncia',
        description: 'Ocorreu um erro ao enviar sua denúncia. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files);
    setImages((prev) => [...prev, ...newImages]);

    // Limpar input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = async () => {
    // Validar os campos da primeira etapa antes de avançar
    const result = await form.trigger(['title', 'description', 'dateTime']);
    if (result) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-14 h-14 rounded-full bg-[#6fcfff] flex items-center justify-center text-white text-2xl shadow-lg fixed bottom-6 right-6">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {step === 1 ? 'Nova Denúncia' : 'Selecione a Localização'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Indicador de etapas */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 1 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'
                  }`}
                >
                  1
                </div>
                <div className={`h-1 w-10 ${step === 1 ? 'bg-gray-300' : 'bg-green-500'}`}></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 2 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'
                  }`}
                >
                  2
                </div>
              </div>
            </div>

            {step === 1 ? (
              /* Etapa 1: Dados básicos */
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título da ocorrência" {...field} />
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
                      <FormLabel className="font-medium">Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva a ocorrência em detalhes" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-medium">Data e Hora</FormLabel>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  const newDate = new Date(date);
                                  // Preservar a hora atual ao selecionar uma nova data
                                  if (field.value) {
                                    newDate.setHours(field.value.getHours(), field.value.getMinutes());
                                  }
                                  field.onChange(newDate);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormControl>
                          <Input
                            type="time"
                            className="w-32"
                            value={field.value ? format(field.value, 'HH:mm') : ''}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              const newDate = new Date(field.value);
                              newDate.setHours(hours, minutes);
                              field.onChange(newDate);
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel className="font-medium">Imagens</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={URL.createObjectURL(image) || '/placeholder.svg'}
                          alt={`Imagem ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="aspect-square bg-gray-100 rounded-md flex flex-col justify-center items-center gap-1 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                      onClick={handleAddImage}
                    >
                      <Camera className="h-6 w-6 text-gray-500" />
                      <span className="text-xs text-gray-500">Adicionar</span>
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" className="w-full bg-green-500 hover:bg-green-600" onClick={handleNextStep}>
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              /* Etapa 2: Localização */
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Selecione a localização da ocorrência</FormLabel>
                      <FormControl>
                        <div className="h-[400px] w-full rounded-md overflow-hidden">
                          <MapComponent value={field.value || defaultValues.location} onChange={field.onChange} />
                        </div>
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <div className="text-sm text-muted-foreground mt-2">
                          Localização selecionada: Lat: {field.value.lat?.toFixed(6)}, Lng:{' '}
                          {field.value.lng?.toFixed(6)}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Finalizar
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
