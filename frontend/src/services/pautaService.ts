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
  findById: async (pautaId: string): Promise<Pauta> => {
    const response = await api.get<Pauta>(`/pautas/${pautaId}`);
    return response.data;
  },

  findAll: async (
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

  create: async (data: NovaPautaRequest): Promise<Pauta> => {
    const response = await api.post<Pauta>("/pautas", data);
    return response.data;
  },

  adicionaVoto: async (
    pautaId: string,
    voto: VotoRequest,
  ): Promise<PautaVoto> => {
    const response = await api.post<PautaVoto>(
      `/pautas/${pautaId}/votos`,
      voto,
    );
    return response.data;
  },
};
