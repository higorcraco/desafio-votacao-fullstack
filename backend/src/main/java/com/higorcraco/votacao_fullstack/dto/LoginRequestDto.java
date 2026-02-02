package com.higorcraco.votacao_fullstack.dto;

import lombok.Data;
import org.hibernate.validator.constraints.br.CPF;

@Data
public class LoginRequestDto {

    @CPF
    private String cpf;
}
