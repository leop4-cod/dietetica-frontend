import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsDetail from "../../../pages/admin/Productos/Detail";
import { deleteProduct, getProduct } from "../../../api/products.service";
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

jest.mock("../../../api/products.service", () => ({
  getProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

jest.mock("../../../api/axios", () => ({
  getApiErrorMessage: jest.fn(() => "Error"),
}));

jest.mock("../../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("ProductsDetail page", () => {
  beforeEach(() => {
    paramsValue = { id: "12" };
    mockNavigate.mockReset();
    (getProduct as jest.Mock).mockReset();
    (deleteProduct as jest.Mock).mockReset();
    (getProduct as jest.Mock).mockResolvedValue({
      id: 12,
      nombre: "Harina de avena",
      descripcion: "Integral",
      precio: 80,
      activo: true,
      category: { nombre: "Cereales" },
      inventory: { stock: 5 },
    });
    (deleteProduct as jest.Mock).mockResolvedValue(undefined);
    (useAuth as jest.Mock).mockReturnValue({ role: "ADMIN" });
  });

  it("renders product details from the API", async () => {
    render(<ProductsDetail />);

    expect(await screen.findByText("Harina de avena")).toBeInTheDocument();
    expect(screen.getByText(/Detalle de producto/i)).toBeInTheDocument();
    expect(screen.getByText(/Integral/i)).toBeInTheDocument();
    expect(screen.getByText(/80/)).toBeInTheDocument();
  });

  it("confirms and deletes a product when authorized", async () => {
    render(<ProductsDetail />);

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /Eliminar/i }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/Eliminar producto/i)).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: /^Eliminar$/i }));

    await waitFor(() => expect(deleteProduct).toHaveBeenCalledWith("12"));
    expect(mockNavigate).toHaveBeenCalledWith("/app/admin/productos", { replace: true });
  });

  it("blocks deletion when the role cannot delete", async () => {
    (useAuth as jest.Mock).mockReturnValue({ role: "EMPLEADO" });
    render(<ProductsDetail />);

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /Eliminar/i }));

    expect(await screen.findByText(/No autorizado/i)).toBeInTheDocument();
    expect(deleteProduct).not.toHaveBeenCalled();
  });
});
