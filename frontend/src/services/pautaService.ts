// src/services/pautaService.ts
import type { NovaPautaRequest, Pauta, VotoRequest } from "../types";
import type { PautaVoto } from "../types/PautaVoto";
import api from "./api";

export const pautaService = {
  listarPautas: async (): Promise<Pauta[]> => {
    const response = await api.get<Pauta[]>("/pautas");
    return response.data;
  },

  criarPauta: async (data: NovaPautaRequest): Promise<Pauta> => {
    const response = await api.post<Pauta>("/pautas", data);
    return response.data;
  },

  votar: async (pautaId: string, voto: VotoRequest): Promise<PautaVoto> => {
    const response = await api.post<PautaVoto>(
      `/pautas/${pautaId}/votos`,
      voto,
    );
    return response.data;
  },
};
