import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../auth/auth", () => ({
  hasRole: (allowed?: string[]) => {
    if (!allowed || allowed.length === 0) return true;
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const role = String(user?.rol ?? user?.role ?? "").toUpperCase();
      return allowed.includes(role);
    } catch {
      return false;
    }
  },
  normalizeRole: (role?: string) => {
    switch ((role || "").toLowerCase()) {
      case "admin":
        return "ADMIN";
      case "empleado":
      case "operador":
        return "OPERADOR";
      case "cliente":
      default:
        return "CLIENTE";
    }
  },
}));

import Dashboard from "../../pages/Dashboard";

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

describe("Dashboard page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders user summary and module links based on role", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 7,
        nombre: "Leo",
        email: "leo@test.com",
        rol: "admin",
      })
    );

    renderDashboard();

    expect(screen.getByText(/Bienvenido, Leo/i)).toBeInTheDocument();
    expect(screen.getByText("leo@test.com")).toBeInTheDocument();
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
    expect(screen.getByText("Usuarios")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("renders fallback values when no user is stored", () => {
    renderDashboard();

    expect(screen.getAllByText("-").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("CLIENTE")).toBeInTheDocument();
  });
});
