package com.higorcraco.votacao_fullstack.controller;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Pauta;
import com.higorcraco.votacao_fullstack.dto.CreatePautaDto;
import com.higorcraco.votacao_fullstack.dto.PautaDto;
import com.higorcraco.votacao_fullstack.dto.PautaVotoDto;
import com.higorcraco.votacao_fullstack.dto.VotoDto;
import com.higorcraco.votacao_fullstack.dto.converter.PautaDtoConverter;
import com.higorcraco.votacao_fullstack.dto.converter.PautaVotoDtoConverter;
import com.higorcraco.votacao_fullstack.service.PautaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/pautas")
public class PautaController extends ReadOnlyController<Pauta, UUID, PautaDto>{

    private final PautaService service;
    private final PautaDtoConverter dtoConverter;
    private final PautaVotoDtoConverter pautaVotoDtoConverter;

    @PostMapping
    public ResponseEntity<PautaDto> create(@RequestBody CreatePautaDto createPautaDto) {
        PautaDto dto = dtoConverter.from(service.create(createPautaDto));
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/votos")
    public ResponseEntity<PautaVotoDto> adicionaVoto(@PathVariable UUID id, @Valid @RequestBody VotoDto voto) {
        PautaVotoDto pautaVotoDto = pautaVotoDtoConverter.from(service.adicionaVoto(id, voto));
        return ResponseEntity.ok(pautaVotoDto);
    }
}
