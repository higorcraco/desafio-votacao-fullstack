package com.higorcraco.votacao_fullstack.exception;

public class NotFoundException
        extends RuntimeException {

    public NotFoundException(String entityName, String key, String value) {
        super(String.format("%s não encontrado. [%s=%s]", entityName, key, value));
    }

    public NotFoundException(String message) {
        super(message);
    }
}
