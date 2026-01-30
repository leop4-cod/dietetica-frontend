import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsForm from "../../../pages/admin/Productos/Form";
import { listCategories } from "../../../api/categories.service";
import { createProduct, getProduct } from "../../../api/products.service";
import { useAuth } from "../../../auth/AuthContext";

const mockNavigate = jest.fn();
let paramsValue: Record<string, string | undefined> = {};

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => paramsValue,
  };
});

jest.mock("../../../api/categories.service", () => ({
  listCategories: jest.fn(),
}));

jest.mock("../../../api/products.service", () => ({
  createProduct: jest.fn(),
  getProduct: jest.fn(),
  updateProduct: jest.fn(),
}));

jest.mock("../../../api/axios", () => ({
  getApiErrorMessage: jest.fn(() => "Error"),
}));

jest.mock("../../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const categories = [{ id: 10, nombre: "Bebidas" }];

describe("ProductsForm page", () => {
  beforeEach(() => {
    paramsValue = {};
    mockNavigate.mockReset();
    (listCategories as jest.Mock).mockResolvedValue({ items: categories });
    (createProduct as jest.Mock).mockResolvedValue({ id: 55 });
    (getProduct as jest.Mock).mockResolvedValue({
      id: 33,
      nombre: "Te verde",
      descripcion: "Bebida saludable",
      precio: 120,
      activo: true,
      category: { id: 10, nombre: "Bebidas" },
      inventory: { stock: 20 },
    });
    (useAuth as jest.Mock).mockReturnValue({ role: "ADMIN" });
  });

  it("loads product data when editing", async () => {
    paramsValue = { id: "33" };
    render(<ProductsForm />);

    expect(await screen.findByDisplayValue(/Te verde/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bebida saludable")).toBeInTheDocument();
    expect(screen.getByDisplayValue("120")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
  });

  it("shows validation feedback when required fields are missing", async () => {
    render(<ProductsForm />);

    const nameInput = await screen.findByLabelText(/Nombre/i);
    const form = nameInput.closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    expect(await screen.findByText(/Completa los campos obligatorios/i)).toBeInTheDocument();
  });

  it("creates a new product with valid data", async () => {
    render(<ProductsForm />);

    const user = userEvent.setup();
    await user.type(await screen.findByLabelText(/Nombre/i), "Agua");
    await user.type(screen.getByLabelText(/Descrip/i), "Sin gas");
    await user.type(screen.getByLabelText(/Precio/i), "50");

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /Bebidas/i }));

    await user.click(screen.getByRole("button", { name: /Guardar/i }));

    expect(createProduct).toHaveBeenCalledWith({
      nombre: "Agua",
      descripcion: "Sin gas",
      precio: 50,
      categoria_id: 10,
      activo: true,
      image_url: undefined,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/app/admin/productos/55", { replace: true });
  });
});
