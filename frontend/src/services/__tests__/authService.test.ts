import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "../authService";

vi.mock("../api");

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("deve fazer login com um CPF válido", async () => {
      const mockUser = { id: "1", cpf: "12345678900", nome: "João Silva" };
      const { default: api } = await import("../api");
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockUser });

      const result = await authService.login("12345678900");

      expect(result).toEqual(mockUser);
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        cpf: "12345678900",
      });
    });

    it("deve lançar erro com CPF inválido", async () => {
      const mockError = {
        response: { status: 400, data: { message: "CPF não encontrado" } },
      };
      const { default: api } = await import("../api");
      vi.mocked(api.post).mockRejectedValueOnce(mockError);

      await expect(authService.login("00000000000")).rejects.toEqual(mockError);
    });

    it("deve lançar erro de rede", async () => {
      const mockError = new Error("Network Error");
      const { default: api } = await import("../api");
      vi.mocked(api.post).mockRejectedValueOnce(mockError);

      await expect(authService.login("12345678900")).rejects.toThrow(
        "Network Error",
      );
    });

    it("deve retornar usuário com todos os campos", async () => {
      const mockUser = { id: "123", cpf: "12345678900", nome: "Maria Silva" };
      const { default: api } = await import("../api");
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockUser });

      const result = await authService.login("12345678900");

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("cpf");
      expect(result).toHaveProperty("nome");
    });
  });
});
