import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../auth/ProtectedRoute";
import { useAuth } from "../../auth/AuthContext";

jest.mock("../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("ProtectedRoute", () => {
  it("renders children when authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ token: "token" });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Contenido privado</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login/cliente" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Contenido privado")).toBeInTheDocument();
  });

  it("redirects to login when unauthenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ token: null });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Contenido privado</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Inicio</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Inicio")).toBeInTheDocument();
  });
});
