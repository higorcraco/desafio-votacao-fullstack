package com.higorcraco.votacao_fullstack.dto;

import lombok.Data;

@Data
public class CreatePautaDto {
    private String descricao;
    private Long duracao;
}
