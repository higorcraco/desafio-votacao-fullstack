package com.higorcraco.votacao_fullstack.controller;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.dto.converter.UsuarioDtoConverter;
import com.higorcraco.votacao_fullstack.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UsuarioController.class)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private UsuarioDtoConverter usuarioDtoConverter;

    @Test
    void findById() throws Exception {
        Usuario usuarioMock = getUsuario();

        when(usuarioService.findByIdThrow(any(UUID.class))).thenReturn(usuarioMock);

        mockMvc.perform(get("/api/v1/usuarios/{id}", usuarioMock.getId()))
                .andExpect(status().isOk());
    }

    private Usuario getUsuario() {
        Usuario usuario = new Usuario();
        usuario.setId(UUID.randomUUID());
        usuario.setCpf("12345678901");
        return usuario;
    }
}
