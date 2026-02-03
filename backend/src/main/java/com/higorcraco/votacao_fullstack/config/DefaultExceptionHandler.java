package com.higorcraco.votacao_fullstack.config;

import java.util.HashMap;
import java.util.Map;

import com.higorcraco.votacao_fullstack.exception.ExceptionResponse;
import com.higorcraco.votacao_fullstack.exception.NotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@Slf4j
@ControllerAdvice
@RestController
public class DefaultExceptionHandler {

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ExceptionResponse> handleAllExceptions(Exception ex, WebRequest request) {
        log.error("Erro não tratado: ", ex);

        ExceptionResponse exceptionResponse = new ExceptionResponse(
                ex.getMessage(), request.getDescription(false));

        return new ResponseEntity<>(exceptionResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NotFoundException.class)
    public final ResponseEntity<ExceptionResponse> notFoundException(Exception ex, WebRequest request) {
        log.warn("Recurso não encontrado: {}", ex.getMessage());

        ExceptionResponse exceptionResponse = new ExceptionResponse(
                ex.getMessage(), request.getDescription(false));

        return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = traduzirMensagemValidacao(error);
            errors.put(fieldName, errorMessage);
        });

        log.warn("Erro de validação: {}", errors);

        ExceptionResponse exceptionResponse = new ExceptionResponse("Erro de validação", ex.getMessage(), errors);

        return new ResponseEntity<>(exceptionResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ExceptionResponse> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();

        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String propertyPath = violation.getPropertyPath().toString();
            String message = traduzirMensagemConstraint(violation.getMessage(), propertyPath);
            errors.put(propertyPath, message);
        }

        log.warn("Erro de constraint de validação: {}", errors);

        ExceptionResponse exceptionResponse = new ExceptionResponse("Erro de validação", ex.getMessage(), errors);

        return new ResponseEntity<>(exceptionResponse, HttpStatus.BAD_REQUEST);
    }

    private String traduzirMensagemConstraint(String message, String propertyPath) {
        if (propertyPath.equalsIgnoreCase("cpf") && message.toLowerCase().contains("invalid")) {
            return "CPF inválido";
        }
        return message;
    }

    private String traduzirMensagemValidacao(org.springframework.validation.ObjectError error) {
        String defaultMessage = error.getDefaultMessage();

        if (error instanceof FieldError fieldError) {
            String fieldName = fieldError.getField();

            if ("cpf".equalsIgnoreCase(fieldName) && defaultMessage != null && defaultMessage.toLowerCase().contains("invalid")) {
                return "CPF inválido";
            }
        }

        return defaultMessage;
    }

}
