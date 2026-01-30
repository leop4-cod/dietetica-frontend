import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RoleGuard from "../../auth/RoleGuard";
import { useAuth } from "../../auth/AuthContext";

jest.mock("../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
  hasRole: (allowed: string[] | undefined, currentRole: string | null) => {
    if (!allowed || allowed.length === 0) return true;
    if (!currentRole) return false;
    return allowed.includes(currentRole);
  },
}));

describe("RoleGuard", () => {
  it("allows access for permitted roles", () => {
    (useAuth as jest.Mock).mockReturnValue({ role: "ADMIN" });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <RoleGuard roles={["ADMIN"]}>
                <div>Admin content</div>
              </RoleGuard>
            }
          />
          <Route path="/no-autorizado" element={<div>No autorizado</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Admin content")).toBeInTheDocument();
  });

  it("denies access for non-permitted roles", () => {
    (useAuth as jest.Mock).mockReturnValue({ role: "CLIENTE" });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <RoleGuard roles={["ADMIN"]}>
                <div>Admin content</div>
              </RoleGuard>
            }
          />
          <Route path="/no-autorizado" element={<div>No autorizado</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("No autorizado")).toBeInTheDocument();
  });
});
