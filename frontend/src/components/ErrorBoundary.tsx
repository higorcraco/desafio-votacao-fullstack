import React, { type ReactNode } from "react";
import Swal from "sweetalert2";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Erro capturado pelo Error Boundary:", error, errorInfo);

    // Exibir SweetAlert com o erro
    Swal.fire({
      icon: "error",
      title: "Oops! Algo deu errado",
      html: `<p><strong>Erro:</strong></p><p style="text-align: left; word-break: break-word;">${error.message}</p>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#dc3545",
      allowOutsideClick: false,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#f8d7da",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "40px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              maxWidth: "500px",
            }}
          >
            <h1 style={{ color: "#721c24", marginBottom: "20px" }}>
              ❌ Erro na Aplicação
            </h1>
            <p style={{ color: "#721c24", marginBottom: "20px" }}>
              Desculpe, algo inesperado aconteceu. Por favor, tente novamente.
            </p>
            <details style={{ marginBottom: "20px", textAlign: "left" }}>
              <summary
                style={{
                  cursor: "pointer",
                  color: "#721c24",
                  fontWeight: "bold",
                }}
              >
                Detalhes do erro
              </summary>
              <pre
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                  overflow: "auto",
                  marginTop: "10px",
                  fontSize: "12px",
                }}
              >
                {this.state.error?.message}
              </pre>
            </details>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#c82333")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#dc3545")
              }
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
