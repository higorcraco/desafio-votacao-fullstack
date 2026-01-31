package com.higorcraco.votacao_fullstack.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class UsuarioDto {

    private UUID id;
    private String cpf;
}
