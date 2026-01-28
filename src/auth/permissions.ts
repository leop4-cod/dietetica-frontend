export type Role = "ADMIN" | "EDITOR" | "OPERADOR" | "CLIENTE" | "DOCTOR";
export type Action = "view" | "create" | "edit" | "delete" | "change_state";

export function normalizeRole(input?: string | null): Role | null {
  if (!input) return null;
  const normalized = input.toLowerCase();
  if (normalized === "admin") return "ADMIN";
  if (normalized === "empleado" || normalized === "editor") return "EDITOR";
  if (normalized === "doctor") return "DOCTOR";
  if (normalized === "operador") return "OPERADOR";
  if (normalized === "cliente") return "CLIENTE";
  return null;
}

export function can(role: Role | null | undefined, action: Action, _resource?: string): boolean {
  if (!role) return false;
  switch (role) {
    case "ADMIN":
      return true;
    case "EDITOR":
      return action === "view" || action === "create" || action === "edit";
    case "DOCTOR":
      return action === "view" || action === "create" || action === "edit";
    case "OPERADOR":
      return action === "view" || action === "change_state";
    case "CLIENTE":
    default:
      return false;
  }
}
