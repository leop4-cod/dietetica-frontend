import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "../../pages/Register";
import { register } from "../../auth/auth";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("../../auth/auth", () => ({
  register: jest.fn(),
}));

const renderRegister = () =>
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

describe("Register page", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockNavigate.mockReset();
    (register as jest.Mock).mockReset();
  });

  it("submits registration with secret code for non-cliente roles", async () => {
    (register as jest.Mock).mockResolvedValueOnce({ message: "ok" });
    renderRegister();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await user.type(screen.getByLabelText(/Nombre/i), "Ana");
    await user.type(screen.getByLabelText(/Email/i), "ana@test.com");
    await user.type(screen.getByLabelText(/Telefono/i), "123456");
    await user.type(screen.getByLabelText(/Contrase/i), "clave");

    const roleSelect = screen.getByRole("combobox", { name: /Rol/i });
    await user.click(roleSelect);
    await user.click(screen.getByRole("option", { name: /Empleado/i }));

    await user.type(screen.getByLabelText(/Codigo secreto/i), "secreto");
    await user.click(screen.getByRole("button", { name: /Crear cuenta/i }));

    expect(register).toHaveBeenCalledWith({
      nombre: "Ana",
      email: "ana@test.com",
      telefono: "123456",
      password: "clave",
      rol: "empleado",
      codigo_secreto: "secreto",
    });

    await act(async () => {
      jest.advanceTimersByTime(800);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("hides secret code when role is cliente", async () => {
    renderRegister();

    expect(screen.queryByLabelText(/Codigo secreto/i)).not.toBeInTheDocument();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await user.click(screen.getByRole("combobox", { name: /Rol/i }));
    await user.click(screen.getByRole("option", { name: /Admin/i }));

    expect(screen.getByLabelText(/Codigo secreto/i)).toBeInTheDocument();
  });
});
