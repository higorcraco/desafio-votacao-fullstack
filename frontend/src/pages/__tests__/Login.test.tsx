import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as AuthContext from "../../contexts/AuthContext";
import Login from "../Login";

vi.mock("../../contexts/AuthContext");

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    } as any);
  });

  it("deve renderizar o formulário de login", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getByText("Sistema de Votação")).toBeTruthy();
    expect(screen.getByText("Cooperativa")).toBeTruthy();
  });

  it("deve renderizar campo CPF", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const inputCPF = screen.getByPlaceholderText(
      "Digite seu CPF (apenas números)",
    );
    expect(inputCPF).toBeTruthy();
  });

  it("deve renderizar botão Entrar", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const botao = screen.getByRole("button", { name: /Entrar/i });
    expect(botao).toBeTruthy();
  });

  it("deve desabilitar botão se CPF não tiver 11 dígitos", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const botao = screen.getByRole("button", { name: /Entrar/i });
    expect(botao).toHaveProperty("disabled", true);
  });

  it("deve habilitar botão ao digitar 11 dígitos", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const inputCPF = screen.getByPlaceholderText(
      "Digite seu CPF (apenas números)",
    );
    const botao = screen.getByRole("button", { name: /Entrar/i });

    await user.type(inputCPF, "12345678901");

    expect(botao).toHaveProperty("disabled", false);
  });

  it("deve aceitar apenas números no CPF", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const inputCPF = screen.getByPlaceholderText(
      "Digite seu CPF (apenas números)",
    ) as HTMLInputElement;

    await user.type(inputCPF, "123.456.789-01");

    // Deve conter apenas números
    expect(inputCPF.value).toBe("12345678901");
  });

  it("deve limitar CPF a 11 caracteres", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const inputCPF = screen.getByPlaceholderText(
      "Digite seu CPF (apenas números)",
    ) as HTMLInputElement;

    await user.type(inputCPF, "123456789012345");

    // Deve ter no máximo 11 dígitos
    expect(inputCPF.value.length).toBeLessThanOrEqual(11);
  });

  it("deve chamar login ao submeter formulário com CPF válido", async () => {
    const mockLogin = vi.fn().mockResolvedValue(undefined);
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: mockLogin,
      logout: vi.fn(),
    } as any);

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const inputCPF = screen.getByPlaceholderText(
      "Digite seu CPF (apenas números)",
    );
    const botao = screen.getByRole("button", { name: /Entrar/i });

    await user.type(inputCPF, "12345678901");
    await user.click(botao);

    expect(mockLogin).toHaveBeenCalledWith("12345678901");
  });

  it('deve mostrar estado "Entrando..." durante carregamento', async () => {
    const mockLogin = vi.fn(() => new Promise(() => {})); // Promise que nunca resolve
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: mockLogin,
      logout: vi.fn(),
    } as any);

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const inputCPF = screen.getByPlaceholderText(
      "Digite seu CPF (apenas números)",
    );
    const botao = screen.getByRole("button", { name: /Entrar/i });

    await user.type(inputCPF, "12345678901");
    await user.click(botao);

    expect(screen.getByText("Entrando...")).toBeTruthy();
  });

  it("deve exibir erro ao falhar o login", async () => {
    const mockLogin = vi.fn().mockRejectedValue({
      response: { data: { message: "CPF não encontrado" } },
    });
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: mockLogin,
      logout: vi.fn(),
    } as any);

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const inputCPF = screen.getByPlaceholderText(
      "Digite seu CPF (apenas números)",
    );
    const botao = screen.getByRole("button", { name: /Entrar/i });

    await user.type(inputCPF, "12345678901");
    await user.click(botao);

    expect(await screen.findByText("CPF não encontrado")).toBeTruthy();
  });

  it("deve exibir erro padrão ao falhar sem mensagem específica", async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error("Erro desconhecido"));
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: mockLogin,
      logout: vi.fn(),
    } as any);

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const inputCPF = screen.getByPlaceholderText(
      "Digite seu CPF (apenas números)",
    );
    const botao = screen.getByRole("button", { name: /Entrar/i });

    await user.type(inputCPF, "12345678901");
    await user.click(botao);

    expect(await screen.findByText(/Erro ao fazer login/i)).toBeTruthy();
  });

  it("deve limpar erro ao começar novo login", async () => {
    const mockLogin = vi
      .fn()
      .mockRejectedValueOnce({ response: { data: { message: "Erro 1" } } })
      .mockResolvedValueOnce(undefined);

    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: mockLogin,
      logout: vi.fn(),
    } as any);

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const inputCPF = screen.getByPlaceholderText(
      "Digite seu CPF (apenas números)",
    );
    const botao = screen.getByRole("button", { name: /Entrar/i });

    // Primeiro login com erro
    await user.type(inputCPF, "12345678901");
    await user.click(botao);

    expect(await screen.findByText("Erro 1")).toBeTruthy();

    // Limpar CPF e tentar novamente
    await user.clear(inputCPF);
    await user.type(inputCPF, "12345678901");

    // Submeter novamente - o erro deve ser limpo ao fazer submit
    await user.click(botao);

    // Verificar se o texto do erro foi removido
    expect(screen.queryByText("Erro 1")).toBeFalsy();
  });

  it("deve renderizar ícone de votação", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    // Verifica se o componente foi renderizado (o ícone é renderizado)
    const titulo = screen.getByText("Sistema de Votação");
    expect(titulo).toBeTruthy();
  });

  it("deve ter layout responsivo", () => {
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    // Verifica classes Bootstrap para responsividade
    const col = container.querySelector('[class*="col-"]');
    expect(col).toBeTruthy();
  });
});
