import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type CartItem = {
  product_id: string;
  nombre?: string;
  precio?: number;
  cantidad: number;
  subtotal?: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
  user_id?: string;
};

export type AddToCartPayload = {
  product_id: string;
  cantidad: number;
};

export async function getCart(): Promise<Cart> {
  const response = await api.get<ApiResponse<Cart>>("/cart");
  return unwrapData(response);
}

export async function addToCart(payload: AddToCartPayload) {
  const response = await api.post<ApiResponse<any>>("/cart", payload);
  return unwrapData(response);
}

export async function removeFromCart(productId: string) {
  const response = await api.delete<ApiResponse<any>>(`/cart/${productId}`);
  return unwrapData(response);
}
