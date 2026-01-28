import { api } from "../axios";

export type Role = "ADMIN" | "EDITOR" | "OPERADOR" | "CLIENTE";

export type User = {
  id: string | number;
  nombre?: string;
  name?: string;
  email?: string;
  role?: Role | string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};

export type RegisterBody = {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  rol?: "cliente";
};

export type RegisterResponse = {
  message?: string;
  user?: User;
};

const extractAuthData = (data: any): LoginResponse => {
  const raw = data?.data ?? data ?? {};
  return {
    accessToken: raw.accessToken ?? raw.access_token ?? raw.token ?? "",
    user: raw.user ?? raw.usuario ?? raw.profile ?? {},
  };
};

export async function login(body: LoginBody): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", body);
  return extractAuthData(data);
}

export async function me(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data?.data ?? data ?? {};
}

const extractRegisterData = (data: any): RegisterResponse => {
  const raw = data?.data ?? data ?? {};
  return {
    message: raw.message ?? raw?.data?.message ?? raw?.data?.msg,
    user: raw.user ?? raw?.data?.user ?? raw?.usuario,
  };
};

export async function register(body: RegisterBody): Promise<RegisterResponse> {
  const { data } = await api.post("/auth/register", body);
  return extractRegisterData(data);
}
