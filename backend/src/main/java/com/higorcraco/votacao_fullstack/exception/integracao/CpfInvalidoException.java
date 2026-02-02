package com.higorcraco.votacao_fullstack.exception.integracao;

import com.higorcraco.votacao_fullstack.exception.NotFoundException;

public class CpfInvalidoException extends NotFoundException {
    public CpfInvalidoException(String message) {
        super(message);
    }
}
