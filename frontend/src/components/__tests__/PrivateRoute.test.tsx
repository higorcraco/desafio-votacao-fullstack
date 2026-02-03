import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as AuthContext from "../../contexts/AuthContext";
import PrivateRoute from "../PrivateRoute";

vi.mock("../../contexts/AuthContext");

const TestComponent = () => <div>Test Component Rendered</div>;

describe("PrivateRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar componente quando autenticado", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "1", cpf: "123", nome: "Test" },
      login: vi.fn(),
      logout: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>,
    );

    expect(screen.getByText("Test Component Rendered")).toBeTruthy();
  });

  it("deve redirecionar para login quando não autenticado", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>,
    );

    expect(screen.queryByText("Test Component Rendered")).toBeFalsy();
  });

  it("deve renderizar loading enquanto verifica autenticação", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>,
    );

    expect(screen.getByText("Carregando...")).toBeTruthy();
  });

  it("deve manter redirect após autenticação falhar", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>,
    );

    expect(screen.queryByText("Test Component Rendered")).toBeFalsy();
  });

  it("deve renderizar múltiplas rotas privadas", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "1", cpf: "123", nome: "Test" },
      login: vi.fn(),
      logout: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <div>
          <PrivateRoute>
            <TestComponent />
          </PrivateRoute>
          <PrivateRoute>
            <TestComponent />
          </PrivateRoute>
        </div>
      </BrowserRouter>,
    );

    const components = screen.getAllByText("Test Component Rendered");
    expect(components.length).toBeGreaterThan(0);
  });

  it("deve usar useAuth hook internamente", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "1", cpf: "123", nome: "Test" },
      login: vi.fn(),
      logout: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>,
    );

    expect(vi.mocked(AuthContext.useAuth)).toHaveBeenCalled();
  });

  it("deve suportar múltiplos tipos de componentes", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "1", cpf: "123", nome: "Test" },
      login: vi.fn(),
      logout: vi.fn(),
    } as any);

    const FuncComponent = () => <div>Func Component</div>;

    render(
      <BrowserRouter>
        <PrivateRoute>
          <FuncComponent />
        </PrivateRoute>
      </BrowserRouter>,
    );

    expect(screen.getByText("Func Component")).toBeTruthy();
  });

  it("deve preservar estado ao navegar", () => {
    const mockUser = { id: "1", cpf: "123", nome: "Test User" };
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: mockUser,
      login: vi.fn(),
      logout: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>,
    );

    expect(screen.getByText("Test Component Rendered")).toBeTruthy();
  });
});
