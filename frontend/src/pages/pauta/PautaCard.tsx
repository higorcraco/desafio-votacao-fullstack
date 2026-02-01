import React, { useEffect, useState } from "react";
import { Alert, Badge, Button, Card } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { pautaService } from "../../services";
import type { Pauta } from "../../types";
import { formatarData } from "../../utils/dataUtils";
import VotacaoResultado from "./VotacaoResultado";

interface PautaCardProps {
  pauta: Pauta;
  onVotoSuccess: () => void;
}

const PautaCard: React.FC<PautaCardProps> = ({ pauta, onVotoSuccess }) => {
  const { user } = useAuth();
  const [emAndamento, setEmAndamento] = useState(false);
  const [tempoRestante, setTempoRestante] = useState("");
  const [usuarioVotou, setUsuarioVotou] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [votando, setVotando] = useState(false);

  useEffect(() => {
    if (user) {
      const votoExistente = pauta.votos.find((v) => v.usuarioId === user.id);
      setUsuarioVotou(!!votoExistente);
    }
  }, [pauta.votos, user]);

  useEffect(() => {
    const verificarStatus = () => {
      const agora = new Date();
      const final = new Date(pauta.dataFinalVotacao);

      if (agora >= final) {
        setEmAndamento(false);
        setTempoRestante("");
        return false;
      } else {
        setEmAndamento(true);
        const diff = final.getTime() - agora.getTime();
        const minutos = Math.floor(diff / 60000);
        const segundos = Math.floor((diff % 60000) / 1000);
        setTempoRestante(
          `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`,
        );
        return true;
      }
    };

    verificarStatus();

    const timer = setInterval(() => {
      const pautaEmAndamento = verificarStatus();
      if (!pautaEmAndamento) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [pauta.dataFinalVotacao]);

  const handleVotar = async (voto: boolean) => {
    if (!user) return;

    setErro("");
    setSucesso("");
    setVotando(true);

    try {
      await pautaService.votar(pauta.id, {
        usuarioId: user.id,
        voto,
      });
      setSucesso(`Voto registrado com sucesso!`);
      onVotoSuccess();
    } catch (error: any) {
      const mensagem =
        error.response?.data?.message ||
        "Erro ao registrar voto. Tente novamente.";
      setErro(mensagem);
    } finally {
      setVotando(false);
    }
  };

  const getStatus = () => {
    return (
      <>
        {emAndamento ? (
          <>
            <Badge bg="success" className="me-2">
              Aberta
            </Badge>
            <span className="text-success fw-bold">
              Fecha em: {tempoRestante}
            </span>
          </>
        ) : (
          <Badge bg="danger">Finalizada</Badge>
        )}
      </>
    );
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{pauta.descricao}</h5>
          {getStatus()}
        </div>
      </Card.Header>
      <Card.Body>
        <p className="text-muted mb-2">
          <small>Criada em: {formatarData(pauta.dataCriacao)}</small>
        </p>
        <p className="text-muted mb-3">
          <small>Encerra em: {formatarData(pauta.dataFinalVotacao)}</small>
        </p>

        {erro && (
          <Alert variant="danger" dismissible onClose={() => setErro("")}>
            {erro}
          </Alert>
        )}
        {sucesso && (
          <Alert variant="success" dismissible onClose={() => setSucesso("")}>
            {sucesso}
          </Alert>
        )}

        {(!emAndamento || usuarioVotou) && (
          <VotacaoResultado votos={pauta.votos} />
        )}
      </Card.Body>

      {emAndamento && !usuarioVotou && (
        <Card.Footer className="bg-light">
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button
              variant="success"
              onClick={() => handleVotar(true)}
              disabled={votando}
              className="d-flex align-items-center gap-2"
            >
              <FaCheckCircle /> Sim
            </Button>
            <Button
              variant="danger"
              onClick={() => handleVotar(false)}
              disabled={votando}
              className="d-flex align-items-center gap-2"
            >
              <FaTimesCircle /> Não
            </Button>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default PautaCard;
