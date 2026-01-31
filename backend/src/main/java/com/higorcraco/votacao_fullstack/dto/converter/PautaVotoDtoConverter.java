package com.higorcraco.votacao_fullstack.dto.converter;

import java.util.Objects;
import java.util.Optional;

import com.higorcraco.votacao_fullstack.domain.PautaVoto;
import com.higorcraco.votacao_fullstack.dto.PautaVotoDto;
import org.springframework.stereotype.Component;

@Component
public class PautaVotoDtoConverter
        implements DtoConverter<PautaVoto, PautaVotoDto> {

    @Override
    public PautaVotoDto from(PautaVoto entity) {
        if (Objects.isNull(entity)) {
            return null;
        }

        PautaVotoDto dto = new PautaVotoDto();
        dto.setId(entity.getId());

        Optional.ofNullable(entity.getPauta())
                .ifPresent(pauta -> dto.setPautaId(pauta.getId()));

        Optional.ofNullable(entity.getUsuario())
                .ifPresent(usuario -> dto.setUsuarioId(usuario.getId()));

        return dto;
    }
}
