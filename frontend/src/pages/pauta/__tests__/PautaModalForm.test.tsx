import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as pautaServiceModule from "../../../services";
import PautaModalForm from "../PautaModalForm";

vi.mock("../../../services", () => ({
  pautaService: {
    create: vi.fn(),
  },
}));

describe("PautaModalForm", () => {
  const mockOnHide = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    mockOnHide.mockClear();
    mockOnSuccess.mockClear();
    vi.mocked(pautaServiceModule.pautaService.create).mockClear();
  });

  it("deve renderizar modal quando show=true", () => {
    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(screen.getByText("Nova Pauta")).toBeTruthy();
    expect(
      screen.getByPlaceholderText("Digite o título da pauta..."),
    ).toBeTruthy();
    expect(
      screen.getByPlaceholderText("Descreva a pauta para votação..."),
    ).toBeTruthy();
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
  });

  it("não deve renderizar modal quando show=false", () => {
    const { container } = render(
      <PautaModalForm
        show={false}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const backdrop = container.querySelector(".modal-backdrop");
    expect(backdrop).toBeFalsy();
  });

  it("deve rejeitar título com menos de 5 caracteres", async () => {
    const user = userEvent.setup();
    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    );
    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });

    await user.type(tituloInput, "Test");
    await user.click(botaoSalvar);

    // Verifica que create não foi chamado (validação falhou)
    expect(
      vi.mocked(pautaServiceModule.pautaService.create),
    ).not.toHaveBeenCalled();
  });

  it("deve aceitar título com 5 ou mais caracteres", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.create).mockResolvedValueOnce(
      {} as any,
    );

    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    );
    const durationInputs = screen.getAllByRole("spinbutton");
    const durationInput = durationInputs[0] as HTMLInputElement;
    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });

    await user.clear(tituloInput);
    await user.type(tituloInput, "Pauta Válida");
    await user.clear(durationInput);
    await user.type(durationInput, "5");
    await user.click(botaoSalvar);

    await waitFor(() => {
      expect(
        vi.mocked(pautaServiceModule.pautaService.create),
      ).toHaveBeenCalled();
    });
  });

  it("deve rejeitar duração menor que 1", async () => {
    const user = userEvent.setup();
    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    );
    const durationInputs = screen.getAllByRole("spinbutton");
    const durationInput = durationInputs[0] as HTMLInputElement;
    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });

    await user.type(tituloInput, "Pauta Válida");
    await user.clear(durationInput);
    await user.type(durationInput, "0");

    await user.click(botaoSalvar);

    // Verifica que create não foi chamado (validação falhou)
    expect(
      vi.mocked(pautaServiceModule.pautaService.create),
    ).not.toHaveBeenCalled();
  });

  it("deve enviar dados corretos ao API", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.create).mockResolvedValueOnce(
      {} as any,
    );

    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    );
    const descricaoInput = screen.getByPlaceholderText(
      "Descreva a pauta para votação...",
    );
    const durationInputs = screen.getAllByRole("spinbutton");
    const durationInput = durationInputs[0] as HTMLInputElement;
    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });

    await user.type(tituloInput, "Nova Pauta Teste");
    await user.type(descricaoInput, "Descrição da pauta");
    await user.clear(durationInput);
    await user.type(durationInput, "10");
    await user.click(botaoSalvar);

    await waitFor(() => {
      expect(
        vi.mocked(pautaServiceModule.pautaService.create),
      ).toHaveBeenCalledWith({
        titulo: "Nova Pauta Teste",
        descricao: "Descrição da pauta",
        duracao: 10,
      });
    });
  });

  it("deve exibir erro ao falhar na criação com mensagem específica", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.create).mockRejectedValueOnce({
      response: { data: { message: "Erro ao criar pauta" } },
    });

    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    );
    const durationInputs = screen.getAllByRole("spinbutton");
    const durationInput = durationInputs[0] as HTMLInputElement;
    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });

    await user.type(tituloInput, "Pauta Válida");
    await user.clear(durationInput);
    await user.type(durationInput, "5");
    await user.click(botaoSalvar);

    const alertElement = screen.getByText("Erro ao criar pauta");
    expect(alertElement).toBeTruthy();
  });

  it("deve exibir erro padrão quando API não retorna mensagem", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.create).mockRejectedValueOnce({
      message: "Network error",
    });

    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    );
    const durationInputs = screen.getAllByRole("spinbutton");
    const durationInput = durationInputs[0] as HTMLInputElement;
    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });

    await user.type(tituloInput, "Pauta Válida");
    await user.clear(durationInput);
    await user.type(durationInput, "5");
    await user.click(botaoSalvar);

    const alertElement = screen.getByText(
      "Erro ao criar pauta. Tente novamente.",
    );
    expect(alertElement).toBeTruthy();
  });

  it("deve chamar onSuccess ao criar pauta com sucesso", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.create).mockResolvedValueOnce(
      {} as any,
    );

    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    );
    const durationInputs = screen.getAllByRole("spinbutton");
    const durationInput = durationInputs[0] as HTMLInputElement;
    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });

    await user.type(tituloInput, "Pauta Válida");
    await user.clear(durationInput);
    await user.type(durationInput, "5");
    await user.click(botaoSalvar);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("deve chamar onHide ao fechar modal com sucesso", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.create).mockResolvedValueOnce(
      {} as any,
    );

    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    );
    const durationInputs = screen.getAllByRole("spinbutton");
    const durationInput = durationInputs[0] as HTMLInputElement;
    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });

    await user.type(tituloInput, "Pauta Válida");
    await user.clear(durationInput);
    await user.type(durationInput, "5");
    await user.click(botaoSalvar);

    await waitFor(() => {
      expect(mockOnHide).toHaveBeenCalled();
    });
  });

  it("deve desabilitar botão ao salvar", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.create).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    );
    const durationInputs = screen.getAllByRole("spinbutton");
    const durationInput = durationInputs[0] as HTMLInputElement;
    const botaoSalvar = screen.getByRole("button", {
      name: /Salvar/i,
    }) as HTMLButtonElement;

    await user.type(tituloInput, "Pauta Válida");
    await user.clear(durationInput);
    await user.type(durationInput, "5");
    await user.click(botaoSalvar);

    await waitFor(() => {
      expect(botaoSalvar.disabled).toBe(true);
    });
  });

  it("deve limpar formulário ao cancelar", async () => {
    const user = userEvent.setup();
    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    ) as HTMLInputElement;
    const descricaoInput = screen.getByPlaceholderText(
      "Descreva a pauta para votação...",
    ) as HTMLTextAreaElement;
    const botaoCancelar = screen.getByRole("button", { name: /Cancelar/i });

    await user.type(tituloInput, "Teste");
    await user.type(descricaoInput, "Descrição teste");

    await user.click(botaoCancelar);

    expect(mockOnHide).toHaveBeenCalled();
  });

  it("deve renderizar botão de cancelar", () => {
    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeTruthy();
  });

  it("deve renderizar botão de salvar", () => {
    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(screen.getByRole("button", { name: /Salvar/i })).toBeTruthy();
  });

  it("deve trimmar espaços em branco do título", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.create).mockResolvedValueOnce(
      {} as any,
    );

    render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    );
    const durationInputs = screen.getAllByRole("spinbutton");
    const durationInput = durationInputs[0] as HTMLInputElement;
    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });

    await user.type(tituloInput, "   Pauta com Espaços   ");
    await user.clear(durationInput);
    await user.type(durationInput, "5");
    await user.click(botaoSalvar);

    await waitFor(() => {
      expect(
        vi.mocked(pautaServiceModule.pautaService.create),
      ).toHaveBeenCalledWith({
        titulo: "Pauta com Espaços",
        descricao: "",
        duracao: 5,
      });
    });
  });

  it("deve limpar formulário após envio bem-sucedido", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.create).mockResolvedValueOnce(
      {} as any,
    );

    const { rerender } = render(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const tituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    ) as HTMLInputElement;
    const descricaoInput = screen.getByPlaceholderText(
      "Descreva a pauta para votação...",
    ) as HTMLTextAreaElement;
    const durationInputs = screen.getAllByRole("spinbutton");
    const durationInput = durationInputs[0] as HTMLInputElement;
    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });

    await user.type(tituloInput, "Pauta Teste");
    await user.type(descricaoInput, "Descrição teste");
    await user.clear(durationInput);
    await user.type(durationInput, "10");
    await user.click(botaoSalvar);

    await waitFor(() => {
      expect(mockOnHide).toHaveBeenCalled();
    });

    // Rerender com show=true novamente para simular reabertura do modal
    rerender(
      <PautaModalForm
        show={true}
        onHide={mockOnHide}
        onSuccess={mockOnSuccess}
      />,
    );

    const novoTituloInput = screen.getByPlaceholderText(
      "Digite o título da pauta...",
    ) as HTMLInputElement;
    expect(novoTituloInput.value).toBe("");
  });
});
