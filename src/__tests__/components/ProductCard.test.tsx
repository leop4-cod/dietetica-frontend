import type React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types/product";
import { getImageUrl } from "../../utils/images";

jest.mock("../../utils/images", () => ({
  getImageUrl: jest.fn(() => "http://example.com/product.jpg"),
}));

const renderCard = (product: Product, props?: Partial<React.ComponentProps<typeof ProductCard>>) =>
  render(
    <MemoryRouter>
      <ProductCard product={product} {...props} />
    </MemoryRouter>
  );

describe("ProductCard", () => {
  beforeEach(() => {
    (getImageUrl as jest.Mock).mockClear();
  });

  it("renders product data and fallback description", () => {
    renderCard({
      id: "1",
      nombre: "Barra de cereal",
      precio: 120,
    });

    expect(screen.getByText("Barra de cereal")).toBeInTheDocument();
    expect(screen.getByText(/Sin descrip/i)).toBeInTheDocument();
    expect(screen.getByText("$120")).toBeInTheDocument();
  });

  it("triggers add to cart when enabled", async () => {
    const onAddToCart = jest.fn();
    renderCard(
      {
        id: "9",
        nombre: "Mix saludable",
        descripcion: "Mix de frutos secos",
        precio: 200,
      },
      { showAddToCart: true, onAddToCart }
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Agregar al carrito/i }));

    expect(onAddToCart).toHaveBeenCalledWith("9");
  });

  it("links to the default detail route", () => {
    renderCard({
      id: "5",
      nombre: "Granola",
      descripcion: "Granola crocante",
      precio: 50,
    });

    expect(screen.getByRole("link", { name: /Ver detalle/i })).toHaveAttribute(
      "href",
      expect.stringContaining("/producto/5")
    );
  });
});
