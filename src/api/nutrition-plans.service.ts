import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type NutritionPlan = {
  id?: number | string;
  _id?: string;
  nombre?: string;
  descripcion?: string;
  duracion?: string;
  precio?: number;
  userId?: string;
  objetivo?: string;
  calorias_diarias?: number;
  recomendaciones?: string[];
};

export async function listNutritionPlans(): Promise<NutritionPlan[]> {
  const response = await api.get<ApiResponse<NutritionPlan[]>>("/nutrition-plans");
  return unwrapData(response);
}

export async function createNutritionPlan(payload: NutritionPlan): Promise<NutritionPlan> {
  const response = await api.post<ApiResponse<NutritionPlan>>("/nutrition-plans", payload);
  return unwrapData(response);
}

export async function updateNutritionPlan(
  id: string,
  payload: Partial<NutritionPlan>
): Promise<NutritionPlan> {
  const response = await api.patch<ApiResponse<NutritionPlan>>(`/nutrition-plans/${id}`, payload);
  return unwrapData(response);
}

export async function deleteNutritionPlan(id: string) {
  const response = await api.delete<ApiResponse<unknown>>(`/nutrition-plans/${id}`);
  return unwrapData(response);
}
