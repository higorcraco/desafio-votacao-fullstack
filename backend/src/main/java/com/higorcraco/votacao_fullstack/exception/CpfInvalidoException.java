package com.higorcraco.votacao_fullstack.exception;

public class CpfInvalidoException extends RuntimeException{
    public CpfInvalidoException() {
        super("CPF inválido");
    }
}
