package com.higorcraco.votacao_fullstack.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class PautaDto {

    private UUID id;
    private String descricao;
    private Long duracao;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataFinalVotacao;
    private String status;
    private List<PautaVotoDto> votos;

}
