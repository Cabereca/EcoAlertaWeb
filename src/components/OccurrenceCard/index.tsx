import { OccurrenceDropdownMenu } from '@/components/OccurrenceDropdownMenu';
import api from '@/services/api';
import { Occurrence } from '@/types/Occurrence';
import dayjs from 'dayjs';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface OccurrenceCardProps {
  occurrence: Occurrence;
}

export function OccurrenceCard({ occurrence }: OccurrenceCardProps) {
  const [imageIndex, setImageIndex] = useState(0);

  const formattedDate = dayjs(occurrence.dateTime).format('DD/MM/YYYY');

  const handleGetImage = (path: string) => {
    return `${api.defaults.baseURL}images/${path}`;
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
    <div className="relative rounded-lg overflow-hidden border border-black">
      <div className="aspect-square bg-gray-200 relative">
        {occurrence.images && occurrence.images.length > 0 ? (
          <>
            <Image
              src={handleGetImage(occurrence.images[imageIndex].path) || '/placeholder.svg'}
              alt={occurrence.title}
              fill
              className="object-cover"
            />

            <button
              onClick={handleGoToPreviousImage}
              className="absolute top-1/2 left-0 w-12 h-12 rounded-full bg-black bg-opacity-50 flex justify-center items-center"
            >
              <ArrowLeft size={24} />
            </button>

            <button
              onClick={handleGoToNextImage}
              className="absolute top-1/2 right-0 w-12 h-12 rounded-full bg-black bg-opacity-50 flex justify-center items-center"
            >
              <ArrowRight size={24} />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">Sem imagem</span>
          </div>
        )}
      </div>
      <div className="p-2 bg-black text-white flex justify-between items-center">
        <div>
          <div className="font-medium">{occurrence.title}</div>
          <div className="text-xs">{formattedDate}</div>
        </div>
        <OccurrenceDropdownMenu occurrence={occurrence} />
      </div>
    </div>
  );
}
