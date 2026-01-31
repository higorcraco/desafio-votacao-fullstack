package com.higorcraco.votacao_fullstack.service;

import java.util.Optional;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    private UsuarioService usuarioService;

    private Usuario usuarioMock;
    private final String CPF_VALIDO = "12345678901";
    private final UUID USUARIO_ID = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        usuarioService = new UsuarioService();
        ReflectionTestUtils.setField(usuarioService, "repository", usuarioRepository);

        usuarioMock = new Usuario();
        usuarioMock.setId(USUARIO_ID);
        usuarioMock.setCpf(CPF_VALIDO);
    }

    @Test
    void create_deveRetornarUsuarioCriado() {
        when(usuarioRepository.saveAndFlush(any(Usuario.class))).thenReturn(usuarioMock);

        Usuario resultado = usuarioService.create(CPF_VALIDO);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getCpf()).isEqualTo(CPF_VALIDO);
        assertThat(resultado.getId()).isEqualTo(USUARIO_ID);

        verify(usuarioRepository).saveAndFlush(any(Usuario.class));
    }

    @Test
    void findByCpf_quandoUsuarioExiste_deveRetornarUsuario() {
        when(usuarioRepository.findByCpf(CPF_VALIDO)).thenReturn(Optional.of(usuarioMock));

        usuarioService.findByCpf(CPF_VALIDO);

        verify(usuarioRepository).findByCpf(CPF_VALIDO);
    }
}