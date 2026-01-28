import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type Review = {
  id?: number | string;
  _id?: string;
  productId?: string;
  userId?: string;
  rating?: number;
  comentario?: string;
};

export async function listReviews(): Promise<Review[]> {
  const response = await api.get<ApiResponse<Review[]>>("/reviews");
  return unwrapData(response);
}

export type CreateReviewPayload = {
  productId: string;
  userId: string;
  rating: number;
  comentario: string;
};

export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const response = await api.post<ApiResponse<Review>>("/reviews", payload);
  return unwrapData(response);
}
