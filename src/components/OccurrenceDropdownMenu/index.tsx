'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/services/api';
import dayjs from 'dayjs';
import { ArrowLeft, ArrowRight, Calendar, Edit, Info, MapPin, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

interface OccurrenceDropdownMenuProps {
  occurrence: Occurrence;
  onDelete?: (id: string) => Promise<void>;
  editable?: boolean;
}

export function OccurrenceDropdownMenu({ occurrence, onDelete, editable }: OccurrenceDropdownMenuProps) {
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/occurrences/edit/${occurrence.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(occurrence.id);
      }
    } catch (error) {
      console.error('Error deleting occurrence:', error);
    } finally {
      setIsDeleting(false);
      setShowDetails(false);
    }
  };

  const getStatusColor = (status: Occurrence['status']) => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'CLOSED':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Occurrence['status']) => {
    switch (status) {
      case 'OPEN':
        return 'Aberta';
      case 'IN_PROGRESS':
        return 'Em Progresso';
      case 'CLOSED':
        return 'Fechada';
      default:
        return status;
    }
  };

  const handleGoToNextImage = () => {
    if (occurrence.images && occurrence.images.length > 0) {
      setImageIndex((prevIndex) => {
        if (occurrence.images && prevIndex === occurrence.images.length - 1) {
          return 0;
        }

        return prevIndex + 1;
      });
    }
  };

  const handleGetImage = (path: string) => {
    return `${api.defaults.baseURL}images/${path}`;
  };

  const handleGoToPreviousImage = () => {
    if (occurrence.images && occurrence.images.length > 0) {
      setImageIndex((prevIndex) => {
        if (occurrence.images && prevIndex === 0) {
          return occurrence.images.length - 1;
        }

        return prevIndex - 1;
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowDetails(true)}>
            <Info className="mr-2 h-4 w-4" />
            Ver detalhes
          </DropdownMenuItem>
          {editable && (
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onClick={() => setShowDetails(true)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Deletar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{occurrence.title}</DialogTitle>
            <DialogDescription>
              <div className="mt-2">
                <Badge className={getStatusColor(occurrence.status)}>{getStatusText(occurrence.status)}</Badge>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium flex items-center gap-1">
                <Info className="h-4 w-4" /> Descrição
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{occurrence.description}</p>
            </div>

            {occurrence.feedback && (
              <div>
                <h4 className="text-sm font-medium">Feedback</h4>
                <p className="text-sm text-muted-foreground mt-1">{occurrence.feedback}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Data da Ocorrência
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {dayjs(occurrence.dateTime).format("DD 'de' MMMM 'de' YYYY, HH:mm")}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium flex items-center gap-1">
                <MapPin className="h-4 w-4" /> Localização
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Lat: {occurrence.location.lat.toFixed(6)}, Lng: {occurrence.location.lng.toFixed(6)}
              </p>
            </div>

            {occurrence.images && occurrence.images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium">Imagens</h4>
                <div className="grid grid-cols-3 gap-2 mt-1 relative">
                  {occurrence.images && occurrence.images.length > 0 && (
                    <>
                      <Image
                        key={occurrence.images[imageIndex].id}
                        src={handleGetImage(occurrence?.images[imageIndex].path) || '/placeholder.svg'}
                        alt="Imagem da ocorrência"
                        width={100}
                        height={100}
                        sizes="100px"
                        className="w-full h-20 object-cover rounded-md"
                      />

                      {occurrence && occurrence.images.length > 1 && (
                        <>
                          <button
                            onClick={handleGoToPreviousImage}
                            className="absolute top-0 left-0 w-12 h-12 rounded-full bg-black bg-opacity-50 flex justify-center items-center"
                          >
                            <ArrowLeft size={24} />
                          </button>

                          <button
                            onClick={handleGoToNextImage}
                            className="absolute top-0 right-0 w-12 h-12 rounded-full bg-black bg-opacity-50 flex justify-center items-center"
                          >
                            <ArrowRight size={24} />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex sm:justify-between">
            {editable && (
              <Button type="button" variant="outline" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>Deletando...</>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
