import React, { useEffect, useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { pautaService } from "../../services";
import type { Pauta } from "../../types";
import { formatarData, intervaloTempoToString } from "../../utils/dateUtils";
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
        setTempoRestante(
          intervaloTempoToString(final.getTime() - agora.getTime()),
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

    setVotando(true);

    try {
      await pautaService.votar(pauta.id, {
        usuarioId: user.id,
        voto,
      });

      Swal.fire({
        icon: "success",
        title: "Voto Registrado!",
        text: "Seu voto foi registrado com sucesso!",
        confirmButtonText: "OK",
        confirmButtonColor: "#198754",
      });

      onVotoSuccess();
    } catch (error: any) {
      const mensagem =
        error.response?.data?.message ||
        error.message ||
        "Erro ao registrar voto. Tente novamente.";

      Swal.fire({
        icon: "error",
        title: "Erro ao Votar",
        text: mensagem,
        confirmButtonText: "OK",
        confirmButtonColor: "#dc3545",
      });
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

        {emAndamento && (
          <span className="text-success fw-bold">
            Fecha em: {tempoRestante}
          </span>
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
