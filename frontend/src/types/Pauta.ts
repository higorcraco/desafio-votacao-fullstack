import type { PautaVoto } from "./PautaVoto";

export interface Pauta {
  id: string;
  descricao: string;
  duracao: number;
  dataCriacao: string;
  dataFinalVotacao: string;
  votos: PautaVoto[];
}
