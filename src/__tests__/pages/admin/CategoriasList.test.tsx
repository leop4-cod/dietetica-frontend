import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoriesList from "../../../pages/admin/Categorias/List";
import { listCategories, deleteCategory } from "../../../api/categories.service";
import { useAuth } from "../../../auth/AuthContext";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("../../../api/categories.service", () => ({
  listCategories: jest.fn(),
  deleteCategory: jest.fn(),
}));

jest.mock("../../../api/axios", () => ({
  getApiErrorMessage: jest.fn(() => "Error"),
}));

jest.mock("../../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const baseCategories = [
  { id: 1, nombre: "Suplementos", descripcion: "Proteinas" },
  { id: 2, nombre: "Snacks", descripcion: "Saludables" },
];

describe("CategoriesList page", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    (listCategories as jest.Mock).mockResolvedValue({
      items: baseCategories,
      meta: { totalItems: baseCategories.length },
    });
    (deleteCategory as jest.Mock).mockResolvedValue(undefined);
    (useAuth as jest.Mock).mockReturnValue({ role: "ADMIN" });
  });

  it("renders categories from the API and filters by search", async () => {
    render(<CategoriesList />);

    expect(await screen.findByText("Suplementos")).toBeInTheDocument();
    expect(screen.getByText("Snacks")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Buscar/i), "snack");

    expect(screen.getByText("Snacks")).toBeInTheDocument();
    expect(screen.queryByText("Suplementos")).not.toBeInTheDocument();
  });

  it("hides the create button when the role cannot create", async () => {
    (useAuth as jest.Mock).mockReturnValue({ role: "CLIENTE" });

    render(<CategoriesList />);

    await waitFor(() => expect(listCategories).toHaveBeenCalled());
    expect(
      screen.queryByRole("button", { name: /Nueva categor/i })
    ).not.toBeInTheDocument();
  });

  it("blocks deletion when the role cannot delete", async () => {
    (useAuth as jest.Mock).mockReturnValue({ role: "EMPLEADO" });

    render(<CategoriesList />);

    expect(await screen.findByText("Suplementos")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: /Eliminar/i })[0]);

    expect(await screen.findByText(/No autorizado/i)).toBeInTheDocument();
    expect(deleteCategory).not.toHaveBeenCalled();
  });
});
