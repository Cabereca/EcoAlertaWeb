export type TUser = {
  id: string;
  name: string;
  cpf?: string;
  cnpj?: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export type AuthUser = {
  token: string;
  user: TUser;
};

export type TLogin = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  data?: AuthUser;
  success?: boolean;
};

export type TSignup = {
  name: string;
  cpfOrCnpj: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};
