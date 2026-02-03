import { describe, expect, it } from "vitest";
import { formatarData, intervaloTempoToString } from "../dateUtils";

describe("dateUtils", () => {
  describe("formatarData", () => {
    it("deve formatar data ISO válida corretamente", () => {
      const data = "2026-02-02T10:30:00Z";
      const resultado = formatarData(data);

      expect(resultado).toBeTruthy();
      expect(resultado).not.toBe("Data inválida");
    });

    it('deve retornar "Data inválida" para data inválida', () => {
      const data = "data-invalida";
      const resultado = formatarData(data);

      expect(resultado).toBe("Data inválida");
    });

    it('deve retornar "Data inválida" para string vazia', () => {
      const data = "";
      const resultado = formatarData(data);

      expect(resultado).toBe("Data inválida");
    });

    it("deve formatar data com hora corretamente", () => {
      const data = "2026-02-02T14:45:30Z";
      const resultado = formatarData(data);

      expect(resultado).toContain("02");
      expect(resultado).toContain("02");
      expect(resultado).toContain("2026");
    });

    it("deve incluir hora e minuto na formatação", () => {
      const data = "2026-02-02T09:15:00Z";
      const resultado = formatarData(data);

      expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("deve formatar data brasileira corretamente", () => {
      const data = "2026-02-02T10:30:00Z";
      const resultado = formatarData(data);

      // Verifica se segue o padrão dd/mm/yyyy, hh:mm (com vírgula)
      expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
    });

    it("deve formatar diferentes datas corretamente", () => {
      const datas = [
        "2026-01-01T00:00:00Z",
        "2026-12-31T23:59:59Z",
        "2026-06-15T12:30:45Z",
      ];

      datas.forEach((data) => {
        const resultado = formatarData(data);
        expect(resultado).not.toBe("Data inválida");
        expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
      });
    });
  });

  describe("intervaloTempoToString", () => {
    it("deve formatar tempo em segundos e minutos", () => {
      const intervalo = 125000; // 2 minutos e 5 segundos
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toBe("02:05");
    });

    it("deve formatar tempo em horas, minutos e segundos", () => {
      const intervalo = 3665000; // 1 hora, 1 minuto e 5 segundos
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toBe("01:01:05");
    });

    it("deve formatar zero segundos corretamente", () => {
      const intervalo = 0;
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toBe("00:00");
    });

    it("deve formatar apenas minutos corretamente", () => {
      const intervalo = 60000; // 1 minuto
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toBe("01:00");
    });

    it("deve formatar apenas segundos corretamente", () => {
      const intervalo = 45000; // 45 segundos
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toBe("00:45");
    });

    it("deve formatar 1 hora corretamente", () => {
      const intervalo = 3600000; // 1 hora
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toBe("01:00:00");
    });

    it("deve formatar múltiplas horas corretamente", () => {
      const intervalo = 7200000; // 2 horas
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toBe("02:00:00");
    });

    it("deve formatar tempo com todos os componentes", () => {
      const intervalo = 3665000; // 1h 1m 5s
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    it("deve formatar tempo sem horas com 2 dígitos", () => {
      const intervalo = 125000; // 2m 5s
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toMatch(/\d{2}:\d{2}/);
      expect(resultado).not.toContain("0:");
    });

    it("deve formatar tempo com padStart corretamente", () => {
      const intervalo = 1000; // 1 segundo
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toBe("00:01");
    });

    it("deve formatar tempo maior que 24 horas", () => {
      const intervalo = 86400000; // 24 horas
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toBe("24:00:00");
    });

    it("deve formatar tempo com minutos e segundos juntos", () => {
      const intervalo = 185000; // 3m 5s
      const resultado = intervaloTempoToString(intervalo);

      expect(resultado).toBe("03:05");
    });
  });

  describe("Integração formatarData e intervaloTempoToString", () => {
    it("deve formatar data inicial e intervalo juntos", () => {
      const dataInicial = "2026-02-02T10:00:00Z";
      const intervalo = 3665000; // 1h 1m 5s

      const dataFormatada = formatarData(dataInicial);
      const intervaloFormatado = intervaloTempoToString(intervalo);

      expect(dataFormatada).not.toBe("Data inválida");
      expect(intervaloFormatado).toBeTruthy();
    });

    it("deve lidar com múltiplas datas e intervalos", () => {
      const datas = ["2026-02-01T10:00:00Z", "2026-02-02T14:30:00Z"];
      const intervalos = [60000, 3665000];

      datas.forEach((data) => {
        expect(formatarData(data)).not.toBe("Data inválida");
      });

      intervalos.forEach((intervalo) => {
        expect(intervaloTempoToString(intervalo)).toBeTruthy();
      });
    });
  });
});
