import { beforeEach, describe, expect, it, vi } from "vitest";
import { pautaService } from "../pautaService";

vi.mock("../api");

describe("PautaService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("deve buscar pauta por ID", async () => {
      const mockPauta = {
        id: "123",
        descricao: "Nova Pauta",
        dataCriacao: "2026-02-01T10:00:00Z",
        dataFinalVotacao: "2026-02-02T10:00:00Z",
        votos: [],
      };
      const { default: api } = await import("../api");
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockPauta });

      const result = await pautaService.findById("123");

      expect(result.id).toBe("123");
      expect(api.get).toHaveBeenCalledWith("/pautas/123");
    });

    it("deve lançar erro ao buscar pauta inexistente", async () => {
      const mockError = {
        response: { status: 404, data: { message: "Pauta não encontrada" } },
      };
      const { default: api } = await import("../api");
      vi.mocked(api.get).mockRejectedValueOnce(mockError);

      await expect(pautaService.findById("inexistente")).rejects.toEqual(
        mockError,
      );
    });
  });

  describe("findAll", () => {
    it("deve listar pautas com paginação", async () => {
      const mockResponse = {
        content: [{ id: "1", descricao: "Pauta 1" }],
        page: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
        last: true,
        first: true,
      };
      const { default: api } = await import("../api");
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

      const result = await pautaService.findAll({ page: 0, size: 10 });

      expect(result.content).toHaveLength(1);
      expect(result.totalPages).toBe(1);
    });
  });

  describe("create", () => {
    it("deve criar nova pauta", async () => {
      const mockPauta = {
        id: "123",
        descricao: "Nova Pauta",
        dataCriacao: "2026-02-01T10:00:00Z",
        dataFinalVotacao: "2026-02-02T10:00:00Z",
        votos: [],
      };
      const { default: api } = await import("../api");
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockPauta });

      const result = await pautaService.create({
        titulo: "Nova Pauta",
        descricao: "Descrição da Nova Pauta",
        duracao: 60,
      });

      expect(result.id).toBeDefined();
      expect(result.descricao).toBe("Nova Pauta");
    });
  });

  describe("adicionaVoto", () => {
    it("deve adicionar voto a uma pauta", async () => {
      const mockVoto = {
        usuarioId: "456",
        pautaId: "123",
        voto: true,
        dataCriacao: "2026-02-01T10:00:00Z",
      };
      const { default: api } = await import("../api");
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockVoto });

      const result = await pautaService.adicionaVoto("123", {
        usuarioId: "456",
        voto: true,
      });

      expect(result.usuarioId).toBe("456");
      expect(result.voto).toBe(true);
    });

    it("deve lançar erro ao votar duplicado", async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: "Usuário já votou nessa pauta" },
        },
      };
      const { default: api } = await import("../api");
      vi.mocked(api.post).mockRejectedValueOnce(mockError);

      await expect(
        pautaService.adicionaVoto("123", { usuarioId: "456", voto: true }),
      ).rejects.toEqual(mockError);
    });
  });
});
