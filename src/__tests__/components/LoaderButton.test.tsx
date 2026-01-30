import { render, screen } from "@testing-library/react";
import LoaderButton from "../../components/LoaderButton";

describe("LoaderButton", () => {
  it("shows a loader and disables when loading", () => {
    render(<LoaderButton loading>Guardar</LoaderButton>);

    expect(screen.getByRole("button", { name: /Guardar/i })).toBeDisabled();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders children and respects disabled prop", () => {
    render(
      <LoaderButton disabled startIcon={<span>icon</span>}>
        Enviar
      </LoaderButton>
    );

    expect(screen.getByRole("button", { name: /Enviar/i })).toBeDisabled();
  });

  it("stays enabled and hides the loader when not loading", () => {
    render(<LoaderButton>Continuar</LoaderButton>);

    expect(screen.getByRole("button", { name: /Continuar/i })).toBeEnabled();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
