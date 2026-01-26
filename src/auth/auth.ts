import { api } from "../api/https";

export type Role = "ADMIN" | "EDITOR" | "OPERADOR" | "CLIENTE";

type LoginBody = { email: string; password: string };
type LoginRes = { data: { access_token: string; user: any } };

export async function login(body: LoginBody) {
  const res = await api<LoginRes>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  localStorage.setItem("token", res.data.access_token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isAuthed() {
  return Boolean(localStorage.getItem("token"));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function normalizeRole(role?: string): Role {
  switch ((role || "").toLowerCase()) {
    case "admin":
      return "ADMIN";
    case "empleado":
      return "OPERADOR";
    case "editor":
      return "EDITOR";
    case "operador":
      return "OPERADOR";
    case "cliente":
    default:
      return "CLIENTE";
  }
}

export function hasRole(allowed?: Role[]) {
  if (!allowed || allowed.length === 0) return true;
  const user = getUser();
  const role = normalizeRole(user?.rol || user?.role);
  return allowed.includes(role);
}
