import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import type { PautaVoto } from "../../types";

interface VotacaoResultadoProps {
  votos: PautaVoto[];
}

const VotacaoResultado: React.FC<VotacaoResultadoProps> = ({ votos }) => {
  const [totalVotosSim, setTotalVotosSim] = useState(0);
  const [totalVotosNao, setTotalVotosNao] = useState(0);

  useEffect(() => {
    const calcularPorcentagens = () => {
      const totalSim = votos.filter((v) => v.voto === true).length;
      const totalNao = votos.length - totalSim;
      setTotalVotosSim(totalSim);
      setTotalVotosNao(totalNao);
    };

    calcularPorcentagens();
  }, [votos]);

  const totalVotos = totalVotosSim + totalVotosNao;
  const percentualSim = totalVotos > 0 ? (totalVotosSim / totalVotos) * 100 : 0;
  const percentualNao = totalVotos > 0 ? (totalVotosNao / totalVotos) * 100 : 0;

  return (
    <div className="mb-3">
      <h6 className="mb-3">Resultado da Votação</h6>

      <div className="d-flex justify-content-between mb-2">
        <span>
          <strong className="text-success">Sim:</strong> {totalVotosSim} voto(s)
        </span>
        <span>
          <strong className="text-danger">Não:</strong> {totalVotosNao} voto(s)
        </span>
      </div>

      <ProgressBar style={{ height: "30px" }} className="mb-2">
        <ProgressBar
          variant="success"
          now={percentualSim}
          key={1}
          label={percentualSim > 5 ? `${percentualSim.toFixed(0)}%` : ""}
        />
        <ProgressBar
          variant="danger"
          now={percentualNao}
          key={2}
          label={percentualNao > 5 ? `${percentualNao.toFixed(0)}%` : ""}
        />
      </ProgressBar>

      <div className="text-center text-muted">
        <small>Total de votos: {totalVotos}</small>
      </div>
    </div>
  );
};

export default VotacaoResultado;
