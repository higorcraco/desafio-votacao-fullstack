package com.higorcraco.votacao_fullstack.controller;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Pauta;
import com.higorcraco.votacao_fullstack.dto.converter.PautaDtoConverter;
import com.higorcraco.votacao_fullstack.dto.converter.PautaVotoDtoConverter;
import com.higorcraco.votacao_fullstack.service.PautaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PautaController.class)
class ReadOnlyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PautaService service;

    @MockitoBean
    private PautaDtoConverter dtoConverter;

    @MockitoBean
    private PautaVotoDtoConverter pautaVotoDtoConverter;

    @Test
    void findById() throws Exception {
        UUID id = UUID.randomUUID();
        Pauta pauta = new Pauta();
        pauta.setId(id);

        when(service.findByIdThrow(id)).thenReturn(pauta);

        mockMvc.perform(get("/api/v1/pautas/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    void findAll() throws Exception {
        Page<Pauta> page = new PageImpl<>(java.util.Collections.emptyList(), PageRequest.of(0, 10), 0);

        when(service.findAll(any())).thenReturn(page);

        mockMvc.perform(get("/api/v1/pautas")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk());
    }
}

