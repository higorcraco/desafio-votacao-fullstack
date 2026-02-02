package com.higorcraco.votacao_fullstack.exception.integracao;

import com.higorcraco.votacao_fullstack.exception.NotFoundException;

public class CpfIntegracaoInvalidoException
        extends NotFoundException {
    public CpfIntegracaoInvalidoException(String message) {
        super(message);
    }
}
