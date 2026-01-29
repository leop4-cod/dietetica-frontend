export type Role = "ADMIN" | "EMPLEADO" | "CLIENTE";
export type Action = "view" | "create" | "edit" | "delete" | "change_state";

export function normalizeRole(input?: string | null): Role | null {
  if (!input) return null;
  const normalized = input.toLowerCase();
  if (normalized === "admin") return "ADMIN";
  if (normalized === "empleado") return "EMPLEADO";
  if (normalized === "cliente") return "CLIENTE";
  return null;
}

export function can(role: Role | null | undefined, action: Action, _resource?: string): boolean {
  if (!role) return false;
  switch (role) {
    case "ADMIN":
      return true;
    case "EMPLEADO":
      return action === "view" || action === "create" || action === "edit" || action === "change_state";
    case "CLIENTE":
    default:
      return false;
  }
}
