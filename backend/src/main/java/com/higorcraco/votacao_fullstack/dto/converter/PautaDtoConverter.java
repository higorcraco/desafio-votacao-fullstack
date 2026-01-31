package com.higorcraco.votacao_fullstack.dto.converter;

import java.util.Objects;

import com.higorcraco.votacao_fullstack.domain.Pauta;
import com.higorcraco.votacao_fullstack.dto.PautaDto;
import org.springframework.stereotype.Component;

@Component
public class PautaDtoConverter implements DtoConverter<Pauta, PautaDto> {

    @Override
    public PautaDto from(Pauta entity) {
        if (Objects.isNull(entity)) {
            return null;
        }

        PautaDto dto = new PautaDto();
        dto.setId(entity.getId());
        dto.setDescricao(entity.getDescricao());
        dto.setDuracao(entity.getDuracao());
        dto.setDataCriacao(entity.getDataCriacao());
        dto.setDataFinalVotacao(entity.getDataFinalVotacao());
        dto.setStatus(entity.getStatus().getDescricao());
        return dto;
    }
}
