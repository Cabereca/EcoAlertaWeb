export type ImageOccurrence = {
  id: string;
  path: string;
  created_at: Date;
  updated_at: Date;
  occurrenceId: string;
};

export type ImageOccurrenceCreate = {
  path: string;
  occurrenceId: string;
};

export type ImageOccurrenceUpdate = Partial<ImageOccurrenceCreate>;
