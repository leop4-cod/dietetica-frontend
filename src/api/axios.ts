import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../types/api";
import { startLoading, stopLoading } from "./loading";

const RAW_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

export const STORAGE_TOKEN_KEY = "token";
export const STORAGE_USER_KEY = "user";

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  startLoading();
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    stopLoading();
    return response;
  },
  (error: AxiosError) => {
    stopLoading();
    const url = error.config?.url ?? "";
    const isAuthRequest = url.includes("/auth/login") || url.includes("/auth/register");
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
      window.dispatchEvent(new Event("auth:logout"));
      const isAdminPath = window.location.pathname.startsWith("/app/admin");
      const target = isAdminPath ? "/login/admin" : "/login/cliente";
      if (window.location.pathname !== target) {
        window.location.assign(target);
      }
    }
    return Promise.reject(error);
  }
);

export const unwrapData = <T>(response: { data: ApiResponse<T> | T }): T => {
  const payload = response.data as any;
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
};

export function getApiErrorMessage(error: unknown): string {
  const fallback = "No pudimos conectar con el servidor. Inténtalo de nuevo.";
  if (!error) return fallback;
  const axiosError = error as AxiosError<any>;
  const status = axiosError.response?.status;
  const apiMessage =
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message;

  if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
    return apiMessage;
  }
  if (Array.isArray(apiMessage) && apiMessage.length > 0) {
    return apiMessage.join(", ");
  }

  switch (status) {
    case 400:
      return "La solicitud es inválida.";
    case 401:
      return "Tu sesión expiró. Vuelve a iniciar sesión.";
    case 403:
      return "No tienes permisos para esta acción.";
    case 404:
      return "No encontramos el recurso solicitado.";
    case 409:
      return "Ya existe un registro con esos datos.";
    case 500:
      return "Ocurrió un error interno del servidor.";
    default:
      return fallback;
  }
}
