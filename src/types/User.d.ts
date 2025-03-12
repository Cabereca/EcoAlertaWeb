import { Occurrence } from './Occurrence';

export type User = {
  id: string;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  occurrence: Occurrence[];
};

export type UserCreate = {
  cpf: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type UserUpdate = Partial<UserCreate>;
