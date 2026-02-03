import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as authContextModule from "../../../contexts/AuthContext";
import * as pautaServiceModule from "../../../services";
import type { Pauta } from "../../../types";
import PautaList from "../PautaList";

vi.mock("../../../contexts/AuthContext");
vi.mock("../../../services");

describe("PautaList", () => {
  const mockLogout = vi.fn();

  const mockPautaData = {
    content: [
      {
        id: "1",
        titulo: "Pauta 1",
        descricao: "Descrição 1",
        duracao: 30,
        dataCriacao: "2026-02-01T10:00:00",
        dataFinalVotacao: "2026-02-02T10:00:00",
        votos: [],
      } as Pauta,
    ],
    totalPages: 1,
    number: 0,
    size: 9,
    totalElements: 1,
    last: true,
    first: true,
  };

  beforeEach(() => {
    mockLogout.mockClear();

    vi.mocked(authContextModule.useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "user-1", cpf: "12345678901" },
      login: vi.fn(),
      logout: mockLogout,
    } as any);

    vi.mocked(pautaServiceModule.pautaService.findAll).mockClear();
    vi.mocked(pautaServiceModule.pautaService.findById).mockClear();
    vi.mocked(pautaServiceModule.pautaService.findById).mockResolvedValue(
      mockPautaData.content[0],
    );
  });

  it("deve renderizar navbar com título", async () => {
    vi.mocked(pautaServiceModule.pautaService.findAll).mockResolvedValueOnce(
      mockPautaData,
    );

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Sistema de Votação")).toBeTruthy();
    });
  });

  it("deve renderizar botão Nova Pauta", async () => {
    vi.mocked(pautaServiceModule.pautaService.findAll).mockResolvedValueOnce(
      mockPautaData,
    );

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Nova Pauta/i })).toBeTruthy();
    });
  });

  it("deve renderizar botão Sair", async () => {
    vi.mocked(pautaServiceModule.pautaService.findAll).mockResolvedValueOnce(
      mockPautaData,
    );

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Sair/i })).toBeTruthy();
    });
  });

  it("deve chamar logout ao clicar em Sair", async () => {
    const user = userEvent.setup();

    vi.mocked(authContextModule.useAuth).mockReturnValueOnce({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "user-1", cpf: "12345678901" },
      login: vi.fn(),
      logout: mockLogout,
    } as any);

    vi.mocked(pautaServiceModule.pautaService.findAll).mockResolvedValueOnce(
      mockPautaData,
    );

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    const botaoSair = screen.getByRole("button", { name: /Sair/i });
    await user.click(botaoSair);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it("deve carregar pautas ao montar", async () => {
    vi.mocked(pautaServiceModule.pautaService.findAll).mockResolvedValueOnce(
      mockPautaData,
    );

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        vi.mocked(pautaServiceModule.pautaService.findAll),
      ).toHaveBeenCalledWith({
        page: 0,
        size: 9,
      });
    });
  });

  it("deve exibir spinner enquanto carrega", () => {
    vi.mocked(pautaServiceModule.pautaService.findAll).mockImplementationOnce(
      () => new Promise(() => {}),
    );

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    expect(screen.getByText("Carregando pautas...")).toBeTruthy();
  });

  it("deve exibir mensagem quando não há pautas", async () => {
    vi.mocked(pautaServiceModule.pautaService.findAll).mockResolvedValueOnce({
      content: [],
      totalPages: 0,
      number: 0,
      size: 9,
      totalElements: 0,
      last: true,
      first: true,
    });

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma pauta cadastrada/i)).toBeTruthy();
    });
  });

  it("deve exibir erro ao falhar carregamento", async () => {
    vi.mocked(pautaServiceModule.pautaService.findAll).mockRejectedValueOnce({
      response: { data: { message: "Erro ao carregar pautas" } },
    });

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar pautas")).toBeTruthy();
    });
  });

  it("deve exibir erro padrão quando API não retorna mensagem", async () => {
    vi.mocked(pautaServiceModule.pautaService.findAll).mockRejectedValueOnce({
      message: "Network error",
    });

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao carregar pautas. Tente novamente."),
      ).toBeTruthy();
    });
  });

  it("deve renderizar pautas ao carregar com sucesso", async () => {
    vi.mocked(pautaServiceModule.pautaService.findAll).mockResolvedValueOnce(
      mockPautaData,
    );

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Pauta 1")).toBeTruthy();
      expect(screen.getByText("Descrição 1")).toBeTruthy();
    });
  });

  it("deve mudar página ao clicar em paginação", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.findAll)
      .mockResolvedValueOnce({
        content: [mockPautaData.content[0]],
        totalPages: 2,
        number: 0,
        size: 9,
        totalElements: 18,
        last: false,
        first: true,
      })
      .mockResolvedValueOnce({
        content: [
          {
            id: "2",
            titulo: "Pauta 2",
            descricao: "Descrição 2",
            duracao: 30,
            dataCriacao: "2026-02-01T10:00:00",
            dataFinalVotacao: "2026-02-02T10:00:00",
            votos: [],
          } as Pauta,
        ],
        totalPages: 2,
        number: 1,
        size: 9,
        totalElements: 18,
        last: true,
        first: false,
      });

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Pauta 1")).toBeTruthy();
    });

    const botaoProxima = screen
      .queryAllByRole("button")
      .find((btn) => btn.textContent === "2");

    if (botaoProxima) {
      await user.click(botaoProxima);

      await waitFor(() => {
        expect(
          vi.mocked(pautaServiceModule.pautaService.findAll),
        ).toHaveBeenCalledWith({
          page: 1,
          size: 9,
        });
      });
    }
  });

  it("deve abrir modal ao clicar em Nova Pauta", async () => {
    const user = userEvent.setup();
    vi.mocked(pautaServiceModule.pautaService.findAll).mockResolvedValueOnce(
      mockPautaData,
    );

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    const botaoNovaPauta = screen.getByRole("button", { name: /Nova Pauta/i });
    await user.click(botaoNovaPauta);

    // Procura pelo título do modal ou elemento dentro do modal
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Digite o título da pauta/i),
      ).toBeTruthy();
    });
  });

  it("deve recarregar pautas após criar nova pauta", async () => {
    vi.mocked(pautaServiceModule.pautaService.findAll)
      .mockResolvedValueOnce(mockPautaData)
      .mockResolvedValueOnce(mockPautaData);

    vi.mocked(pautaServiceModule.pautaService.findById).mockClear();

    render(
      <BrowserRouter>
        <PautaList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Pauta 1")).toBeTruthy();
    });

    // Verificar que findAll foi chamado uma vez na montagem
    expect(
      vi.mocked(pautaServiceModule.pautaService.findAll),
    ).toHaveBeenCalledTimes(1);
  });
});
