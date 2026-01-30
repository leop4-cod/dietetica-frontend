import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type PlanReservation = {
  id?: string;
  _id?: string;
  planId: string;
  userId: string;
  planObjetivo?: string;
  planCalorias?: number;
  status?: string;
  createdAt?: string;
};

export async function listPlanReservations(): Promise<PlanReservation[]> {
  const response = await api.get<ApiResponse<PlanReservation[]>>("/plan-reservations");
  return unwrapData(response);
}

export async function createPlanReservation(payload: {
  planId: string;
  userId?: string;
}): Promise<PlanReservation> {
  const response = await api.post<ApiResponse<PlanReservation>>("/plan-reservations", payload);
  return unwrapData(response);
}
