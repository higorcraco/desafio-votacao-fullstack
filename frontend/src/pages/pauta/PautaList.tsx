import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Navbar,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../components/PaginationComponent";
import { useAuth } from "../../contexts/AuthContext";
import { pautaService } from "../../services";
import type { Pauta } from "../../types";
import PautaCard from "./PautaCard";
import PautaModalForm from "./PautaModalForm";

const PautaList: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [pautas, setPautas] = useState<Pauta[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(9);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [showModal, setShowModal] = useState(false);

  const carregarPautas = async (page: number = 0) => {
    setErro("");
    setCarregando(true);

    try {
      const data = await pautaService.listarPautas({ page, size: pageSize });
      setPautas(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (error: any) {
      const mensagem =
        error.response?.data?.message ||
        "Erro ao carregar pautas. Tente novamente.";
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPautas();
  }, []);

  const handlePageChange = (page: number) => {
    carregarPautas(page);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNovaPautaSuccess = () => {
    carregarPautas(0);
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Sistema de Votação</Navbar.Brand>
          <div className="d-flex gap-2">
            <Button variant="success" onClick={() => setShowModal(true)}>
              <FaPlus className="me-2" />
              Nova Pauta
            </Button>
            <Button variant="outline-light" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              Sair
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container>
        {erro && (
          <Alert variant="danger" dismissible onClose={() => setErro("")}>
            {erro}
          </Alert>
        )}

        {carregando ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Carregando pautas...</p>
          </div>
        ) : !pautas?.length ? (
          <Alert variant="info" className="text-center">
            Nenhuma pauta cadastrada. Clique em "Nova Pauta" para criar a
            primeira!
          </Alert>
        ) : (
          <>
            <Row xs={1} md={2} lg={3} className="g-4">
              {pautas.map((pauta) => (
                <Col key={pauta.id}>
                  <PautaCard pauta={pauta} onVotoSuccess={carregarPautas} />
                </Col>
              ))}
            </Row>
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              disabled={carregando}
            />
          </>
        )}
      </Container>

      <PautaModalForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={handleNovaPautaSuccess}
      />
    </>
  );
};

export default PautaList;
