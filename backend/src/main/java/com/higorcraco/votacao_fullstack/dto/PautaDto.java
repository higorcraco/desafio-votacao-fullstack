package com.higorcraco.votacao_fullstack.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class PautaDto {

    private UUID id;
    private String titulo;
    private String descricao;
    private Long duracao;
    private Instant dataCriacao;
    private Instant dataFinalVotacao;
    private String status;
    private List<PautaVotoDto> votos;

}
