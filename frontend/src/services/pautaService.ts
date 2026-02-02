import {
  defaultPageRequest,
  type NovaPautaRequest,
  type PageRequest,
  type PageResponse,
  type Pauta,
  type PautaVoto,
  type VotoRequest,
} from "../types";
import api from "./api";

const defaultSort = "dataCriacao,desc";

export const pautaService = {
  listarPautas: async (
    pageRequest: PageRequest = defaultPageRequest,
    sort: string = defaultSort,
  ): Promise<PageResponse<Pauta>> => {
    const response = await api.get<PageResponse<Pauta>>("/pautas", {
      params: {
        ...pageRequest,
        sort,
      },
    });
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
