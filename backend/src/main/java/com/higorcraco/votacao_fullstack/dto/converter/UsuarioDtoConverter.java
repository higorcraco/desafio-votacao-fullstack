package com.higorcraco.votacao_fullstack.dto.converter;

import java.util.Objects;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.dto.UsuarioDto;
import org.springframework.stereotype.Component;

@Component
public class UsuarioDtoConverter
        implements DtoConverter<Usuario, UsuarioDto> {

    @Override
    public Usuario to(UsuarioDto dto) {
        if (Objects.isNull(dto)) {
            return null;
        }

        Usuario entity = new Usuario();
        entity.setId(dto.getId());
        entity.setCpf(dto.getCpf());

        return entity;

    }

    @Override
    public UsuarioDto from(Usuario entity) {
        if (Objects.isNull(entity)) {
            return null;
        }

        UsuarioDto dto = new UsuarioDto();
        dto.setId(entity.getId());
        dto.setCpf(entity.getCpf());

        return dto;
    }
}
