package com.higorcraco.votacao_fullstack.exception.integracao;

import com.higorcraco.votacao_fullstack.exception.NotFoundException;

public class CpfNaoEncontradoException
        extends NotFoundException {
    public CpfNaoEncontradoException(String message) {
        super(message);
    }
}
