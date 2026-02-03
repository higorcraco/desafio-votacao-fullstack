import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PautaVoto } from "../../../types";
import VotacaoResultado from "../VotacaoResultado";

describe("VotacaoResultado", () => {
  const mockVotos: PautaVoto[] = [
    { id: "1", pautaId: "pauta1", usuarioId: "user1", voto: true },
    { id: "2", pautaId: "pauta1", usuarioId: "user2", voto: true },
    { id: "3", pautaId: "pauta1", usuarioId: "user3", voto: false },
  ];

  it('deve renderizar o título "Resultado da Votação"', () => {
    render(<VotacaoResultado votos={mockVotos} />);
    expect(screen.getByText("Resultado da Votação")).toBeTruthy();
  });

  it("deve exibir contador de votos para SIM", () => {
    render(<VotacaoResultado votos={mockVotos} />);
    expect(screen.getByText(/Sim:/)).toBeTruthy();
    expect(screen.getByText(/2 voto\(s\)/)).toBeTruthy();
  });

  it("deve exibir contador de votos para NÃO", () => {
    render(<VotacaoResultado votos={mockVotos} />);
    expect(screen.getByText(/Não:/)).toBeTruthy();
    expect(screen.getByText(/1 voto\(s\)/)).toBeTruthy();
  });

  it("deve exibir contador correto quando não há votos", () => {
    render(<VotacaoResultado votos={[]} />);

    const votosText = screen.getAllByText(/0 voto\(s\)/);
    expect(votosText.length).toBeGreaterThanOrEqual(2); // SIM e NÃO
  });

  it("deve calcular percentual de votos corretamente", () => {
    render(<VotacaoResultado votos={mockVotos} />);

    // 2 votos SIM em 3 total = 66.67%, arredondado para 67%
    expect(screen.getByText(/67%/)).toBeTruthy();

    // 1 voto NÃO em 3 total = 33.33%, arredondado para 33%
    expect(screen.getByText(/33%/)).toBeTruthy();
  });

  it("deve renderizar barras de progresso", () => {
    const { container } = render(<VotacaoResultado votos={mockVotos} />);
    const progressBars = container.querySelectorAll(".progress-bar");
    expect(progressBars.length).toBeGreaterThanOrEqual(2); // SIM e NÃO
  });

  it("deve exibir total de votos corretamente", () => {
    render(<VotacaoResultado votos={mockVotos} />);
    expect(screen.getByText("Total de votos: 3")).toBeTruthy();
  });

  it("deve atualizar reativo quando votos mudam", () => {
    const { rerender } = render(<VotacaoResultado votos={mockVotos} />);

    // Verifica estado inicial
    expect(screen.getByText("Total de votos: 3")).toBeTruthy();
    expect(screen.getByText(/2 voto\(s\)/)).toBeTruthy();

    // Novos votos com um voto SIM adicional
    const novoVotos: PautaVoto[] = [
      { id: "1", pautaId: "pauta1", usuarioId: "user1", voto: true },
      { id: "2", pautaId: "pauta1", usuarioId: "user2", voto: true },
      { id: "3", pautaId: "pauta1", usuarioId: "user3", voto: true },
      { id: "4", pautaId: "pauta1", usuarioId: "user4", voto: false },
    ];

    rerender(<VotacaoResultado votos={novoVotos} />);

    // Verifica novo estado
    expect(screen.getByText("Total de votos: 4")).toBeTruthy();
    expect(screen.getByText(/3 voto\(s\)/)).toBeTruthy();
  });

  it("deve renderizar com todos votos SIM", () => {
    const todosSim: PautaVoto[] = [
      { id: "1", pautaId: "pauta1", usuarioId: "user1", voto: true },
      { id: "2", pautaId: "pauta1", usuarioId: "user2", voto: true },
    ];

    render(<VotacaoResultado votos={todosSim} />);

    expect(screen.getByText(/2 voto\(s\)/)).toBeTruthy();
    expect(screen.getByText(/0 voto\(s\)/)).toBeTruthy();
    expect(screen.getByText("Total de votos: 2")).toBeTruthy();
    expect(screen.getByText(/100%/)).toBeTruthy();
  });

  it("deve renderizar com todos votos NÃO", () => {
    const todosNao: PautaVoto[] = [
      { id: "1", pautaId: "pauta1", usuarioId: "user1", voto: false },
      { id: "2", pautaId: "pauta1", usuarioId: "user2", voto: false },
    ];

    render(<VotacaoResultado votos={todosNao} />);

    expect(screen.getByText(/0 voto\(s\)/)).toBeTruthy();
    expect(screen.getByText(/2 voto\(s\)/)).toBeTruthy();
    expect(screen.getByText("Total de votos: 2")).toBeTruthy();
  });

  it("deve renderizar percentuais como 0% quando não há votos", () => {
    const { container } = render(<VotacaoResultado votos={[]} />);

    // Quando não há votos, não deve exibir percentuais
    const percentText = container.textContent;
    expect(percentText).toContain("Total de votos: 0");
  });

  it("deve não exibir percentual quando valor é menor que 5%", () => {
    const votos: PautaVoto[] = [
      { id: "1", pautaId: "pauta1", usuarioId: "user1", voto: true },
      { id: "2", pautaId: "pauta1", usuarioId: "user2", voto: false },
      { id: "3", pautaId: "pauta1", usuarioId: "user3", voto: false },
      { id: "4", pautaId: "pauta1", usuarioId: "user4", voto: false },
      { id: "5", pautaId: "pauta1", usuarioId: "user5", voto: false },
    ];

    render(<VotacaoResultado votos={votos} />);

    // 1 voto SIM em 5 total = 20%, 4 votos NÃO = 80%
    // Ambos devem ser exibidos
    expect(screen.getByText(/20%/)).toBeTruthy();
    expect(screen.getByText(/80%/)).toBeTruthy();
  });
});
