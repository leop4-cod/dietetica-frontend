import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../../components/SearchBar";

describe("SearchBar", () => {
  it("calls onChange and onSearch via Enter key", async () => {
    const onChange = jest.fn();
    const onSearch = jest.fn();

    render(
      <SearchBar value="" onChange={onChange} onSearch={onSearch} placeholder="Buscar productos" />
    );

    fireEvent.change(screen.getByLabelText(/Buscar productos/i), {
      target: { value: "manzana" },
    });

    expect(onChange).toHaveBeenCalledWith("manzana");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Buscar productos/i), "{enter}");
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("calls onSearch when clicking the button", async () => {
    const onChange = jest.fn();
    const onSearch = jest.fn();

    render(<SearchBar value="arroz" onChange={onChange} onSearch={onSearch} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Buscar/i }));

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("uses the default label when placeholder is not provided", () => {
    const onChange = jest.fn();
    const onSearch = jest.fn();

    render(<SearchBar value="" onChange={onChange} onSearch={onSearch} />);

    expect(screen.getByLabelText(/Buscar/i)).toBeInTheDocument();
  });
});
