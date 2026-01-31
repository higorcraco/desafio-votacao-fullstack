package com.higorcraco.votacao_fullstack.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PautaStatusEnum {
    EM_VOTACAO("Em Votação"),
    FINALIZADA("Finalizada");

    private final String descricao;
}
