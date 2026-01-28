import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../types/api";

const RAW_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

export const STORAGE_TOKEN_KEY = "consulta_dietetica_token";
export const STORAGE_USER_KEY = "consulta_dietetica_user";

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const unwrapData = <T>(response: { data: ApiResponse<T> }): T => response.data.data;

export function getApiErrorMessage(error: unknown): string {
  const fallback = "No pudimos conectar con el servidor. Intentalo de nuevo.";
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
      return "La solicitud es invalida.";
    case 401:
      return "Tu sesion expiro. Volve a iniciar sesion.";
    case 403:
      return "No tenes permisos para esta accion.";
    case 404:
      return "No encontramos el recurso solicitado.";
    case 409:
      return "Ya existe un registro con esos datos.";
    case 500:
      return "Ocurrio un error interno del servidor.";
    default:
      return fallback;
  }
}
