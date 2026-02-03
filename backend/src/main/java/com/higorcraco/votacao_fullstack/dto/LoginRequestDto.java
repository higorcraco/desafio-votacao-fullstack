package com.higorcraco.votacao_fullstack.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.br.CPF;

@Data
public class LoginRequestDto {

    @CPF
    @NotBlank
    private String cpf;
}
