package com.higorcraco.votacao_fullstack.exception;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;

import lombok.Getter;

@Getter
public class ExceptionResponse implements Serializable {

    private LocalDateTime timestamp;
    private String message;
    private String details;
    private Map<String, String> errors;

    public ExceptionResponse(String message, String details) {
        this.message = message;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    public ExceptionResponse(String message, String details, Map<String, String> errors) {
        this.message = message;
        this.details = details;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }
}
