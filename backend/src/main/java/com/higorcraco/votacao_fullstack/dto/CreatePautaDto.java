package com.higorcraco.votacao_fullstack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePautaDto {
    @NotBlank
    private String titulo;
    private String descricao;
    @NotNull
    private Long duracao;
}
