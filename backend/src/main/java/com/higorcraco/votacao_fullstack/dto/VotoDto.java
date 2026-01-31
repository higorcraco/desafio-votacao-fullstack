package com.higorcraco.votacao_fullstack.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VotoDto {
    @NotNull
    private UUID usuarioId;

    @NotNull
    private Boolean voto;
}
