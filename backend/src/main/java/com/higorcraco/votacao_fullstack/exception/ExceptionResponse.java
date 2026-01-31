package com.higorcraco.votacao_fullstack.exception;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class ExceptionResponse implements Serializable {

    private LocalDateTime timestamp;
    private String message;
    private String details;

    public ExceptionResponse(String message, String details) {
        this.message = message;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }
}
