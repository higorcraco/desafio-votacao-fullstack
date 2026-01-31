package com.higorcraco.votacao_fullstack.domain.dto;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import lombok.Data;

@Data
public class UsuarioDto {

    private UUID id;
    private String cpf;

    public static UsuarioDto from(Usuario usuario) {
        UsuarioDto dto = new UsuarioDto();
        dto.id = usuario.getId();
        dto.cpf = usuario.getCpf();
        return dto;
    }
}
