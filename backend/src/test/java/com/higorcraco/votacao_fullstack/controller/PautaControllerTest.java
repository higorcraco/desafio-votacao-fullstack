package com.higorcraco.votacao_fullstack.controller;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Pauta;
import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.dto.CreatePautaDto;
import com.higorcraco.votacao_fullstack.dto.VotoDto;
import com.higorcraco.votacao_fullstack.dto.converter.PautaDtoConverter;
import com.higorcraco.votacao_fullstack.dto.converter.PautaVotoDtoConverter;
import com.higorcraco.votacao_fullstack.service.PautaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PautaController.class)
class PautaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PautaService pautaService;

    @MockitoBean
    private PautaDtoConverter pautaDtoConverter;

    @MockitoBean
    private PautaVotoDtoConverter pautaVotoDtoConverter;

    @Test
    void create() throws Exception {
        Pauta pautaMock = getPauta();
        CreatePautaDto createPautaDto = new CreatePautaDto();
        createPautaDto.setDescricao("Nova pauta");
        createPautaDto.setDuracao(30L);

        when(pautaService.create(any(CreatePautaDto.class))).thenReturn(pautaMock);

        mockMvc.perform(post("/api/v1/pautas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createPautaDto)))
                .andExpect(status().isOk());
    }

    @Test
    void adicionaVoto() throws Exception {
        Usuario usuarioMock = getUsuario();
        VotoDto votoDto = new VotoDto();
        votoDto.setUsuarioId(usuarioMock.getId());
        votoDto.setVoto(true);

        when(pautaService.adicionaVoto(any(UUID.class), any(VotoDto.class))).thenReturn(null);

        mockMvc.perform(post("/api/v1/pautas/{id}/votos", UUID.randomUUID())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(votoDto)))
                .andExpect(status().isOk());
    }

    private Pauta getPauta() {
        Pauta pauta = new Pauta();
        pauta.setId(UUID.randomUUID());
        pauta.setDescricao("Pauta sobre orçamento");
        pauta.setDuracao(60L);
        return pauta;
    }

    private Usuario getUsuario() {
        Usuario usuario = new Usuario();
        usuario.setId(UUID.randomUUID());
        usuario.setCpf("12345678901");
        return usuario;
    }
}
