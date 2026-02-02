package com.higorcraco.votacao_fullstack.exception.integracao;

import com.higorcraco.votacao_fullstack.exception.NotFoundException;

public class CpfIntegracaoNaoEncontradoException
        extends NotFoundException {
    public CpfIntegracaoNaoEncontradoException(String message) {
        super(message);
    }
}
