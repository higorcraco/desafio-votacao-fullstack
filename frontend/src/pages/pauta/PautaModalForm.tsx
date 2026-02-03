// src/components/NovaPautaModal.tsx
import React, { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { pautaService } from "../../services";

interface PautaModalFormProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const PautaModalForm: React.FC<PautaModalFormProps> = ({
  show,
  onHide,
  onSuccess,
}) => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [duracao, setDuracao] = useState(1);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (titulo.trim().length < 5) {
      setErro("O título deve ter no mínimo 5 caracteres.");
      return;
    }

    if (duracao < 1) {
      setErro("A duração deve ser de no mínimo 1 minuto.");
      return;
    }

    setSalvando(true);

    try {
      await pautaService.create({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        duracao,
      });
      setTitulo("");
      setDescricao("");
      setDuracao(1);
      onSuccess();
      onHide();
    } catch (error: any) {
      const mensagem =
        error.response?.data?.message ||
        "Erro ao criar pauta. Tente novamente.";
      setErro(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  const handleClose = () => {
    setDescricao("");
    setDuracao(1);
    setErro("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nova Pauta</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {erro && <Alert variant="danger">{erro}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Título *</Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título da pauta..."
              required
              minLength={5}
            />
            <Form.Text className="text-muted">Mínimo de 5 caracteres</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a pauta para votação..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duração (minutos) *</Form.Label>
            <Form.Control
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(Number(e.target.value))}
              min={1}
              required
            />
            <Form.Text className="text-muted">
              Tempo que a pauta ficará aberta para votação
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={salvando}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PautaModalForm;
