package com.higorcraco.votacao_fullstack.exception.integracao;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class CpfNaoEncontrado
        extends RuntimeException {
    public CpfNaoEncontrado(String message) {
        super(message);
    }
}
