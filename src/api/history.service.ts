import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type Appointment = {
  _id?: string;
  id?: string;
  userId: string;
  tipo?: string;
  cita_fecha: string;
  motivo: string;
  estado?: string;
  especialista?: string;
};

export type CreateAppointmentPayload = {
  userId: string;
  cita_fecha: string;
  motivo: string;
  estado?: string;
  especialista?: string;
};

export async function listAppointments(userId?: string): Promise<Appointment[]> {
  const response = await api.get<ApiResponse<Appointment[]>>("/history/appointments", {
    params: userId ? { userId } : undefined,
  });
  return unwrapData(response);
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
  const response = await api.post<ApiResponse<Appointment>>("/history/appointments", payload);
  return unwrapData(response);
}
