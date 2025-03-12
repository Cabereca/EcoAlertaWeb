import { Occurrence } from './Occurrence';

export type Employee = {
  id: string;
  registrationNumber: string;
  name: string;
  email: string;
  phone: string;
  occurrence: Occurrence[];
};

export type EmployeeCreate = {
  registrationNumber: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type EmployeeUpdate = Partial<EmployeeCreate>;
