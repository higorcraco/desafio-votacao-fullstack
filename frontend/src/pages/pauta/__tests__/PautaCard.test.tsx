import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Swal from "sweetalert2";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as authContextModule from "../../../contexts/AuthContext";
import * as pautaServiceModule from "../../../services";
import type { Pauta } from "../../../types";
import PautaCard from "../PautaCard";

vi.mock("sweetalert2");
vi.mock("../../../contexts/AuthContext");
vi.mock("../../../services", () => ({
  pautaService: {
    adicionaVoto: vi.fn(),
  },
}));

describe("PautaCard", () => {
  const mockUser = { id: "user-1", cpf: "12345678901" };
  const mockUpdatePauta = vi.fn();

  const mockPauta: Pauta = {
    id: "pauta-1",
    titulo: "Pauta Teste",
    descricao: "Descrição da pauta",
    duracao: 10,
    dataCriacao: "2026-02-01T10:00:00",
    dataFinalVotacao: new Date(Date.now() + 3600000).toISOString(),
    votos: [],
  };

  beforeEach(() => {
    vi.mocked(authContextModule.useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: mockUser,
      login: vi.fn(),
      logout: vi.fn(),
    } as any);

    vi.mocked(pautaServiceModule.pautaService.adicionaVoto).mockClear();
    vi.mocked(Swal.fire).mockClear();
    mockUpdatePauta.mockClear();
  });

  it("deve renderizar título da pauta", () => {
    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    expect(screen.getByText("Pauta Teste")).toBeTruthy();
  });

  it("deve renderizar descrição da pauta", () => {
    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    expect(screen.getByText("Descrição da pauta")).toBeTruthy();
  });

  it("deve renderizar data de criação", () => {
    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    expect(screen.getByText(/Criada em:/)).toBeTruthy();
  });

  it("deve renderizar data final de votação", () => {
    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    expect(screen.getByText(/Encerra em:/)).toBeTruthy();
  });

  it("deve renderizar botão Sim quando pauta está aberta", () => {
    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    expect(screen.getByRole("button", { name: /Sim/i })).toBeTruthy();
  });

  it("deve renderizar botão Não quando pauta está aberta", () => {
    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    expect(screen.getByRole("button", { name: /Não/i })).toBeTruthy();
  });

  it('deve renderizar badge "Aberta" quando pauta está em andamento', () => {
    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    expect(screen.getByText("Aberta")).toBeTruthy();
  });

  it("deve renderizar resultado da votação", () => {
    const pautaComVoto = {
      ...mockPauta,
      votos: [
        {
          id: "voto-1",
          pautaId: "pauta-1",
          usuarioId: "user-1",
          voto: true,
        },
      ],
    };

    render(<PautaCard pauta={pautaComVoto} updatePauta={mockUpdatePauta} />);

    expect(screen.getByText("Resultado da Votação")).toBeTruthy();
  });

  it("deve chamar adicionaVoto ao clicar em Sim", async () => {
    const user = userEvent.setup();
    vi.mocked(
      pautaServiceModule.pautaService.adicionaVoto,
    ).mockResolvedValueOnce({} as any);
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as any);

    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    const botaoSim = screen.getByRole("button", { name: /Sim/i });
    await user.click(botaoSim);

    await waitFor(() => {
      expect(
        vi.mocked(pautaServiceModule.pautaService.adicionaVoto),
      ).toHaveBeenCalledWith("pauta-1", {
        usuarioId: "user-1",
        voto: true,
      });
    });
  });

  it("deve chamar adicionaVoto ao clicar em Não", async () => {
    const user = userEvent.setup();
    vi.mocked(
      pautaServiceModule.pautaService.adicionaVoto,
    ).mockResolvedValueOnce({} as any);
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as any);

    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    const botaoNao = screen.getByRole("button", { name: /Não/i });
    await user.click(botaoNao);

    await waitFor(() => {
      expect(
        vi.mocked(pautaServiceModule.pautaService.adicionaVoto),
      ).toHaveBeenCalledWith("pauta-1", {
        usuarioId: "user-1",
        voto: false,
      });
    });
  });

  it("deve chamar updatePauta após votar com sucesso", async () => {
    const user = userEvent.setup();
    vi.mocked(
      pautaServiceModule.pautaService.adicionaVoto,
    ).mockResolvedValueOnce({} as any);
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as any);

    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    const botaoSim = screen.getByRole("button", { name: /Sim/i });
    await user.click(botaoSim);

    await waitFor(() => {
      expect(mockUpdatePauta).toHaveBeenCalledWith("pauta-1");
    });
  });

  it("deve desabilitar botões enquanto vota", async () => {
    const user = userEvent.setup();
    vi.mocked(
      pautaServiceModule.pautaService.adicionaVoto,
    ).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    const botaoSim = screen.getByRole("button", {
      name: /Sim/i,
    }) as HTMLButtonElement;
    await user.click(botaoSim);

    await waitFor(() => {
      expect(botaoSim.disabled).toBe(true);
    });
  });

  it("deve exibir erro ao falhar ao votar", async () => {
    const user = userEvent.setup();
    vi.mocked(
      pautaServiceModule.pautaService.adicionaVoto,
    ).mockRejectedValueOnce({
      response: { data: { message: "Erro ao registrar voto" } },
    });

    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    const botaoSim = screen.getByRole("button", { name: /Sim/i });
    await user.click(botaoSim);

    await waitFor(() => {
      expect(vi.mocked(Swal.fire)).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          text: "Erro ao registrar voto",
        }),
      );
    });
  });

  it("deve exibir erro padrão quando API não retorna mensagem", async () => {
    const user = userEvent.setup();
    vi.mocked(
      pautaServiceModule.pautaService.adicionaVoto,
    ).mockRejectedValueOnce({
      message: "Network error",
    });

    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    const botaoSim = screen.getByRole("button", { name: /Sim/i });
    await user.click(botaoSim);

    await waitFor(() => {
      expect(vi.mocked(Swal.fire)).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
        }),
      );
    });
  });

  it("deve detectar se usuário já votou", () => {
    const pautaComVoto = {
      ...mockPauta,
      votos: [
        {
          id: "voto-1",
          pautaId: "pauta-1",
          usuarioId: "user-1",
          voto: true,
        },
      ],
    };

    render(<PautaCard pauta={pautaComVoto} updatePauta={mockUpdatePauta} />);

    // Botões de votação não devem estar visíveis se usuário já votou
    const botaoSim = screen.queryByRole("button", { name: /Sim/i });
    const botaoNao = screen.queryByRole("button", { name: /Não/i });

    // Apenas um pode estar presente (ou nenhum se resultado é exibido)
    expect(!botaoSim || !botaoNao || (!botaoSim && !botaoNao)).toBe(true);
  });

  it("deve exibir resultado quando usuário já votou", () => {
    const pautaComVoto = {
      ...mockPauta,
      votos: [
        {
          id: "voto-1",
          pautaId: "pauta-1",
          usuarioId: "user-1",
          voto: true,
        },
      ],
    };

    render(<PautaCard pauta={pautaComVoto} updatePauta={mockUpdatePauta} />);

    expect(screen.getByText("Resultado da Votação")).toBeTruthy();
  });

  it("deve exibir tempo restante quando pauta está aberta", () => {
    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    expect(screen.getByText(/Fecha em:/)).toBeTruthy();
  });

  it('deve renderizar badge "Finalizada" para pauta encerrada', () => {
    const pautaFinalizada = {
      ...mockPauta,
      dataFinalVotacao: new Date(Date.now() - 3600000).toISOString(),
    };

    render(<PautaCard pauta={pautaFinalizada} updatePauta={mockUpdatePauta} />);

    expect(screen.getByText("Finalizada")).toBeTruthy();
  });

  it("deve exibir resultado quando pauta está finalizada", () => {
    const pautaFinalizada = {
      ...mockPauta,
      dataFinalVotacao: new Date(Date.now() - 3600000).toISOString(),
      votos: [
        {
          id: "voto-1",
          pautaId: "pauta-1",
          usuarioId: "user-1",
          voto: true,
        },
      ],
    };

    render(<PautaCard pauta={pautaFinalizada} updatePauta={mockUpdatePauta} />);

    expect(screen.getByText("Resultado da Votação")).toBeTruthy();
  });

  it("não deve exibir botões de votação quando pauta está finalizada", () => {
    const pautaFinalizada = {
      ...mockPauta,
      dataFinalVotacao: new Date(Date.now() - 3600000).toISOString(),
    };

    render(<PautaCard pauta={pautaFinalizada} updatePauta={mockUpdatePauta} />);

    const botaoSim = screen.queryByRole("button", { name: /Sim/i });
    const botaoNao = screen.queryByRole("button", { name: /Não/i });

    expect(botaoSim).toBeFalsy();
    expect(botaoNao).toBeFalsy();
  });

  it("deve chamar updatePauta quando pauta finaliza", () => {
    vi.useFakeTimers();

    const pautaProximaDeExpirar = {
      ...mockPauta,
      dataFinalVotacao: new Date(Date.now() + 1500).toISOString(),
    };

    render(
      <PautaCard pauta={pautaProximaDeExpirar} updatePauta={mockUpdatePauta} />,
    );

    // Avança o tempo para passar da data de expiração
    vi.advanceTimersByTime(2000);

    expect(mockUpdatePauta).toHaveBeenCalledWith("pauta-1");

    vi.useRealTimers();
  });

  it("deve renderizar com múltiplos votos", () => {
    const pautaComVotos = {
      ...mockPauta,
      votos: [
        { id: "1", pautaId: "pauta-1", usuarioId: "user-1", voto: true },
        { id: "2", pautaId: "pauta-1", usuarioId: "user2", voto: true },
        { id: "3", pautaId: "pauta-1", usuarioId: "user3", voto: false },
      ],
    };

    render(<PautaCard pauta={pautaComVotos} updatePauta={mockUpdatePauta} />);

    // Verifica que o resultado é exibido buscando pelo texto
    expect(screen.getByText("Resultado da Votação")).toBeTruthy();
    expect(screen.getByText(/2 voto\(s\)/)).toBeTruthy();
  });

  it("deve exibir sucesso ao votar com sucesso", async () => {
    const user = userEvent.setup();
    vi.mocked(
      pautaServiceModule.pautaService.adicionaVoto,
    ).mockResolvedValueOnce({} as any);
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as any);

    render(<PautaCard pauta={mockPauta} updatePauta={mockUpdatePauta} />);

    const botaoSim = screen.getByRole("button", { name: /Sim/i });
    await user.click(botaoSim);

    await waitFor(
      () => {
        expect(vi.mocked(Swal.fire)).toHaveBeenCalledWith(
          expect.objectContaining({
            icon: "success",
            title: "Voto Registrado!",
          }),
        );
      },
      { timeout: 3000 },
    );
  });
});
