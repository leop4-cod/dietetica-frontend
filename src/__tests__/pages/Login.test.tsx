import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/Login";
import { login } from "../../auth/auth";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("../../auth/auth", () => ({
  login: jest.fn(),
}));

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe("Login page", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    (login as jest.Mock).mockReset();
  });

  it("submits credentials and navigates on success", async () => {
    (login as jest.Mock).mockResolvedValueOnce({ data: { access_token: "t" } });
    renderLogin();

    const user = userEvent.setup();
    await user.clear(screen.getByLabelText(/Correo/i));
    await user.type(screen.getByLabelText(/Correo/i), "ana@test.com");
    await user.clear(screen.getByLabelText(/Contrase/i));
    await user.type(screen.getByLabelText(/Contrase/i), "secreto");

    await user.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(login).toHaveBeenCalledWith({ email: "ana@test.com", password: "secreto" });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dashboard"));
  });

  it("shows an error message when login fails", async () => {
    (login as jest.Mock).mockRejectedValueOnce(new Error("Credenciales invalidas"));
    renderLogin();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(await screen.findByText(/Credenciales invalidas/i)).toBeInTheDocument();
  });

  it("starts with default credentials filled", () => {
    renderLogin();

    expect(screen.getByLabelText(/Correo/i)).toHaveValue("leo@test.com");
    expect(screen.getByLabelText(/Contrase/i)).toHaveValue("123456");
  });
});
