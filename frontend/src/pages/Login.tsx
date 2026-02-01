import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { FaVoteYea } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formatarCPF = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    return numeros.slice(0, 11);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (cpf.length !== 11) {
      setErro("CPF deve conter 11 dígitos.");
      return;
    }

    setCarregando(true);

    try {
      await login(cpf);
      navigate("/pautas");
    } catch (error: any) {
      const mensagem =
        error.response?.data?.message ||
        "Erro ao fazer login. Verifique o CPF e tente novamente.";
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="mx-auto">
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <FaVoteYea size={48} className="text-primary mb-3" />
                <h3>Sistema de Votação</h3>
                <p className="text-muted">Cooperativa</p>
              </div>

              {erro && <Alert variant="danger">{erro}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite seu CPF (apenas números)"
                    value={cpf}
                    onChange={(e) => setCpf(formatarCPF(e.target.value))}
                    required
                    maxLength={11}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={carregando || cpf.length !== 11}
                  >
                    {carregando ? "Entrando..." : "Entrar"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
