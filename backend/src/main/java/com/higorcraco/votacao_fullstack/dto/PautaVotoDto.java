package com.higorcraco.votacao_fullstack.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class PautaVotoDto {
    private UUID id;
    private UUID usuarioId;
    private UUID pautaId;
    private Boolean voto;
}
