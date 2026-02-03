import { render, screen } from "@testing-library/react";
import Swal from "sweetalert2";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from "../ErrorBoundary";

vi.mock("sweetalert2");

const ThrowError = () => {
  throw new Error("Test error message");
};

const NormalComponent = () => {
  return <div>Normal Component Content</div>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve renderizar componentes filhos normalmente", () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Normal Component Content")).toBeTruthy();
  });

  it("deve capturar erro e exibir fallback UI", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/Erro na Aplicação/i)).toBeTruthy();
  });

  it("deve exibir botão de reset", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    const resetButton = screen.getByRole("button");
    expect(resetButton).toBeTruthy();
  });

  it("deve chamar SweetAlert quando capturar erro", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(Swal.fire).toHaveBeenCalled();
  });

  it("deve armazenar informações do erro no estado", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText(/Desculpe, algo inesperado aconteceu/i),
    ).toBeTruthy();
  });
});
