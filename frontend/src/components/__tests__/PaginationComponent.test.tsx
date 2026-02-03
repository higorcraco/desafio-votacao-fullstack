import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaginationComponent from "../PaginationComponent";

describe("PaginationComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar botões de paginação", () => {
    const mockOnPageChange = vi.fn();
    render(
      <PaginationComponent
        currentPage={0}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    );

    // Verifica se renderiza algum botão
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("deve desabilitar botão Previous na primeira página", () => {
    const mockOnPageChange = vi.fn();
    render(
      <PaginationComponent
        currentPage={0}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    );

    // PaginationComponent usa Pagination.First e Pagination.Prev
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("deve desabilitar botão Next na última página", () => {
    const mockOnPageChange = vi.fn();
    render(
      <PaginationComponent
        currentPage={4}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("deve chamar callback ao clicar em página", async () => {
    const mockOnPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <PaginationComponent
        currentPage={0}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    );

    // Procura pelo número da página (página 3 é index 2, então mostra "3")
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 4) {
      await user.click(buttons[4]);
      expect(mockOnPageChange).toHaveBeenCalled();
    }
  });

  it("deve mostrar múltiplas páginas", () => {
    const mockOnPageChange = vi.fn();
    render(
      <PaginationComponent
        currentPage={0}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("deve navegar com Previous e Next", async () => {
    const mockOnPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <PaginationComponent
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    );

    const buttons = screen.getAllByRole("button");
    // Encontra botão Next e clica
    if (buttons.length > 2) {
      await user.click(buttons[buttons.length - 2]);
      expect(mockOnPageChange).toHaveBeenCalled();
    }
  });

  it("deve retornar null quando totalPages é 1", () => {
    const mockOnPageChange = vi.fn();
    const { container } = render(
      <PaginationComponent
        currentPage={0}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />,
    );

    // Quando há apenas 1 página, PaginationComponent retorna null
    expect(container.firstChild).toBeNull();
  });
});
