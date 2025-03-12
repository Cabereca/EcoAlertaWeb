import { ImageOccurrence } from './ImageOccurrence';

export type Occurrence = {
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

export type OccurrenceCreate = {
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  feedback?: string;
  dateTime: Date;
  location: any;
  userId: string;
  employeeId?: string;
};

export type OccurrenceUpdate = Partial<OccurrenceCreate>;
export type OccurrenceUpdateStatus = {
  status: string;
  feedback?: string;
};
